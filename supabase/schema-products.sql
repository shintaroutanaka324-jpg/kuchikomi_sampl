-- サービス（商品）マスタ — schema.sql / schema-reviews.sql 実行後に実行
-- 管理者画面からサービスを追加・編集するためのテーブル

create table if not exists public.products (
  id text primary key,
  title text not null,
  instructor text not null,
  category text not null,
  price integer not null default 0 check (price >= 0),
  platform text,
  image_url text,
  description text,
  average_rating numeric(3, 1) not null default 0,
  review_count integer not null default 0,
  company_name text,
  location text,
  highlight_pro text,
  highlight_con text,
  proof_rate integer not null default 0,
  official_url text,
  support_period text,
  refund_policy text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_published_idx on public.products (is_published);

alter table public.products enable row level security;

-- 公開中のサービスは誰でも閲覧
create policy "products_select_published"
  on public.products for select
  using (is_published = true);

-- 運営はすべて閲覧
create policy "products_select_admin"
  on public.products for select
  using (public.is_admin());

-- 運営のみ追加・更新・削除
create policy "products_insert_admin"
  on public.products for insert
  with check (public.is_admin());

create policy "products_update_admin"
  on public.products for update
  using (public.is_admin());

create policy "products_delete_admin"
  on public.products for delete
  using (public.is_admin());
