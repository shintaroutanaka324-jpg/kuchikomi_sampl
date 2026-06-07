-- 有料会員フラグ（将来の Stripe 連携用）
-- profiles テーブル作成済みの環境で実行してください

alter table public.profiles
  add column if not exists is_paid_member boolean not null default false;

-- 運営が手動で有料会員にする例:
-- update public.profiles set is_paid_member = true where email = 'user@example.com';
