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

let currentTab = "all";
let categoryFilter = "all";
let serviceFilter = "all";
const editableRowsById = new Map();

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

function getReviewCategory(row) {
  if (row._category) return row._category;
  const productId = row.product_id;
  if (productId && typeof getProductById === "function") {
    const product = getProductById(productId);
    if (product?.category) return product.category;
  }
  return "other";
}

function legacyReviewToAdminRow(review) {
  const product =
    typeof getProductById === "function" ? getProductById(review.productId) : null;
  return {
    id: review.id,
    status: "approved",
    product_name: product?.title || review.title || "（不明）",
    product_id: review.productId || null,
    created_at: `${review.date}T12:00:00.000Z`,
    purchase_price: review.purchasePrice || 0,
    purchase_year: null,
    purchase_month: null,
    reviewer_display_name: review.userName || "匿名ユーザー",
    cost_performance: review.costPerformance,
    recommendation: review.recommendation,
    support_quality: review.supportQuality,
    content_satisfaction: review.contentSatisfaction,
    result_realization: review.resultRealization,
    body_pros: review.content || review.pros?.[0] || "",
    body_concerns: review.cons?.[0] || "",
    body_before: review.situation || "",
    body_results: review.learned || "",
    body_recommend: "",
    _isStatic: true,
    _category: product?.category || "other",
  };
}

function getStaticReviewsForAdmin() {
  if (typeof REVIEWS === "undefined") return [];
  return REVIEWS.map(legacyReviewToAdminRow);
}

function annotateReviewRows(rows) {
  return rows.map((row) => ({
    ...row,
    _category: row._category || getReviewCategory(row),
    _isStatic: row._isStatic === true,
  }));
}

function getReviewServiceKey(row) {
  if (row.product_id) return row.product_id;
  if (row.product_name) return `name:${row.product_name}`;
  return "__unlinked__";
}

function getReviewServiceLabel(row) {
  if (row.product_id && typeof getProductById === "function") {
    const product = getProductById(row.product_id);
    if (product?.title) return product.title;
  }
  return row.product_name || "（サービス未紐づけ）";
}

function resolveProductName(productId) {
  if (!productId) return null;
  const list = typeof getAllProducts === "function" ? getAllProducts() : PRODUCTS || [];
  return list.find((p) => p.id === productId)?.title || null;
}

function filterReviews(rows) {
  let result = rows;
  if (categoryFilter !== "all") {
    result = result.filter((row) => getReviewCategory(row) === categoryFilter);
  }
  if (serviceFilter !== "all") {
    result = result.filter((row) => getReviewServiceKey(row) === serviceFilter);
  }
  return result;
}

function buildServiceFilterOptions(allRows) {
  const baseRows =
    categoryFilter === "all"
      ? allRows
      : allRows.filter((row) => getReviewCategory(row) === categoryFilter);

  const map = new Map();
  baseRows.forEach((row) => {
    const key = getReviewServiceKey(row);
    const label = getReviewServiceLabel(row);
    if (!map.has(key)) {
      map.set(key, { label, count: 0 });
    }
    map.get(key).count += 1;
  });

  return Array.from(map.entries())
    .sort((a, b) => a[1].label.localeCompare(b[1].label, "ja"))
    .map(([key, info]) => ({ key, ...info }));
}

function renderReviewFilters(allRows, filteredCount) {
  const el = document.getElementById("admin-review-filters");
  if (!el) return;

  const counts = new Map();
  allRows.forEach((row) => {
    const cat = getReviewCategory(row);
    counts.set(cat, (counts.get(cat) || 0) + 1);
  });

  const chips = [
    `<button type="button" class="admin-filter-chip ${categoryFilter === "all" ? "active" : ""}" data-review-category="all">すべて <span class="admin-filter-count">${allRows.length}</span></button>`,
  ];

  if (typeof CATEGORIES !== "undefined") {
    CATEGORIES.forEach((c) => {
      const count = counts.get(c.value) || 0;
      if (count === 0 && categoryFilter !== c.value) return;
      chips.push(
        `<button type="button" class="admin-filter-chip ${categoryFilter === c.value ? "active" : ""}" data-review-category="${c.value}">${App.escapeHtml(c.label)} <span class="admin-filter-count">${count}</span></button>`
      );
    });
  }

  const serviceOptions = buildServiceFilterOptions(allRows);
  const serviceSelectOptions = [
    `<option value="all">すべてのサービス（${serviceOptions.reduce((n, s) => n + s.count, 0)}件）</option>`,
    ...serviceOptions.map(
      (s) =>
        `<option value="${App.escapeHtml(s.key)}" ${serviceFilter === s.key ? "selected" : ""}>${App.escapeHtml(s.label)}（${s.count}件）</option>`
    ),
  ];

  el.innerHTML = `
    <div class="admin-filter-section">
      <p class="admin-filter-label">ジャンルで絞り込み</p>
      <div class="admin-filter-bar admin-filter-bar--scroll">${chips.join("")}</div>
    </div>
    <div class="admin-filter-section">
      <p class="admin-filter-label">サービスで絞り込み</p>
      <select id="admin-service-filter" class="form-input admin-service-filter">${serviceSelectOptions.join("")}</select>
    </div>
    <p class="admin-product-hint">表示中: ${filteredCount}件${filteredCount !== allRows.length ? `（全${allRows.length}件中）` : ""}</p>`;

  el.querySelectorAll("[data-review-category]").forEach((btn) => {
    btn.addEventListener("click", () => {
      categoryFilter = btn.dataset.reviewCategory || "all";
      serviceFilter = "all";
      loadTab(currentTab);
    });
  });

  document.getElementById("admin-service-filter")?.addEventListener("change", (e) => {
    serviceFilter = e.target.value || "all";
    loadTab(currentTab);
  });
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
  return list
    .map(
      (p) =>
        `<option value="${p.id}" ${p.id === selectedId ? "selected" : ""}>${App.escapeHtml(p.title)}</option>`
    )
    .join("");
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

function renderBodyEditors(row, { postPublish = false } = {}) {
  const note = postPublish
    ? "公開済みの口コミを運営が修正できます。保存するとサイトに反映され、修正記録が残ります。"
    : "不適切な表現がある場合は、内容を修正してから公開してください。修正した箇所は記録されます。";
  return `
    <div class="admin-edit-note">
      <p>${note}</p>
    </div>
    ${EDITABLE_BODY_FIELDS.map((field) => {
      const value = getBodyFieldValue(row, field.key);
      const minLabel = field.optional ? "任意" : `最低${field.minChars}文字`;
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

function renderReviewCard(row, { showActions = false, showEditActions = false, showDelete = false } = {}) {
  const showEditors = showActions || showEditActions;
  const isStatic = row._isStatic === true;
  const statusClass = `admin-status--${row.status}`;
  const editedBadge = row.was_edited_by_admin
    ? '<span class="admin-edited-badge">運営が内容を修正済み</span>'
    : "";
  const staticBadge = isStatic
    ? '<span class="admin-product-source admin-product-source--static">デモデータ</span>'
    : "";
  const categoryLabel =
    typeof getCategoryLabel === "function"
      ? getCategoryLabel(getReviewCategory(row))
      : getReviewCategory(row);

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
          <p class="admin-card-meta">ジャンル: ${App.escapeHtml(categoryLabel)} ${staticBadge}</p>
          ${editedBadge}
        </div>
        <span class="admin-status ${statusClass}">${ReviewsApi.statusLabel(row.status)}</span>
      </div>

      <p class="admin-card-meta">投稿者表示名: ${App.escapeHtml(row.reviewer_display_name)}</p>
      ${row.product_id ? `<p class="admin-card-meta">紐づけ商品ID: ${App.escapeHtml(row.product_id)}</p>` : ""}

      <h3 class="admin-section-title">評価</h3>
      <div class="admin-ratings">${renderRatings(row)}</div>

      ${showEditors ? renderBodyEditors(row, { postPublish: showEditActions }) : renderBodyReadOnly(row)}

      ${
        !isStatic && row.purchase_proof_path
          ? `<p style="margin-top:0.75rem"><button type="button" class="admin-proof-link" data-proof-path="${App.escapeHtml(row.purchase_proof_path)}">購入証明を表示</button></p>`
          : !isStatic
            ? '<p class="admin-card-meta" style="margin-top:0.75rem">購入証明: 未提出</p>'
            : ""
      }

      ${
        row.rejection_reason
          ? `<p class="admin-card-meta" style="margin-top:0.75rem;color:#b45309">却下理由: ${App.escapeHtml(row.rejection_reason)}</p>`
          : ""
      }

      ${
        isStatic
          ? `
        <p class="admin-card-meta" style="margin-top:0.75rem">デモ用の静的口コミです。編集・削除は data.js で行ってください。</p>
        ${
          row.product_id
            ? `<p style="margin-top:0.5rem"><a href="review-detail.html?id=${encodeURIComponent(row.product_id)}" class="btn btn-outline btn-sm" target="_blank" rel="noopener">サービスページで見る</a></p>`
            : ""
        }`
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

      ${
        showEditActions
          ? `
        <div class="admin-field">
          <label for="product-${row.id}">掲載先サービス</label>
          <select id="product-${row.id}" class="form-input">
            <option value="">— 未紐づけ —</option>
            ${productOptions(row.product_id)}
          </select>
        </div>
        <div class="admin-field">
          <label for="note-${row.id}">運営メモ（非公開）</label>
          <textarea id="note-${row.id}" class="form-textarea" rows="2" placeholder="修正理由や内部メモ">${App.escapeHtml(row.admin_note || "")}</textarea>
        </div>
        <div class="admin-actions">
          <button type="button" class="btn btn-trust" data-action="save-review" data-id="${row.id}">変更を保存</button>
        </div>`
          : ""
      }

      ${
        showDelete
          ? `
        <div class="admin-actions admin-actions--delete">
          <button type="button" class="btn btn-outline admin-btn-delete" data-action="delete-review" data-id="${row.id}">
            サイトから削除
          </button>
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
      const hint = document.getElementById(
        `hint-${field.key}-${textarea.id.replace(`edit-${field.key}-`, "")}`
      );
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

async function fetchReviewsForTab(tab) {
  let rows = [];

  if (tab === "all") {
    rows = await ReviewsApi.getAllReviewsAdmin();
    rows = [...rows, ...getStaticReviewsForAdmin()];
  } else if (tab === "pending") {
    rows = await ReviewsApi.getPendingReviews();
  } else if (tab === "approved") {
    rows = await ReviewsApi.getReviewHistory("approved");
    rows = [...rows, ...getStaticReviewsForAdmin()];
  } else {
    rows = await ReviewsApi.getReviewHistory("rejected");
  }

  return annotateReviewRows(rows);
}

async function loadTab(tab) {
  currentTab = tab;
  const root = document.getElementById("admin-root");
  root.innerHTML = `<p class="admin-empty">読み込み中...</p>`;

  document.querySelectorAll(".admin-tab").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });

  try {
    const allRows = await fetchReviewsForTab(tab);
    const serviceOptions = buildServiceFilterOptions(allRows);
    if (serviceFilter !== "all" && !serviceOptions.some((s) => s.key === serviceFilter)) {
      serviceFilter = "all";
    }
    const filtered = filterReviews(allRows);

    renderReviewFilters(allRows, filtered.length);

    editableRowsById.clear();

    if (!filtered.length) {
      root.innerHTML = `<div class="admin-empty">表示する口コミはありません</div>`;
      return;
    }

    filtered
      .filter((row) => !row._isStatic)
      .forEach((row) => editableRowsById.set(row.id, row));

    root.innerHTML = filtered
      .map((row) => {
        const isPending = row.status === "pending";
        const canEdit = !row._isStatic && !isPending;
        return renderReviewCard(row, {
          showActions: isPending && !row._isStatic,
          showEditActions: canEdit,
          showDelete: !row._isStatic && row.status === "approved",
        });
      })
      .join("");

    bindCardEvents();
    bindEditorHints();
  } catch (err) {
    document.getElementById("admin-review-filters").innerHTML = "";
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
        const content = collectEditedContent(id);
        const row = editableRowsById.get(id);
        const edited = row ? wasContentEdited(row, content) : false;

        await ReviewsApi.approveReview(id, {
          productId: productId || undefined,
          productName: resolveProductName(productId) || undefined,
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
    });
  });

  document.querySelectorAll("[data-action='save-review']").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      btn.disabled = true;
      try {
        const productId = document.getElementById(`product-${id}`)?.value || null;
        const adminNote = document.getElementById(`note-${id}`)?.value.trim() || "";
        const content = collectEditedContent(id);
        const row = editableRowsById.get(id);
        const edited = row ? wasContentEdited(row, content) : true;
        const productChanged = row && productId !== (row.product_id || "");

        await ReviewsApi.updateReviewAdmin(id, {
          productId,
          productName: resolveProductName(productId) || row?.product_name || undefined,
          adminNote,
          content,
          wasEdited: edited || productChanged,
        });
        App.showToast(edited || productChanged ? "口コミを更新しました（運営が修正）" : "口コミを更新しました");
        await loadTab(currentTab);
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

  document.querySelectorAll("[data-action='delete-review']").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (
        !window.confirm(
          "この口コミをサイトから完全に削除しますか？\n削除するとトップページやサービス詳細からも消え、元に戻せません。"
        )
      ) {
        return;
      }
      btn.disabled = true;
      try {
        await ReviewsApi.deleteApprovedReview(id);
        App.showToast("口コミを削除しました");
        await loadTab(currentTab);
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

  await loadTab("all");
});
