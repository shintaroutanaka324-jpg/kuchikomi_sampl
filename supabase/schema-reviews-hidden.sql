-- 口コミのサイト非表示（削除せず運営が非公開にできる）
-- schema-reviews.sql 実行後に SQL Editor で実行してください

alter table public.submitted_reviews
  add column if not exists is_published boolean not null default true;

create index if not exists submitted_reviews_published_idx
  on public.submitted_reviews (is_published)
  where status = 'approved';

-- 公開サイトには is_published = true の承認済み口コミのみ表示
drop policy if exists "submitted_reviews_select_approved" on public.submitted_reviews;

create policy "submitted_reviews_select_approved"
  on public.submitted_reviews for select
  using (status = 'approved' and is_published = true);
