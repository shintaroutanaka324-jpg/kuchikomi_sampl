(function () {
  let cachedCount = 0;

  function formatCount(count) {
    if (!count || count <= 0) return "";
    return count > 99 ? "99+" : String(count);
  }

  function badgeHtml(count, extraClass = "") {
    const text = formatCount(count);
    if (!text) return "";
    return `<span class="adm-pending-badge ${extraClass}" aria-label="審査待ち ${text} 件">${text}</span>`;
  }

  async function fetchCount() {
    if (!window.Auth?.isAdmin?.() || !window.ReviewsApi?.getPendingReviewCount) {
      return 0;
    }
    try {
      return await ReviewsApi.getPendingReviewCount();
    } catch (err) {
      console.warn("[カウマエ] 審査待ち件数の取得に失敗", err.message);
      return 0;
    }
  }

  function setBadgeOnElement(el, count) {
    if (!el) return;
    let badge = el.querySelector(".adm-pending-badge");
    const text = formatCount(count);
    if (!text) {
      badge?.remove();
      el.removeAttribute("data-pending-active");
      return;
    }
    if (!badge) {
      el.insertAdjacentHTML("beforeend", badgeHtml(count));
      badge = el.querySelector(".adm-pending-badge");
    } else {
      badge.textContent = text;
    }
    el.setAttribute("data-pending-active", "true");
  }

  function updateDom(count) {
    cachedCount = count;

    setBadgeOnElement(document.querySelector('[data-pending-badge="reviews-nav"]'), count);
    setBadgeOnElement(document.querySelector('[data-pending-badge="pending-tab"]'), count);
    setBadgeOnElement(document.querySelector('[data-pending-badge="account-review"]'), count);
    setBadgeOnElement(document.querySelector('[data-pending-badge="account-review-mobile"]'), count);

    const notifyBtn = document.getElementById("adm-notify-btn");
    if (notifyBtn) {
      let badge = notifyBtn.querySelector(".adm-pending-badge");
      const text = formatCount(count);
      if (!text) {
        badge?.remove();
      } else {
        if (!badge) {
          notifyBtn.insertAdjacentHTML("beforeend", badgeHtml(count, "adm-pending-badge--notify"));
        } else {
          badge.textContent = text;
        }
      }
    }

    window.dispatchEvent(
      new CustomEvent("admin:pending-count-changed", { detail: { count } })
    );
  }

  function clear() {
    updateDom(0);
  }

  async function refresh() {
    const count = await fetchCount();
    updateDom(count);
    return count;
  }

  function getCachedCount() {
    return cachedCount;
  }

  window.AdminPendingCount = {
    refresh,
    fetchCount,
    clear,
    badgeHtml,
    formatCount,
    getCachedCount,
  };
})();
