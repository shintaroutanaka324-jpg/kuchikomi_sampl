const SEARCH_HINTS = [
  "例：○○コーチ / ○○スクール / ○○塾",
  "サービス名で検索",
  "講師名で検索",
  "SNSアカウント名で検索",
];

function renderStarsInline(rating) {
  const full = Math.round(rating);
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += `<span class="${i <= full ? "" : "empty"}">★</span>`;
  }
  return html;
}

const HOME_REVIEWS_PER_PAGE = 3;

document.addEventListener("DOMContentLoaded", () => {
  initHeroSearch();
  renderTrending();
  renderReviews();
  renderCategories();
  renderReviewCountLabel();
});

function renderReviewCountLabel() {
  const el = document.getElementById("home-review-count");
  if (!el) return;
  el.textContent = "購入証明を提出した口コミには「購入証明済み」バッジが付きます（提出は任意）";
}

function initHeroSearch() {
  const form = document.getElementById("hero-search-form");
  const input = document.getElementById("hero-search-input");
  const hint = document.getElementById("hero-search-hint");
  if (!form || !input) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (q) window.location.href = `reviews.html?search=${encodeURIComponent(q)}`;
    else input.focus();
  });

  if (hint && SEARCH_HINTS.length > 1) {
    let i = 0;
    setInterval(() => {
      i = (i + 1) % SEARCH_HINTS.length;
      hint.textContent = SEARCH_HINTS[i];
    }, 4000);
  }
}

function renderTrending() {
  const el = document.getElementById("home-trending");
  if (!el || typeof TRENDING_SEARCHES === "undefined") return;

  const items = TRENDING_SEARCHES.slice(0, 4);
  el.innerHTML = items
    .map((t) => {
      const hint = t.hint ? `（${App.escapeHtml(t.hint)}）` : "";
      return `<a href="reviews.html?search=${encodeURIComponent(t.query)}" class="trending-tag trending-tag--rich trending-tag--cell">${App.escapeHtml(t.label)}<span class="trending-tag-hint">${hint}</span></a>`;
    })
    .join("");
}

function renderCategories() {
  const el = document.getElementById("home-categories");
  if (!el) return;

  el.innerHTML = CATEGORIES.map(
    (c) =>
      `<a href="reviews.html?genre=${c.value}" class="category-chip">${App.escapeHtml(c.label)}</a>`
  ).join("");
}

function renderReviewCardHtml(r, productMap) {
  const product = productMap[r.productId];
  const rating = r.rating || 4;
  const serviceName = product ? product.title : "（サービス名非公開）";
  const category = product ? getCategoryLabel(product.category) : "—";
  const instructor = product ? product.instructor : "";
  const detailUrl = product ? `review-detail.html?id=${product.id}` : "reviews.html";
  const badges = renderReviewTrustBadges(r, { large: true });
  const noBadgeNote = hasAnyTrustBadge(r)
    ? ""
    : `<p class="review-no-badge">購入記録未提出の口コミ</p>`;

  return `
      <article class="review-feed-card review-feed-card--primary">
        <header class="review-feed-header">
          <div class="review-feed-rating-large">
            <span class="rating-big">${rating.toFixed(1)}</span>
            <span class="stars">${renderStarsInline(rating)}</span>
          </div>
          <time class="review-feed-date" datetime="${App.escapeHtml(r.date)}">${formatDateJa(r.date)}</time>
        </header>
        ${badges}
        ${noBadgeNote}
        <a href="${detailUrl}" class="review-feed-service-name review-feed-service-name--lg">${App.escapeHtml(serviceName)}</a>
        ${instructor ? `<p class="review-feed-instructor">講師・発信者：${App.escapeHtml(instructor)} · ${App.escapeHtml(category)}</p>` : `<p class="review-feed-instructor">${App.escapeHtml(category)}</p>`}
        <h3 class="review-feed-title review-feed-title--lg">${App.escapeHtml(r.title)}</h3>
        <p class="review-feed-body review-feed-body--lg">${App.escapeHtml(r.content)}</p>
        <footer class="review-feed-footer">
          <span class="review-feed-user">${App.escapeHtml(r.userName)}（${r.age}）</span>
          <a href="${detailUrl}" class="review-feed-link">続きを読む →</a>
        </footer>
      </article>`;
}

function renderReviews() {
  const track = document.getElementById("home-reviews");
  const carousel = document.getElementById("home-reviews-carousel");
  if (!track || typeof REVIEWS === "undefined") return;

  const productMap = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
  const sorted = [...REVIEWS].sort((a, b) => new Date(b.date) - new Date(a.date));
  const items = sorted.slice(0, 6);
  const pages = [];

  for (let i = 0; i < items.length; i += HOME_REVIEWS_PER_PAGE) {
    pages.push(items.slice(i, i + HOME_REVIEWS_PER_PAGE));
  }

  if (pages.length === 0) {
    track.innerHTML = "";
    return;
  }

  track.innerHTML = pages
    .map(
      (page) =>
        `<div class="reviews-carousel-slide review-feed review-feed--primary">${page
          .map((r) => renderReviewCardHtml(r, productMap))
          .join("")}</div>`
    )
    .join("");

  if (carousel) {
    initReviewsCarousel(carousel, track, pages.length);
  }
}

function initReviewsCarousel(carousel, track, pageCount) {
  const prevBtn = document.getElementById("home-reviews-prev");
  const nextBtn = document.getElementById("home-reviews-next");
  if (!prevBtn || !nextBtn) return;

  let pageIndex = 0;

  const update = () => {
    track.style.transform = `translateX(-${pageIndex * 100}%)`;
    prevBtn.disabled = pageIndex === 0;
    nextBtn.disabled = pageIndex >= pageCount - 1;
    carousel.classList.toggle("reviews-carousel--end", pageIndex >= pageCount - 1);
  };

  prevBtn.onclick = () => {
    if (pageIndex > 0) {
      pageIndex -= 1;
      update();
    }
  };

  nextBtn.onclick = () => {
    if (pageIndex < pageCount - 1) {
      pageIndex += 1;
      update();
    }
  };

  if (pageCount <= 1) {
    nextBtn.disabled = true;
    prevBtn.disabled = true;
    carousel.classList.add("reviews-carousel--single");
  }

  update();
}
