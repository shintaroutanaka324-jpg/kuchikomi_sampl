const RATING_SCALE = [
  { stars: 5, label: "とても良い" },
  { stars: 4, label: "良い" },
  { stars: 3, label: "普通" },
  { stars: 2, label: "やや不満" },
  { stars: 1, label: "不満" },
];

const RATING_ITEMS = [
  { key: "costPerformance", label: "コスパ", desc: "価格に見合った内容か", icon: "coin" },
  { key: "recommendation", label: "難易度・継続", desc: "続けやすさ・学びやすさ", icon: "repeat" },
  { key: "supportQuality", label: "サポート体制", desc: "質問対応・フォローの充実度", icon: "support" },
  { key: "contentSatisfaction", label: "満足度", desc: "内容への満足の度合い", icon: "heart" },
  { key: "resultRealization", label: "実現性・成果", desc: "成果や変化の実感", icon: "target" },
];

const BODY_ITEMS = [
  {
    id: "bodyPros",
    label: "良かった点・満足した点",
    minChars: 100,
    required: true,
    placeholder: "サービスで良かった点や満足した点を、具体的なエピソードを交えて書いてください",
    hint: "最低100文字以上で具体的に書いてください",
    icon: "smile",
  },
  {
    id: "bodyConcerns",
    label: "気になった点",
    minChars: 50,
    required: true,
    placeholder: "気になった点や改善してほしい点を、具体的に書いてください",
    hint: "最低50文字以上で具体的に書いてください",
    icon: "alert",
  },
  {
    id: "bodySituation",
    label: "購入前の状況・悩み",
    minChars: 50,
    required: true,
    placeholder: "購入前に抱えていた悩みや課題、期待していたことを書いてください",
    hint: "最低50文字以上で具体的に書いてください",
    icon: "situation",
  },
  {
    id: "bodyResults",
    label: "得られた成果・変化",
    minChars: 100,
    required: true,
    placeholder: "利用後に得られた成果や変化を、できるだけ具体的に書いてください",
    hint: "最低100文字以上で具体的に書いてください",
    icon: "results",
  },
  {
    id: "bodyRecommend",
    label: "どんな人におすすめしたいか",
    minChars: 50,
    required: true,
    placeholder: "どんな方におすすめできるか、理由と合わせて具体的に書いてください",
    hint: "最低50文字以上で具体的に書いてください",
    icon: "users",
  },
  {
    id: "bodyNumeric",
    label: "数値で表せる成果",
    minChars: 0,
    required: false,
    placeholder: "例：作業時間が月15時間から3時間に減った、年収が400万円から500万円になった、など",
    hint: "売上、年収、学習時間、作業時間、成約数など、数値で表せる成果があれば入力してください（任意）",
    icon: "numeric",
    rows: 3,
  },
  {
    id: "bodyOther",
    label: "その他",
    minChars: 0,
    required: false,
    placeholder: "上記以外で伝えたいことがあれば書いてください",
    hint: "任意項目です",
    icon: "note",
    rows: 4,
  },
];

const REQUIRED_BODY_ITEMS = BODY_ITEMS.filter((item) => item.required);

const ITEM_ICONS = {
  coin: '<path d="M12 4v16M8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0z"/>',
  repeat:
    '<path d="M17 2l3 3-3 3"/><path d="M20 5H10a5 5 0 0 0-5 5v1"/><path d="M7 22l-3-3 3-3"/><path d="M4 19h10a5 5 0 0 0 5-5v-1"/>',
  support:
    '<path d="M12 3a6 6 0 0 0-6 6v4l-2 2h16l-2-2V9a6 6 0 0 0-6-6z"/><path d="M10 21h4"/>',
  heart:
    '<path d="M12 20.5s-7-4.6-7-9.4C5 7.6 7.8 5 11 5c1.8 0 3.2.8 4 2.1C15.8 5.8 17.2 5 19 5c3.2 0 6 2.6 6 6.1 0 4.8-7 9.4-7 9.4z"/>',
  target:
    '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
  smile:
    '<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01M15 9h.01"/>',
  alert:
    '<circle cx="12" cy="12" r="9"/><path d="M12 8v4"/><circle cx="12" cy="16" r=".5" fill="currentColor"/>',
  learn:
    '<path d="M12 3 3 7.5 12 12l9-4.5L12 3z"/><path d="M6 10v5c0 2 2.5 4 6 4s6-2 6-4v-5"/>',
  users:
    '<path d="M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1"/><circle cx="9" cy="7" r="3"/><path d="M22 19v-1a4 4 0 0 0-3-3.87"/><path d="M16 3.13a3 3 0 0 1 0 5.74"/>',
  note:
    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M10 13h4M10 17h4"/>',
  situation:
    '<circle cx="12" cy="12" r="9"/><path d="M12 7v5"/><circle cx="12" cy="16.5" r=".5" fill="currentColor"/>',
  results:
    '<path d="M4 19h16"/><path d="M6 17l4-8 3 5 5-9 4 6"/>',
  numeric:
    '<path d="M4 19h16"/><path d="M7 15l3-6 2 4 3-5 3 7"/>',
};

function getBodyItem(id) {
  return BODY_ITEMS.find((item) => item.id === id);
}

function getMinCharsForItem(item) {
  return item?.minChars ?? 0;
}

const MONTH_OPTIONS = [
  { value: "1", label: "1月" },
  { value: "2", label: "2月" },
  { value: "3", label: "3月" },
  { value: "4", label: "4月" },
  { value: "5", label: "5月" },
  { value: "6", label: "6月" },
  { value: "7", label: "7月" },
  { value: "8", label: "8月" },
  { value: "9", label: "9月" },
  { value: "10", label: "10月" },
  { value: "11", label: "11月" },
  { value: "12", label: "12月" },
];

function countChars(value) {
  return [...String(value || "")].length;
}

function isLowQualityText(text, minChars = 50) {
  const trimmed = String(text || "").trim();
  if (trimmed.length < minChars) return false;

  const compact = trimmed.replace(/\s+/g, "");
  if (!compact) return true;

  const chars = [...compact];
  const freq = {};
  for (const c of chars) freq[c] = (freq[c] || 0) + 1;
  const maxFreq = Math.max(...Object.values(freq));
  if (maxFreq / chars.length > 0.35) return true;

  const unique = new Set(chars).size;
  if (unique < 10) return true;
  if (unique / chars.length < 0.1) return true;

  for (let len = 1; len <= 6; len++) {
    const unit = compact.slice(0, len);
    if (unit && compact === unit.repeat(Math.ceil(compact.length / len)).slice(0, compact.length)) {
      return true;
    }
  }

  if (/^[ぁ-んァ-ヶーa-zA-Z0-9.。、！？!?\s]{0,20}$/.test(compact) && chars.length >= minChars) {
    const onlyFew = /^(.)\1+$/.test(compact) || /^(..)\1+$/.test(compact);
    if (onlyFew) return true;
  }

  const words = trimmed.split(/[\s　、。.\n]+/).filter((w) => w.length >= 2);
  if (words.length >= 3) {
    const wordFreq = {};
    for (const w of words) wordFreq[w] = (wordFreq[w] || 0) + 1;
    const maxWord = Math.max(...Object.values(wordFreq));
    if (maxWord / words.length > 0.5 && words.length >= 5) return true;
  }

  return false;
}

function renderCharCount(item) {
  if (!item.required) {
    return `<p class="sr-char-count sr-char-count--optional" id="${item.id}-count" aria-live="polite">0文字（任意）</p>`;
  }
  const min = item.minChars;
  return `
    <p class="sr-char-count is-invalid" id="${item.id}-count" aria-live="polite">0 / ${min}文字（あと${min}文字）</p>
    <p class="sr-quality-error hidden" id="${item.id}-quality" role="alert">内容が適切ではありません。具体的な体験を記載してください。</p>`;
}

function renderPurchasePeriodFields() {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear; y >= currentYear - 15; y--) years.push(y);

  return `
    <div class="sr-period-fields">
      <div class="sr-period-field">
        <select class="select" id="purchaseYear" required aria-label="購入年">
          <option value="">年を選択</option>
          ${years.map((y) => `<option value="${y}">${y}年</option>`).join("")}
        </select>
      </div>
      <div class="sr-period-field">
        <select class="select" id="purchaseMonth" required aria-label="購入月">
          <option value="">月を選択</option>
          ${MONTH_OPTIONS.map((m) => `<option value="${m.value}">${m.label}</option>`).join("")}
        </select>
      </div>
      <span class="sr-period-suffix">頃</span>
    </div>
    <p class="form-hint">おおよその時期で構いません</p>`;
}

function renderItemIcon(item) {
  const paths = ITEM_ICONS[item.icon] || ITEM_ICONS.coin;
  return `
    <span class="sr-item-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
        ${paths}
      </svg>
    </span>`;
}

function renderStarRating(name) {
  return `
    <div class="sr-stars" data-rating-name="${name}" role="group" aria-label="星評価">
      ${[1, 2, 3, 4, 5]
        .map(
          (i) =>
            `<button type="button" class="sr-star" data-star="${i}" aria-label="${i}つ星">
              <span class="sr-star-fill" aria-hidden="true">★</span>
            </button>`
        )
        .join("")}
    </div>
    <input type="hidden" name="${name}" id="${name}" value="0" required />`;
}

function renderStaticStars(count) {
  const full = Math.floor(count);
  const half = count % 1 >= 0.5;
  let html = "★".repeat(full);
  if (half) html += "☆";
  html += `<span class="sr-scale-empty">${"★".repeat(5 - full - (half ? 1 : 0))}</span>`;
  return `<span class="sr-scale-stars" aria-hidden="true">${html}</span>`;
}

function formatRatingStars(value) {
  const v = Number(value);
  const full = Math.floor(v);
  const half = v % 1 >= 0.5;
  return `${"★".repeat(full)}${half ? "⯨" : ""}${"☆".repeat(5 - full - (half ? 1 : 0))}（${v}）`;
}

function renderRatingRows() {
  return RATING_ITEMS.map(
    (item, index) => `
    <div class="sr-rating-row${index < RATING_ITEMS.length - 1 ? " sr-rating-row--border" : ""}">
      <div class="sr-rating-row-label">
        ${renderItemIcon(item)}
        <div>
          <strong>${item.label}</strong>
          <span class="sr-detail-desc">${App.escapeHtml(item.desc)}</span>
        </div>
      </div>
      ${renderStarRating(item.key)}
    </div>`
  ).join("");
}

function renderBodyRows() {
  const requiredHtml = REQUIRED_BODY_ITEMS.map(
    (item, index) => renderBodyItem(item, index < REQUIRED_BODY_ITEMS.length - 1)
  ).join("");

  const optionalItems = BODY_ITEMS.filter((item) => !item.required);
  const optionalHtml = optionalItems.length
    ? `
      <div class="sr-body-optional-head">
        <h3 class="sr-body-optional-title">任意項目</h3>
        <p class="form-hint">入力しなくても投稿できます</p>
      </div>
      ${optionalItems.map((item, index) => renderBodyItem(item, index < optionalItems.length - 1)).join("")}`
    : "";

  return requiredHtml + optionalHtml;
}

function renderBodyItem(item, showBorder) {
  const min = getMinCharsForItem(item);
  return `
    <div class="sr-body-item${showBorder ? " sr-body-item--border" : ""}${item.required ? "" : " sr-body-item--optional"}">
      <div class="sr-body-item-head">
        ${renderItemIcon(item)}
        <label class="form-label" for="${item.id}">
          ${item.label}
          ${item.required ? '<span class="sr-required">*</span>' : '<span class="sr-optional">任意</span>'}
        </label>
      </div>
      <div class="sr-body-item-content">
        <textarea class="form-textarea sr-textarea" id="${item.id}" rows="${item.rows || 5}"
          ${item.required ? "required" : ""}
          data-min-chars="${min}"
          data-required="${item.required ? "true" : "false"}"
          placeholder="${App.escapeHtml(item.placeholder)}"></textarea>
        <p class="form-hint">${App.escapeHtml(item.hint)}</p>
        ${renderCharCount(item)}
      </div>
    </div>`;
}

function renderRatingScale() {
  return RATING_SCALE.map(
    (row) => `
    <div class="sr-scale-row">
      ${renderStaticStars(row.stars)}
      <span class="sr-scale-label">${row.label}</span>
    </div>`
  ).join("");
}

function renderSidebar() {
  return `
    <aside class="sr-sidebar">
      <div class="sr-side-box sr-side-box--guide">
        <h3>投稿前のご案内</h3>
        <ul class="sr-side-list">
          <li>実際に購入・受講した商品・サービスのみ投稿できます</li>
          <li>口コミを1件投稿すると、<strong>1か月間</strong>すべての口コミを閲覧できます</li>
          <li>購入証明の提出は任意です（提出で「購入証明済み」バッジ）</li>
          <li>口コミ本文は項目ごとに<strong>最低文字数</strong>が異なります（50〜100文字）</li>
        </ul>
        <a href="submit-guidelines.html" class="sr-side-guide-link">口コミ投稿ガイドラインを見る →</a>
      </div>
      <div class="sr-side-box">
        <h3>評価の基準</h3>
        <div class="sr-scale-list">${renderRatingScale()}</div>
        <p class="sr-side-note">0.5刻みで評価できます（星を左半分クリックで半分）</p>
      </div>
      <div class="sr-side-box">
        <h3>投稿内容の公開について</h3>
        <ul class="sr-side-list">
          <li>口コミ本文は<strong>匿名</strong>（ニックネーム）で公開されます</li>
          <li>購入証明は<strong>モザイク処理</strong>され、氏名・住所・電話番号・メールアドレスなどの個人情報は公開されません</li>
          <li>内容は運営が確認し、承認後に掲載されます</li>
          <li>個人を特定できる記述や誹謗中傷は削除対象です</li>
        </ul>
      </div>
      <div class="sr-side-box sr-side-box--help">
        <h3>困ったときは？</h3>
        <p>投稿方法や評価基準でわからないことがあれば、以下をご確認ください。</p>
        <a href="faq.html" class="sr-side-link">Q&Aを見る</a>
        <a href="contact.html" class="sr-side-link">お問い合わせ</a>
        <a href="guide.html" class="sr-side-link">ご利用ガイド</a>
      </div>
    </aside>`;
}

function collectFormData() {
  const proofInput = document.getElementById("purchaseProof");
  const year = document.getElementById("purchaseYear")?.value;
  const month = document.getElementById("purchaseMonth")?.value;
  const monthLabel = MONTH_OPTIONS.find((m) => m.value === month)?.label || "";

  return {
    productName: document.getElementById("productName")?.value.trim() || "",
    purchasePrice: document.getElementById("purchasePrice")?.value || "",
    purchasePeriod: year && month ? `${year}年${monthLabel}頃` : "",
    purchaseProofName: proofInput?.files?.[0]?.name || "未提出",
    ratings: RATING_ITEMS.map((item) => ({
      key: item.key,
      label: item.label,
      value: Number(document.getElementById(item.key)?.value || 0),
    })),
    bodies: BODY_ITEMS.map((item) => ({
      id: item.id,
      label: item.label,
      text: document.getElementById(item.id)?.value.trim() || "",
    })),
  };
}

function renderConfirmScreen(data) {
  return `
    <section class="sr-confirm" id="sr-confirm" aria-labelledby="sr-confirm-title">
      <div class="sr-confirm-card">
        <h2 id="sr-confirm-title">本当にこの内容で投稿してよろしいですか？</h2>
        <p class="sr-confirm-lead">投稿前に入力内容をご確認ください。</p>

        <div class="sr-confirm-block">
          <h3>購入情報</h3>
          <dl class="sr-confirm-dl">
            <div><dt>商品・サービス名</dt><dd>${App.escapeHtml(data.productName)}</dd></div>
            <div><dt>購入価格</dt><dd>${App.escapeHtml(Number(data.purchasePrice).toLocaleString())}円</dd></div>
            <div><dt>購入時期</dt><dd>${App.escapeHtml(data.purchasePeriod)}</dd></div>
            <div><dt>購入証明</dt><dd>${App.escapeHtml(data.purchaseProofName)}</dd></div>
          </dl>
        </div>

        <div class="sr-confirm-block">
          <h3>評価</h3>
          <dl class="sr-confirm-dl sr-confirm-dl--ratings">
            ${data.ratings
              .map(
                (r) =>
                  `<div><dt>${App.escapeHtml(r.label)}</dt><dd class="sr-confirm-stars">${formatRatingStars(r.value)}</dd></div>`
              )
              .join("")}
          </dl>
        </div>

        <div class="sr-confirm-block">
          <h3>口コミ本文</h3>
          ${data.bodies
            .filter((b) => b.text)
            .map(
              (b) => `
            <div class="sr-confirm-body-item">
              <h4>${App.escapeHtml(b.label)}</h4>
              <p class="sr-confirm-body-text">${App.escapeHtml(b.text).replace(/\n/g, "<br>")}</p>
            </div>`
            )
            .join("")}
        </div>

        <div class="sr-confirm-actions">
          <button type="button" class="btn btn-outline-trust btn-lg" id="sr-confirm-back">戻って修正する</button>
          <button type="button" class="btn btn-trust btn-lg" id="sr-confirm-submit">この内容で投稿する</button>
        </div>
      </div>
    </section>`;
}

function showConfirmScreen() {
  const form = document.getElementById("review-form");
  const data = collectFormData();
  let confirm = document.getElementById("sr-confirm");

  if (!confirm) {
    form.insertAdjacentHTML("beforeend", renderConfirmScreen(data));
    confirm = document.getElementById("sr-confirm");
    document.getElementById("sr-confirm-back").addEventListener("click", hideConfirmScreen);
    document.getElementById("sr-confirm-submit").addEventListener("click", submitReview);
  } else {
    confirm.outerHTML = renderConfirmScreen(data);
    confirm = document.getElementById("sr-confirm");
    document.getElementById("sr-confirm-back").addEventListener("click", hideConfirmScreen);
    document.getElementById("sr-confirm-submit").addEventListener("click", submitReview);
  }

  form.querySelector(".sr-layout").classList.add("hidden");
  form.querySelector(".sr-actions").classList.add("hidden");
  form.querySelector(".sr-footer-note")?.classList.add("hidden");
  confirm.classList.remove("hidden");
  confirm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function hideConfirmScreen() {
  const form = document.getElementById("review-form");
  document.getElementById("sr-confirm")?.classList.add("hidden");
  form.querySelector(".sr-layout")?.classList.remove("hidden");
  form.querySelector(".sr-actions")?.classList.remove("hidden");
  form.querySelector(".sr-footer-note")?.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function submitReview() {
  const submitBtn = document.getElementById("sr-confirm-submit");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "送信中...";
  }

  try {
    const data = collectFormData();
    const proofFile = document.getElementById("purchaseProof")?.files?.[0] || null;
    await ReviewsApi.submitReview(data, proofFile);
    App.showToast("口コミを送信しました。運営確認後に公開されます。");
    setTimeout(() => (window.location.href = "my-reviews.html"), 1200);
  } catch (err) {
    App.showToast(err.message || "投稿に失敗しました", "error");
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "この内容で投稿する";
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await App.whenReady();

  App.renderBreadcrumb([
    { label: "トップ", path: "index.html" },
    { label: "口コミを投稿" },
  ]);

  const root = document.getElementById("submit-root");

  if (!App.isLoggedIn()) {
    root.innerHTML = `
      <div class="sr-login-card">
        <div class="sr-login-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <rect x="5" y="11" width="14" height="10" rx="2"/>
            <path d="M8 11V8a4 4 0 0 1 8 0v3"/>
          </svg>
        </div>
        <h1>口コミを投稿するにはログインが必要です</h1>
        <p class="sr-login-lead">
          アカウントを作成またはログインして、口コミを投稿しましょう。<br />
          口コミを投稿すると、すべての口コミを無料で閲覧できるようになります。
        </p>
        <div class="sr-login-actions">
          <a href="register.html" class="btn btn-trust btn-lg">新規登録</a>
          <a href="login.html?redirect=submit-review.html" class="btn btn-outline-trust btn-lg">ログイン</a>
        </div>
        <p class="sr-login-back"><a href="index.html" class="back-link">トップページに戻る</a></p>
      </div>`;
    return;
  }

  root.innerHTML = `
    <header class="sr-header">
      <h1>口コミを投稿する</h1>
      <p>購入した商品・サービスの口コミを投稿すると、1か月間すべての口コミを無料で閲覧できます</p>
    </header>

    <form id="review-form" class="sr-form" novalidate>
      <div class="sr-layout">
        <div class="sr-main-col">
          <section class="sr-panel sr-panel--info">
            <header class="sr-panel-head">
              <h2>購入情報</h2>
              <p>購入した商品・サービスについて入力してください</p>
            </header>
            <div class="sr-panel-body sr-info-grid">
              <div class="form-group">
                <label class="form-label" for="productName">商品・サービス名 <span class="sr-required">*</span></label>
                <input type="text" class="form-input" id="productName" required
                  placeholder="例: YouTubeで月収100万円を達成する完全ロードマップ" />
              </div>
              <div class="form-group">
                <label class="form-label" for="purchasePrice">購入価格（円） <span class="sr-required">*</span></label>
                <input type="number" class="form-input" id="purchasePrice" required min="0" placeholder="98000" />
              </div>
              <div class="form-group sr-info-period">
                <span class="form-label">購入時期 <span class="sr-required">*</span></span>
                ${renderPurchasePeriodFields()}
              </div>
              <div class="form-group sr-info-proof">
                <label class="form-label" for="purchaseProof">購入証明</label>
                <label class="sr-upload" for="purchaseProof">
                  <span class="sr-upload-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                      <path d="M12 16V4m0 0 7 7m-7-7 7 7"/>
                      <path d="M4 20h16"/>
                    </svg>
                  </span>
                  <span class="sr-upload-title">ファイルを選択</span>
                  <span class="sr-upload-hint">領収書・契約画面・決済メールなど</span>
                  <span class="sr-upload-name" id="purchaseProof-name">未選択</span>
                </label>
                <input type="file" class="sr-upload-input" id="purchaseProof" accept="image/*,.pdf" />
              </div>
            </div>
          </section>

          <section class="sr-panel sr-panel--main">
            <header class="sr-panel-head">
              <h2>詳細レビュー</h2>
              <p>5つの項目について、まず星で評価し、その後に口コミ本文を入力してください</p>
            </header>
            <div class="sr-panel-body">
              <div class="sr-subsection">
                <h3 class="sr-subsection-title">評価</h3>
                <div class="sr-rating-list">${renderRatingRows()}</div>
              </div>
              <div class="sr-subsection sr-subsection--body">
                <h3 class="sr-subsection-title">口コミ本文</h3>
                <div class="sr-body-list">${renderBodyRows()}</div>
              </div>
            </div>
          </section>
        </div>
        ${renderSidebar()}
      </div>

      <div class="sr-actions">
        <button type="submit" class="btn btn-trust btn-lg sr-submit-btn" id="submit-btn" disabled>
          入力内容を確認する
        </button>
        <a href="reviews.html" class="btn btn-outline-trust btn-lg">キャンセル</a>
      </div>
      <p class="sr-footer-note">
        投稿された口コミは運営が確認のうえ公開されます。審査状況は<a href="my-reviews.html">投稿した口コミ</a>から確認できます。投稿は匿名で行われます。
      </p>
    </form>
  `;

  initFileUpload();
  initStarRatings();
  initCharCounters();
  initFormValidation();
});

function initFileUpload() {
  const input = document.getElementById("purchaseProof");
  const nameEl = document.getElementById("purchaseProof-name");
  if (!input || !nameEl) return;

  input.addEventListener("change", () => {
    nameEl.textContent = input.files?.[0]?.name || "未選択";
  });
}

function initStarRatings() {
  document.querySelectorAll(".sr-stars").forEach((container) => {
    const name = container.dataset.ratingName;
    const hidden = document.getElementById(name);
    if (!hidden) return;

    const updateDisplay = (value) => {
      container.querySelectorAll(".sr-star").forEach((btn) => {
        const star = Number(btn.dataset.star);
        btn.classList.toggle("is-half", value >= star - 0.5 && value < star);
        btn.classList.toggle("is-full", value >= star);
      });
      hidden.value = value || "";
      validateForm();
    };

    container.querySelectorAll(".sr-star").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const star = Number(btn.dataset.star);
        const rect = btn.getBoundingClientRect();
        const isLeftHalf = e.clientX - rect.left < rect.width / 2;
        updateDisplay(isLeftHalf ? star - 0.5 : star);
      });
    });

    updateDisplay(0);
  });
}

function updateTextareaState(textarea) {
  const item = getBodyItem(textarea.id);
  const minChars = Number(textarea.dataset.minChars || 0);
  const required = textarea.dataset.required === "true";
  const countEl = document.getElementById(`${textarea.id}-count`);
  const qualityEl = document.getElementById(`${textarea.id}-quality`);
  const len = countChars(textarea.value);
  const remaining = Math.max(0, minChars - len);
  const lowQuality =
    required && len >= minChars && isLowQualityText(textarea.value, minChars);

  if (countEl) {
    if (!required) {
      countEl.textContent = len > 0 ? `${len}文字（任意）` : "0文字（任意）";
      countEl.classList.remove("is-valid", "is-invalid");
    } else {
      countEl.textContent =
        remaining > 0
          ? `${len} / ${minChars}文字（あと${remaining}文字）`
          : `${len} / ${minChars}文字`;
      countEl.classList.toggle("is-valid", len >= minChars && !lowQuality);
      countEl.classList.toggle("is-invalid", len < minChars || lowQuality);
    }
  }

  if (qualityEl) {
    qualityEl.classList.toggle("hidden", !lowQuality);
  }

  textarea.classList.toggle("sr-textarea--invalid", lowQuality);
  void item;
}

function initCharCounters() {
  document.querySelectorAll(".sr-textarea[data-min-chars]").forEach((textarea) => {
    textarea.addEventListener("input", () => {
      updateTextareaState(textarea);
      validateForm();
    });
    updateTextareaState(textarea);
  });
}

function getQualityInvalidFields() {
  return REQUIRED_BODY_ITEMS.filter((item) => {
    const text = document.getElementById(item.id)?.value || "";
    const minChars = getMinCharsForItem(item);
    return countChars(text) >= minChars && isLowQualityText(text, minChars);
  });
}

function validateForm(showToast = false) {
  const submitBtn = document.getElementById("submit-btn");
  if (!submitBtn) return false;

  const productName = document.getElementById("productName")?.value.trim();
  const purchasePrice = document.getElementById("purchasePrice")?.value;
  const purchaseYear = document.getElementById("purchaseYear")?.value;
  const purchaseMonth = document.getElementById("purchaseMonth")?.value;
  const missingRatings = RATING_ITEMS.filter(
    (item) => !Number(document.getElementById(item.key)?.value || 0)
  );
  const shortComments = REQUIRED_BODY_ITEMS.filter((item) => {
    const minChars = getMinCharsForItem(item);
    return countChars(document.getElementById(item.id)?.value || "") < minChars;
  });
  const badQuality = getQualityInvalidFields();

  const isValid =
    productName &&
    purchasePrice !== "" &&
    Number(purchasePrice) >= 0 &&
    purchaseYear &&
    purchaseMonth &&
    missingRatings.length === 0 &&
    shortComments.length === 0 &&
    badQuality.length === 0;

  submitBtn.disabled = !isValid;

  if (showToast) {
    if (!productName || purchasePrice === "" || !purchaseYear || !purchaseMonth) {
      App.showToast("購入情報の必須項目を入力してください", "error");
      return false;
    }
    if (missingRatings.length) {
      App.showToast("5つの評価をすべて入力してください", "error");
      return false;
    }
    if (shortComments.length) {
      const first = shortComments[0];
      App.showToast(
        `${first.label}は${getMinCharsForItem(first)}文字以上入力してください`,
        "error"
      );
      return false;
    }
    if (badQuality.length) {
      const names = badQuality.map((item) => item.label).join("、");
      App.showToast(`${names}の内容が適切ではありません。具体的な体験を記載してください`, "error");
      return false;
    }
  }

  return isValid;
}

function initFormValidation() {
  const form = document.getElementById("review-form");
  form
    .querySelectorAll("#productName, #purchasePrice, #purchaseYear, #purchaseMonth, .sr-textarea")
    .forEach((el) => {
      el.addEventListener("input", () => validateForm());
      el.addEventListener("change", () => validateForm());
    });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm(true)) return;
    showConfirmScreen();
  });

  validateForm();
}
