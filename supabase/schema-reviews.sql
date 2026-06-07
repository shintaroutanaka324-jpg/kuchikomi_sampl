-- 口コミ投稿・運営審査（schema.sql 実行後にこのファイルも実行してください）

-- 運営者フラグ
alter table public.profiles
  add column if not exists is_admin boolean not null default false;

-- 運営者判定（RLS 用）
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- 口コミ投稿テーブル
create table if not exists public.submitted_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  product_id text,
  product_name text not null,
  purchase_price integer not null check (purchase_price >= 0),
  purchase_year integer,
  purchase_month integer,
  purchase_proof_path text,
  cost_performance numeric(3, 1) not null,
  recommendation numeric(3, 1) not null,
  support_quality numeric(3, 1) not null,
  content_satisfaction numeric(3, 1) not null,
  result_realization numeric(3, 1) not null,
  body_pros text not null,
  body_concerns text not null,
  body_situation text not null,
  body_before text,
  body_results text not null,
  body_recommend text not null,
  body_learnings text,
  body_numeric text,
  numeric_results text,
  body_other text,
  reviewer_display_name text not null default '匿名ユーザー',
  rejection_reason text,
  admin_note text,
  reviewed_by uuid references auth.users,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists submitted_reviews_status_idx on public.submitted_reviews (status);
create index if not exists submitted_reviews_product_id_idx on public.submitted_reviews (product_id);
create index if not exists submitted_reviews_user_id_idx on public.submitted_reviews (user_id);

alter table public.submitted_reviews enable row level security;

-- 公開済み口コミは誰でも閲覧
create policy "submitted_reviews_select_approved"
  on public.submitted_reviews for select
  using (status = 'approved');

-- 本人は自分の投稿を閲覧
create policy "submitted_reviews_select_own"
  on public.submitted_reviews for select
  using (auth.uid() = user_id);

-- 運営はすべて閲覧
create policy "submitted_reviews_select_admin"
  on public.submitted_reviews for select
  using (public.is_admin());

-- ログインユーザーは投稿可能
create policy "submitted_reviews_insert_own"
  on public.submitted_reviews for insert
  with check (auth.uid() = user_id and status = 'pending');

-- 本人は審査待ちの投稿を更新（購入証明パスなど）
create policy "submitted_reviews_update_own_pending"
  on public.submitted_reviews for update
  using (auth.uid() = user_id and status = 'pending')
  with check (auth.uid() = user_id and status = 'pending');

-- 運営のみ審査・更新
create policy "submitted_reviews_update_admin"
  on public.submitted_reviews for update
  using (public.is_admin());

-- 購入証明ストレージ
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'purchase-proofs',
  'purchase-proofs',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "purchase_proofs_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'purchase-proofs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "purchase_proofs_select_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'purchase-proofs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "purchase_proofs_select_admin"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'purchase-proofs'
    and public.is_admin()
  );

create policy "purchase_proofs_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'purchase-proofs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
