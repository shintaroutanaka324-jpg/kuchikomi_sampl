-- アカウント退会（schema.sql / schema-reviews.sql 実行後に実行）
-- 口コミは保持し、認証情報・個人情報・購入証明のみ削除する

-- 口コミの user_id は退会後も監査用に保持できるよう nullable + SET NULL に変更
alter table public.submitted_reviews
  drop constraint if exists submitted_reviews_user_id_fkey;

alter table public.submitted_reviews
  alter column user_id drop not null;

alter table public.submitted_reviews
  add constraint submitted_reviews_user_id_fkey
  foreign key (user_id) references auth.users (id) on delete set null;

-- 審査者参照も退会時にブロックしないよう SET NULL
alter table public.submitted_reviews
  drop constraint if exists submitted_reviews_reviewed_by_fkey;

alter table public.submitted_reviews
  add constraint submitted_reviews_reviewed_by_fkey
  foreign key (reviewed_by) references auth.users (id) on delete set null;

-- 退会ユーザー管理（管理画面用）
create table if not exists public.withdrawn_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  email text not null,
  withdrawn_at timestamptz not null default now(),
  reason text not null,
  reason_other text,
  review_count integer not null default 0,
  purchase_proof_deleted boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists withdrawn_users_user_id_idx on public.withdrawn_users (user_id);
create index if not exists withdrawn_users_withdrawn_at_idx on public.withdrawn_users (withdrawn_at desc);
create index if not exists withdrawn_users_email_idx on public.withdrawn_users (lower(email));

-- 退会監査ログ
create table if not exists public.withdrawal_audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  withdrawn_at timestamptz not null default now(),
  reason text not null,
  reason_other text,
  result text not null default 'processing'
    check (result in ('processing', 'success', 'failed')),
  purchase_proof_deletion_result text,
  error_message text,
  created_at timestamptz not null default now()
);

create index if not exists withdrawal_audit_logs_user_id_idx on public.withdrawal_audit_logs (user_id);

alter table public.withdrawn_users enable row level security;
alter table public.withdrawal_audit_logs enable row level security;

-- 運営のみ閲覧
create policy "withdrawn_users_select_admin"
  on public.withdrawn_users for select
  using (public.is_admin());

create policy "withdrawal_audit_logs_select_admin"
  on public.withdrawal_audit_logs for select
  using (public.is_admin());

-- 退会済みメール判定（ログイン時メッセージ用）
create or replace function public.is_withdrawn_email(check_email text)
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.withdrawn_users w
    where lower(w.email) = lower(trim(check_email))
  )
  and not exists (
    select 1
    from auth.users u
    where lower(u.email) = lower(trim(check_email))
  );
$$;

grant execute on function public.is_withdrawn_email(text) to anon, authenticated;

-- 退会処理（Edge Function から service_role で実行）
create or replace function public.process_account_withdrawal(
  p_user_id uuid,
  p_email text,
  p_reason text,
  p_reason_other text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, storage
as $$
declare
  v_audit_id uuid;
  v_review_count integer;
  v_proof_paths text[];
  v_deleted_count integer := 0;
  v_proof_result text;
  v_path text;
begin
  if p_user_id is null then
    raise exception 'user_id is required';
  end if;

  insert into public.withdrawal_audit_logs (user_id, reason, reason_other, result)
  values (p_user_id, p_reason, nullif(trim(p_reason_other), ''), 'processing')
  returning id into v_audit_id;

  select count(*)::integer
  into v_review_count
  from public.submitted_reviews
  where user_id = p_user_id;

  select coalesce(array_agg(purchase_proof_path), '{}')
  into v_proof_paths
  from public.submitted_reviews
  where user_id = p_user_id
    and purchase_proof_path is not null
    and purchase_proof_path <> '';

  foreach v_path in array v_proof_paths
  loop
    begin
      delete from storage.objects
      where bucket_id = 'purchase-proofs'
        and name = v_path;
      v_deleted_count := v_deleted_count + 1;
    exception when others then
      null;
    end;
  end loop;

  update public.submitted_reviews
  set purchase_proof_path = null,
      updated_at = now()
  where user_id = p_user_id;

  v_proof_result := format('deleted:%s,paths:%s', v_deleted_count, coalesce(array_length(v_proof_paths, 1), 0));

  insert into public.withdrawn_users (
    user_id,
    email,
    reason,
    reason_other,
    review_count,
    purchase_proof_deleted
  ) values (
    p_user_id,
    lower(trim(p_email)),
    p_reason,
    nullif(trim(p_reason_other), ''),
    v_review_count,
    true
  );

  update public.withdrawal_audit_logs
  set result = 'success',
      purchase_proof_deletion_result = v_proof_result
  where id = v_audit_id;

  return jsonb_build_object(
    'ok', true,
    'audit_id', v_audit_id,
    'review_count', v_review_count,
    'purchase_proof_deletion_result', v_proof_result
  );
exception when others then
  update public.withdrawal_audit_logs
  set result = 'failed',
      error_message = sqlerrm
  where id = v_audit_id;

  raise;
end;
$$;

-- ストレージ: 本人フォルダの削除（退会時の補助）
create policy "purchase_proofs_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'purchase-proofs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
