-- 口コミ投稿フォーム追加項目（サービス名と販売者名の分離・返金保証）
-- schema-reviews.sql 実行後に SQL Editor で実行してください

alter table public.submitted_reviews
  add column if not exists seller_name text,
  add column if not exists has_refund_guarantee text
    check (has_refund_guarantee is null or has_refund_guarantee in ('yes', 'no', 'unknown'));
