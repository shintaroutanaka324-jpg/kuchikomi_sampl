(function () {
  const EMPTY_FORM = {
    title: "",
    instructor: "",
    category: "other",
    price: "",
    platform: "",
    imageUrl: "",
    description: "",
    highlightPro: "",
    highlightCon: "",
    officialUrl: "",
    supportPeriod: "3〜6ヶ月",
    refundPolicy: "なし",
    isPublished: true,
  };

  let listFilter = "all";
  let categoryFilter = "all";
  let searchQuery = "";
  let editingId = null;
  let editingIsStatic = false;
  let contentRoot = null;
  let cachedProducts = [];

  const FORM_EXAMPLE = {
    title: "山本のWebマーケティング実践講座",
    instructor: "山本",
    category: "web-marketing",
    price: "49800",
    platform: "オンライン講座",
    imageUrl: "",
    description:
      "SNSやLPの基礎から集客の流れまで学べる、実践型のマーケティング講座です。購入前に口コミで雰囲気を確認できます。",
    highlightPro: "初学者でも始めやすいカリキュラム",
    highlightCon: "成果には継続的な実践が必要",
    supportPeriod: "3〜6ヶ月",
    refundPolicy: "なし",
    officialUrl: "https://example.com/yamamoto-course",
  };

  const FORM_EXAMPLE_ITEMS = [
    { id: "ap-title", key: "title" },
    { id: "ap-instructor", key: "instructor" },
    { id: "ap-category", key: "category" },
    { id: "ap-price", key: "price" },
    { id: "ap-platform", key: "platform" },
    { id: "ap-image", key: "imageUrl", optional: true },
    { id: "ap-description", key: "description" },
    { id: "ap-highlight-pro", key: "highlightPro", optional: true },
    { id: "ap-highlight-con", key: "highlightCon", optional: true },
    { id: "ap-support", key: "supportPeriod" },
    { id: "ap-refund", key: "refundPolicy" },
    { id: "ap-official", key: "officialUrl", optional: true },
  ];

  function categoryOptions(selected) {
    if (typeof CATEGORIES === "undefined") return "";
    return CATEGORIES.map(
      (c) =>
        `<option value="${c.value}" ${c.value === selected ? "selected" : ""}>${App.escapeHtml(c.label)}</option>`
    ).join("");
  }

  function productToForm(product) {
    return {
      title: product.title || "",
      instructor: product.instructor || "",
      category: product.category || "other",
      price: product.price ?? "",
      platform: product.platform || "",
      imageUrl: product.imageUrl || "",
      description: product.description || "",
      highlightPro: product.highlightPro || "",
      highlightCon: product.highlightCon || "",
      officialUrl: product.officialUrl || "",
      supportPeriod: product.supportPeriod || "3〜6ヶ月",
      refundPolicy: product.refundPolicy || "なし",
      isPublished: product.isPublished !== false,
    };
  }

  function staticProductToInput(product, overrides = {}) {
    return {
      id: product.id,
      title: product.title,
      instructor: product.instructor,
      category: product.category,
      price: product.price,
      platform: product.platform,
      imageUrl: product.imageUrl,
      description: product.description,
      highlightPro: product.highlightPro,
      highlightCon: product.highlightCon,
      officialUrl: product.officialUrl,
      supportPeriod: product.supportPeriod,
      refundPolicy: product.refundPolicy,
      companyName: product.companyName,
      location: product.location,
      averageRating: product.averageRating,
      reviewCount: product.reviewCount,
      proofRate: product.proofRate,
      isPublished: product.isPublished !== false,
      ...overrides,
    };
  }

  function isProductPublished(product) {
    if (product.source === "static") return true;
    return product.isPublished !== false;
  }

  function filterProducts(products) {
    let result = products;
    if (listFilter === "published") result = result.filter((p) => isProductPublished(p));
    else if (listFilter === "hidden") result = result.filter((p) => !isProductPublished(p));
    if (categoryFilter !== "all") result = result.filter((p) => p.category === categoryFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => {
        const cat = typeof getCategoryLabel === "function" ? getCategoryLabel(p.category) : p.category;
        return (
          p.title.toLowerCase().includes(q) ||
          p.instructor.toLowerCase().includes(q) ||
          cat.toLowerCase().includes(q) ||
          String(p.id).toLowerCase().includes(q)
        );
      });
    }
    return result;
  }

  function renderKpiRow(kpis) {
    const cards = [
      { key: "services", label: "登録サービス数" },
      { key: "reviews", label: "口コミ数" },
      { key: "users", label: "ユーザー数" },
      { key: "monthlyPv", label: "月間PV" },
      { key: "avgRating", label: "平均評価" },
    ];
    return `<div class="adm-kpi-row">${cards
      .map((c) => {
        const k = kpis[c.key];
        return `<div class="adm-kpi-card">
          <div class="adm-kpi-label">${c.label}</div>
          <div class="adm-kpi-value">${App.escapeHtml(String(k.value))}</div>
          <div class="adm-kpi-delta ${k.delta.cls}">${App.escapeHtml(k.delta.text)}</div>
        </div>`;
      })
      .join("")}</div>`;
  }

  function renderServiceTable(products) {
    const filtered = filterProducts(products);
    const S = window.AdminDashboardStats;

    const rows = filtered.length
      ? filtered
          .map((p) => {
            const published = isProductPublished(p);
            const pv = S.estimatePv(p);
            const rating = p.averageRating || 0;
            const reviews = p.reviewCount || 0;
            const regDate = p.created_at
              ? new Date(p.created_at).toLocaleDateString("ja-JP")
              : p.source === "static"
                ? "—"
                : "—";
            const canToggle = p.source === "db";

            return `<tr data-product-id="${App.escapeHtml(p.id)}">
              <td>
                <div class="adm-table-service">
                  <img class="adm-table-thumb" src="${App.escapeHtml(p.imageUrl || ProductsApi?.DEFAULT_IMAGE || "")}" alt="" loading="lazy" />
                  <div>
                    <div class="adm-table-name">${App.escapeHtml(p.title)}</div>
                    <div class="adm-table-sub">${App.escapeHtml(p.instructor)}${p.source === "static" ? " · デモ" : ""}</div>
                  </div>
                </div>
              </td>
              <td><span class="adm-cat-pill">${App.escapeHtml(getCategoryLabel(p.category))}</span></td>
              <td>${reviews}</td>
              <td>${S.renderStars(rating)} <span style="color:#6b7280;font-size:0.75rem">${rating ? rating.toFixed(1) : "—"}</span></td>
              <td><div class="adm-pv-cell">${pv.toLocaleString("ja-JP")}${S.sparklineSvg(p.id)}</div></td>
              <td>
                ${
                  canToggle
                    ? `<button type="button" class="adm-toggle ${published ? "is-on" : ""}" data-action="toggle-product" data-id="${App.escapeHtml(p.id)}" data-published="${published}" aria-label="公開切替"></button>`
                    : `<span class="adm-cat-pill">公開</span>`
                }
              </td>
              <td style="white-space:nowrap;color:#9ca3af;font-size:0.75rem">${regDate}</td>
              <td>
                <div class="adm-row-actions">
                  <a href="review-detail.html?id=${encodeURIComponent(p.id)}" class="adm-action-btn" target="_blank" rel="noopener" title="プレビュー">👁</a>
                  <button type="button" class="adm-action-btn" data-action="edit-product" data-id="${App.escapeHtml(p.id)}" data-static="${p.source === "static" ? "1" : "0"}" title="編集">✎</button>
                  ${
                    canToggle
                      ? `<button type="button" class="adm-action-btn" data-action="toggle-product" data-id="${App.escapeHtml(p.id)}" data-published="${published}" title="公開切替">◐</button>
                         <button type="button" class="adm-action-btn is-danger" data-action="delete-product" data-id="${App.escapeHtml(p.id)}" title="削除">✕</button>`
                      : `<button type="button" class="adm-action-btn" data-action="hide-static" data-id="${App.escapeHtml(p.id)}" title="非表示">◐</button>`
                  }
                </div>
              </td>
            </tr>`;
          })
          .join("")
      : `<tr><td colspan="8" class="adm-empty-state">該当するサービスがありません</td></tr>`;

    const catChips =
      typeof CATEGORIES !== "undefined"
        ? CATEGORIES.map((c) => {
            const count = products.filter((p) => p.category === c.value).length;
            if (!count && categoryFilter !== c.value) return "";
            return `<button type="button" class="adm-chip ${categoryFilter === c.value ? "active" : ""}" data-category="${c.value}">${App.escapeHtml(c.label)} (${count})</button>`;
          }).join("")
        : "";

    return `
      <div class="adm-panel">
        <div class="adm-toolbar">
          <button type="button" class="adm-chip ${listFilter === "all" ? "active" : ""}" data-filter="all">すべて</button>
          <button type="button" class="adm-chip ${listFilter === "published" ? "active" : ""}" data-filter="published">公開中</button>
          <button type="button" class="adm-chip ${listFilter === "hidden" ? "active" : ""}" data-filter="hidden">非公開</button>
          <span style="width:1px;height:1.25rem;background:#e5e7eb;margin:0 0.25rem"></span>
          <button type="button" class="adm-chip ${categoryFilter === "all" ? "active" : ""}" data-category="all">全カテゴリ</button>
          ${catChips}
        </div>
        <div class="adm-table-wrap">
          <table class="adm-table">
            <thead>
              <tr>
                <th>サービス</th>
                <th>カテゴリ</th>
                <th>口コミ</th>
                <th>評価</th>
                <th>PV</th>
                <th>公開</th>
                <th>登録日</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <div style="padding:0.65rem 1rem;font-size:0.75rem;color:#9ca3af;border-top:1px solid #f3f4f6">
          表示 ${filtered.length}件 / 全 ${products.length}件
        </div>
      </div>`;
  }

  function renderFormFields(form) {
    return `
      <div class="admin-product-grid">
        <div class="admin-field">
          <label for="ap-title">サービス名 *</label>
          <input type="text" id="ap-title" class="form-input" required value="${App.escapeHtml(form.title)}" />
        </div>
        <div class="admin-field">
          <label for="ap-instructor">講師・発信者名 *</label>
          <input type="text" id="ap-instructor" class="form-input" required value="${App.escapeHtml(form.instructor)}" />
        </div>
        <div class="admin-field">
          <label for="ap-category">カテゴリ *</label>
          <select id="ap-category" class="form-input">${categoryOptions(form.category)}</select>
        </div>
        <div class="admin-field">
          <label for="ap-price">価格（円） *</label>
          <input type="number" id="ap-price" class="form-input" required min="0" value="${form.price !== "" ? App.escapeHtml(String(form.price)) : ""}" />
        </div>
        <div class="admin-field">
          <label for="ap-platform">販売プラットフォーム</label>
          <input type="text" id="ap-platform" class="form-input" value="${App.escapeHtml(form.platform)}" />
        </div>
        <div class="admin-field admin-field--full">
          <label for="ap-image">画像URL</label>
          <input type="url" id="ap-image" class="form-input" value="${App.escapeHtml(form.imageUrl)}" />
        </div>
        <div class="admin-field admin-field--full">
          <label for="ap-description">サービス説明</label>
          <textarea id="ap-description" class="form-textarea" rows="3">${App.escapeHtml(form.description)}</textarea>
        </div>
        <div class="admin-field">
          <label for="ap-highlight-pro">良い点</label>
          <input type="text" id="ap-highlight-pro" class="form-input" value="${App.escapeHtml(form.highlightPro)}" />
        </div>
        <div class="admin-field">
          <label for="ap-highlight-con">気になる点</label>
          <input type="text" id="ap-highlight-con" class="form-input" value="${App.escapeHtml(form.highlightCon)}" />
        </div>
        <div class="admin-field">
          <label for="ap-support">サポート期間</label>
          <input type="text" id="ap-support" class="form-input" value="${App.escapeHtml(form.supportPeriod)}" />
        </div>
        <div class="admin-field">
          <label for="ap-refund">返金ポリシー</label>
          <input type="text" id="ap-refund" class="form-input" value="${App.escapeHtml(form.refundPolicy)}" />
        </div>
        <div class="admin-field admin-field--full">
          <label for="ap-official">公式URL</label>
          <input type="url" id="ap-official" class="form-input" value="${App.escapeHtml(form.officialUrl)}" />
        </div>
      </div>
      <label class="admin-checkbox">
        <input type="checkbox" id="ap-published" ${form.isPublished !== false ? "checked" : ""} />
        サイトに公開する
      </label>`;
  }

  function openFormModal(form = EMPTY_FORM, product = null) {
    const isEdit = Boolean(editingId);
    const modalRoot = document.getElementById("admin-modal-root");
    if (!modalRoot) return;

    modalRoot.innerHTML = `
      <div class="adm-modal-backdrop" id="adm-modal-backdrop">
        <div class="adm-modal" role="dialog" aria-modal="true">
          <div class="adm-modal-head">
            <h2 class="adm-modal-title">${isEdit ? "サービスを編集" : "新規サービス登録"}</h2>
            <button type="button" class="adm-modal-close" id="ap-modal-close" aria-label="閉じる">×</button>
          </div>
          <div class="adm-modal-body">
            ${editingIsStatic ? '<p class="adm-warning-banner">デモデータを編集しています。保存するとDBに登録されます。</p>' : ""}
            <form id="admin-product-form" novalidate>
              ${renderFormFields(form)}
              <div class="admin-actions" style="margin-top:1rem">
                <button type="submit" class="adm-btn-primary">${isEdit ? "変更を保存" : "サービスを追加"}</button>
                <button type="button" class="adm-btn-ghost" id="ap-cancel-edit">キャンセル</button>
              </div>
            </form>
          </div>
        </div>
      </div>`;

    const close = () => {
      editingId = null;
      editingIsStatic = false;
      modalRoot.innerHTML = "";
    };

    document.getElementById("ap-modal-close")?.addEventListener("click", close);
    document.getElementById("ap-cancel-edit")?.addEventListener("click", close);
    document.getElementById("adm-modal-backdrop")?.addEventListener("click", (e) => {
      if (e.target.id === "adm-modal-backdrop") close();
    });

    bindFormEvents(modalRoot, cachedProducts, close);
  }

  function collectFormData() {
    return {
      title: document.getElementById("ap-title")?.value.trim() || "",
      instructor: document.getElementById("ap-instructor")?.value.trim() || "",
      category: document.getElementById("ap-category")?.value || "other",
      price: document.getElementById("ap-price")?.value,
      platform: document.getElementById("ap-platform")?.value.trim() || "",
      imageUrl: document.getElementById("ap-image")?.value.trim() || "",
      description: document.getElementById("ap-description")?.value.trim() || "",
      highlightPro: document.getElementById("ap-highlight-pro")?.value.trim() || "",
      highlightCon: document.getElementById("ap-highlight-con")?.value.trim() || "",
      officialUrl: document.getElementById("ap-official")?.value.trim() || "",
      supportPeriod: document.getElementById("ap-support")?.value.trim() || "3〜6ヶ月",
      refundPolicy: document.getElementById("ap-refund")?.value.trim() || "なし",
      isPublished: document.getElementById("ap-published")?.checked !== false,
    };
  }

  function validateForm(data) {
    if (!data.title) return "サービス名を入力してください";
    if (!data.instructor) return "講師・発信者名を入力してください";
    if (data.price === "" || Number(data.price) < 0) return "価格を入力してください";
    return null;
  }

  function bindFormEvents(root, products, onClose) {
    document.getElementById("admin-product-form")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = collectFormData();
      const err = validateForm(data);
      if (err) {
        App.showToast(err, "error");
        return;
      }
      const submitBtn = e.target.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "保存中...";
      }
      try {
        const api = await ensureProductsApi();
        if (editingId && !editingIsStatic) {
          await api.updateProduct(editingId, data);
          App.showToast("サービスを更新しました");
        } else {
          const payload = editingId && editingIsStatic ? { ...data, id: editingId } : data;
          if (editingIsStatic) {
            const original = products.find((p) => p.id === editingId);
            if (original) {
              Object.assign(payload, {
                companyName: original.companyName,
                location: original.location,
                averageRating: original.averageRating,
                reviewCount: original.reviewCount,
                proofRate: original.proofRate,
              });
            }
          }
          await api.createProduct(payload);
          App.showToast(editingIsStatic ? "DBに登録しました" : "サービスを追加しました");
        }
        editingId = null;
        editingIsStatic = false;
        onClose?.();
        await render(contentRoot);
      } catch (error) {
        App.showToast(error.message, "error");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = editingId ? "変更を保存" : "サービスを追加";
        }
      }
    });
  }

  function bindListEvents(root, products) {
    const openCreate = () => {
      editingId = null;
      editingIsStatic = false;
      openFormModal(EMPTY_FORM);
    };

    root.querySelectorAll("#ap-show-create-form, [id=ap-show-create-form]").forEach((btn) => {
      btn.addEventListener("click", openCreate);
    });
    document.getElementById("ap-show-create-form")?.addEventListener("click", openCreate);

    root.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        listFilter = btn.dataset.filter || "all";
        await render(contentRoot);
      });
    });

    root.querySelectorAll("[data-category]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        categoryFilter = btn.dataset.category || "all";
        await render(contentRoot);
      });
    });

    root.querySelectorAll("[data-action='edit-product']").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const product = products.find((p) => p.id === id);
        if (!product) return;
        editingId = id;
        editingIsStatic = btn.dataset.static === "1";
        openFormModal(productToForm(product), product);
      });
    });

    root.querySelectorAll("[data-action='toggle-product']").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const publish = btn.dataset.published !== "true";
        btn.disabled = true;
        try {
          await (await ensureProductsApi()).setProductPublished(id, publish);
          App.showToast(publish ? "公開しました" : "非公開にしました");
          await render(contentRoot);
        } catch (error) {
          App.showToast(error.message, "error");
        }
      });
    });

    root.querySelectorAll("[data-action='delete-product']").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!window.confirm("このサービスを削除しますか？")) return;
        btn.disabled = true;
        try {
          await (await ensureProductsApi()).deleteProduct(btn.dataset.id);
          App.showToast("削除しました");
          await render(contentRoot);
        } catch (error) {
          App.showToast(error.message, "error");
        }
      });
    });

    root.querySelectorAll("[data-action='hide-static']").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const product = products.find((p) => p.id === btn.dataset.id);
        if (!product || !window.confirm("デモサービスをサイトから非表示にしますか？")) return;
        try {
          await (await ensureProductsApi()).createProduct(
            staticProductToInput(product, { isPublished: false })
          );
          App.showToast("非公開にしました");
          await render(contentRoot);
        } catch (error) {
          App.showToast(error.message, "error");
        }
      });
    });
  }

  async function ensureProductsApi() {
    await App.whenReady();
    if (window.ProductsApi) return window.ProductsApi;
    throw new Error("サービス管理の読み込みに失敗しました。");
  }

  async function fetchAdminProducts() {
    const api = await ensureProductsApi();
    let dbError = null;
    try {
      await api.loadAllProductsAdmin();
    } catch (err) {
      dbError = err;
      if (typeof setDbProductsAdmin === "function") setDbProductsAdmin([]);
    }
    const all =
      typeof getAllProductsAdmin === "function"
        ? getAllProductsAdmin()
        : typeof getAllProducts === "function"
          ? getAllProducts()
          : typeof PRODUCTS !== "undefined"
            ? PRODUCTS
            : [];
    return {
      products: all.map((p) => ({ ...p, source: p.isDbProduct ? "db" : "static" })),
      dbError,
    };
  }

  async function render(root) {
    contentRoot = root;
    root.innerHTML = `<div class="adm-empty-state">読み込み中...</div>`;
    try {
      const { products, dbError } = await fetchAdminProducts();
      cachedProducts = products;
      const kpis = await window.AdminDashboardStats.computeKpis(products);

      let warning = "";
      if (dbError?.message?.includes("products") || dbError?.message?.includes("relation")) {
        warning = `<div class="adm-warning-banner">DB未設定: <code>schema-products.sql</code> を実行してください。デモデータのみ表示中。</div>`;
      }

      const actionsEl = document.getElementById("adm-page-actions");
      if (actionsEl) {
        actionsEl.innerHTML = `<button type="button" class="adm-btn-primary" id="ap-show-create-form">＋ 新規サービス</button>`;
      }

      root.innerHTML = `
        ${warning}
        ${renderKpiRow(kpis)}
        <div class="adm-services-main">${renderServiceTable(products)}</div>`;

      bindListEvents(root, products);
      document.getElementById("ap-show-create-form")?.addEventListener("click", () => {
        editingId = null;
        editingIsStatic = false;
        openFormModal(EMPTY_FORM);
      });
    } catch (err) {
      root.innerHTML = `<div class="adm-empty-state">${App.escapeHtml(err.message)}</div>`;
    }
  }

  function setSearchQuery(q) {
    searchQuery = q;
    if (contentRoot) render(contentRoot);
  }

  window.AdminProducts = { render, setSearchQuery };
})();
