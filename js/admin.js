const RATING_LABELS = {
  cost_performance: "コスパ",
  recommendation: "難易度・継続",
  support_quality: "サポート体制",
  content_satisfaction: "満足度",
  result_realization: "実現性・成果",
};

const EDITABLE_BODY_FIELDS = [
  { key: "body_pros", label: "良かった点・満足した点", minChars: 150, rows: 5 },
  { key: "body_concerns", label: "気になった点・改善してほしい点", minChars: 80, rows: 4 },
  { key: "body_before", label: "受講前・利用前の状態", minChars: 80, rows: 4 },
  { key: "body_results", label: "受講後・利用後の変化", minChars: 150, rows: 5 },
  { key: "body_recommend", label: "どんな人におすすめしたいか", minChars: 80, rows: 4 },
  { key: "numeric_results", label: "数値で表せる成果", optional: true, rows: 3 },
  { key: "body_other", label: "その他", optional: true, rows: 3 },
];

let currentTab = "pending";
const pendingRowsById = new Map();

function formatPeriod(row) {
  if (!row.purchase_year || !row.purchase_month) return "—";
  return `${row.purchase_year}年${row.purchase_month}月頃`;
}

function getBodyFieldValue(row, key) {
  if (key === "body_results") return row.body_results || row.body_learnings || "";
  if (key === "body_before") return row.body_before || row.body_situation || "";
  if (key === "numeric_results") return row.numeric_results || row.body_numeric || "";
  return row[key] || "";
}

function countAdminChars(value) {
  return [...String(value || "")].length;
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
  const list = typeof getAllProducts === "function" ? getAllProducts() : PRODUCTS || [];
  return list.map(
    (p) =>
      `<option value="${p.id}" ${p.id === selectedId ? "selected" : ""}>${App.escapeHtml(p.title)}</option>`
  ).join("");
}

function renderBodyReadOnly(row) {
  return EDITABLE_BODY_FIELDS.map((field) => {
    const value = getBodyFieldValue(row, field.key);
    if (field.optional && !value) return "";
    return `
      <h3 class="admin-section-title">${field.label}</h3>
      <div class="admin-text-block">${App.escapeHtml(value || "（未入力）")}</div>`;
  }).join("");
}

function renderBodyEditors(row) {
  return `
    <div class="admin-edit-note">
      <p>不適切な表現がある場合は、内容を修正してから公開してください。修正した箇所は記録されます。</p>
    </div>
    ${EDITABLE_BODY_FIELDS.map((field) => {
      const value = getBodyFieldValue(row, field.key);
      const minLabel = field.optional
        ? "任意"
        : `最低${field.minChars}文字`;
      return `
        <div class="admin-field admin-field--body">
          <label for="edit-${field.key}-${row.id}">
            ${field.label}
            <span class="admin-field-min">${minLabel}</span>
          </label>
          <textarea
            id="edit-${field.key}-${row.id}"
            class="form-textarea admin-edit-textarea"
            rows="${field.rows || 4}"
            data-min-chars="${field.minChars || 0}"
            data-optional="${field.optional ? "true" : "false"}">${App.escapeHtml(value)}</textarea>
          <p class="admin-char-hint" id="hint-${field.key}-${row.id}">${countAdminChars(value)}文字</p>
        </div>`;
    }).join("")}`;
}

function renderReviewCard(row, { showActions = false } = {}) {
  const statusClass = `admin-status--${row.status}`;
  const editedBadge = row.was_edited_by_admin
    ? '<span class="admin-edited-badge">運営が内容を修正して公開</span>'
    : "";

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
          ${editedBadge}
        </div>
        <span class="admin-status ${statusClass}">${ReviewsApi.statusLabel(row.status)}</span>
      </div>

      <p class="admin-card-meta">投稿者表示名: ${App.escapeHtml(row.reviewer_display_name)}</p>
      ${row.product_id ? `<p class="admin-card-meta">紐づけ商品ID: ${App.escapeHtml(row.product_id)}</p>` : ""}

      <h3 class="admin-section-title">評価</h3>
      <div class="admin-ratings">${renderRatings(row)}</div>

      ${showActions ? renderBodyEditors(row) : renderBodyReadOnly(row)}

      ${
        row.purchase_proof_path
          ? `<p style="margin-top:0.75rem"><button type="button" class="admin-proof-link" data-proof-path="${App.escapeHtml(row.purchase_proof_path)}">購入証明を表示</button></p>`
          : '<p class="admin-card-meta" style="margin-top:0.75rem">購入証明: 未提出</p>'
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
          <textarea id="note-${row.id}" class="form-textarea" rows="2" placeholder="修正理由や内部メモ">${App.escapeHtml(row.admin_note || "")}</textarea>
        </div>
        <div class="admin-field">
          <label for="reject-${row.id}">却下理由（却下時のみ投稿者に表示）</label>
          <textarea id="reject-${row.id}" class="form-textarea" rows="2" placeholder="掲載基準に適合しない場合の理由"></textarea>
        </div>
        <div class="admin-actions">
          <button type="button" class="btn btn-trust" data-action="approve" data-id="${row.id}">修正内容を確認して公開</button>
          <button type="button" class="btn btn-outline" data-action="reject" data-id="${row.id}">却下</button>
        </div>`
          : ""
      }
    </article>`;
}

function collectEditedContent(reviewId) {
  const content = {};
  EDITABLE_BODY_FIELDS.forEach((field) => {
    const el = document.getElementById(`edit-${field.key}-${reviewId}`);
    content[field.key] = el?.value.trim() || "";
  });
  return content;
}

function wasContentEdited(row, content) {
  return EDITABLE_BODY_FIELDS.some((field) => {
    const original = getBodyFieldValue(row, field.key).trim();
    return (content[field.key] || "").trim() !== original;
  });
}

function bindEditorHints() {
  EDITABLE_BODY_FIELDS.forEach((field) => {
    document.querySelectorAll(`[id^="edit-${field.key}-"]`).forEach((textarea) => {
      const hint = document.getElementById(`hint-${field.key}-${textarea.id.replace(`edit-${field.key}-`, "")}`);
      const update = () => {
        const len = countAdminChars(textarea.value);
        const min = Number(textarea.dataset.minChars || 0);
        const optional = textarea.dataset.optional === "true";
        if (hint) {
          if (optional) {
            hint.textContent = `${len}文字（任意）`;
            hint.classList.remove("is-invalid");
          } else {
            const remaining = Math.max(0, min - len);
            hint.textContent =
              remaining > 0
                ? `${len} / ${min}文字（あと${remaining}文字）`
                : `${len} / ${min}文字（達成済み）`;
            hint.classList.toggle("is-invalid", remaining > 0);
            hint.classList.toggle("is-valid", remaining === 0);
          }
        }
      };
      textarea.addEventListener("input", update);
      update();
    });
  });
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

    pendingRowsById.clear();

    if (!rows.length) {
      root.innerHTML = `<div class="admin-empty">表示する口コミはありません</div>`;
      return;
    }

    if (tab === "pending") {
      rows.forEach((row) => pendingRowsById.set(row.id, row));
    }

    root.innerHTML = rows
      .map((row) => renderReviewCard(row, { showActions: tab === "pending" }))
      .join("");

    bindCardEvents();
    if (tab === "pending") bindEditorHints();
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
      const card = document.querySelector(`[data-review-id="${id}"]`);
      btn.disabled = true;
      try {
        const productId = document.getElementById(`product-${id}`)?.value || null;
        const adminNote = document.getElementById(`note-${id}`)?.value.trim() || "";
        const content = collectEditedContent(id);
        const row = pendingRowsById.get(id);
        const edited = row ? wasContentEdited(row, content) : false;

        await ReviewsApi.approveReview(id, {
          productId: productId || undefined,
          adminNote,
          content,
          wasEdited: edited,
        });
        App.showToast(edited ? "内容を修正して公開しました" : "口コミを公開しました");
        await loadTab("pending");
      } catch (err) {
        App.showToast(err.message, "error");
        btn.disabled = false;
      }
      void card;
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
