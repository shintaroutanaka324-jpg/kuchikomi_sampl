(function () {
  function formatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function renderWithdrawnTable(rows) {
    if (!rows.length) {
      return '<p class="admin-empty">退会ユーザーの記録はまだありません。</p>';
    }

    const body = rows
      .map(
        (row) => `
        <tr>
          <td><span class="admin-withdrawals-id">${App.escapeHtml(row.user_id)}</span></td>
          <td>${formatDate(row.withdrawn_at)}</td>
          <td>${App.escapeHtml(AccountApi.reasonLabel(row.reason))}${
            row.reason_other
              ? `<br><span style="color:var(--gray-500);font-size:0.8125rem">${App.escapeHtml(row.reason_other)}</span>`
              : ""
          }</td>
          <td>${row.review_count ?? 0}</td>
          <td>${
            row.purchase_proof_deleted
              ? '<span class="admin-badge-yes">削除済み</span>'
              : "—"
          }</td>
        </tr>`
      )
      .join("");

    return `
      <h2 class="admin-section-title" style="margin-bottom:0.75rem">退会ユーザー一覧</h2>
      <div class="admin-withdrawals-table-wrap">
        <table class="admin-withdrawals-table">
          <thead>
            <tr>
              <th>ユーザーID</th>
              <th>退会日時</th>
              <th>退会理由</th>
              <th>口コミ投稿数</th>
              <th>購入証明削除済み</th>
            </tr>
          </thead>
          <tbody>${body}</tbody>
        </table>
      </div>`;
  }

  function renderAuditTable(rows) {
    if (!rows.length) {
      return "";
    }

    const body = rows
      .map(
        (row) => `
        <tr>
          <td><span class="admin-withdrawals-id">${App.escapeHtml(row.user_id)}</span></td>
          <td>${formatDate(row.withdrawn_at)}</td>
          <td>${App.escapeHtml(AccountApi.reasonLabel(row.reason))}</td>
          <td>${App.escapeHtml(row.result || "—")}</td>
          <td>${App.escapeHtml(row.purchase_proof_deletion_result || "—")}</td>
        </tr>`
      )
      .join("");

    return `
      <h2 class="admin-section-title" style="margin:2rem 0 0.75rem">監査ログ</h2>
      <div class="admin-withdrawals-table-wrap">
        <table class="admin-withdrawals-table">
          <thead>
            <tr>
              <th>ユーザーID</th>
              <th>退会日時</th>
              <th>退会理由</th>
              <th>退会処理結果</th>
              <th>購入証明削除結果</th>
            </tr>
          </thead>
          <tbody>${body}</tbody>
        </table>
      </div>`;
  }

  async function init() {
    await App.whenReady();

    if (!Auth.isConfigured()) {
      document.getElementById("admin-withdrawals-root").innerHTML =
        '<p class="admin-empty">Supabase の設定が必要です。</p>';
      return;
    }

    if (!Auth.isLoggedIn()) {
      window.location.href = "login.html?redirect=admin-withdrawals.html";
      return;
    }

    if (!Auth.isAdmin()) {
      document.getElementById("admin-withdrawals-root").innerHTML =
        '<p class="admin-empty">運営者権限が必要です。</p>';
      return;
    }

    App.renderBreadcrumb([
      { label: "トップ", path: "index.html" },
      { label: "退会ユーザー管理" },
    ]);

    const root = document.getElementById("admin-withdrawals-root");
    root.innerHTML = '<p class="admin-empty">読み込み中...</p>';

    try {
      const [withdrawn, audits] = await Promise.all([
        AccountApi.loadWithdrawnUsersAdmin(),
        AccountApi.loadWithdrawalAuditLogsAdmin(),
      ]);
      root.innerHTML = renderWithdrawnTable(withdrawn) + renderAuditTable(audits);
    } catch (err) {
      root.innerHTML = `<p class="admin-empty">${App.escapeHtml(err.message)}</p>`;
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
