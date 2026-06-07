document.addEventListener("DOMContentLoaded", async () => {
  await App.whenReady();

  App.renderBreadcrumb([
    { label: "トップ", path: "index.html" },
    { label: "サービス管理（運営）" },
  ]);

  const root = document.getElementById("admin-services-root");
  if (!root) return;

  if (!Auth.isConfigured()) {
    root.innerHTML = `<div class="admin-denied"><h1>設定が必要です</h1><p>Supabase の設定を完了してください。</p></div>`;
    return;
  }

  if (!Auth.isLoggedIn()) {
    root.innerHTML = `<div class="admin-denied"><h1>ログインが必要です</h1><p><a href="login.html?redirect=admin-services.html" class="btn btn-trust">ログイン</a></p></div>`;
    return;
  }

  if (!Auth.isAdmin()) {
    root.innerHTML = `<div class="admin-denied"><h1>アクセス権限がありません</h1><p>このページは運営者のみ利用できます。</p><a href="index.html" class="btn btn-outline">トップへ</a></div>`;
    return;
  }

  if (window.AdminProducts?.render) {
    await AdminProducts.render(root);
  } else {
    root.innerHTML = `<div class="admin-empty">サービス管理の読み込みに失敗しました。ページを再読み込みしてください。</div>`;
  }
});
