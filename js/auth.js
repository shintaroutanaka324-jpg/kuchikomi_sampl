(function () {
  let client = null;
  let session = null;
  let profile = null;
  let readyPromise = null;

  function getConfig() {
    return window.SUPABASE_CONFIG || {};
  }

  function isConfigured() {
    const { url, anonKey } = getConfig();
    if (!url || !anonKey) return false;
    if (url.includes("YOUR_SUPABASE")) return false;
    if (anonKey.includes("YOUR_SUPABASE")) return false;
    return true;
  }

  function clearLegacyAuthStorage() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
  }

  function loadSupabaseLib() {
    if (window.supabase?.createClient) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Supabase SDK の読み込みに失敗しました"));
      document.head.appendChild(script);
    });
  }

  async function fetchProfile(userId) {
    if (!client || !userId) {
      profile = null;
      return;
    }
    const { data, error } = await client
      .from("profiles")
      .select("display_name, email")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.warn("[カウマエ] プロフィール取得エラー", error.message);
      profile = null;
      return;
    }
    profile = data;
  }

  async function init() {
    clearLegacyAuthStorage();

    if (!isConfigured()) {
      session = null;
      profile = null;
      return;
    }

    await loadSupabaseLib();
    const { url, anonKey } = getConfig();
    client = window.supabase.createClient(url, anonKey);

    const { data, error } = await client.auth.getSession();
    if (error) {
      console.warn("[カウマエ] セッション取得エラー", error.message);
    }

    session = data?.session ?? null;
    if (session?.user) {
      await fetchProfile(session.user.id);
    }

    client.auth.onAuthStateChange(async (_event, nextSession) => {
      session = nextSession;
      if (nextSession?.user) {
        await fetchProfile(nextSession.user.id);
      } else {
        profile = null;
      }
      window.dispatchEvent(new CustomEvent("auth:changed"));
    });
  }

  function whenReady() {
    if (!readyPromise) {
      readyPromise = init().catch((err) => {
        console.warn("[カウマエ] 認証の初期化に失敗しました", err);
      });
    }
    return readyPromise;
  }

  function ensureClient() {
    if (!isConfigured()) {
      throw new Error("認証が設定されていません。管理者に supabase-config.js の設定を確認してください。");
    }
    if (!client) {
      throw new Error("認証クライアントの準備ができていません。ページを再読み込みしてください。");
    }
    return client;
  }

  function mapAuthError(error) {
    const message = error?.message || "エラーが発生しました";
    if (message.includes("already registered") || message.includes("User already registered")) {
      return "このメールアドレスは既に登録されています";
    }
    if (message.includes("Invalid login credentials")) {
      return "メールアドレスまたはパスワードが正しくありません";
    }
    if (message.includes("Email not confirmed")) {
      return "メールアドレスの確認が完了していません。受信トレイをご確認ください";
    }
    if (message.includes("Password should be at least")) {
      return "パスワードは8文字以上で設定してください";
    }
    if (message.includes("Unable to validate email address")) {
      return "メールアドレスの形式が正しくありません";
    }
    if (message.includes("Signup requires a valid password")) {
      return "有効なパスワードを入力してください";
    }
    return message;
  }

  async function signUp({ email, password, displayName }) {
    const supabase = ensureClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });
    if (error) throw new Error(mapAuthError(error));

    session = data.session;
    if (session?.user) {
      await fetchProfile(session.user.id);
    }
    return data;
  }

  async function signIn({ email, password }) {
    const supabase = ensureClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(mapAuthError(error));

    session = data.session;
    if (session?.user) {
      await fetchProfile(session.user.id);
    }
    return data;
  }

  async function signOut() {
    if (client) {
      await client.auth.signOut();
    }
    session = null;
    profile = null;
    clearLegacyAuthStorage();
  }

  async function resetPassword(email) {
    const supabase = ensureClient();
    const redirectTo = `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, "")}reset-password.html`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) throw new Error(mapAuthError(error));
  }

  async function updatePassword(newPassword) {
    const supabase = ensureClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new Error(mapAuthError(error));
  }

  function isLoggedIn() {
    return Boolean(session?.user);
  }

  function getUser() {
    return session?.user ?? null;
  }

  function getUserName() {
    return (
      profile?.display_name ||
      session?.user?.user_metadata?.display_name ||
      session?.user?.email?.split("@")[0] ||
      "ユーザー"
    );
  }

  function getUserEmail() {
    return profile?.email || session?.user?.email || "";
  }

  window.Auth = {
    whenReady,
    isConfigured,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    isLoggedIn,
    getUser,
    getUserName,
    getUserEmail,
    mapAuthError,
  };
})();
