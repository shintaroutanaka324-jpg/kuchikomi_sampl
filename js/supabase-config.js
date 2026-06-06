/**
 * Supabase プロジェクトの接続情報
 *
 * 1. https://supabase.com でプロジェクトを作成
 * 2. Settings → API から URL と anon public key をコピー
 * 3. 下記の url / anonKey に貼り付け
 * 4. supabase/schema.sql を SQL Editor で実行
 *
 * 詳細: supabase/SETUP.md
 */
window.SUPABASE_CONFIG = {
  url: "https://pzqkfknrzvrqrfdemetq.supabase.co",
  anonKey: "sb_publishable_MLj2s3NRvUAqis--XvQenQ_YAjys8j_",
  // GitHub Pages のプロジェクトサイト用（末尾スラッシュ付き）
  siteBasePath: "/kuchikomi_sampl/",
};
