const RATING_LABELS = {
  cost_performance: "コスパ",
  recommendation: "難易度・継続",
  support_quality: "サポート体制",
  content_satisfaction: "満足度",
  result_realization: "実現性・成果",
};

let currentTab = "pending";

function formatPeriod(row) {
  if (!row.purchase_year || !row.purchase_month) return "—";
  return `${row.purchase_year}年${row.purchase_month}月頃`;
}

function renderRatings(row) {
  return Object.entries(RATING_LABELS)
    .map(
      ([key, label]) =>
        `<div class="admin-rating-item">${label}: <strong>${row[key] ?? "—"}</strong></div>`
    )
    .join("");
}

function productOptions(selectedId) {
  if (typeof PRODUCTS === "undefined") return "";
  return PRODUCTS.map(
    (p) =>
      `<option value="${p.id}" ${p.id === selectedId ? "selected" : ""}>${App.escapeHtml(p.title)}</option>`
  ).join("");
}

function renderReviewCard(row, { showActions = false } = {}) {
  const statusClass = `admin-status--${row.status}`;
  return `
    <article class="admin-card" data-review-id="${row.id}">
      <div class="admin-card-head">
        <div>
          <h2 class="admin-card-title">${App.escapeHtml(row.product_name)}</h2>
          <p class="admin-card-meta">
            投稿日: ${formatDateJa(row.created_at.split("T")[0])}
            ・ 購入価格: ${Number(row.purchase_price).toLocaleString()}円
            ・ 購入時期: ${formatPeriod(row)}
          </p>
        </div>
        <span class="admin-status ${statusClass}">${ReviewsApi.statusLabel(row.status)}</span>
      </div>

      <p class="admin-card-meta">投稿者表示名: ${App.escapeHtml(row.reviewer_display_name)}</p>
      ${row.product_id ? `<p class="admin-card-meta">紐づけ商品ID: ${App.escapeHtml(row.product_id)}</p>` : ""}

      <h3 class="admin-section-title">評価</h3>
      <div class="admin-ratings">${renderRatings(row)}</div>

      <h3 class="admin-section-title">良かった点</h3>
      <div class="admin-text-block">${App.escapeHtml(row.body_pros)}</div>
      <h3 class="admin-section-title">気になった点</h3>
      <div class="admin-text-block">${App.escapeHtml(row.body_concerns)}</div>
      <h3 class="admin-section-title">購入前の状況・悩み</h3>
      <div class="admin-text-block">${App.escapeHtml(row.body_situation || "（未入力）")}</div>
      <h3 class="admin-section-title">得られた成果・変化</h3>
      <div class="admin-text-block">${App.escapeHtml(row.body_results || row.body_learnings || "（未入力）")}</div>
      <h3 class="admin-section-title">おすすめしたい人</h3>
      <div class="admin-text-block">${App.escapeHtml(row.body_recommend)}</div>
      ${row.body_numeric ? `<h3 class="admin-section-title">数値で表せる成果</h3><div class="admin-text-block">${App.escapeHtml(row.body_numeric)}</div>` : ""}
      ${row.body_other ? `<h3 class="admin-section-title">その他</h3><div class="admin-text-block">${App.escapeHtml(row.body_other)}</div>` : ""}

      ${
        row.purchase_proof_path
          ? `<p style="margin-top:0.75rem"><button type="button" class="admin-proof-link" data-proof-path="${App.escapeHtml(row.purchase_proof_path)}">購入証明を表示</button></p>`
          : "<p class=\"admin-card-meta\" style=\"margin-top:0.75rem\">購入証明: 未提出</p>"
      }

      ${
        row.rejection_reason
          ? `<p class="admin-card-meta" style="margin-top:0.75rem;color:#b45309">却下理由: ${App.escapeHtml(row.rejection_reason)}</p>`
          : ""
      }

      ${
        showActions
          ? `
        <div class="admin-field">
          <label for="product-${row.id}">掲載先サービス（商品ID）</label>
          <select id="product-${row.id}" class="form-input">
            <option value="">— 未紐づけ —</option>
            ${productOptions(row.product_id)}
          </select>
        </div>
        <div class="admin-field">
          <label for="note-${row.id}">運営メモ（非公開）</label>
          <textarea id="note-${row.id}" class="form-textarea" rows="2" placeholder="内部メモ">${App.escapeHtml(row.admin_note || "")}</textarea>
        </div>
        <div class="admin-field">
          <label for="reject-${row.id}">却下理由（却下時のみ投稿者に表示）</label>
          <textarea id="reject-${row.id}" class="form-textarea" rows="2" placeholder="掲載基準に適合しない場合の理由"></textarea>
        </div>
        <div class="admin-actions">
          <button type="button" class="btn btn-trust" data-action="approve" data-id="${row.id}">承認して公開</button>
          <button type="button" class="btn btn-outline" data-action="reject" data-id="${row.id}">却下</button>
        </div>`
          : ""
      }
    </article>`;
}

async function loadTab(tab) {
  currentTab = tab;
  const root = document.getElementById("admin-root");
  root.innerHTML = `<p class="admin-empty">読み込み中...</p>`;

  document.querySelectorAll(".admin-tab").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });

  try {
    let rows = [];
    if (tab === "pending") {
      rows = await ReviewsApi.getPendingReviews();
    } else if (tab === "approved") {
      rows = await ReviewsApi.getReviewHistory("approved");
    } else {
      rows = await ReviewsApi.getReviewHistory("rejected");
    }

    if (!rows.length) {
      root.innerHTML = `<div class="admin-empty">表示する口コミはありません</div>`;
      return;
    }

    root.innerHTML = rows
      .map((row) => renderReviewCard(row, { showActions: tab === "pending" }))
      .join("");

    bindCardEvents();
  } catch (err) {
    root.innerHTML = `<div class="admin-empty">${App.escapeHtml(err.message)}</div>`;
  }
}

function bindCardEvents() {
  document.querySelectorAll("[data-proof-path]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        const url = await ReviewsApi.getProofSignedUrl(btn.dataset.proofPath);
        if (url) window.open(url, "_blank", "noopener,noreferrer");
      } catch (err) {
        App.showToast(err.message, "error");
      }
    });
  });

  document.querySelectorAll("[data-action='approve']").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      btn.disabled = true;
      try {
        const productId = document.getElementById(`product-${id}`)?.value || null;
        const adminNote = document.getElementById(`note-${id}`)?.value.trim() || "";
        await ReviewsApi.approveReview(id, { productId: productId || undefined, adminNote });
        App.showToast("口コミを公開しました");
        await loadTab("pending");
      } catch (err) {
        App.showToast(err.message, "error");
        btn.disabled = false;
      }
    });
  });

  document.querySelectorAll("[data-action='reject']").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const reason = document.getElementById(`reject-${id}`)?.value.trim();
      if (!reason) {
        App.showToast("却下理由を入力してください", "error");
        return;
      }
      btn.disabled = true;
      try {
        const adminNote = document.getElementById(`note-${id}`)?.value.trim() || "";
        await ReviewsApi.rejectReview(id, reason, adminNote);
        App.showToast("口コミを却下しました");
        await loadTab("pending");
      } catch (err) {
        App.showToast(err.message, "error");
        btn.disabled = false;
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await App.whenReady();

  App.renderBreadcrumb([
    { label: "トップ", path: "index.html" },
    { label: "口コミ審査（運営）" },
  ]);

  const root = document.getElementById("admin-root");

  if (!Auth.isConfigured()) {
    root.innerHTML = `<div class="admin-denied"><h1>設定が必要です</h1><p>Supabase の設定を完了してください。</p></div>`;
    return;
  }

  if (!Auth.isLoggedIn()) {
    root.innerHTML = `<div class="admin-denied"><h1>ログインが必要です</h1><p><a href="login.html?redirect=admin.html" class="btn btn-trust">ログイン</a></p></div>`;
    return;
  }

  if (!Auth.isAdmin()) {
    root.innerHTML = `<div class="admin-denied"><h1>アクセス権限がありません</h1><p>このページは運営者のみ利用できます。</p><a href="index.html" class="btn btn-outline">トップへ</a></div>`;
    return;
  }

  document.querySelectorAll(".admin-tab").forEach((btn) => {
    btn.addEventListener("click", () => loadTab(btn.dataset.tab));
  });

  await loadTab("pending");
});
