(function () {
  const EMPTY_FORM = {
    id: "",
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

  let editingId = null;

  function categoryOptions(selected) {
    if (typeof CATEGORIES === "undefined") return "";
    return CATEGORIES.map(
      (c) =>
        `<option value="${c.value}" ${c.value === selected ? "selected" : ""}>${App.escapeHtml(c.label)}</option>`
    ).join("");
  }

  function renderForm(form = EMPTY_FORM) {
    const isEdit = Boolean(editingId);
    return `
      <section class="admin-product-form-wrap">
        <h2 class="admin-section-title">${isEdit ? "サービスを編集" : "新しいサービスを追加"}</h2>
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
            ${isEdit ? '<button type="button" class="btn btn-outline" id="ap-cancel-edit">編集をやめる</button>' : ""}
          </div>
        </form>
      </section>`;
  }

  function renderProductList(products) {
    const dbProducts = products.filter((p) => p.isDbProduct);
    const staticCount = getAllProducts().filter((p) => !p.isDbProduct).length;

    if (!dbProducts.length) {
      return `
        <section class="admin-product-list-wrap">
          <h2 class="admin-section-title">登録済みサービス（DB）</h2>
          <p class="admin-product-hint">まだ管理者画面から追加したサービスはありません。上のフォームから追加できます。</p>
          <p class="admin-product-hint">※ デモ用の静的サービスが ${staticCount} 件あります（data.js）。</p>
        </section>`;
    }

    return `
      <section class="admin-product-list-wrap">
        <h2 class="admin-section-title">登録済みサービス（${dbProducts.length}件）</h2>
        <div class="admin-product-list">
          ${dbProducts
            .map(
              (p) => `
            <article class="admin-product-item ${p.isPublished === false ? "admin-product-item--hidden" : ""}" data-product-id="${App.escapeHtml(p.id)}">
              <div class="admin-product-item-main">
                <h3>${App.escapeHtml(p.title)}</h3>
                <p class="admin-card-meta">${App.escapeHtml(p.instructor)} ／ ${App.escapeHtml(getCategoryLabel(p.category))} ／ ${formatPrice(p.price)}</p>
                <p class="admin-card-meta">ID: <code>${App.escapeHtml(p.id)}</code>
                  ${p.isPublished === false ? '<span class="admin-status admin-status--rejected">非公開</span>' : ""}
                </p>
              </div>
              <div class="admin-product-item-actions">
                <a href="review-detail.html?id=${encodeURIComponent(p.id)}" class="btn btn-outline btn-sm" target="_blank" rel="noopener">ページを見る</a>
                <button type="button" class="btn btn-outline btn-sm" data-action="edit-product" data-id="${App.escapeHtml(p.id)}">編集</button>
                <button type="button" class="btn btn-outline btn-sm" data-action="toggle-product" data-id="${App.escapeHtml(p.id)}" data-published="${p.isPublished !== false}">
                  ${p.isPublished !== false ? "非公開にする" : "公開する"}
                </button>
                <button type="button" class="btn btn-outline btn-sm" data-action="delete-product" data-id="${App.escapeHtml(p.id)}">削除</button>
              </div>
            </article>`
            )
            .join("")}
        </div>
      </section>`;
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
        if (editingId) {
          await ProductsApi.updateProduct(editingId, data);
          App.showToast("サービスを更新しました");
          editingId = null;
        } else {
          await ProductsApi.createProduct(data);
          App.showToast("サービスを追加しました");
        }
        await render(root);
      } catch (error) {
        App.showToast(error.message, "error");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = editingId ? "変更を保存" : "サービスを追加";
        }
      }
    });

    document.getElementById("ap-cancel-edit")?.addEventListener("click", async () => {
      editingId = null;
      await render(root);
    });

    root.querySelectorAll("[data-action='edit-product']").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const product = products.find((p) => p.id === id);
        if (!product) return;
        editingId = id;
        await render(root, product);
        document.querySelector(".admin-product-form-wrap")?.scrollIntoView({ behavior: "smooth" });
      });
    });

    root.querySelectorAll("[data-action='toggle-product']").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const publish = btn.dataset.published !== "true";
        btn.disabled = true;
        try {
          await ProductsApi.setProductPublished(id, publish);
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
        if (!window.confirm("このサービスを完全に削除しますか？口コミの紐づけは残りますが、詳細ページは表示されなくなります。")) {
          return;
        }
        btn.disabled = true;
        try {
          await ProductsApi.deleteProduct(id);
          if (editingId === id) editingId = null;
          App.showToast("サービスを削除しました");
          await render(root);
        } catch (error) {
          App.showToast(error.message, "error");
          btn.disabled = false;
        }
      });
    });
  }

  async function render(root, editForm = null) {
    root.innerHTML = `<p class="admin-empty">読み込み中...</p>`;
    try {
      const products = await ProductsApi.loadAllProductsAdmin();
      const formData = editForm
        ? {
            title: editForm.title,
            instructor: editForm.instructor,
            category: editForm.category,
            price: editForm.price,
            platform: editForm.platform || "",
            imageUrl: editForm.imageUrl || "",
            description: editForm.description || "",
            highlightPro: editForm.highlightPro || "",
            highlightCon: editForm.highlightCon || "",
            officialUrl: editForm.officialUrl || "",
            supportPeriod: editForm.supportPeriod || "3〜6ヶ月",
            refundPolicy: editForm.refundPolicy || "なし",
            isPublished: editForm.isPublished !== false,
          }
        : EMPTY_FORM;

      root.innerHTML = `
        <p class="admin-product-intro">コードを編集せず、ここから新しいサービスの枠を追加できます。追加後は「サービスを探す」一覧と詳細ページに表示されます。</p>
        ${renderForm(formData)}
        ${renderProductList(products)}`;

      bindFormEvents(root, products);
    } catch (err) {
      if (err.message?.includes("products") || err.message?.includes("relation")) {
        root.innerHTML = `
          <div class="admin-denied">
            <h1>データベースの準備が必要です</h1>
            <p>Supabase SQL Editor で <code>supabase/schema-products.sql</code> を実行してください。</p>
            <p class="admin-card-meta">${App.escapeHtml(err.message)}</p>
          </div>`;
        return;
      }
      root.innerHTML = `<div class="admin-empty">${App.escapeHtml(err.message)}</div>`;
    }
  }

  window.AdminProducts = { render };
})();
