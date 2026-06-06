function renderMyReviewCard(row) {
  const statusClass = `admin-status--${row.status}`;
  return `
    <article class="admin-card">
      <div class="admin-card-head">
        <div>
          <h2 class="admin-card-title">${App.escapeHtml(row.product_name)}</h2>
          <p class="admin-card-meta">投稿日: ${formatDateJa(row.created_at.split("T")[0])}</p>
        </div>
        <span class="admin-status ${statusClass}">${ReviewsApi.statusLabel(row.status)}</span>
      </div>
      ${
        row.status === "pending"
          ? `<p style="font-size:0.875rem;color:var(--gray-600);line-height:1.7">運営が内容を確認しています。承認後にサイトへ公開されます。</p>`
          : ""
      }
      ${
        row.status === "approved" && row.product_id
          ? `<p style="margin-top:0.75rem"><a href="review-detail.html?id=${App.escapeHtml(row.product_id)}" class="btn btn-outline btn-sm">サービスページで見る</a></p>`
          : ""
      }
      ${
        row.status === "rejected" && row.rejection_reason
          ? `<p style="margin-top:0.75rem;font-size:0.875rem;color:#b45309">却下理由: ${App.escapeHtml(row.rejection_reason)}</p>`
          : ""
      }
    </article>`;
}

document.addEventListener("DOMContentLoaded", async () => {
  await App.whenReady();

  App.renderBreadcrumb([
    { label: "トップ", path: "index.html" },
    { label: "投稿した口コミ" },
  ]);

  const root = document.getElementById("my-reviews-root");

  if (!Auth.isLoggedIn()) {
    root.innerHTML = `
      <div class="admin-denied">
        <h1>ログインが必要です</h1>
        <p><a href="login.html?redirect=my-reviews.html" class="btn btn-trust">ログイン</a></p>
      </div>`;
    return;
  }

  try {
    const rows = await ReviewsApi.getMyReviews();
    if (!rows.length) {
      root.innerHTML = `
        <div class="admin-empty">
          <p>まだ口コミを投稿していません。</p>
          <p style="margin-top:1rem"><a href="submit-review.html" class="btn btn-trust">口コミを投稿する</a></p>
        </div>`;
      return;
    }
    root.innerHTML = rows.map(renderMyReviewCard).join("");
  } catch (err) {
    root.innerHTML = `<div class="admin-empty">${App.escapeHtml(err.message)}</div>`;
  }
});
