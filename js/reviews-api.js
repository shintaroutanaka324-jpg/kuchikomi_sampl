(function () {
  let readyPromise = null;
  let approvedCache = [];

  function getClient() {
    return window.Auth?.getClient?.() ?? null;
  }

  function ensureConfigured() {
    if (!window.Auth?.isConfigured?.()) {
      throw new Error("口コミ機能の設定が完了していません。");
    }
    const client = getClient();
    if (!client) throw new Error("接続の準備ができていません。ページを再読み込みしてください。");
    return client;
  }

  function readBodyBefore(row) {
    return row?.body_before || row?.body_situation || "";
  }

  function readNumericResults(row) {
    return row?.numeric_results || row?.body_numeric || "";
  }

  function findProductIdByName(name) {
    const list = typeof getAllProducts === "function" ? getAllProducts() : PRODUCTS || [];
    const trimmed = name.trim();
    const exact = list.find((p) => p.title === trimmed);
    if (exact) return exact.id;
    const partial = list.find(
      (p) => p.title.includes(trimmed) || trimmed.includes(p.title)
    );
    return partial?.id ?? null;
  }

  function rowToLegacyReview(row) {
    const ratings = [
      Number(row.cost_performance),
      Number(row.recommendation),
      Number(row.support_quality),
      Number(row.content_satisfaction),
      Number(row.result_realization),
    ];
    const rating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    const dateSource = row.published_at || row.created_at;

    return {
      id: `db-${row.id}`,
      productId: row.product_id || "",
      productName: row.product_name || "",
      userName: row.reviewer_display_name || "匿名ユーザー",
      age: "30代",
      rating,
      date: dateSource.split("T")[0],
      verifiedPurchase: Boolean(row.purchase_proof_path),
      title: row.body_pros.slice(0, 40) + (row.body_pros.length > 40 ? "…" : ""),
      content: row.body_pros,
      purchasePrice: row.purchase_price,
      pros: [row.body_pros],
      cons: [row.body_concerns],
      learned: row.body_results || row.body_learnings,
      situation: readBodyBefore(row),
      numericResult: readNumericResults(row),
      recommendFor: row.body_recommend,
      bodyOther: row.body_other,
      contentSatisfaction: Number(row.content_satisfaction),
      resultRealization: Number(row.result_realization),
      supportQuality: Number(row.support_quality),
      costPerformance: Number(row.cost_performance),
      recommendation: Number(row.recommendation),
      _dbId: row.id,
      _fromDb: true,
    };
  }

  function applyApprovedCache(rows) {
    approvedCache = rows.map(rowToLegacyReview);
    if (typeof setApprovedDbReviews === "function") {
      setApprovedDbReviews(approvedCache);
    }
    window.dispatchEvent(new CustomEvent("reviews:updated", { detail: { count: approvedCache.length } }));
  }

  async function loadApprovedReviews() {
    if (!window.Auth?.isConfigured?.()) {
      approvedCache = [];
      applyApprovedCache([]);
      return [];
    }

    const client = getClient();
    if (!client) return [];

    let result = await client
      .from("submitted_reviews")
      .select("*")
      .eq("status", "approved")
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (result.error && isMissingPublishedColumnError(result.error)) {
      result = await client
        .from("submitted_reviews")
        .select("*")
        .eq("status", "approved")
        .order("published_at", { ascending: false });
    }

    if (result.error) {
      console.warn("[カウマエ] 公開口コミの取得エラー", result.error.message);
      return approvedCache;
    }

    applyApprovedCache((result.data || []).filter(isReviewPublished));
    return approvedCache;
  }

  function isMissingSubmitFieldsColumnError(error) {
    const msg = error?.message || "";
    return (
      (msg.includes("seller_name") || msg.includes("has_refund_guarantee")) &&
      msg.includes("schema cache")
    );
  }

  function isMissingReadUnlockColumnError(error) {
    const msg = error?.message || "";
    return (
      (msg.includes("read_unlock_status") || msg.includes("quality_flags")) &&
      msg.includes("schema cache")
    );
  }

  async function userHasReadUnlock() {
    if (!window.Auth?.isLoggedIn?.()) return false;
    if (window.Auth.isPaidMember?.()) return true;
    if (window.Auth.hasPostedReview?.()) return true;

    const client = getClient();
    if (!client) return false;

    const { count, error } = await client
      .from("submitted_reviews")
      .select("id", { count: "exact", head: true })
      .eq("user_id", window.Auth.getUser().id)
      .in("read_unlock_status", ["auto_approved", "admin_approved"]);

    if (error && isMissingReadUnlockColumnError(error)) {
      return userHasSubmissions();
    }
    if (error) {
      console.warn("[カウマエ] 閲覧解除状態の確認エラー", error.message);
      return false;
    }
    return (count || 0) > 0;
  }

  async function canViewFullReview() {
    if (!window.Auth?.isLoggedIn?.()) return false;
    if (window.Auth.refreshProfile) {
      await window.Auth.refreshProfile();
    }
    if (window.Auth.isPaidMember?.()) {
      localStorage.setItem("reviewsUnlocked", "true");
      return true;
    }
    const has = await userHasReadUnlock();
    if (has) {
      localStorage.setItem("reviewsUnlocked", "true");
    } else {
      localStorage.removeItem("reviewsUnlocked");
    }
    return has;
  }

  async function syncUnlockState() {
    return canViewFullReview();
  }

  async function getReviewAccessState() {
    const loggedIn = window.Auth?.isLoggedIn?.() ?? false;
    const isPaidMember = window.Auth?.isPaidMember?.() ?? false;
    let hasPostedReview = window.Auth?.hasPostedReview?.() ?? false;

    if (loggedIn && !hasPostedReview && !isPaidMember) {
      hasPostedReview = await userHasReadUnlock();
    }

    const canViewFull = loggedIn && (isPaidMember || hasPostedReview);

    if (canViewFull) {
      localStorage.setItem("reviewsUnlocked", "true");
    }

    return {
      loggedIn,
      isPaidMember,
      hasPostedReview,
      canViewFull,
    };
  }

  async function init() {
    await window.Auth?.whenReady?.();
    await loadApprovedReviews();
    await syncUnlockState();
  }

  function whenReady() {
    if (!readyPromise) {
      readyPromise = init().catch((err) => {
        console.warn("[カウマエ] 口コミAPIの初期化に失敗", err);
      });
    }
    return readyPromise;
  }

  async function uploadProof(file, userId, reviewId) {
    const client = ensureConfigured();
    const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
    const path = `${userId}/${reviewId}/proof.${ext}`;

    const { error } = await client.storage.from("purchase-proofs").upload(path, file, {
      upsert: true,
      contentType: file.type || undefined,
    });
    if (error) throw new Error(`購入証明のアップロードに失敗しました: ${error.message}`);
    return path;
  }

  async function submitReview(formData, proofFile) {
    const client = ensureConfigured();
    if (!window.Auth.isLoggedIn()) {
      throw new Error("ログインが必要です");
    }

    const user = window.Auth.getUser();
    const year = document.getElementById("purchaseYear")?.value;
    const month = document.getElementById("purchaseMonth")?.value;
    const serviceName = (formData.serviceName || formData.productName || "").trim();
    const sellerName = (formData.sellerName || "").trim();
    const hasRefundGuarantee = formData.hasRefundGuarantee || "";

    if (!serviceName) throw new Error("サービス名を入力してください");
    if (!sellerName) throw new Error("チャンネル・企業名を入力してください");
    if (!["yes", "no", "unknown"].includes(hasRefundGuarantee)) {
      throw new Error("返金保証の有無を選択してください");
    }

    const productId = findProductIdByName(serviceName);
    const reviewerName = `匿名ユーザー${String(user.id).slice(0, 4).toUpperCase()}`;

    const ratingKeyMap = {
      costPerformance: "cost_performance",
      recommendation: "recommendation",
      supportQuality: "support_quality",
      contentSatisfaction: "content_satisfaction",
      resultRealization: "result_realization",
    };
    const ratings = {};
    formData.ratings.forEach((r) => {
      const col = ratingKeyMap[r.key];
      if (col) ratings[col] = r.value;
    });

    const bodyIdMap = {
      bodyPros: "body_pros",
      bodyConcerns: "body_concerns",
      bodyBefore: "body_before",
      bodyResults: "body_results",
      bodyRecommend: "body_recommend",
      numericResults: "numeric_results",
      bodyOther: "body_other",
    };
    const bodyMinLengths = {
      body_pros: 150,
      body_concerns: 80,
      body_before: 80,
      body_results: 150,
      body_recommend: 80,
    };
    const bodyMinLabels = {
      body_pros: "良かった点",
      body_concerns: "気になった点",
      body_before: "受講前・利用前の状態",
      body_results: "受講後・利用後の変化",
      body_recommend: "おすすめしたい人",
    };
    const bodies = {};
    formData.bodies.forEach((b) => {
      const col = bodyIdMap[b.id];
      if (col) bodies[col] = b.text;
    });

    for (const [key, minLen] of Object.entries(bodyMinLengths)) {
      const text = bodies[key]?.trim() || "";
      if (!text) {
        throw new Error("口コミ本文の必須項目が不足しています");
      }
      if ([...text].length < minLen) {
        throw new Error(`${bodyMinLabels[key]}が${minLen}文字未満です`);
      }
    }

    if (!window.ReviewQuality?.evaluateReviewBodies) {
      throw new Error("品質チェックの読み込みに失敗しました。ページを再読み込みしてください。");
    }
    const quality = window.ReviewQuality.evaluateReviewBodies(bodies);
    const readUnlockStatus = quality.pass ? "auto_approved" : "pending";

    const insertPayload = {
      user_id: user.id,
      status: "pending",
      read_unlock_status: readUnlockStatus,
      quality_flags: quality.reasons,
      product_id: productId,
      product_name: serviceName,
      seller_name: sellerName,
      has_refund_guarantee: hasRefundGuarantee,
      purchase_price: Number(formData.purchasePrice),
      purchase_year: year ? Number(year) : null,
      purchase_month: month ? Number(month) : null,
      cost_performance: ratings.cost_performance,
      recommendation: ratings.recommendation,
      support_quality: ratings.support_quality,
      content_satisfaction: ratings.content_satisfaction,
      result_realization: ratings.result_realization,
      body_pros: bodies.body_pros,
      body_concerns: bodies.body_concerns,
      body_before: bodies.body_before,
      body_situation: bodies.body_before,
      body_results: bodies.body_results,
      body_learnings: bodies.body_results,
      body_recommend: bodies.body_recommend,
      numeric_results: bodies.numeric_results?.trim() || null,
      body_numeric: bodies.numeric_results?.trim() || null,
      body_other: bodies.body_other?.trim() || null,
      reviewer_display_name: reviewerName,
    };

    let created;
    let insertError;
    ({ data: created, error: insertError } = await client
      .from("submitted_reviews")
      .insert(insertPayload)
      .select("*")
      .single());

    if (insertError && isMissingSubmitFieldsColumnError(insertError)) {
      const fallbackPayload = { ...insertPayload };
      delete fallbackPayload.seller_name;
      delete fallbackPayload.has_refund_guarantee;
      ({ data: created, error: insertError } = await client
        .from("submitted_reviews")
        .insert(fallbackPayload)
        .select("*")
        .single());
    }

    if (insertError && isMissingReadUnlockColumnError(insertError)) {
      const fallbackPayload = { ...insertPayload };
      delete fallbackPayload.read_unlock_status;
      delete fallbackPayload.quality_flags;
      ({ data: created, error: insertError } = await client
        .from("submitted_reviews")
        .insert(fallbackPayload)
        .select("*")
        .single());
    }

    if (insertError) throw new Error(`口コミの保存に失敗しました: ${insertError.message}`);

    if (proofFile) {
      const proofPath = await uploadProof(proofFile, user.id, created.id);
      const { error: updateError } = await client
        .from("submitted_reviews")
        .update({ purchase_proof_path: proofPath })
        .eq("id", created.id);
      if (updateError) {
        console.warn("[カウマエ] 購入証明パスの更新エラー", updateError.message);
      }
    }

    if (quality.pass) {
      localStorage.setItem("reviewsUnlocked", "true");
    } else {
      localStorage.removeItem("reviewsUnlocked");
    }
    if (window.Auth?.refreshProfile) {
      await window.Auth.refreshProfile();
    }
    return {
      review: created,
      readUnlockApproved: quality.pass,
      qualityReasons: quality.reasons,
    };
  }

  async function approveReadUnlock(id) {
    ensureConfigured();
    if (!window.Auth.isAdmin?.()) throw new Error("運営者権限が必要です");

    const { data, error } = await getClient()
      .from("submitted_reviews")
      .update({
        read_unlock_status: "admin_approved",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(
        isMissingReadUnlockColumnError(error)
          ? "閲覧解除機能に必要なDB列がありません。Supabase SQL Editor で supabase/schema-reviews-read-unlock.sql を実行してください。"
          : error.message
      );
    }
    return data;
  }

  async function resetReadUnlockPending(id, qualityReasons) {
    ensureConfigured();
    if (!window.Auth.isAdmin?.()) throw new Error("運営者権限が必要です");

    const payload = {
      read_unlock_status: "pending",
      updated_at: new Date().toISOString(),
    };
    if (qualityReasons) {
      payload.quality_flags = qualityReasons;
    }

    const { data, error } = await getClient()
      .from("submitted_reviews")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(
        isMissingReadUnlockColumnError(error)
          ? "閲覧解除機能に必要なDB列がありません。Supabase SQL Editor で supabase/schema-reviews-read-unlock.sql を実行してください。"
          : error.message
      );
    }
    return data;
  }

  async function userHasSubmissions() {
    if (!window.Auth?.isLoggedIn?.()) return false;
    const client = getClient();
    if (!client) return false;

    const { count, error } = await client
      .from("submitted_reviews")
      .select("id", { count: "exact", head: true })
      .eq("user_id", window.Auth.getUser().id);

    if (error) {
      console.warn("[カウマエ] 投稿履歴の確認エラー", error.message);
      return false;
    }
    return (count || 0) > 0;
  }

  async function getMyReviews() {
    ensureConfigured();
    if (!window.Auth.isLoggedIn()) return [];

    const { data, error } = await getClient()
      .from("submitted_reviews")
      .select("*")
      .eq("user_id", window.Auth.getUser().id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }

  async function getPendingReviews() {
    ensureConfigured();
    if (!window.Auth.isAdmin?.()) {
      throw new Error("運営者権限が必要です");
    }

    const { data, error } = await getClient()
      .from("submitted_reviews")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  }

  async function getPendingReviewCount() {
    if (!window.Auth?.isConfigured?.()) return 0;
    if (!window.Auth.isAdmin?.()) return 0;

    const client = getClient();
    if (!client) return 0;

    const { count, error } = await client
      .from("submitted_reviews")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending");

    if (error) {
      console.warn("[カウマエ] 審査待ち件数の取得エラー", error.message);
      return 0;
    }
    return count || 0;
  }

  async function getReadUnlockPendingReviews() {
    ensureConfigured();
    if (!window.Auth.isAdmin?.()) throw new Error("運営者権限が必要です");

    const { data, error } = await getClient()
      .from("submitted_reviews")
      .select("*")
      .eq("read_unlock_status", "pending")
      .order("created_at", { ascending: true });

    if (error) {
      if (isMissingReadUnlockColumnError(error)) return [];
      throw new Error(error.message);
    }
    return data || [];
  }

  async function getReviewHistory(status) {
    ensureConfigured();
    if (!window.Auth.isAdmin?.()) throw new Error("運営者権限が必要です");

    let query = getClient()
      .from("submitted_reviews")
      .select("*")
      .order("reviewed_at", { ascending: false });
    if (status) query = query.eq("status", status);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  }

  async function getAllReviewsAdmin() {
    ensureConfigured();
    if (!window.Auth.isAdmin?.()) throw new Error("運営者権限が必要です");

    const { data, error } = await getClient()
      .from("submitted_reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }

  async function getProofSignedUrl(path) {
    if (!path) return null;
    const { data, error } = await getClient().storage.from("purchase-proofs").createSignedUrl(path, 3600);
    if (error) throw new Error(error.message);
    return data?.signedUrl ?? null;
  }

  const ADMIN_BODY_MIN = {
    body_pros: 150,
    body_concerns: 80,
    body_before: 80,
    body_results: 150,
    body_recommend: 80,
  };

  const ADMIN_BODY_LABELS = {
    body_pros: "良かった点・満足した点",
    body_concerns: "気になった点・改善してほしい点",
    body_before: "受講前・利用前の状態",
    body_results: "受講後・利用後の変化",
    body_recommend: "どんな人におすすめしたいか",
  };

  function validateAdminReviewContent(content) {
    for (const [key, minLen] of Object.entries(ADMIN_BODY_MIN)) {
      const text = content?.[key]?.trim() || "";
      if ([...text].length < minLen) {
        throw new Error(`${ADMIN_BODY_LABELS[key]}は${minLen}文字以上にしてください`);
      }
    }
  }

  function applyAdminContentToPayload(payload, content) {
    if (!content) return payload;
    const beforeText = (content.body_before ?? content.body_situation ?? "").trim();
    const numericText = (content.numeric_results ?? content.body_numeric ?? "").trim() || null;
    payload.body_pros = content.body_pros.trim();
    payload.body_concerns = content.body_concerns.trim();
    payload.body_before = beforeText;
    payload.body_situation = beforeText;
    payload.body_results = content.body_results.trim();
    payload.body_learnings = content.body_results.trim();
    payload.body_recommend = content.body_recommend.trim();
    payload.numeric_results = numericText;
    payload.body_numeric = numericText;
    payload.body_other = content.body_other?.trim() || null;
    return payload;
  }

  function isReviewPublished(row) {
    return row?.is_published !== false;
  }

  function isMissingWasEditedColumnError(error) {
    const msg = error?.message || "";
    return msg.includes("was_edited_by_admin") && msg.includes("schema cache");
  }

  function isMissingPublishedColumnError(error) {
    const msg = error?.message || "";
    return msg.includes("is_published") && msg.includes("schema cache");
  }

  function withoutWasEditedColumn(payload) {
    const next = { ...payload };
    delete next.was_edited_by_admin;
    return next;
  }

  async function updateSubmittedReview(id, payload) {
    let result = await getClient()
      .from("submitted_reviews")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (result.error && isMissingWasEditedColumnError(result.error)) {
      result = await getClient()
        .from("submitted_reviews")
        .update(withoutWasEditedColumn(payload))
        .eq("id", id)
        .select("*")
        .single();
    }

    if (result.error && isMissingPublishedColumnError(result.error)) {
      const fallback = { ...payload };
      delete fallback.is_published;
      result = await getClient()
        .from("submitted_reviews")
        .update(fallback)
        .eq("id", id)
        .select("*")
        .single();
    }

    return result;
  }

  async function approveReview(id, { productId, adminNote, content, wasEdited, productName } = {}) {
    ensureConfigured();
    if (!window.Auth.isAdmin?.()) throw new Error("運営者権限が必要です");

    if (content) {
      validateAdminReviewContent(content);
    }

    const payload = {
      status: "approved",
      is_published: true,
      reviewed_by: window.Auth.getUser().id,
      reviewed_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
      rejection_reason: null,
      admin_note: adminNote || null,
      was_edited_by_admin: Boolean(wasEdited),
      updated_at: new Date().toISOString(),
    };
    if (productId) {
      payload.product_id = productId;
      if (productName) payload.product_name = productName;
    }

    applyAdminContentToPayload(payload, content);

    const { data, error } = await updateSubmittedReview(id, payload);

    if (error) {
      throw new Error(
        isMissingWasEditedColumnError(error)
          ? "口コミ公開に必要なDB列がありません。Supabase SQL Editor で supabase/schema-reviews-admin-edit.sql を実行してください。"
          : error.message
      );
    }
    await loadApprovedReviews();
    return data;
  }

  async function updateReviewAdmin(id, { productId, productName, adminNote, content, wasEdited } = {}) {
    ensureConfigured();
    if (!window.Auth.isAdmin?.()) throw new Error("運営者権限が必要です");

    if (content) {
      validateAdminReviewContent(content);
    }

    let existing;
    let fetchErr;
    ({ data: existing, error: fetchErr } = await getClient()
      .from("submitted_reviews")
      .select("id, status, was_edited_by_admin")
      .eq("id", id)
      .maybeSingle());

    if (fetchErr && isMissingWasEditedColumnError(fetchErr)) {
      ({ data: existing, error: fetchErr } = await getClient()
        .from("submitted_reviews")
        .select("id, status")
        .eq("id", id)
        .maybeSingle());
    }

    if (fetchErr) throw new Error(fetchErr.message);
    if (!existing) throw new Error("口コミが見つかりません");
    if (existing.status === "pending") {
      throw new Error("審査待ちの口コミは「公開」操作で更新してください");
    }

    const payload = {
      admin_note: adminNote || null,
      was_edited_by_admin: Boolean(wasEdited) || existing.was_edited_by_admin === true,
      updated_at: new Date().toISOString(),
    };

    if (productId !== undefined) {
      payload.product_id = productId || null;
      if (productName) payload.product_name = productName;
    }

    applyAdminContentToPayload(payload, content);

    const { data, error } = await updateSubmittedReview(id, payload);

    if (error) {
      throw new Error(
        isMissingWasEditedColumnError(error)
          ? "口コミ更新に必要なDB列がありません。Supabase SQL Editor で supabase/schema-reviews-admin-edit.sql を実行してください。"
          : error.message
      );
    }
    await loadApprovedReviews();
    return data;
  }

  async function rejectReview(id, reason, adminNote) {
    ensureConfigured();
    if (!window.Auth.isAdmin?.()) throw new Error("運営者権限が必要です");

    const { data, error } = await getClient()
      .from("submitted_reviews")
      .update({
        status: "rejected",
        rejection_reason: reason || "掲載基準に適合しませんでした",
        admin_note: adminNote || null,
        reviewed_by: window.Auth.getUser().id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async function deleteApprovedReview(id) {
    ensureConfigured();
    if (!window.Auth.isAdmin?.()) throw new Error("運営者権限が必要です");

    const client = getClient();
    const { data: row, error: fetchErr } = await client
      .from("submitted_reviews")
      .select("id, status, purchase_proof_path")
      .eq("id", id)
      .maybeSingle();

    if (fetchErr) throw new Error(fetchErr.message);
    if (!row) throw new Error("口コミが見つかりません");
    if (row.status !== "approved") {
      throw new Error("公開済みの口コミのみ削除できます");
    }

    const { error } = await client.from("submitted_reviews").delete().eq("id", id);
    if (error) throw new Error(error.message);

    if (row.purchase_proof_path) {
      const { error: storageErr } = await client.storage
        .from("purchase-proofs")
        .remove([row.purchase_proof_path]);
      if (storageErr) {
        console.warn("[カウマエ] 購入証明の削除に失敗", storageErr.message);
      }
    }

    await loadApprovedReviews();
    return true;
  }

  async function setReviewPublished(id, isPublished) {
    ensureConfigured();
    if (!window.Auth.isAdmin?.()) throw new Error("運営者権限が必要です");

    const { data: row, error: fetchErr } = await getClient()
      .from("submitted_reviews")
      .select("id, status")
      .eq("id", id)
      .maybeSingle();

    if (fetchErr) throw new Error(fetchErr.message);
    if (!row) throw new Error("口コミが見つかりません");
    if (row.status !== "approved") {
      throw new Error("公開済みの口コミのみ非表示・再表示できます");
    }

    const { data, error } = await getClient()
      .from("submitted_reviews")
      .update({
        is_published: Boolean(isPublished),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(
        isMissingPublishedColumnError(error)
          ? "非表示機能に必要なDB列がありません。Supabase SQL Editor で supabase/schema-reviews-hidden.sql を実行してください。"
          : error.message
      );
    }

    await loadApprovedReviews();
    return data;
  }

  function statusLabel(status, row) {
    if (row?.status === "approved" && row.is_published === false) {
      return "非表示";
    }
    const map = {
      pending: "審査中",
      approved: "公開済み",
      rejected: "却下",
    };
    return map[status] || status;
  }

  window.ReviewsApi = {
    whenReady,
    loadApprovedReviews,
    submitReview,
    userHasSubmissions,
    userHasReadUnlock,
    approveReadUnlock,
    resetReadUnlockPending,
    canViewFullReview,
    getReviewAccessState,
    getMyReviews,
    getPendingReviews,
    getPendingReviewCount,
    getReadUnlockPendingReviews,
    getReviewHistory,
    getAllReviewsAdmin,
    getProofSignedUrl,
    approveReview,
    updateReviewAdmin,
    rejectReview,
    deleteApprovedReview,
    setReviewPublished,
    isReviewPublished,
    statusLabel,
    rowToLegacyReview,
    getApprovedCache: () => approvedCache,
  };
})();
