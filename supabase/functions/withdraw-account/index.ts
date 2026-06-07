import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const VALID_REASONS = new Set([
  "hard_to_use",
  "few_reviews",
  "price",
  "not_found",
  "no_longer_use",
  "other",
]);

function isActivePaidMember(profile: {
  is_paid?: boolean;
  is_paid_member?: boolean;
  subscription_status?: string | null;
}) {
  const paid = profile.is_paid === true || profile.is_paid_member === true;
  const status = (profile.subscription_status || "").toLowerCase();
  const activeStatus = status === "active" || status === "trialing" || status === "past_due";
  return paid && activeStatus;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: "サーバー設定が不完全です" }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "ログインが必要です" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "認証に失敗しました" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const reason = String(body.reason || "unspecified").trim() || "unspecified";
    const reasonOther = body.reasonOther ? String(body.reasonOther).trim() : null;

    if (reason !== "unspecified" && !VALID_REASONS.has(reason)) {
      return new Response(JSON.stringify({ error: "退会理由が不正です" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (reason === "other" && !reasonOther) {
      return new Response(JSON.stringify({ error: "その他を選択した場合は内容を入力してください" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("is_admin, is_paid, is_paid_member, subscription_status")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      return new Response(JSON.stringify({ error: profileError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (profile?.is_admin) {
      return new Response(JSON.stringify({ error: "運営アカウントは退会できません" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (profile && isActivePaidMember(profile)) {
      return new Response(
        JSON.stringify({
          error: "paid_subscription_active",
          message: "有料プランを解約後に退会できます。",
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const email = user.email || "";

    const { data: processResult, error: processError } = await adminClient.rpc(
      "process_account_withdrawal",
      {
        p_user_id: user.id,
        p_email: email,
        p_reason: reason,
        p_reason_other: reasonOther,
      }
    );

    if (processError) {
      console.error("[withdraw-account] process_account_withdrawal", processError);
      return new Response(JSON.stringify({ error: processError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const orphanPaths: string[] = [];
    async function collectStoragePaths(prefix: string) {
      const { data: items } = await adminClient.storage
        .from("purchase-proofs")
        .list(prefix, { limit: 1000 });
      if (!items?.length) return;
      for (const item of items) {
        const path = prefix ? `${prefix}/${item.name}` : item.name;
        if (item.id) {
          orphanPaths.push(path);
        } else {
          await collectStoragePaths(path);
        }
      }
    }
    await collectStoragePaths(user.id);
    if (orphanPaths.length) {
      await adminClient.storage.from("purchase-proofs").remove(orphanPaths);
    }

    const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(user.id);

    if (deleteUserError) {
      await adminClient
        .from("withdrawal_audit_logs")
        .update({
          result: "failed",
          error_message: deleteUserError.message,
        })
        .eq("user_id", user.id)
        .eq("result", "success")
        .order("created_at", { ascending: false })
        .limit(1);

      return new Response(JSON.stringify({ error: "アカウントの削除に失敗しました" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        ok: true,
        result: processResult,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[withdraw-account]", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "退会処理に失敗しました" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
