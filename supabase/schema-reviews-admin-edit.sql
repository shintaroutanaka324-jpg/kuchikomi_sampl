-- 運営による口コミ内容の修正記録（schema-reviews-fields.sql 実行後に実行）

alter table public.submitted_reviews
  add column if not exists was_edited_by_admin boolean not null default false;
