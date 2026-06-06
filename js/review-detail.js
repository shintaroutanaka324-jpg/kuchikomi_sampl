const RADAR_AXES = [
  { key: "contentSatisfaction", label: "内容の質" },
  { key: "resultRealization", label: "成果実感" },
  { key: "supportQuality", label: "サポート" },
  { key: "costPerformance", label: "コスパ" },
  { key: "recommendation", label: "おすすめ度" },
];

document.addEventListener("DOMContentLoaded", () => {
  const id = App.getQueryParam("id");
  const product = getProductById(id);
  const root = document.getElementById("detail-root");

  if (product) trackRecentlyViewed(product.id);

  if (!product) {
    root.innerHTML = `
      <div class="empty-state">
        <h1 style="font-size:1.5rem;margin-bottom:1rem">サービスが見つかりません</h1>
        <a href="reviews.html" class="btn btn-trust">サービスを探すに戻る</a>
      </div>`;
    return;
  }

  const summary = getProductReviewSummary(product);
  const reviews = summary.reviews;
  const unlocked = App.hasUnlockedReviews();
  const reviewCount = Math.max(reviews.length, product.reviewCount || 0);
  const avgRating = reviews.length ? summary.averageRating : product.averageRating;
  const radarScores = computeRadarScores(reviews, product);
  const starDist = computeStarDistribution(reviews, reviewCount, avgRating);
  const related = getRelatedProducts(product);
  const officialUrl = product.officialUrl || "#";

  document.title = `${product.title} | ${App.SITE_BRAND.nameFull}`;

  App.renderBreadcrumb([
    { label: "トップ", path: "index.html" },
    { label: "オンライン講座", path: "reviews.html" },
    { label: getCategoryLabel(product.category), path: `reviews.html?genre=${product.category}` },
    { label: product.title },
  ]);

  root.innerHTML = `
    <div class="pd2">

      <!-- サービス概要 -->
      <section class="pd2-hero">
        <div class="pd2-hero-row">
          <div class="pd2-hero-banner">
            <img src="${product.imageUrl}" alt="" loading="eager" decoding="async" />
            <div class="pd2-hero-banner-overlay">
              <span class="pd2-hero-banner-cat">${App.escapeHtml(getCategoryShortLabel(product.category))}</span>
            </div>
          </div>
          <div class="pd2-hero-main">
            <div class="pd2-hero-tags">
              <span class="pd2-tag">オンライン講座</span>
              <a href="reviews.html?genre=${product.category}" class="pd2-tag pd2-tag--link">${App.escapeHtml(getCategoryLabel(product.category))}</a>
            </div>
            <h1 class="pd2-hero-title">${App.escapeHtml(product.title)}</h1>
            <div class="pd2-hero-rating">
              <span class="pd2-stars pd2-stars--hero" aria-hidden="true">${renderStarsHtml(avgRating)}</span>
              <strong class="pd2-score">${avgRating.toFixed(1)}</strong>
              <span class="pd2-score-max">/ 5.0</span>
              <a href="#reviews-section" class="pd2-review-link">口コミ ${reviewCount.toLocaleString("ja-JP")}件</a>
            </div>
            <ul class="pd2-keyinfo">
              <li>
                <span class="pd2-keyinfo-icon" aria-hidden="true">📺</span>
                <span class="pd2-keyinfo-label">受講形式</span>
                <span class="pd2-keyinfo-val">${App.escapeHtml(product.platform || "オンライン")}</span>
              </li>
              <li>
                <span class="pd2-keyinfo-icon" aria-hidden="true">📅</span>
                <span class="pd2-keyinfo-label">サポート期間</span>
                <span class="pd2-keyinfo-val">${App.escapeHtml(product.supportPeriod || "3〜6ヶ月")}</span>
              </li>
              <li>
                <span class="pd2-keyinfo-icon" aria-hidden="true">💴</span>
                <span class="pd2-keyinfo-label">料金</span>
                <span class="pd2-keyinfo-val">${formatPrice(product.price)}</span>
              </li>
              <li>
                <span class="pd2-keyinfo-icon" aria-hidden="true">↩</span>
                <span class="pd2-keyinfo-label">返金保証</span>
                <span class="pd2-keyinfo-val">${App.escapeHtml(product.refundPolicy || "なし")}</span>
              </li>
            </ul>
          </div>
          <aside class="pd2-hero-actions">
            <button type="button" class="pd2-fav-btn" id="pd2-fav-btn" aria-pressed="false"><span aria-hidden="true">♡</span> お気に入り</button>
            <a href="${App.escapeHtml(officialUrl)}" class="btn btn-trust btn-block pd2-official-cta" target="_blank" rel="noopener noreferrer">
              公式サイトで詳細を見る
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
            <a href="submit-review.html" class="btn btn-outline btn-block pd2-post-link">口コミを投稿する</a>
          </aside>
        </div>
      </section>

      <div class="pd2-body">
        <div class="pd2-main">

          <!-- 口コミ一覧 -->
          <section class="pd2-block pd2-reviews-section" id="reviews-section" aria-labelledby="pd2-reviews-heading">
            <div class="pd2-reviews-head">
              <div class="pd2-reviews-head-row">
                <h2 id="pd2-reviews-heading" class="pd2-block-title">口コミ一覧（${reviewCount.toLocaleString("ja-JP")}件）</h2>
                <label class="pd2-sort">
                  <span class="pd2-sort-label">並び替え：</span>
                  <select id="pd2-sort">
                    <option value="helpful-high">参考になった順</option>
                    <option value="newest">新しい順</option>
                    <option value="oldest">古い順</option>
                    <option value="rating-high">評価が高い順</option>
                    <option value="rating-low">評価が低い順</option>
                  </select>
                </label>
              </div>
            </div>
            <div class="pd2-reviews-list" id="pd2-reviews-list">
              ${
                reviews.length === 0
                  ? '<p class="pd2-empty">まだ口コミがありません。<a href="submit-review.html">最初の口コミを投稿</a>してください。</p>'
                  : reviews.map((r) => renderReviewCard(r, unlocked)).join("")
              }
            </div>
            ${!unlocked ? renderUnlockBanner() : ""}
          </section>
        </div>

        <!-- 右カラム -->
        <aside class="pd2-sidebar">
          <div class="pd2-side-card">
            <h2 class="pd2-side-title">総合評価の内訳</h2>
            <div class="pd2-side-score-row">
              <span class="pd2-side-big">${avgRating.toFixed(1)}</span>
              <div>
                <span class="pd2-stars pd2-stars--lg" aria-hidden="true">${renderStarsHtml(avgRating)}</span>
                <p class="pd2-side-count">${reviewCount.toLocaleString("ja-JP")}件の口コミ</p>
              </div>
            </div>
            <div class="pd2-star-bars">${starDist.map((row) => renderStarBarRow(row)).join("")}</div>
          </div>
          <div class="pd2-side-card">
            <h2 class="pd2-side-title">評価のポイント</h2>
            <ul class="pd2-eval-list">
              ${RADAR_AXES.map((axis, i) => {
                const val = Number(radarScores[i]) || 0;
                return `<li><span class="pd2-eval-label">${axis.label}</span><span class="pd2-eval-bar"><span style="width:${(val / 5) * 100}%"></span></span><span class="pd2-eval-val">${val.toFixed(1)}</span></li>`;
              }).join("")}
            </ul>
          </div>
          ${renderBasicInfoCard(product)}
          <button type="button" class="pd2-report">不適切な口コミを通報する</button>
        </aside>
      </div>

      ${
        related.length
          ? `
      <section class="pd2-related" aria-labelledby="pd2-related-title">
        <h2 id="pd2-related-title" class="pd2-related-title">このサービスを見た人はこんなサービスも見ています</h2>
        <div class="pd2-related-wrap">
          <button type="button" class="pd2-related-nav" id="related-prev" aria-label="前へ">‹</button>
          <div class="pd2-related-track" id="related-track">${related.map(renderRelatedCard).join("")}</div>
          <button type="button" class="pd2-related-nav" id="related-next" aria-label="次へ">›</button>
        </div>
      </section>`
          : ""
      }
    </div>

    <div class="pd2-sticky-cta">
      <a href="${App.escapeHtml(officialUrl)}" class="btn btn-trust btn-block" target="_blank" rel="noopener noreferrer">公式サイトで詳細を見る</a>
    </div>
  `;

  initProductDetailInteractions(product.id, reviews, unlocked);
});

function computeStarDistribution(reviews, totalCount, avgRating) {
  const counts = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    const b = Math.min(5, Math.max(1, Math.round(r.rating)));
    counts[b - 1]++;
  });
  const n = reviews.length;
  if (!n) {
    const adj = avgRating >= 4.5 ? [0.02, 0.05, 0.13, 0.3, 0.5] : [0.05, 0.1, 0.15, 0.3, 0.4];
    return [5, 4, 3, 2, 1].map((star, i) => ({ star, pct: Math.round(adj[4 - i] * 100) }));
  }
  return [5, 4, 3, 2, 1].map((star) => ({ star, pct: Math.round((counts[star - 1] / n) * 100) }));
}

function renderStarBarRow({ star, pct }) {
  return `
    <div class="pd2-star-bar-row">
      <span class="pd2-star-bar-label">${star}★</span>
      <div class="pd2-star-bar-track"><div class="pd2-star-bar-fill" style="width:${pct}%"></div></div>
      <span class="pd2-star-bar-pct">${pct}%</span>
    </div>`;
}

function renderBasicInfoCard(product) {
  return `
    <div class="pd2-side-card">
      <h2 class="pd2-side-title">基本情報</h2>
      <dl class="pd2-info-table">
        <div><dt>カテゴリ</dt><dd>${App.escapeHtml(getCategoryLabel(product.category))}</dd></div>
        <div><dt>受講形式</dt><dd>${App.escapeHtml(product.platform || "オンライン")}</dd></div>
        <div><dt>料金</dt><dd>${formatPrice(product.price)}</dd></div>
        <div><dt>運営</dt><dd>${App.escapeHtml(product.instructor)}</dd></div>
        <div><dt>サポート期間</dt><dd>${App.escapeHtml(product.supportPeriod || "3〜6ヶ月")}</dd></div>
      </dl>
    </div>`;
}

function getRelatedProducts(product) {
  return PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 6)
    .concat(PRODUCTS.filter((p) => p.id !== product.id && p.category !== product.category).slice(0, 4))
    .slice(0, 8);
}

function renderUnlockBanner() {
  return `
    <div class="pd2-unlock">
      <p class="pd2-unlock-title">🔒 口コミの詳細をすべて読む</p>
      <p class="pd2-unlock-desc">良かった点・気になった点・学べたことは、口コミ投稿後または有料プランで全文閲覧できます</p>
      <div class="pd2-unlock-actions">
        <a href="submit-review.html" class="btn btn-trust">無料で口コミを投稿</a>
        <a href="pricing.html" class="btn btn-outline">月額プランを見る</a>
      </div>
    </div>`;
}

function renderRelatedCard(p) {
  const st = getProductDisplayStats(p);
  return `
    <a href="review-detail.html?id=${p.id}" class="pd2-related-card">
      <div class="pd2-related-img-wrap">
        <img src="${p.imageUrl}" alt="" loading="lazy" decoding="async" />
      </div>
      <div class="pd2-related-body">
        <span class="pd2-related-cat">${App.escapeHtml(getCategoryShortLabel(p.category))}</span>
        <span class="pd2-related-name">${App.escapeHtml(p.title)}</span>
        <div class="pd2-related-rating">
          <span class="pd2-stars" aria-hidden="true">${renderStarsHtml(st.rating)}</span>
          <strong>${st.rating.toFixed(1)}</strong>
        </div>
        <span class="pd2-related-reviews">口コミ ${st.displayCount}件</span>
        <span class="pd2-related-price">${formatPrice(p.price)}</span>
      </div>
    </a>`;
}

function computeRadarScores(reviews, product) {
  if (!reviews.length) {
    const f = product.averageRating || 4;
    return RADAR_AXES.map(() => f);
  }
  return RADAR_AXES.map((axis) => {
    const sum = reviews.reduce((s, r) => s + (r[axis.key] || r.rating || 0), 0);
    return sum / reviews.length;
  });
}

function renderStarsHtml(rating) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += `<span class="${i <= Math.round(rating) ? "on" : "off"}">★</span>`;
  }
  return html;
}

function getUserProfile(r) {
  const jobs = ["会社員", "フリーランス", "自営業", "学生"];
  const genders = ["男性", "女性"];
  const n = (r.id.charCodeAt(1) || 0) + (r.userName?.length || 0);
  return { age: r.age, job: jobs[n % jobs.length], gender: genders[n % 2] };
}

function getLearnedText(r) {
  if (r.learned) return r.learned;
  if (r.results) return r.results;
  if (r.content && r.content.length > 30) return r.content.slice(0, 160) + (r.content.length > 160 ? "…" : "");
  return r.pros?.[0] ? `${r.pros[0]}を実践し、新しいスキルが身についた` : "受講を通じて実践的な知識を得られた";
}

function getRecommendForText(r) {
  if (r.recommendFor) return r.recommendFor;
  if (r.rating >= 4) return "本気で学び、継続して取り組める人";
  if (r.rating >= 3) return "自分のペースで学べる人";
  return "購入前に十分比較検討したい人";
}

function renderTagBlock(type, label, text, unlocked) {
  const inner = App.escapeHtml(text || "（記載なし）");
  const lockable = type !== "recommend";
  if (lockable && !unlocked) {
    return `
      <div class="pd2-rc-box pd2-rc-box--${type}">
        <h4 class="pd2-rc-box-title">${label}</h4>
        <div class="pd2-mosaic">
          <p class="pd2-rc-box-text pd2-blur">${inner}</p>
          <div class="pd2-mosaic-over"><span>🔒</span><p>口コミ投稿で全文を読む</p></div>
        </div>
      </div>`;
  }
  return `
    <div class="pd2-rc-box pd2-rc-box--${type}">
      <h4 class="pd2-rc-box-title">${label}</h4>
      <p class="pd2-rc-box-text">${inner}</p>
    </div>`;
}

function getAvatarClass(r) {
  const n = (r.id.charCodeAt(1) || 0) + (r.userName?.length || 0);
  return n % 2 === 0 ? "pd2-rc-avatar--blue" : "pd2-rc-avatar--rose";
}

function renderReviewCard(r, unlocked) {
  const profile = getUserProfile(r);
  const proText = (r.pros || []).join("。") || "—";
  const conText = (r.cons || []).join("。") || "—";
  const helpfulBase = 3 + (r.id.length % 12);

  return `
    <article class="pd2-rc" data-rating="${r.rating}" data-date="${r.date}" data-helpful="${helpfulBase}" id="review-${App.escapeHtml(r.id)}">
      <aside class="pd2-rc-side">
        <span class="pd2-rc-avatar ${getAvatarClass(r)}" aria-hidden="true">👤</span>
        <p class="pd2-rc-demo">${App.escapeHtml(profile.age)}・${App.escapeHtml(profile.gender)}</p>
        ${r.verifiedPurchase ? '<span class="pd2-rc-badge">購入証明済み</span>' : ""}
        <time class="pd2-rc-date" datetime="${r.date}">${formatDateJa(r.date)}</time>
      </aside>
      <div class="pd2-rc-main">
        <div class="pd2-rc-rating-row">
          <span class="pd2-stars" aria-hidden="true">${renderStarsHtml(r.rating)}</span>
          <strong>${r.rating.toFixed(1)}</strong>
        </div>
        <h3 class="pd2-rc-title">${App.escapeHtml(r.title)}</h3>
        <div class="pd2-rc-boxes">
          ${renderTagBlock("pro", "良かった点", proText, unlocked)}
          ${renderTagBlock("con", "気になった点", conText, unlocked)}
          ${renderTagBlock("learn", "学んだこと", getLearnedText(r), unlocked)}
          ${renderTagBlock("recommend", "おすすめしたい人", getRecommendForText(r), unlocked)}
        </div>
        <div class="pd2-rc-foot">
          <button type="button" class="pd2-helpful" data-review-id="${App.escapeHtml(r.id)}" data-base="${helpfulBase}">
            <span aria-hidden="true">👍</span> 参考になった <span class="pd2-helpful-n">${helpfulBase}</span>
          </button>
          <button type="button" class="pd2-rc-report">🚩 不適切な内容を報告</button>
        </div>
      </div>
    </article>`;
}

function initProductDetailInteractions(productId, reviews, unlocked) {
  const favKey = `fav-${productId}`;
  const favBtn = document.getElementById("pd2-fav-btn");
  if (favBtn) {
    const active = localStorage.getItem(favKey) === "true";
    favBtn.classList.toggle("is-active", active);
    favBtn.setAttribute("aria-pressed", String(active));
    favBtn.addEventListener("click", () => {
      const next = !favBtn.classList.contains("is-active");
      favBtn.classList.toggle("is-active", next);
      favBtn.setAttribute("aria-pressed", String(next));
      localStorage.setItem(favKey, String(next));
    });
  }

  const sortEl = document.getElementById("pd2-sort");
  if (sortEl) {
    sortEl.addEventListener("change", applyReviewSort);
    applyReviewSort();
  }

  function applyReviewSort() {
    const sort = sortEl?.value || "newest";
    const list = document.getElementById("pd2-reviews-list");
    if (!list) return;
    const cards = [...list.querySelectorAll(".pd2-rc")];
    cards.sort((a, b) => {
      const ra = parseFloat(a.dataset.rating, 10);
      const rb = parseFloat(b.dataset.rating, 10);
      const ha = parseInt(a.dataset.helpful, 10) || 0;
      const hb = parseInt(b.dataset.helpful, 10) || 0;
      const da = new Date(a.dataset.date);
      const db = new Date(b.dataset.date);
      if (sort === "helpful-high") return hb - ha;
      if (sort === "newest") return db - da;
      if (sort === "oldest") return da - db;
      if (sort === "rating-high") return rb - ra;
      if (sort === "rating-low") return ra - rb;
      return 0;
    });
    cards.forEach((c) => list.appendChild(c));
  }

  document.querySelectorAll(".pd2-helpful").forEach((btn) => {
    const rid = btn.dataset.reviewId;
    const key = `helpful-${rid}`;
    const countEl = btn.querySelector(".pd2-helpful-n");
    const saved = parseInt(localStorage.getItem(key) || "0", 10);
    const base = parseInt(btn.dataset.base || "3", 10);
    countEl.textContent = base + saved;
    btn.addEventListener("click", () => {
      if (btn.classList.contains("is-voted")) return;
      btn.classList.add("is-voted");
      localStorage.setItem(key, String(saved + 1));
      const total = base + saved + 1;
      countEl.textContent = total;
      const card = btn.closest(".pd2-rc");
      if (card) card.dataset.helpful = String(total);
    });
  });

  const track = document.getElementById("related-track");
  const prev = document.getElementById("related-prev");
  const next = document.getElementById("related-next");
  if (track && prev && next) {
    prev.addEventListener("click", () => track.scrollBy({ left: -300, behavior: "smooth" }));
    next.addEventListener("click", () => track.scrollBy({ left: 300, behavior: "smooth" }));
  }
}
