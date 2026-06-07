-- 口コミ投稿フォーム項目の追加（schema-reviews.sql 実行済みの場合に実行）

alter table public.submitted_reviews
  add column if not exists body_situation text,
  add column if not exists body_results text,
  add column if not exists body_numeric text;

-- 旧カラムからの移行（既存データがある場合）
update public.submitted_reviews
set body_results = body_learnings
where body_results is null and body_learnings is not null;
