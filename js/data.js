const CATEGORIES = [
  { value: "career-job-change", label: "キャリア・転職" },
  { value: "romance-marriage", label: "恋愛・婚活" },
  { value: "side-business-independence", label: "副業・独立" },
  { value: "ai-it-skills", label: "AI・ITスキル" },
  { value: "web-marketing", label: "Webマーケティング" },
  { value: "sales-business-skills", label: "営業・ビジネススキル" },
  { value: "certification-exam", label: "資格・試験対策" },
  { value: "english-language", label: "英語・語学" },
  { value: "money-asset-building", label: "マネー・資産形成" },
  { value: "health-lifestyle", label: "健康・ライフスタイル" },
  { value: "community-salon", label: "コミュニティ・サロン" },
  { value: "other", label: "その他" },
];

const PRODUCTS = [
  {
    id: "1",
    title: "YouTubeで月収100万円を達成する完全ロードマップ",
    instructor: "山田太郎",
    category: "web-marketing",
    price: 98000,
    platform: "YouTube",
    imageUrl:
      "https://images.unsplash.com/photo-1683721003111-070bcc053d8b?w=400&h=300&fit=crop",
    description:
      "YouTubeチャンネルを0から立ち上げ、収益化までの完全ガイド。実践的な動画制作スキルとマネタイズ戦略を学べます。",
    averageRating: 4.3,
    reviewCount: 127,
    companyName: "株式会社山田メディア",
    location: "東京都渋谷区",
    highlightPro: "具体的なアクションプランが明確",
    highlightCon: "価格が高め",
    proofRate: 78,
  },
  {
    id: "2",
    title: "実践ビジネスコーチング講座 - あなたの可能性を最大化",
    instructor: "佐藤花子",
    category: "sales-business-skills",
    price: 150000,
    platform: "オンラインコーチング",
    imageUrl:
      "https://images.unsplash.com/photo-1611095790444-1dfa35e37b52?w=400&h=300&fit=crop",
    description:
      "3ヶ月間のマンツーマンコーチングプログラム。キャリアアップや起業を目指す方向けの実践的なコーチングです。",
    averageRating: 4.7,
    reviewCount: 89,
    highlightPro: "マンツーマンで丁寧なサポート",
    highlightCon: "価格が非常に高い",
    proofRate: 85,
  },
  {
    id: "3",
    title: "モテる男になる恋愛マスタープログラム",
    instructor: "田中恋太",
    category: "romance-marriage",
    price: 49800,
    platform: "X（旧Twitter）",
    imageUrl:
      "https://images.unsplash.com/photo-1619852182277-79aa23f82c8e?w=400&h=300&fit=crop",
    description:
      "外見、会話術、マインドセットまで、モテる男になるための総合的な恋愛コンサルティング。",
    averageRating: 3.2,
    reviewCount: 234,
    highlightPro: "動画の見やすさ",
    highlightCon: "価格に見合わない内容との声も",
    proofRate: 71,
  },
  {
    id: "4",
    title: "初心者から始める株式投資の教科書",
    instructor: "鈴木投資郎",
    category: "money-asset-building",
    price: 79800,
    platform: "YouTube",
    imageUrl:
      "https://images.unsplash.com/photo-1604594849809-dfedbc827105?w=400&h=300&fit=crop",
    description:
      "株式投資の基礎から実践的なテクニカル分析まで。初心者でも安心して学べる投資講座です。",
    averageRating: 4.6,
    reviewCount: 156,
    companyName: "鈴木投資アカデミー株式会社",
    location: "東京都千代田区",
    highlightPro: "初心者にも分かりやすい説明",
    highlightCon: "価格が高い",
    proofRate: 82,
  },
  {
    id: "5",
    title: "Xで影響力を高めるコンテンツ戦略",
    instructor: "高橋マーケ",
    category: "web-marketing",
    price: 39800,
    platform: "X（旧Twitter）",
    imageUrl:
      "https://images.unsplash.com/photo-1683721003111-070bcc053d8b?w=400&h=300&fit=crop",
    description:
      "フォロワー0から10万人を目指すX運用の完全ガイド。バズるコンテンツの作り方を徹底解説。",
    averageRating: 3.8,
    reviewCount: 98,
    highlightPro: "バズるコンテンツの作り方が学べる",
    highlightCon: "成果は個人差が大きい",
    proofRate: 69,
  },
  {
    id: "6",
    title: "女性のための恋愛・結婚コンサルティング",
    instructor: "伊藤愛子",
    category: "romance-marriage",
    price: 68000,
    platform: "Instagram",
    imageUrl:
      "https://images.unsplash.com/photo-1619852182277-79aa23f82c8e?w=400&h=300&fit=crop",
    description:
      "理想のパートナーと出会い、幸せな結婚を実現するための女性向け恋愛講座。",
    averageRating: 4.4,
    reviewCount: 76,
    highlightPro: "女性向けに特化した実践的アドバイス",
    highlightCon: "価格はやや高め",
    proofRate: 75,
  },
  {
    id: "7",
    title: "恋愛屋ジュンの実践的恋愛講座 - 本気で彼女を作る方法",
    instructor: "恋愛屋ジュン",
    category: "romance-marriage",
    price: 39800,
    platform: "YouTube",
    imageUrl:
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop",
    description:
      "恋愛経験ゼロから彼女を作るための実践的メソッド。外見改善、会話術、デート戦略まで網羅した総合恋愛プログラム。",
    averageRating: 4.2,
    reviewCount: 183,
    companyName: "恋愛屋ジュン合同会社",
    location: "大阪府大阪市",
    highlightPro: "コスパ抜群で実体験ベース",
    highlightCon: "情報量が多く整理が必要",
    proofRate: 80,
  },
  {
    id: "8",
    title: "ChatGPT×業務効率化 実践マスター講座",
    instructor: "AI活用ラボ",
    category: "ai-it-skills",
    price: 29800,
    platform: "オンライン講座",
    imageUrl:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
    description:
      "生成AIを仕事に活かす実践カリキュラム。プロンプト設計から業務自動化まで、未経験でも始められる内容です。",
    averageRating: 4.5,
    reviewCount: 312,
    highlightPro: "実務ですぐ使えるプロンプト例が豊富",
    highlightCon: "最新情報の更新頻度にばらつきあり",
    proofRate: 81,
  },
  {
    id: "9",
    title: "月5万円副業スタートアップ講座",
    instructor: "副業コンサル田中",
    category: "side-business-independence",
    price: 49800,
    platform: "オンラインスクール",
    imageUrl:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop",
    description:
      "本業と両立しながら月5万円を目指す副業のロードマップ。案件獲得から納品までの流れを体系的に学べます。",
    averageRating: 3.9,
    reviewCount: 156,
    highlightPro: "副業の全体像が整理しやすい",
    highlightCon: "成果は個人差が大きい",
    proofRate: 74,
  },
  {
    id: "10",
    title: "宅建士合格 完全攻略オンライン講座",
    instructor: "資格のプロ佐々木",
    category: "certification-exam",
    price: 88000,
    platform: "オンライン講座",
    imageUrl:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
    description:
      "宅建試験合格に必要な知識を効率的に習得。過去問演習と解説動画で独学でも学習しやすい構成です。",
    averageRating: 4.4,
    reviewCount: 89,
    highlightPro: "過去問の解説が丁寧で分かりやすい",
    highlightCon: "価格はやや高め",
    proofRate: 86,
  },
  {
    id: "11",
    title: "トップセールスが教える 営業力強化プログラム",
    instructor: "営業王ケン",
    category: "sales-business-skills",
    price: 68000,
    platform: "オンラインコーチング",
    imageUrl:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop",
    description:
      "商談力・クロージング力を短期間で伸ばす営業特化プログラム。BtoB・BtoC両方に応用できる実践型です。",
    averageRating: 4.1,
    reviewCount: 67,
    highlightPro: "ロールプレイ形式で実践的",
    highlightCon: "営業経験者向けの内容が多い",
    proofRate: 79,
  },
  {
    id: "12",
    title: "Instagram運用で集客するWebマーケ講座",
    instructor: "インスタマーケ美咲",
    category: "web-marketing",
    price: 45800,
    platform: "Instagram",
    imageUrl:
      "https://images.unsplash.com/photo-1611162617474-5b21e939e966?w=400&h=300&fit=crop",
    description:
      "フォロワー獲得から商品販売まで、Instagramを使った集客の全体像を学べるマーケティング講座です。",
    averageRating: 4.0,
    reviewCount: 142,
    highlightPro: "投稿テンプレートがそのまま使える",
    highlightCon: "アルゴリズム変更の影響を受けやすい",
    proofRate: 72,
  },
  {
    id: "13",
    title: "FXデイトレード入門 実践トレード講座",
    instructor: "トレード研究家 木村",
    category: "money-asset-building",
    price: 128000,
    platform: "オンライン講座",
    imageUrl:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop",
    description:
      "FXの基礎からデイトレード手法まで。チャート分析とリスク管理を重視した投資教育プログラムです。",
    averageRating: 3.6,
    reviewCount: 198,
    highlightPro: "チャート分析の考え方が学べる",
    highlightCon: "高額で損失リスクの説明が不足との声も",
    proofRate: 68,
  },
  {
    id: "14",
    title: "未経験から始めるプログラミング副業講座",
    instructor: "コードキャリア山本",
    category: "side-business-independence",
    price: 79800,
    platform: "オンラインスクール",
    imageUrl:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
    description:
      "Web制作スキルを身につけ、副業案件を獲得するための実践カリキュラム。ポートフォリオ作成までサポートします。",
    averageRating: 4.3,
    reviewCount: 224,
    highlightPro: "ポートフォリオ作成まで伴走してくれる",
    highlightCon: "学習期間が長く継続が必要",
    proofRate: 83,
  },
  {
    id: "15",
    title: "Python×AI データ分析実務講座",
    instructor: "データサイエンス研究所",
    category: "ai-it-skills",
    price: 98000,
    platform: "オンライン講座",
    imageUrl:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop",
    description:
      "Pythonと機械学習の基礎から実務レベルまで。データ分析のスキルを身につけたい社会人向けの講座です。",
    averageRating: 4.6,
    reviewCount: 95,
    highlightPro: "実データを使った演習が充実",
    highlightCon: "数学の基礎がないと難しい部分も",
    proofRate: 88,
  },
];

/** サービス検索ページ左カラム用カテゴリ */
const FILTER_CATEGORIES = [
  { value: "side-business-independence", label: "副業" },
  { value: "romance-marriage", label: "恋愛" },
  { value: "money-asset-building", label: "投資" },
  { value: "ai-it-skills", label: "AI" },
  { value: "web-marketing", label: "Webマーケ" },
  { value: "sales-business-skills", label: "営業" },
  { value: "certification-exam", label: "資格" },
];

const POPULAR_TAGS = [
  { label: "#副業", category: "side-business-independence" },
  { label: "#AI", category: "ai-it-skills" },
  { label: "#恋愛", category: "romance-marriage" },
  { label: "#投資", category: "money-asset-building" },
];

const CATEGORY_SHORT_LABELS = {
  "side-business-independence": "副業",
  "romance-marriage": "恋愛",
  "money-asset-building": "投資",
  "ai-it-skills": "AI",
  "web-marketing": "Webマーケ",
  "sales-business-skills": "営業",
  "certification-exam": "資格",
  "career-job-change": "キャリア",
  "english-language": "英語",
  "health-lifestyle": "健康",
  "community-salon": "コミュニティ",
  other: "その他",
};

const SITE_STATS = {
  serviceCount: 1250,
  reviewCount: 12847,
  reviewerCount: 5800,
  averageRating: 4.2,
};

const TRENDING_SEARCHES = [
  { label: "#山田コーチ", query: "山田太郎", hint: "口コミ127件" },
  { label: "#恋愛屋ジュン塾", query: "恋愛屋ジュン", hint: "今週+5件" },
  { label: "#佐藤コーチング", query: "佐藤花子", hint: "口コミ89件" },
  { label: "#鈴木投資アカデミー", query: "鈴木投資郎", hint: "口コミ156件" },
  { label: "#副業スクール", query: "副業", hint: "口コミ234件" },
  { label: "#YouTube講座", query: "YouTube", hint: "今週+3件" },
];

const REVIEWS = [
  {
    id: "r1",
    productId: "1",
    userName: "匿名ユーザーA",
    age: "30代",
    rating: 4.5,
    date: "2026-05-20",
    verifiedPurchase: true,
    title: "本当に収益化できました！",
    content:
      "最初は半信半疑でしたが、この教材の通りに実践したところ、6ヶ月で収益化を達成できました。特に動画のサムネイル制作とSEO対策の部分が非常に参考になりました。価格は高いですが、それ以上の価値がありました。",
    purchasePrice: 98000,
    pros: ["具体的なアクションプランが明確", "質問サポートが充実", "実績が出やすい"],
    cons: ["価格が高め", "初心者には少し難しい部分も"],
    contentSatisfaction: 4.5,
    resultRealization: 5,
    supportQuality: 4.5,
    costPerformance: 4,
    recommendation: 4.5,
  },
  {
    id: "r2",
    productId: "1",
    userName: "匿名ユーザーB",
    age: "20代",
    rating: 3.5,
    date: "2026-04-15",
    verifiedPurchase: false,
    title: "内容は良いが価格が...",
    content:
      "コンテンツ自体は良質で、YouTubeの収益化に必要な知識は一通り学べます。ただ、正直なところネットで調べればある程度わかる内容も含まれており、この価格は少し高すぎると感じました。",
    purchasePrice: 98000,
    pros: ["体系的なカリキュラム", "実践的"],
    cons: ["価格が高い", "一部は無料情報と重複"],
    contentSatisfaction: 4,
    resultRealization: 3,
    supportQuality: 4,
    costPerformance: 2.5,
    recommendation: 3,
  },
  {
    id: "r3",
    productId: "2",
    userName: "匿名ユーザーC",
    age: "40代",
    rating: 5,
    date: "2026-05-10",
    verifiedPurchase: true,
    title: "人生が変わりました",
    content:
      "佐藤さんのコーチングを受けて、自分の可能性を信じられるようになりました。3ヶ月のプログラムで、転職も成功し、年収も200万円アップ。高額ですが、投資した以上のリターンがありました。",
    purchasePrice: 150000,
    pros: ["マンツーマンで丁寧", "的確なアドバイス", "成果が出る"],
    cons: ["価格が非常に高い"],
    contentSatisfaction: 5,
    resultRealization: 5,
    supportQuality: 5,
    costPerformance: 4,
    recommendation: 5,
  },
  {
    id: "r4",
    productId: "7",
    userName: "匿名ユーザーD",
    age: "20代",
    rating: 4.5,
    date: "2026-05-01",
    verifiedPurchase: true,
    title: "コスパ最高の恋愛教材",
    content:
      "他の恋愛コンサルは10万円以上するのに、この価格でこの内容量は本当にすごい。ジュンさんの実体験に基づいたアドバイスなので説得力があります。",
    purchasePrice: 39800,
    pros: ["コスパ抜群", "実体験ベース", "ボリュームがある"],
    cons: ["情報量が多くて整理が必要"],
    contentSatisfaction: 5,
    resultRealization: 4,
    supportQuality: 4,
    costPerformance: 5,
    recommendation: 5,
  },
  {
    id: "r5",
    productId: "3",
    userName: "匿名ユーザーE",
    age: "30代",
    rating: 2.5,
    date: "2026-05-18",
    verifiedPurchase: true,
    title: "期待外れだった",
    content:
      "SNSの煽りに乗って購入しましたが、内容は一般的な恋愛テクニックの寄せ集め。同じ情報はYouTubeでも無料で得られます。購入前に口コミを見ていれば防げた失敗でした。",
    purchasePrice: 49800,
    pros: ["動画の見やすさ"],
    cons: ["価格に見合わない", "誇大広告感", "成果が出にくい"],
    contentSatisfaction: 3,
    resultRealization: 2,
    supportQuality: 2.5,
    costPerformance: 2,
    recommendation: 2,
  },
  {
    id: "r6",
    productId: "4",
    userName: "匿名ユーザーF",
    age: "50代",
    rating: 4,
    date: "2026-05-22",
    verifiedPurchase: true,
    title: "初心者には分かりやすい投資講座",
    content:
      "鈴木先生の説明は丁寧で、投資初心者の私でも理解できました。ただし高額なので、余裕資金がある方向け。購入前に口コミを読んで安心して申し込めました。",
    purchasePrice: 79800,
    pros: ["説明が分かりやすい", "カリキュラムが体系的"],
    cons: ["価格が高い", "成果は自己責任"],
    contentSatisfaction: 4.5,
    resultRealization: 3.5,
    supportQuality: 4,
    costPerformance: 3.5,
    recommendation: 4,
  },
];

function getCategoryLabel(value) {
  return CATEGORIES.find((c) => c.value === value)?.label || value;
}

let _dbProductsPublished = [];
let _dbProductsAdmin = [];

/** 公開サイト用: 公開中の DB サービスのみ */
function setDbProducts(products) {
  _dbProductsPublished = Array.isArray(products) ? products : [];
}

/** 運営画面用: 公開・非公開を含む DB サービス */
function setDbProductsAdmin(products) {
  _dbProductsAdmin = Array.isArray(products) ? products : [];
}

/** 静的データ（data.js）と DB 登録サービスを統合（公開サイト向け） */
function getAllProducts() {
  const publishedDb = _dbProductsPublished;
  const suppressedStaticIds = new Set(
    _dbProductsAdmin.filter((p) => p.isPublished === false).map((p) => p.id)
  );
  const dbIds = new Set(publishedDb.map((p) => p.id));
  const staticOnly = PRODUCTS.filter((p) => !dbIds.has(p.id) && !suppressedStaticIds.has(p.id));
  return [...publishedDb, ...staticOnly];
}

/** 運営画面向け: 非公開 DB サービスとデモデータを統合 */
function getAllProductsAdmin() {
  const dbIds = new Set(_dbProductsAdmin.map((p) => p.id));
  const staticOnly = PRODUCTS.filter((p) => !dbIds.has(p.id));
  return [..._dbProductsAdmin, ...staticOnly];
}

function getProductById(id) {
  if (!id) return undefined;
  return getAllProducts().find((p) => p.id === id);
}

let _approvedDbReviews = [];

function setApprovedDbReviews(reviews) {
  _approvedDbReviews = Array.isArray(reviews) ? reviews : [];
}

function getAllReviewsMerged() {
  const seen = new Set();
  const merged = [];

  for (const review of [...REVIEWS, ..._approvedDbReviews]) {
    if (seen.has(review.id)) continue;
    seen.add(review.id);
    merged.push(review);
  }

  return merged.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getLatestReviews(limit = 6) {
  const dbSorted = [..._approvedDbReviews].sort((a, b) => new Date(b.date) - new Date(a.date));
  const staticSorted = REVIEWS.filter((r) => !dbSorted.some((d) => d.id === r.id)).sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  if (dbSorted.length > 0) {
    return [...dbSorted, ...staticSorted].slice(0, limit);
  }

  return staticSorted.slice(0, limit);
}

function getReviewsByProductId(productId) {
  return getAllReviewsMerged().filter((r) => r.productId === productId);
}

/** 商品（商材）単位の口コミ集計 */
function getProductReviewSummary(product) {
  const reviews = getReviewsByProductId(product.id);
  const sorted = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!sorted.length) {
    return {
      reviews: [],
      reviewCount: product.reviewCount || 0,
      averageRating: product.averageRating,
      latestDate: null,
      latestReview: null,
    };
  }

  const averageRating = sorted.reduce((sum, r) => sum + r.rating, 0) / sorted.length;

  return {
    reviews: sorted,
    reviewCount: sorted.length,
    averageRating,
    latestDate: sorted[0].date,
    latestReview: sorted[0],
  };
}

function formatPrice(price) {
  return "¥" + price.toLocaleString("ja-JP");
}

function formatPriceRange(price) {
  if (price >= 100000) return "10万円〜";
  if (price >= 50000) return "5万円〜10万円";
  if (price >= 30000) return "3万円〜5万円";
  return "〜3万円";
}

function formatDateJa(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

function renderStars(rating, max = 5) {
  let html = '<div class="stars">';
  for (let i = 1; i <= max; i++) {
    html += `<span class="${i <= Math.round(rating) ? "" : "empty"}">★</span>`;
  }
  html += "</div>";
  return html;
}

const TRUST_BADGE_ICONS = {
  purchase:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/></svg>',
};

/** 購入証明を提出した口コミにのみバッジを表示 */
function renderReviewTrustBadges(review, options = {}) {
  if (!review.verifiedPurchase) return "";

  const large = options.large === true;
  const cls = large ? "trust-badge trust-badge--lg" : "trust-badge";
  const rowClass = large ? "trust-badges-row trust-badges-row--lg" : "trust-badges-row";
  return `<div class="${rowClass}"><span class="${cls} trust-badge--purchase" title="購入証明を提出済み">${TRUST_BADGE_ICONS.purchase}購入証明済み</span></div>`;
}

function hasAnyTrustBadge(review) {
  return Boolean(review.verifiedPurchase);
}

function getCategoryShortLabel(value) {
  return CATEGORY_SHORT_LABELS[value] || getCategoryLabel(value);
}

const RECENT_VIEWED_KEY = "recentlyViewedProducts";
const RECENT_VIEWED_MAX = 5;

function trackRecentlyViewed(productId) {
  if (!productId) return;
  let ids = [];
  try {
    ids = JSON.parse(localStorage.getItem(RECENT_VIEWED_KEY) || "[]");
  } catch {
    ids = [];
  }
  ids = ids.filter((id) => id !== productId);
  ids.unshift(productId);
  ids = ids.slice(0, RECENT_VIEWED_MAX);
  localStorage.setItem(RECENT_VIEWED_KEY, JSON.stringify(ids));
}

function getRecentlyViewedProducts() {
  let ids = [];
  try {
    ids = JSON.parse(localStorage.getItem(RECENT_VIEWED_KEY) || "[]");
  } catch {
    return [];
  }
  return ids.map((id) => getProductById(id)).filter(Boolean);
}

/** 一覧・カード表示用の集計（口コミ件数は product.reviewCount を優先） */
function getProductDisplayStats(product) {
  const summary = getProductReviewSummary(product);
  const reviews = summary.reviews;
  const displayCount = Math.max(product.reviewCount || 0, summary.reviewCount || 0);
  const rating = reviews.length ? summary.averageRating : product.averageRating;

  let proofRate = product.proofRate;
  if (reviews.length) {
    const verified = reviews.filter((r) => r.verifiedPurchase).length;
    proofRate = Math.round((verified / reviews.length) * 100);
  }
  if (proofRate == null) proofRate = 70;

  let recommendScore = rating;
  const withRec = reviews.filter((r) => r.recommendation != null);
  if (withRec.length) {
    recommendScore = withRec.reduce((s, r) => s + r.recommendation, 0) / withRec.length;
  }

  let highlightPro = product.highlightPro;
  let highlightCon = product.highlightCon;
  if (reviews.length) {
    const sorted = [...reviews].sort((a, b) => b.rating - a.rating);
    const best = sorted[0];
    highlightPro = best.pros?.[0] || highlightPro || "購入者から高評価の口コミあり";
    highlightCon = best.cons?.[0] || highlightCon || "気になる点も口コミで確認できます";
  }
  if (!highlightPro) highlightPro = "口コミを投稿して最初の1件に";
  if (!highlightCon) highlightCon = "購入前に口コミで確認しましょう";

  return {
    summary,
    displayCount,
    rating,
    proofRate,
    recommendScore,
    highlightPro,
    highlightCon,
    hasProof: proofRate >= 50,
  };
}
