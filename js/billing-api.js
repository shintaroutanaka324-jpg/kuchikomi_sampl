(function () {
  function getConfig() {
    return window.SUPABASE_CONFIG || {};
  }

  function getFunctionsUrl() {
    const base = getConfig().url?.replace(/\/$/, "");
    if (!base) return null;
    return `${base}/functions/v1`;
  }

  function getSiteBaseUrl() {
    if (window.Auth?.getSiteBaseUrl) return window.Auth.getSiteBaseUrl();
    const path = getConfig().siteBasePath || "/";
    const normalized = path.startsWith("/") ? path : `/${path}`;
    const withSlash = normalized.endsWith("/") ? normalized : `${normalized}/`;
    return `${window.location.origin}${withSlash}`;
  }

  function isBillingConfigured() {
    return getConfig().billingEnabled !== false;
  }

  async function startCheckout({ redirectOnLogin = "pricing.html" } = {}) {
    if (!window.Auth?.isConfigured?.()) {
      throw new Error("決済機能の設定が完了していません。");
    }

    if (!window.Auth.isLoggedIn()) {
      window.location.href = `login.html?redirect=${encodeURIComponent(redirectOnLogin)}`;
      return null;
    }

    const client = window.Auth.getClient();
    const {
      data: { session },
    } = await client.auth.getSession();

    if (!session?.access_token) {
      throw new Error("ログインセッションが無効です。再度ログインしてください。");
    }

    const functionsUrl = getFunctionsUrl();
    if (!functionsUrl) {
      throw new Error("Supabase URL が設定されていません。");
    }

    const siteBase = getSiteBaseUrl();
    const response = await fetch(`${functionsUrl}/create-checkout-session`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        apikey: getConfig().anonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        siteUrl: siteBase,
        successUrl: `${siteBase}?payment=success`,
        cancelUrl: `${siteBase}?payment=cancel`,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (data.demo) {
        throw new Error(
          "Stripe はまだ設定されていません。Supabase Edge Functions に本番キーを設定後、再度お試しください。"
        );
      }
      throw new Error(data.error || "決済ページの作成に失敗しました");
    }

    if (!data.url) {
      throw new Error("決済URLを取得できませんでした");
    }

    window.location.href = data.url;
    return data.url;
  }

  function handlePaymentQueryParams() {
    const payment = new URLSearchParams(window.location.search).get("payment");
    if (!payment) return;

    if (payment === "success") {
      window.Auth?.refreshProfile?.();
      App.showToast("決済が完了しました。口コミ全文を閲覧できます。");
    } else if (payment === "cancel") {
      App.showToast("決済がキャンセルされました", "error");
    }

    const url = new URL(window.location.href);
    url.searchParams.delete("payment");
    window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
  }

  window.BillingApi = {
    startCheckout,
    handlePaymentQueryParams,
    isBillingConfigured,
    getSiteBaseUrl,
  };
})();
