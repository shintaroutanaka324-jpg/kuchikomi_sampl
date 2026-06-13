const RADAR_AXES = [
  { key: "contentSatisfaction", label: "内容の質" },
  { key: "resultRealization", label: "成果実感" },
  { key: "supportQuality", label: "サポート" },
  { key: "costPerformance", label: "コスパ" },
  { key: "recommendation", label: "おすすめ度" },
];

document.addEventListener("DOMContentLoaded", async () => {
  await App.whenReady();

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
  const access = await App.getReviewAccessState();
  const unlocked = access.canViewFull;
  const reviewCount = Math.max(reviews.length, product.reviewCount || 0);
  const avgRating = reviews.length ? summary.averageRating : product.averageRating;
  const radarScores = computeRadarScores(reviews, product);
  const starDist = computeStarDistribution(reviews, reviewCount, avgRating);
  const related = getRelatedProducts(product);
  const officialUrl = product.officialUrl || "#";
  const providerName = getProductProviderName(product, reviews);

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
            ${renderHeroIdentity(product.title, providerName)}
            <div class="pd2-hero-rating">
              <span class="pd2-stars pd2-stars--hero" aria-hidden="true">${renderStarsHtml(avgRating)}</span>
              <strong class="pd2-score">${avgRating.toFixed(1)}</strong>
              <span class="pd2-score-max">/ 5.0</span>
              <a href="#reviews-section" class="pd2-review-link">口コミ ${reviewCount.toLocaleString("ja-JP")}件</a>
            </div>
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
            <ul class="pd2-eval-list${unlocked ? "" : " pd2-eval-list--locked"}">
              ${renderEvalList(radarScores, unlocked)}
            </ul>
            ${!unlocked ? renderEvalUnlockNote() : ""}
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
  initReviewPaywallBilling();
});

function initReviewPaywallBilling() {
  const startCheckout = async (btn) => {
    if (!Auth.isLoggedIn()) {
      window.location.href = "login.html?redirect=review-detail.html?id=" + encodeURIComponent(App.getQueryParam("id") || "");
      return;
    }
    if (btn) {
      btn.disabled = true;
      const original = btn.textContent;
      btn.textContent = "移動中...";
      try {
        await BillingApi.startCheckout({
          redirectOnLogin: `review-detail.html?id=${encodeURIComponent(App.getQueryParam("id") || "")}`,
        });
      } catch (err) {
        App.showToast(err.message, "error");
        btn.disabled = false;
        btn.textContent = original;
      }
    }
  };

  document.getElementById("pd2-unlock-subscribe")?.addEventListener("click", (e) => {
    startCheckout(e.currentTarget);
  });

  document.querySelectorAll(".pd2-paywall-subscribe").forEach((btn) => {
    btn.addEventListener("click", () => startCheckout(btn));
  });
}

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

function getTopReviewValue(reviews, getter) {
  const counts = new Map();
  reviews.forEach((review) => {
    const value = String(getter(review) || "").trim();
    if (!value) return;
    counts.set(value, (counts.get(value) || 0) + 1);
  });
  if (!counts.size) return "";
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

function getProductProviderName(product, reviews = []) {
  const fromReviews = getTopReviewValue(reviews, (r) => r.sellerName || r.seller_name);
  if (fromReviews) return fromReviews;
  return String(product?.instructor || "").trim();
}

function renderHeroIdentity(serviceName, providerName) {
  return `
    <div class="pd2-hero-identity">
      <div class="pd2-hero-identity-block">
        <span class="pd2-hero-identity-label">サービス名</span>
        <h1 class="pd2-hero-identity-name">${App.escapeHtml(serviceName)}</h1>
      </div>
      <div class="pd2-hero-identity-block">
        <span class="pd2-hero-identity-label">チャンネル・企業名</span>
        <p class="pd2-hero-identity-name">${App.escapeHtml(providerName || "—")}</p>
      </div>
    </div>`;
}

function renderBasicInfoCard(product) {
  return `
    <div class="pd2-side-card">
      <h2 class="pd2-side-title">基本情報</h2>
      <dl class="pd2-info-table">
        <div><dt>カテゴリ</dt><dd>${App.escapeHtml(getCategoryLabel(product.category))}</dd></div>
      </dl>
    </div>`;
}

const REFUND_GUARANTEE_LABELS = {
  yes: "返金保証がある",
  no: "返金保証はない",
  unknown: "わからない・記載がなかった",
};

function refundGuaranteeLabel(value) {
  return REFUND_GUARANTEE_LABELS[value] || value || "—";
}

function formatReviewPurchasePeriod(review) {
  const y = Number(review.purchaseYear);
  if (!y) return null;
  const m = Number(review.purchaseMonth) || 0;
  return m > 0 ? `${y}年${m}月` : `${y}年`;
}

function formatReviewPurchasePrice(review) {
  const price = Number(review.purchasePrice);
  if (!Number.isFinite(price) || price <= 0) return null;
  return formatPrice(price);
}

function renderReviewPurchaseCards(review) {
  const price = formatReviewPurchasePrice(review);
  const period = formatReviewPurchasePeriod(review);
  const refundValue = review.hasRefundGuarantee || review.has_refund_guarantee || "";
  const refund = refundValue ? refundGuaranteeLabel(refundValue) : null;

  if (!price && !period && !refund) return "";

  const cards = [];
  if (price) {
    cards.push(`
      <div class="pd2-rc-fact">
        <span class="pd2-rc-fact-icon" aria-hidden="true">${RC_ICONS.price}</span>
        <div>
          <span class="pd2-rc-fact-label">購入価格</span>
          <span class="pd2-rc-fact-value">${App.escapeHtml(price)}</span>
        </div>
      </div>`);
  }
  if (period) {
    cards.push(`
      <div class="pd2-rc-fact">
        <span class="pd2-rc-fact-icon" aria-hidden="true">${RC_ICONS.calendar}</span>
        <div>
          <span class="pd2-rc-fact-label">購入時期</span>
          <span class="pd2-rc-fact-value">${App.escapeHtml(period)}</span>
        </div>
      </div>`);
  }
  if (refund) {
    cards.push(`
      <div class="pd2-rc-fact">
        <span class="pd2-rc-fact-icon" aria-hidden="true">${RC_ICONS.shield}</span>
        <div>
          <span class="pd2-rc-fact-label">返金保証</span>
          <span class="pd2-rc-fact-value">${App.escapeHtml(refund)}</span>
        </div>
      </div>`);
  }

  return `<div class="pd2-rc-facts">${cards.join("")}</div>`;
}

function getRelatedProducts(product) {
  const all = getAllProducts();
  return all
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 6)
    .concat(all.filter((p) => p.id !== product.id && p.category !== product.category).slice(0, 4))
    .slice(0, 8);
}

const PREVIEW_CHAR_LIMIT = 15;

function renderUnlockBanner() {
  return `
    <div class="pd2-unlock pd2-unlock--premium">
      <div class="pd2-unlock-icon" aria-hidden="true">🔒</div>
      <p class="pd2-unlock-title">続きを読むには</p>
      <p class="pd2-unlock-desc">口コミ全文を見るには <strong>月額880円で登録</strong> するか、<strong>口コミを投稿</strong> してください。</p>
      <ul class="pd2-unlock-list">
        <li>月額880円で口コミをすべて見る</li>
        <li>または</li>
        <li>口コミを投稿すると閲覧できます</li>
      </ul>
      <div class="pd2-unlock-actions">
        <button type="button" class="btn btn-trust" id="pd2-unlock-subscribe">月額880円で登録する</button>
        <a href="submit-review.html" class="btn btn-outline-trust">口コミを投稿する</a>
      </div>
    </div>`;
}

function renderEvalUnlockNote() {
  return `
    <p class="pd2-eval-lock-note">
      <span aria-hidden="true">🔒</span>
      詳細な評価スコアは口コミ投稿後またはプレミアム会員で表示されます
    </p>`;
}

function renderEvalList(radarScores, unlocked) {
  return RADAR_AXES.map((axis, i) => {
    const val = Number(radarScores[i]) || 0;
    if (unlocked) {
      return `<li><span class="pd2-eval-label">${axis.label}</span><span class="pd2-eval-bar"><span style="width:${(val / 5) * 100}%"></span></span><span class="pd2-eval-val">${val.toFixed(1)}</span></li>`;
    }
    const starPreview = renderStarsHtml(val);
    return `<li class="pd2-eval-item--locked">
      <span class="pd2-eval-label">${axis.label}</span>
      <span class="pd2-eval-bar pd2-eval-bar--locked" aria-hidden="true"><span style="width:${(val / 5) * 100}%"></span></span>
      <span class="pd2-eval-val pd2-eval-val--locked" aria-label="スコアは非公開">
        <span class="pd2-eval-stars-mask">${starPreview}</span>
      </span>
    </li>`;
  }).join("");
}

function truncatePreview(text, limit = PREVIEW_CHAR_LIMIT) {
  const chars = [...String(text || "")];
  if (!chars.length) return "（記載なし）";
  if (chars.length <= limit) return chars.join("");
  return chars.slice(0, limit).join("");
}

function hasMoreThanPreview(text, limit = PREVIEW_CHAR_LIMIT) {
  return [...String(text || "")].length > limit;
}

function renderPaywallCta(showActions = true) {
  if (!showActions) return "";
  return `
    <div class="pd2-paywall-cta">
      <span class="pd2-paywall-lock" aria-hidden="true">🔒</span>
      <p class="pd2-paywall-cta-title">続きを読むには</p>
      <ul class="pd2-paywall-cta-list">
        <li>月額880円で登録</li>
        <li>または</li>
        <li>口コミを投稿</li>
      </ul>
      <div class="pd2-paywall-cta-actions">
        <button type="button" class="btn btn-trust btn-sm pd2-paywall-subscribe">月額880円で登録</button>
        <a href="submit-review.html" class="btn btn-outline-trust btn-sm">口コミを投稿</a>
      </div>
    </div>`;
}

function renderLockedFiller() {
  return `
    <div class="pd2-paywall-filler" aria-hidden="true">
      <span class="pd2-paywall-line"></span>
      <span class="pd2-paywall-line"></span>
      <span class="pd2-paywall-line pd2-paywall-line--short"></span>
    </div>
    <div class="pd2-paywall-fade"></div>`;
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

function getBeforeText(r) {
  if (r.situation) return r.situation;
  return "";
}

function getAfterChangeText(r) {
  if (r.learned) return r.learned;
  if (r.results) return r.results;
  if (r.content && r.content.length > 30) return r.content.slice(0, 160) + (r.content.length > 160 ? "…" : "");
  return r.pros?.[0]
    ? `${r.pros[0]}を実践し、受講後に新しいスキルが身についた`
    : "受講・利用を通じて実践的な変化を感じられた";
}

function getRecommendForText(r) {
  if (r.recommendFor) return r.recommendFor;
  if (r.rating >= 4) return "本気で学び、継続して取り組める人";
  if (r.rating >= 3) return "自分のペースで学べる人";
  return "購入前に十分比較検討したい人";
}

const RC_ICONS = {
  price:
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>',
  calendar:
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  shield:
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  pro:
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M7 11v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-8"/><path d="M12 15V3"/><path d="M8 7l4-4 4 4"/></svg>',
  con:
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  learn:
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  recommend:
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  arrow:
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>',
};

function getReviewHeadline(r) {
  const title = String(r.title || "").trim();
  if (title) return title;
  const after = getAfterChangeText(r);
  const chars = [...after];
  if (chars.length > 5) return chars.slice(0, 42).join("") + (chars.length > 42 ? "…" : "");
  return "購入者の体験談";
}

function getLearnedDetailText(r) {
  return String(r.content || "").trim();
}

function renderLockableContent(text, unlocked, { showCta = false, className = "pd2-rc-text" } = {}) {
  const raw = text || "（記載なし）";
  if (unlocked) {
    return `<p class="${className}">${App.escapeHtml(raw)}</p>`;
  }

  const preview = App.escapeHtml(truncatePreview(raw));
  const locked = hasMoreThanPreview(raw);
  if (!locked) {
    return `<p class="${className}">${preview}</p>`;
  }

  return `
    <div class="pd2-paywall">
      <p class="pd2-paywall-preview">${preview}</p>
      <div class="pd2-paywall-locked">
        ${renderLockedFiller()}
        ${renderPaywallCta(showCta)}
      </div>
    </div>`;
}

function renderStoryBlock(beforeText, afterText, unlocked, showAfterCta) {
  return `
    <div class="pd2-rc-story">
      <p class="pd2-rc-story-heading">受講前から受講後の変化</p>
      <div class="pd2-rc-story-grid">
        <div class="pd2-rc-story-panel pd2-rc-story-panel--before">
          <span class="pd2-rc-story-tag">BEFORE</span>
          <h4 class="pd2-rc-story-label">受講前・利用前の状態</h4>
          ${renderLockableContent(beforeText || "（記載なし）", unlocked, {
            className: "pd2-rc-story-text",
          })}
        </div>
        <div class="pd2-rc-story-arrow" aria-hidden="true">${RC_ICONS.arrow}</div>
        <div class="pd2-rc-story-panel pd2-rc-story-panel--after">
          <span class="pd2-rc-story-tag">AFTER</span>
          <h4 class="pd2-rc-story-label">受講後・利用後の変化</h4>
          ${renderLockableContent(afterText, unlocked, {
            showCta: showAfterCta,
            className: "pd2-rc-story-text",
          })}
        </div>
      </div>
    </div>`;
}

function renderDetailRow(type, label, icon, text, unlocked, showCta) {
  return `
    <section class="pd2-rc-detail pd2-rc-detail--${type}">
      <div class="pd2-rc-detail-head">
        <span class="pd2-rc-detail-icon pd2-rc-detail-icon--${type}" aria-hidden="true">${icon}</span>
        <h4 class="pd2-rc-detail-title">${label}</h4>
      </div>
      <div class="pd2-rc-detail-body">
        ${renderLockableContent(text, unlocked, { showCta, className: "pd2-rc-detail-text" })}
      </div>
    </section>`;
}

function renderReviewCard(r, unlocked) {
  const profile = getUserProfile(r);
  const proText = (r.pros || []).join("。") || "—";
  const conText = (r.cons || []).join("。") || "—";
  const beforeText = getBeforeText(r);
  const afterText = getAfterChangeText(r);
  const learnText = getLearnedDetailText(r);
  const recommendText = getRecommendForText(r);
  const helpfulBase = 3 + (r.id.length % 12);
  let ctaShown = false;

  const detailRows = [
    { type: "pro", label: "良かった点・満足した点", icon: RC_ICONS.pro, text: proText },
    { type: "con", label: "気になった点", icon: RC_ICONS.con, text: conText },
    ...(learnText
      ? [{ type: "learn", label: "学んだこと", icon: RC_ICONS.learn, text: learnText }]
      : []),
    {
      type: "recommend",
      label: "どんな人におすすめしたいか",
      icon: RC_ICONS.recommend,
      text: recommendText,
    },
  ];

  const assignCta = (text) => {
    if (unlocked || ctaShown || !hasMoreThanPreview(text)) return false;
    ctaShown = true;
    return true;
  };

  const showStoryCta = assignCta(afterText);

  const detailsHtml = detailRows
    .map((row) => renderDetailRow(row.type, row.label, row.icon, row.text, unlocked, assignCta(row.text)))
    .join("");

  return `
    <article class="pd2-rc${unlocked ? "" : " pd2-rc--locked"}" data-rating="${r.rating}" data-date="${r.date}" data-helpful="${helpfulBase}" id="review-${App.escapeHtml(r.id)}">
      <header class="pd2-rc-head">
        <div class="pd2-rc-rating-row">
          <span class="pd2-stars pd2-stars--rc" aria-hidden="true">${renderStarsHtml(r.rating)}</span>
          ${
            unlocked
              ? `<strong class="pd2-rc-score">${r.rating.toFixed(1)}</strong>`
              : `<span class="pd2-rating-mask" aria-label="詳細スコアは非公開">—</span>`
          }
        </div>
        <h3 class="pd2-rc-headline">${App.escapeHtml(getReviewHeadline(r))}</h3>
        <div class="pd2-rc-meta">
          <span class="pd2-rc-avatar" aria-hidden="true">👤</span>
          <span class="pd2-rc-demo">${App.escapeHtml(profile.age)}・${App.escapeHtml(profile.gender)}</span>
          ${r.verifiedPurchase ? '<span class="pd2-rc-badge">購入証明済み</span>' : ""}
          <time class="pd2-rc-date" datetime="${r.date}">${formatDateJa(r.date)}</time>
        </div>
      </header>

      ${renderReviewPurchaseCards(r)}

      ${renderStoryBlock(beforeText, afterText, unlocked, showStoryCta)}

      <div class="pd2-rc-details">
        ${detailsHtml}
      </div>

      <footer class="pd2-rc-foot">
        <button type="button" class="pd2-helpful" data-review-id="${App.escapeHtml(r.id)}" data-base="${helpfulBase}">
          <span aria-hidden="true">♡</span> 参考になった <span class="pd2-helpful-n">${helpfulBase}</span>
        </button>
        <button type="button" class="pd2-rc-report">不適切な内容を報告</button>
      </footer>
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
