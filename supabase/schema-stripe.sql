-- Stripe 課金連携用（schema.sql / schema-paid-member.sql 実行後に実行）

alter table public.profiles
  add column if not exists is_paid boolean not null default false,
  add column if not exists has_posted_review boolean not null default false,
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_status text;

-- 旧 is_paid_member からの移行
update public.profiles
set is_paid = true
where is_paid_member = true and is_paid = false;

-- 既存の口コミ投稿者を反映
update public.profiles p
set has_posted_review = true
where has_posted_review = false
  and exists (
    select 1 from public.submitted_reviews r where r.user_id = p.id
  );

-- 口コミ投稿時に has_posted_review を true に
create or replace function public.mark_user_has_posted_review()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set has_posted_review = true, updated_at = now()
  where id = NEW.user_id;
  return NEW;
end;
$$;

drop trigger if exists on_review_submitted on public.submitted_reviews;
create trigger on_review_submitted
  after insert on public.submitted_reviews
  for each row execute function public.mark_user_has_posted_review();

-- ユーザー自身が課金フラグを書き換えられないよう保護（Webhook / 運営のみ更新）
create or replace function public.protect_billing_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() = 'authenticated' and auth.uid() = old.id then
    new.is_paid := old.is_paid;
    new.is_paid_member := old.is_paid_member;
    new.has_posted_review := old.has_posted_review;
    new.stripe_customer_id := old.stripe_customer_id;
    new.stripe_subscription_id := old.stripe_subscription_id;
    new.subscription_status := old.subscription_status;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profiles_billing on public.profiles;
create trigger protect_profiles_billing
  before update on public.profiles
  for each row execute function public.protect_billing_fields();
