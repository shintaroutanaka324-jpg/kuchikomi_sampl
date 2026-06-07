-- 口コミ投稿後の「全文閲覧（モザイク解除）」ルールベース審査
-- schema-reviews.sql / schema-stripe.sql 実行後に SQL Editor で実行してください

alter table public.submitted_reviews
  add column if not exists read_unlock_status text not null default 'pending'
    check (read_unlock_status in ('pending', 'auto_approved', 'admin_approved', 'denied')),
  add column if not exists quality_flags jsonb;

create index if not exists submitted_reviews_read_unlock_idx
  on public.submitted_reviews (read_unlock_status);

-- 投稿直後の無条件解除をやめる（auto_approved / admin_approved のときだけ解除）
drop trigger if exists on_review_submitted on public.submitted_reviews;

create or replace function public.sync_read_unlock_on_review()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if NEW.read_unlock_status in ('auto_approved', 'admin_approved') then
    update public.profiles
    set has_posted_review = true, updated_at = now()
    where id = NEW.user_id;
  end if;
  return NEW;
end;
$$;

drop trigger if exists on_review_read_unlock on public.submitted_reviews;
create trigger on_review_read_unlock
  after insert or update of read_unlock_status on public.submitted_reviews
  for each row execute function public.sync_read_unlock_on_review();

-- 既存の口コミ投稿者はこれまでどおり閲覧可能に
update public.submitted_reviews
set read_unlock_status = 'auto_approved'
where read_unlock_status = 'pending';

update public.profiles p
set has_posted_review = true, updated_at = now()
where has_posted_review = false
  and exists (
    select 1 from public.submitted_reviews r
    where r.user_id = p.id
      and r.read_unlock_status in ('auto_approved', 'admin_approved')
  );
