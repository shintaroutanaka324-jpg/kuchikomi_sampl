-- 公開サイトでデモサービスの非表示を正しく反映するため、
-- 非公開サービスの id も匿名ユーザーが参照できるようにする
-- schema-products.sql 実行後に SQL Editor で実行してください

create policy "products_select_unpublished"
  on public.products for select
  using (is_published = false);
