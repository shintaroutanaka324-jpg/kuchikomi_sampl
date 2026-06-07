(function () {
  const WITHDRAW_REASONS = {
    unspecified: "未回答",
    hard_to_use: "使い方が分かりにくかった",
    few_reviews: "口コミが少なかった",
    price: "料金に納得できなかった",
    not_found: "目的のサービスが見つからなかった",
    no_longer_use: "もう利用しなくなった",
    other: "その他",
  };

  function getConfig() {
    return window.SUPABASE_CONFIG || {};
  }

  function reasonLabel(key) {
    return WITHDRAW_REASONS[key] || key;
  }

  async function getAccessToken() {
    const client = window.Auth?.getClient?.();
    if (!client) throw new Error("接続の準備ができていません。");
    const { data, error } = await client.auth.getSession();
    if (error || !data?.session?.access_token) {
      throw new Error("ログインが必要です。");
    }
    return data.session.access_token;
  }

  function isPaidSubscriptionActive() {
    if (!window.Auth?.isPaidMember?.()) return false;
    const status = (window.Auth.getSubscriptionStatus?.() || "").toLowerCase();
    if (!status) return window.Auth.isPaidMember();
    return status === "active" || status === "trialing" || status === "past_due";
  }

  async function withdrawAccount({ reason, reasonOther }) {
    const { url, anonKey } = getConfig();
    if (!url || !anonKey) {
      throw new Error("認証の設定が完了していません。");
    }

    const token = await getAccessToken();
    const endpoint = `${url.replace(/\/$/, "")}/functions/v1/withdraw-account`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: anonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason, reasonOther: reasonOther || null }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (payload.error === "paid_subscription_active") {
        const err = new Error(payload.message || "有料プランを解約後に退会できます。");
        err.code = "paid_subscription_active";
        throw err;
      }
      throw new Error(payload.error || payload.message || "退会処理に失敗しました。");
    }

    if (window.Auth?.signOut) {
      await window.Auth.signOut();
    }
    localStorage.removeItem("reviewsUnlocked");

    return payload;
  }

  async function loadWithdrawnUsersAdmin() {
    const client = window.Auth?.getClient?.();
    if (!client) throw new Error("接続の準備ができていません。");
    if (!window.Auth?.isAdmin?.()) throw new Error("運営者権限が必要です。");

    const { data, error } = await client
      .from("withdrawn_users")
      .select("*")
      .order("withdrawn_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }

  async function loadWithdrawalAuditLogsAdmin() {
    const client = window.Auth?.getClient?.();
    if (!client) throw new Error("接続の準備ができていません。");
    if (!window.Auth?.isAdmin?.()) throw new Error("運営者権限が必要です。");

    const { data, error } = await client
      .from("withdrawal_audit_logs")
      .select("*")
      .order("withdrawn_at", { ascending: false })
      .limit(200);

    if (error) throw new Error(error.message);
    return data || [];
  }

  window.AccountApi = {
    WITHDRAW_REASONS,
    reasonLabel,
    isPaidSubscriptionActive,
    withdrawAccount,
    loadWithdrawnUsersAdmin,
    loadWithdrawalAuditLogsAdmin,
  };
})();
