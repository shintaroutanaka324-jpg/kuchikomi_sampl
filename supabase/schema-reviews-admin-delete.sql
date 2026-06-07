-- 運営が公開済み口コミを削除できるようにする（schema-reviews.sql 実行後）

create policy "submitted_reviews_delete_admin"
  on public.submitted_reviews for delete
  using (public.is_admin());

-- 購入証明ファイルの削除（運営）
create policy "purchase_proofs_delete_admin"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'purchase-proofs'
    and public.is_admin()
  );
