(function () {
  const DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop";

  let readyPromise = null;

  function getClient() {
    return window.Auth?.getClient?.() ?? null;
  }

  function ensureConfigured() {
    if (!window.Auth?.isConfigured?.()) {
      throw new Error("Supabase の設定が完了していません。");
    }
    const client = getClient();
    if (!client) throw new Error("接続の準備ができていません。");
    return client;
  }

  function rowToProduct(row) {
    return {
      id: row.id,
      title: row.title,
      instructor: row.instructor,
      category: row.category,
      price: Number(row.price) || 0,
      platform: row.platform || "オンライン",
      imageUrl: row.image_url || DEFAULT_IMAGE,
      description: row.description || "",
      averageRating: Number(row.average_rating) || 0,
      reviewCount: Number(row.review_count) || 0,
      companyName: row.company_name || "",
      location: row.location || "",
      highlightPro: row.highlight_pro || "",
      highlightCon: row.highlight_con || "",
      proofRate: Number(row.proof_rate) || 0,
      officialUrl: row.official_url || "",
      supportPeriod: row.support_period || "3〜6ヶ月",
      refundPolicy: row.refund_policy || "なし",
      isDbProduct: true,
      isPublished: row.is_published !== false,
    };
  }

  function productToRow(product) {
    return {
      id: product.id,
      title: product.title.trim(),
      instructor: product.instructor.trim(),
      category: product.category,
      price: Number(product.price) || 0,
      platform: product.platform?.trim() || null,
      image_url: product.imageUrl?.trim() || null,
      description: product.description?.trim() || null,
      average_rating: Number(product.averageRating) || 0,
      review_count: Number(product.reviewCount) || 0,
      company_name: product.companyName?.trim() || null,
      location: product.location?.trim() || null,
      highlight_pro: product.highlightPro?.trim() || null,
      highlight_con: product.highlightCon?.trim() || null,
      proof_rate: Number(product.proofRate) || 0,
      official_url: product.officialUrl?.trim() || null,
      support_period: product.supportPeriod?.trim() || null,
      refund_policy: product.refundPolicy?.trim() || null,
      is_published: product.isPublished !== false,
      updated_at: new Date().toISOString(),
    };
  }

  function generateProductId() {
    return `p-${Date.now().toString(36)}`;
  }

  async function loadPublishedProducts() {
    if (!window.Auth?.isConfigured?.()) {
      if (typeof setDbProducts === "function") setDbProducts([]);
      return [];
    }
    const client = getClient();
    if (!client) return [];

    const { data, error } = await client
      .from("products")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("[カウマエ] サービス一覧の取得に失敗", error.message);
      if (typeof setDbProducts === "function") setDbProducts([]);
      return [];
    }

    const products = (data || []).map(rowToProduct);
    if (typeof setDbProducts === "function") setDbProducts(products);
    return products;
  }

  async function loadAllProductsAdmin() {
    ensureConfigured();
    if (!window.Auth?.isAdmin?.()) {
      throw new Error("管理者権限が必要です。");
    }
    const client = getClient();
    const { data, error } = await client
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map(rowToProduct);
  }

  async function createProduct(input) {
    ensureConfigured();
    if (!window.Auth?.isAdmin?.()) {
      throw new Error("管理者権限が必要です。");
    }
    const client = getClient();
    const product = {
      id: input.id?.trim() || generateProductId(),
      title: input.title,
      instructor: input.instructor,
      category: input.category,
      price: input.price,
      platform: input.platform,
      imageUrl: input.imageUrl,
      description: input.description,
      highlightPro: input.highlightPro,
      highlightCon: input.highlightCon,
      officialUrl: input.officialUrl,
      supportPeriod: input.supportPeriod,
      refundPolicy: input.refundPolicy,
      isPublished: input.isPublished !== false,
    };

    const { data, error } = await client
      .from("products")
      .insert(productToRow(product))
      .select()
      .single();

    if (error) throw new Error(error.message);
    await loadPublishedProducts();
    return rowToProduct(data);
  }

  async function updateProduct(id, input) {
    ensureConfigured();
    if (!window.Auth?.isAdmin?.()) {
      throw new Error("管理者権限が必要です。");
    }
    const client = getClient();
    const { data: existing, error: fetchErr } = await client
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    if (fetchErr) throw new Error(fetchErr.message);

    const merged = { ...rowToProduct(existing), ...input, id };
    const row = productToRow(merged);
    delete row.id;

    const { data, error } = await client
      .from("products")
      .update(row)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    await loadPublishedProducts();
    return rowToProduct(data);
  }

  async function setProductPublished(id, isPublished) {
    ensureConfigured();
    if (!window.Auth?.isAdmin?.()) {
      throw new Error("管理者権限が必要です。");
    }
    const client = getClient();
    const { data, error } = await client
      .from("products")
      .update({ is_published: isPublished, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    await loadPublishedProducts();
    return rowToProduct(data);
  }

  async function deleteProduct(id) {
    ensureConfigured();
    if (!window.Auth?.isAdmin?.()) {
      throw new Error("管理者権限が必要です。");
    }
    const client = getClient();
    const { error } = await client.from("products").delete().eq("id", id);
    if (error) throw new Error(error.message);
    await loadPublishedProducts();
  }

  function whenReady() {
    if (!readyPromise) {
      readyPromise = (async () => {
        if (window.Auth?.whenReady) await window.Auth.whenReady();
        await loadPublishedProducts();
      })();
    }
    return readyPromise;
  }

  window.ProductsApi = {
    whenReady,
    loadPublishedProducts,
    loadAllProductsAdmin,
    createProduct,
    updateProduct,
    setProductPublished,
    deleteProduct,
    generateProductId,
    DEFAULT_IMAGE,
  };
})();
