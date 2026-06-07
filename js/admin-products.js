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

  let viewMode = "list";
  let listFilter = "all";
  let categoryFilter = "all";
  let editingId = null;
  let editingIsStatic = false;

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
    { id: "ap-title", label: "サービス名", key: "title" },
    { id: "ap-instructor", label: "講師・発信者名", key: "instructor" },
    { id: "ap-category", label: "カテゴリ", key: "category", format: (v) => getCategoryLabel(v) },
    { id: "ap-price", label: "価格", key: "price", format: (v) => `${Number(v).toLocaleString("ja-JP")}円` },
    { id: "ap-platform", label: "販売プラットフォーム", key: "platform" },
    { id: "ap-image", label: "画像URL", key: "imageUrl", optional: true },
    { id: "ap-description", label: "サービス説明", key: "description" },
    { id: "ap-highlight-pro", label: "良い点", key: "highlightPro", optional: true },
    { id: "ap-highlight-con", label: "気になる点", key: "highlightCon", optional: true },
    { id: "ap-support", label: "サポート期間", key: "supportPeriod" },
    { id: "ap-refund", label: "返金ポリシー", key: "refundPolicy" },
    { id: "ap-official", label: "公式URL", key: "officialUrl", optional: true },
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

  function renderExamplesPanel() {
    const rows = FORM_EXAMPLE_ITEMS.map((item) => {
      const raw = FORM_EXAMPLE[item.key];
      if (!raw && item.optional) {
        return `
          <div class="admin-example-item">
            <dt>${App.escapeHtml(item.label)}</dt>
            <dd class="admin-example-value admin-example-value--muted">（空欄でOK・デフォルト画像を使用）</dd>
          </div>`;
      }
      const text = item.format ? item.format(raw) : raw;
      return `
        <div class="admin-example-item">
          <dt>${App.escapeHtml(item.label)}</dt>
          <dd>
            <button type="button" class="admin-example-value" data-example-target="${item.id}" data-example-key="${item.key}" title="クリックで左のフォームに入力">
              ${App.escapeHtml(text)}
            </button>
          </dd>
        </div>`;
    }).join("");

    return `
      <aside class="admin-product-examples" aria-label="入力例">
        <div class="admin-product-examples-head">
          <h3 class="admin-product-examples-title">入力例</h3>
          <p class="admin-product-examples-lead">山本さんの講座を想定した記入サンプルです。</p>
        </div>
        <button type="button" class="btn btn-outline-trust btn-sm admin-product-examples-fill" id="ap-fill-example">
          すべての例をフォームに入れる
        </button>
        <dl class="admin-example-list">${rows}</dl>
        <div class="admin-product-examples-tips">
          <p><strong>ヒント</strong></p>
          <ul>
            <li>各例をクリックすると、左の該当欄にコピーされます。</li>
            <li>口コミ投稿時は<strong>サービス名を同じ表記</strong>にすると自動で紐づきます。</li>
            <li>画像URLは空欄でも公開できます。</li>
          </ul>
        </div>
      </aside>`;
  }

  function renderForm(form = EMPTY_FORM) {
    const isEdit = Boolean(editingId);
    return `
      <section class="admin-product-form-wrap">
        <div class="admin-product-form-head">
          <button type="button" class="btn btn-ghost btn-sm" id="ap-back-to-list">← 一覧に戻る</button>
          <h2 class="admin-section-title">${isEdit ? "サービスを編集" : "新しいサービスを追加"}</h2>
          ${editingIsStatic ? '<p class="admin-product-hint">デモ用の静的データを編集しています。保存するとデータベースに登録されます。</p>' : ""}
        </div>
        <div class="admin-product-form-layout">
        <form id="admin-product-form" class="admin-product-form" novalidate>
          <div class="admin-product-grid">
            <div class="admin-field">
              <label for="ap-title">サービス名 <span class="sr-required">*</span></label>
              <input type="text" id="ap-title" class="form-input" required
                value="${App.escapeHtml(form.title)}"
                placeholder="例: 山本のWebマーケティング講座" />
            </div>
            <div class="admin-field">
              <label for="ap-instructor">講師・発信者名 <span class="sr-required">*</span></label>
              <input type="text" id="ap-instructor" class="form-input" required
                value="${App.escapeHtml(form.instructor)}"
                placeholder="例: 山本" />
            </div>
            <div class="admin-field">
              <label for="ap-category">カテゴリ <span class="sr-required">*</span></label>
              <select id="ap-category" class="form-input">${categoryOptions(form.category)}</select>
            </div>
            <div class="admin-field">
              <label for="ap-price">価格（円） <span class="sr-required">*</span></label>
              <input type="number" id="ap-price" class="form-input" required min="0"
                value="${form.price !== "" ? App.escapeHtml(String(form.price)) : ""}"
                placeholder="49800" />
            </div>
            <div class="admin-field">
              <label for="ap-platform">販売プラットフォーム</label>
              <input type="text" id="ap-platform" class="form-input"
                value="${App.escapeHtml(form.platform)}"
                placeholder="例: YouTube / Instagram / オンライン講座" />
            </div>
            <div class="admin-field admin-field--full">
              <label for="ap-image">画像URL</label>
              <input type="url" id="ap-image" class="form-input"
                value="${App.escapeHtml(form.imageUrl)}"
                placeholder="空欄の場合はデフォルト画像を使用" />
            </div>
            <div class="admin-field admin-field--full">
              <label for="ap-description">サービス説明</label>
              <textarea id="ap-description" class="form-textarea" rows="3"
                placeholder="購入検討者向けの概要">${App.escapeHtml(form.description)}</textarea>
            </div>
            <div class="admin-field">
              <label for="ap-highlight-pro">良い点（一覧用・任意）</label>
              <input type="text" id="ap-highlight-pro" class="form-input"
                value="${App.escapeHtml(form.highlightPro)}" />
            </div>
            <div class="admin-field">
              <label for="ap-highlight-con">気になる点（一覧用・任意）</label>
              <input type="text" id="ap-highlight-con" class="form-input"
                value="${App.escapeHtml(form.highlightCon)}" />
            </div>
            <div class="admin-field">
              <label for="ap-support">サポート期間</label>
              <input type="text" id="ap-support" class="form-input"
                value="${App.escapeHtml(form.supportPeriod)}" />
            </div>
            <div class="admin-field">
              <label for="ap-refund">返金ポリシー</label>
              <input type="text" id="ap-refund" class="form-input"
                value="${App.escapeHtml(form.refundPolicy)}" />
            </div>
            <div class="admin-field admin-field--full">
              <label for="ap-official">公式サイトURL（任意）</label>
              <input type="url" id="ap-official" class="form-input"
                value="${App.escapeHtml(form.officialUrl)}" placeholder="https://" />
            </div>
          </div>
          <label class="admin-checkbox">
            <input type="checkbox" id="ap-published" ${form.isPublished !== false ? "checked" : ""} />
            サイトに公開する
          </label>
          <div class="admin-actions">
            <button type="submit" class="btn btn-trust">${isEdit ? "変更を保存" : "サービスを追加"}</button>
            <button type="button" class="btn btn-outline" id="ap-cancel-edit">キャンセル</button>
          </div>
        </form>
        ${renderExamplesPanel()}
        </div>
      </section>`;
  }

  function isProductPublished(product) {
    if (product.source === "static") return true;
    return product.isPublished !== false;
  }

  function filterProducts(products) {
    let result = products;
    if (listFilter === "published") {
      result = result.filter((p) => isProductPublished(p));
    } else if (listFilter === "hidden") {
      result = result.filter((p) => !isProductPublished(p));
    }
    if (categoryFilter !== "all") {
      result = result.filter((p) => p.category === categoryFilter);
    }
    return result;
  }

  function renderCategoryFilters(products) {
    if (typeof CATEGORIES === "undefined") return "";

    const counts = new Map();
    products.forEach((p) => {
      counts.set(p.category, (counts.get(p.category) || 0) + 1);
    });

    const chips = [
      `<button type="button" class="admin-filter-chip ${categoryFilter === "all" ? "active" : ""}" data-category="all">すべて <span class="admin-filter-count">${products.length}</span></button>`,
    ];

    CATEGORIES.forEach((c) => {
      const count = counts.get(c.value) || 0;
      if (count === 0 && categoryFilter !== c.value) return;
      chips.push(
        `<button type="button" class="admin-filter-chip ${categoryFilter === c.value ? "active" : ""}" data-category="${c.value}">${App.escapeHtml(c.label)} <span class="admin-filter-count">${count}</span></button>`
      );
    });

    return `
      <div class="admin-filter-section">
        <p class="admin-filter-label">カテゴリで絞り込み</p>
        <div class="admin-filter-bar admin-filter-bar--scroll">${chips.join("")}</div>
      </div>`;
  }

  function renderProductList(products) {
    const filtered = filterProducts(products);
    const dbCount = products.filter((p) => p.source === "db").length;
    const staticCount = products.filter((p) => p.source === "static").length;

    const listHtml = filtered.length
      ? filtered
          .map((p) => {
            const published = isProductPublished(p);
            const sourceBadge =
              p.source === "static"
                ? '<span class="admin-product-source admin-product-source--static">デモデータ</span>'
                : '<span class="admin-product-source admin-product-source--db">DB</span>';
            const statusBadge = published
              ? '<span class="admin-status admin-status--approved">公開中</span>'
              : '<span class="admin-status admin-status--rejected">非公開</span>';

            const actions =
              p.source === "db"
                ? `
                <button type="button" class="btn btn-outline btn-sm" data-action="edit-product" data-id="${App.escapeHtml(p.id)}" data-static="0">編集</button>
                <button type="button" class="btn btn-outline btn-sm" data-action="toggle-product" data-id="${App.escapeHtml(p.id)}" data-published="${published}">
                  ${published ? "非公開にする" : "公開する"}
                </button>
                <button type="button" class="btn btn-outline btn-sm" data-action="delete-product" data-id="${App.escapeHtml(p.id)}">削除</button>`
                : `
                <button type="button" class="btn btn-outline btn-sm" data-action="edit-product" data-id="${App.escapeHtml(p.id)}" data-static="1">編集</button>
                <button type="button" class="btn btn-outline btn-sm" data-action="hide-static" data-id="${App.escapeHtml(p.id)}">サイトから非表示</button>`;

            return `
            <article class="admin-product-item ${published ? "" : "admin-product-item--hidden"}" data-product-id="${App.escapeHtml(p.id)}">
              <div class="admin-product-item-thumb">
                <img src="${App.escapeHtml(p.imageUrl || ProductsApi?.DEFAULT_IMAGE || "")}" alt="" loading="lazy" />
              </div>
              <div class="admin-product-item-main">
                <div class="admin-product-item-badges">${sourceBadge}${statusBadge}</div>
                <h3>${App.escapeHtml(p.title)}</h3>
                <p class="admin-card-meta">${App.escapeHtml(p.instructor)} ／ ${App.escapeHtml(getCategoryLabel(p.category))} ／ ${formatPrice(p.price)}</p>
                <p class="admin-card-meta">ID: <code>${App.escapeHtml(p.id)}</code></p>
              </div>
              <div class="admin-product-item-actions">
                <a href="review-detail.html?id=${encodeURIComponent(p.id)}" class="btn btn-outline btn-sm" target="_blank" rel="noopener">プレビュー</a>
                ${actions}
              </div>
            </article>`;
          })
          .join("")
      : `<p class="admin-product-hint">該当するサービスがありません。</p>`;

    return `
      <section class="admin-product-list-wrap">
        <div class="admin-product-list-head">
          <div>
            <h2 class="admin-section-title">サービス一覧（${products.length}件）</h2>
            <p class="admin-product-hint">DB登録 ${dbCount}件 ／ デモデータ ${staticCount}件</p>
          </div>
          <button type="button" class="btn btn-trust" id="ap-show-create-form">＋ 新規サービスを追加</button>
        </div>
        <div class="admin-filter-section">
          <p class="admin-filter-label">公開状態</p>
          <div class="admin-filter-bar" role="tablist">
            <button type="button" class="admin-filter-chip ${listFilter === "all" ? "active" : ""}" data-filter="all">すべて</button>
            <button type="button" class="admin-filter-chip ${listFilter === "published" ? "active" : ""}" data-filter="published">公開中</button>
            <button type="button" class="admin-filter-chip ${listFilter === "hidden" ? "active" : ""}" data-filter="hidden">非公開</button>
          </div>
        </div>
        ${renderCategoryFilters(products)}
        <p class="admin-product-hint" style="margin-bottom:0.75rem">表示中: ${filtered.length}件${filtered.length !== products.length ? `（全${products.length}件中）` : ""}</p>
        <div class="admin-product-list">${listHtml}</div>
      </section>`;
  }

  function fillExampleField(targetId, value) {
    const el = document.getElementById(targetId);
    if (!el) return;
    el.value = value;
    el.focus();
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function fillExampleForm() {
    FORM_EXAMPLE_ITEMS.forEach((item) => {
      const value = FORM_EXAMPLE[item.key];
      if (value === "" && item.optional) return;
      fillExampleField(item.id, value);
    });
    App.showToast("入力例をフォームに反映しました");
  }

  function bindExamplePanel() {
    document.getElementById("ap-fill-example")?.addEventListener("click", fillExampleForm);
    document.querySelectorAll("[data-example-key]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const value = FORM_EXAMPLE[btn.dataset.exampleKey] ?? "";
        fillExampleField(btn.dataset.exampleTarget, value);
        App.showToast("入力しました");
      });
    });
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

  function bindFormEvents(root, products) {
    document.getElementById("admin-product-form")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = collectFormData();
      const err = validateForm(data);
      if (err) {
        App.showToast(err, "error");
        return;
      }

      const submitBtn = e.submitter || e.target.querySelector('[type="submit"]');
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
          App.showToast(editingIsStatic ? "サービスをDBに登録しました" : "サービスを追加しました");
        }
        editingId = null;
        editingIsStatic = false;
        viewMode = "list";
        await render(root);
      } catch (error) {
        App.showToast(error.message, "error");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = editingId ? "変更を保存" : "サービスを追加";
        }
      }
    });

    const backToList = async () => {
      editingId = null;
      editingIsStatic = false;
      viewMode = "list";
      await render(root);
    };

    document.getElementById("ap-cancel-edit")?.addEventListener("click", backToList);
    document.getElementById("ap-back-to-list")?.addEventListener("click", backToList);
    bindExamplePanel();
  }

  function bindListEvents(root, products) {
    document.getElementById("ap-show-create-form")?.addEventListener("click", async () => {
      editingId = null;
      editingIsStatic = false;
      viewMode = "form";
      await render(root);
    });

    root.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        listFilter = btn.dataset.filter || "all";
        await render(root);
      });
    });

    root.querySelectorAll("[data-category]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        categoryFilter = btn.dataset.category || "all";
        await render(root);
      });
    });

    root.querySelectorAll("[data-action='edit-product']").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const isStatic = btn.dataset.static === "1";
        const product = products.find((p) => p.id === id);
        if (!product) return;
        editingId = id;
        editingIsStatic = isStatic;
        viewMode = "form";
        await render(root, product);
      });
    });

    root.querySelectorAll("[data-action='toggle-product']").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const publish = btn.dataset.published !== "true";
        btn.disabled = true;
        try {
          await (await ensureProductsApi()).setProductPublished(id, publish);
          App.showToast(publish ? "サービスを公開しました" : "サービスを非公開にしました");
          await render(root);
        } catch (error) {
          App.showToast(error.message, "error");
          btn.disabled = false;
        }
      });
    });

    root.querySelectorAll("[data-action='delete-product']").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        if (
          !window.confirm(
            "このサービスを完全に削除しますか？口コミの紐づけは残りますが、詳細ページは表示されなくなります。"
          )
        ) {
          return;
        }
        btn.disabled = true;
        try {
          await (await ensureProductsApi()).deleteProduct(id);
          if (editingId === id) {
            editingId = null;
            editingIsStatic = false;
            viewMode = "list";
          }
          App.showToast("サービスを削除しました");
          await render(root);
        } catch (error) {
          App.showToast(error.message, "error");
          btn.disabled = false;
        }
      });
    });

    root.querySelectorAll("[data-action='hide-static']").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const product = products.find((p) => p.id === id);
        if (!product || product.source !== "static") return;
        if (
          !window.confirm(
            "このデモサービスをサイトから非表示にしますか？（data.js のデータは残り、DBに非公開レコードが作成されます）"
          )
        ) {
          return;
        }
        btn.disabled = true;
        try {
          await (await ensureProductsApi()).createProduct(
            staticProductToInput(product, { isPublished: false })
          );
          App.showToast("サービスを非公開にしました");
          await render(root);
        } catch (error) {
          App.showToast(error.message, "error");
          btn.disabled = false;
        }
      });
    });
  }

  async function ensureProductsApi() {
    await App.whenReady();
    if (window.ProductsApi) return window.ProductsApi;
    throw new Error("サービス管理の読み込みに失敗しました。ページを再読み込みしてください。");
  }

  async function fetchAdminProducts() {
    const api = await ensureProductsApi();
    let dbError = null;

    try {
      await api.loadAllProductsAdmin();
    } catch (err) {
      dbError = err;
      if (typeof setDbProducts === "function") setDbProducts([]);
    }

    try {
      await api.loadPublishedProducts();
    } catch (_) {
      /* 公開一覧の同期失敗は一覧表示を妨げない */
    }

    const all =
      typeof getAllProducts === "function"
        ? getAllProducts()
        : typeof PRODUCTS !== "undefined"
          ? PRODUCTS
          : [];

    const products = all.map((p) => ({
      ...p,
      source: p.isDbProduct ? "db" : "static",
    }));

    return { products, dbError };
  }

  async function render(root, editProduct = null) {
    root.innerHTML = `<p class="admin-empty">読み込み中...</p>`;
    try {
      const { products, dbError } = await fetchAdminProducts();

      if (viewMode === "form") {
        const formData = editProduct ? productToForm(editProduct) : EMPTY_FORM;
        root.innerHTML = `
          <p class="admin-product-intro">サービスの追加・編集を行います。保存すると「サービスを探す」一覧と詳細ページに反映されます。</p>
          ${renderForm(formData)}`;
        bindFormEvents(root, products);
        return;
      }

      let dbWarning = "";
      if (dbError) {
        const isMissingTable =
          dbError.message?.includes("products") || dbError.message?.includes("relation");
        dbWarning = isMissingTable
          ? `<div class="admin-product-db-warning">DBのサービステーブルが未設定です。追加・編集・削除には <code>supabase/schema-products.sql</code> の実行が必要です。いまはデモデータの一覧のみ表示しています。</div>`
          : `<div class="admin-product-db-warning">${App.escapeHtml(dbError.message)}</div>`;
      }

      root.innerHTML = `
        <p class="admin-product-intro">登録済みのサービスを一覧で確認し、編集・公開設定・削除ができます。デモ用データ（data.js）も表示されます。</p>
        ${dbWarning}
        ${renderProductList(products)}`;

      bindListEvents(root, products);
    } catch (err) {
      root.innerHTML = `<div class="admin-empty">${App.escapeHtml(err.message)}</div>`;
    }
  }

  window.AdminProducts = { render };
})();
