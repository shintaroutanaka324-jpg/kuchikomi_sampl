-- 口コミフォーム品質向上用カラム（schema-reviews-fields.sql 実行後に実行）
-- body_before / numeric_results を独立カラムとして追加し、旧カラムから移行

alter table public.submitted_reviews
  add column if not exists body_before text,
  add column if not exists numeric_results text;

-- 旧カラムからの移行（既存データがある場合）
update public.submitted_reviews
set body_before = body_situation
where body_before is null and body_situation is not null;

update public.submitted_reviews
set numeric_results = body_numeric
where numeric_results is null and body_numeric is not null;

update public.submitted_reviews
set body_results = body_learnings
where body_results is null and body_learnings is not null;
