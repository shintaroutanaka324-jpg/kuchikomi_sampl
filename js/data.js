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
      "最初は半信半疑でしたが、この教材の通りに実践したところ、6ヶ月で収益化を達成できました。特に動画のサムネイル制作とSEO対策の部分が非常に参考になりました。",
    purchasePrice: 98000,
    sellerName: "株式会社山田メディア",
    hasRefundGuarantee: "yes",
    purchaseYear: 2025,
    purchaseMonth: 11,
    pros: ["具体的なアクションプランが明確", "質問サポートが充実", "実績が出やすい"],
    cons: ["価格が高め", "初心者には少し難しい部分も"],
    situation: "受講前はYouTubeに興味はあったものの、何から手を付ければいいか分からず、3回チャンネルを作っては放置していました。",
    learned: "受講後は収益化の条件をクリアし、月5万円程度の広告収入を得られるようになりました。サムネイルとタイトルの改善だけで再生数が2倍になりました。",
    recommendFor: "本気でYouTubeで収益化を目指す人。高額ですが、独学より圧倒的に時間を節約できます。",
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
    title: "内容は良いが価格が…",
    content:
      "コンテンツ自体は良質で、YouTubeの収益化に必要な知識は一通り学べます。ただ、ネットで調べればわかる内容も含まれており、この価格は少し高いと感じました。",
    purchasePrice: 98000,
    sellerName: "山田太郎チャンネル",
    hasRefundGuarantee: "unknown",
    purchaseYear: 2026,
    purchaseMonth: 1,
    pros: ["体系的なカリキュラム", "実践的な動画構成の解説"],
    cons: ["価格が高い", "一部は無料情報と重複"],
    situation: "副業としてYouTubeを始めたいと思い、無料動画だけでは限界を感じていました。",
    learned: "動画の企画から公開までの流れは整理できましたが、まだ収益化には至っていません。基礎固めにはなったと思います。",
    recommendFor: "ある程度予算に余裕があり、体系的に学びたい人向けです。",
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
      "佐藤さんのコーチングを受けて、自分の可能性を信じられるようになりました。3ヶ月のプログラムで転職も成功し、年収も200万円アップしました。",
    purchasePrice: 150000,
    sellerName: "佐藤花子コーチング",
    hasRefundGuarantee: "no",
    purchaseYear: 2025,
    purchaseMonth: 9,
    pros: ["マンツーマンで丁寧", "的確なアドバイス", "成果が出る"],
    cons: ["価格が非常に高い"],
    situation: "受講前は管理職として10年勤めましたが、キャリアの停滞感があり、転職か起業かで迷っていました。",
    learned: "受講後は強みと市場価値を言語化でき、希望していたIT企業への転職に成功。年収も200万円アップしました。",
    recommendFor: "キャリアの転換期にいる人、本気で変化を求める人におすすめです。",
    contentSatisfaction: 5,
    resultRealization: 5,
    supportQuality: 5,
    costPerformance: 4,
    recommendation: 5,
  },
  {
    id: "r4",
    productId: "2",
    userName: "匿名ユーザーG",
    age: "30代",
    rating: 4,
    date: "2026-03-22",
    verifiedPurchase: true,
    title: "起業の方向性が定まった",
    content:
      "3ヶ月間のセッションで、漠然としていた起業アイデアを具体化できました。佐藤さんの質問力が鋭く、自分では気づけない盲点を指摘してもらえます。",
    purchasePrice: 150000,
    sellerName: "佐藤花子コーチング",
    hasRefundGuarantee: "no",
    purchaseYear: 2025,
    purchaseMonth: 12,
    pros: ["起業に特化したアドバイス", "毎週の進捗管理が効く"],
    cons: ["価格が高い", "スケジュール調整に時間がかかる"],
    situation: "会社員のまま副業で小さく始めたいと思っていましたが、何を軸にすればいいか決めきれていませんでした。",
    learned: "受講後はターゲット顧客と提供サービスが明確になり、3ヶ月で初案件を獲得。月10万円の副収入を達成しました。",
    recommendFor: "起業や独立を本気で考えている会社員の方に向いています。",
    contentSatisfaction: 4.5,
    resultRealization: 4,
    supportQuality: 4.5,
    costPerformance: 3.5,
    recommendation: 4,
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
      "SNSの煽りに乗って購入しましたが、内容は一般的な恋愛テクニックの寄せ集め。同じ情報はYouTubeでも無料で得られます。",
    purchasePrice: 49800,
    sellerName: "田中恋太",
    hasRefundGuarantee: "no",
    purchaseYear: 2026,
    purchaseMonth: 2,
    pros: ["動画の見やすさ"],
    cons: ["価格に見合わない", "誇大広告感", "成果が出にくい"],
    situation: "恋愛経験が少なく、彼女ができずに悩んでいました。SNSの広告を見て購入を決めました。",
    learned: "テクニックを試しましたが、根本的な自信のなさは変わらず。結局3ヶ月で効果を実感できませんでした。",
    recommendFor: "購入前に口コミを十分読んでから判断した方がよいと思います。",
    contentSatisfaction: 3,
    resultRealization: 2,
    supportQuality: 2.5,
    costPerformance: 2,
    recommendation: 2,
  },
  {
    id: "r6",
    productId: "3",
    userName: "匿名ユーザーH",
    age: "20代",
    rating: 3,
    date: "2026-04-08",
    verifiedPurchase: false,
    title: "一部は参考になった",
    content:
      "全てが役に立ったわけではありませんが、ファッションと会話術の章は実践しやすく、デートの成功率は上がったと感じています。",
    purchasePrice: 49800,
    sellerName: "田中恋太",
    hasRefundGuarantee: "unknown",
    purchaseYear: 2025,
    purchaseMonth: 10,
    pros: ["ファッション改善の具体例", "会話例が豊富"],
    cons: ["内容のばらつき", "サポートが薄い"],
    situation: "デートはできるものの2回目以降に繋がらず、何が足りないのか分からない状態でした。",
    learned: "外見と話題選びを意識した結果、2回目デートに進める率が上がりました。彼女はまだいませんが前進は感じています。",
    recommendFor: "恋愛初心者で、まず基礎から整えたい人向けです。",
    contentSatisfaction: 3.5,
    resultRealization: 3,
    supportQuality: 2.5,
    costPerformance: 3,
    recommendation: 3,
  },
  {
    id: "r7",
    productId: "4",
    userName: "匿名ユーザーF",
    age: "50代",
    rating: 4,
    date: "2026-05-22",
    verifiedPurchase: true,
    title: "初心者には分かりやすい投資講座",
    content:
      "鈴木先生の説明は丁寧で、投資初心者の私でも理解できました。ただし高額なので、余裕資金がある方向けです。",
    purchasePrice: 79800,
    sellerName: "鈴木投資アカデミー株式会社",
    hasRefundGuarantee: "yes",
    purchaseYear: 2025,
    purchaseMonth: 8,
    pros: ["説明が分かりやすい", "カリキュラムが体系的"],
    cons: ["価格が高い", "成果は自己責任"],
    situation: "定年が近づき、老後資金のために株式投資を始めたいと思っていましたが、用語も仕組みも全く分かりませんでした。",
    learned: "受講後は証券口座を開設し、長期積立と個別株の基本が理解できました。半年でポートフォリオを組み始めています。",
    recommendFor: "投資完全初心者で、体系的に基礎から学びたい50代以降の方におすすめです。",
    contentSatisfaction: 4.5,
    resultRealization: 3.5,
    supportQuality: 4,
    costPerformance: 3.5,
    recommendation: 4,
  },
  {
    id: "r8",
    productId: "4",
    userName: "匿名ユーザーI",
    age: "30代",
    rating: 4.5,
    date: "2026-02-14",
    verifiedPurchase: true,
    title: "テクニカル分析が身についた",
    content:
      "チャートの読み方とリスク管理の考え方が特に良かったです。実践演習も多く、机上の空論ではなく使える知識が得られました。",
    purchasePrice: 79800,
    sellerName: "鈴木投資アカデミー株式会社",
    hasRefundGuarantee: "yes",
    purchaseYear: 2025,
    purchaseMonth: 6,
    pros: ["チャート分析の演習が充実", "リスク管理を重視した内容"],
    cons: ["最新の市場動向は自分で追う必要あり"],
    situation: "すでに積立投資はしていましたが、個別株の売買タイミングが分からず、損切りができずにいました。",
    learned: "損切りラインの設定とチャートパターンの読み方を学び、トレードのルールを自分で作れるようになりました。",
    recommendFor: "積立に加えて個別株にも挑戦したい中級者向けです。",
    contentSatisfaction: 4.5,
    resultRealization: 4,
    supportQuality: 4,
    costPerformance: 4,
    recommendation: 4.5,
  },
  {
    id: "r9",
    productId: "5",
    userName: "匿名ユーザーJ",
    age: "20代",
    rating: 4,
    date: "2026-05-05",
    verifiedPurchase: true,
    title: "フォロワーが3000人増えた",
    content:
      "X運用の基本からバズる投稿の型まで学べました。3ヶ月でフォロワーが500から3500人に。まだ収益化までは至っていませんが満足しています。",
    purchasePrice: 39800,
    sellerName: "高橋マーケ",
    hasRefundGuarantee: "yes",
    purchaseYear: 2025,
    purchaseMonth: 12,
    pros: ["投稿テンプレートがすぐ使える", "アルゴリズムの解説が分かりやすい"],
    cons: ["成果はジャンルによる", "更新頻度がやや低い"],
    situation: "副業で情報発信を始めたいと思い、Xアカウントは作ったもののフォロワーが100人程度で伸び悩んでいました。",
    learned: "投稿の型とリプライ戦略を実践した結果、3ヶ月でフォロワー3000人増。リスト獲得にもつながり始めました。",
    recommendFor: "Xで集客・発信を本気で伸ばしたい個人事業主や副業初心者向けです。",
    contentSatisfaction: 4,
    resultRealization: 4,
    supportQuality: 3.5,
    costPerformance: 4.5,
    recommendation: 4,
  },
  {
    id: "r10",
    productId: "5",
    userName: "匿名ユーザーK",
    age: "30代",
    rating: 3,
    date: "2026-03-30",
    verifiedPurchase: false,
    title: "伸び悩みは続いている",
    content:
      "内容自体は悪くないのですが、競合が多いジャンルでは思ったほど伸びませんでした。テンプレートは参考になりました。",
    purchasePrice: 39800,
    sellerName: "高橋マーケ",
    hasRefundGuarantee: "unknown",
    purchaseYear: 2026,
    purchaseMonth: 1,
    pros: ["コンテンツ企画の考え方", "分析ツールの使い方"],
    cons: ["個人差が大きい", "サポートがコミュニティのみ"],
    situation: "ビジネス系アカウントを運用していましたが、インプレッションが頭打ちで困っていました。",
    learned: "投稿頻度と時間帯の最適化はできましたが、フォロワー増は500人程度にとどまりました。",
    recommendFor: "まだフォロワーが少ない段階で、基礎を固めたい人には向いていると思います。",
    contentSatisfaction: 3.5,
    resultRealization: 2.5,
    supportQuality: 3,
    costPerformance: 3,
    recommendation: 3,
  },
  {
    id: "r11",
    productId: "6",
    userName: "匿名ユーザーL",
    age: "20代",
    rating: 4.5,
    date: "2026-05-12",
    verifiedPurchase: true,
    title: "理想の彼氏ができました",
    content:
      "女性向けに特化しているので、自分の状況に合ったアドバイスが多く、3ヶ月で彼氏ができました。婚活アプリの使い方も参考になりました。",
    purchasePrice: 68000,
    sellerName: "伊藤愛子",
    hasRefundGuarantee: "yes",
    purchaseYear: 2025,
    purchaseMonth: 10,
    pros: ["女性視点のアドバイス", "婚活アプリ攻略が実践的"],
    cons: ["価格はやや高め"],
    situation: "28歳で交際経験が少なく、婚活アプリを使ってもマッチング後に会えず、自信を失っていました。",
    learned: "プロフィールとメッセージの改善でマッチング率が上がり、4ヶ月で現在の彼氏と交際開始。結婚を前提に付き合っています。",
    recommendFor: "婚活中の20〜30代女性で、本気でパートナーを見つけたい方におすすめです。",
    contentSatisfaction: 4.5,
    resultRealization: 5,
    supportQuality: 4,
    costPerformance: 4,
    recommendation: 4.5,
  },
  {
    id: "r12",
    productId: "6",
    userName: "匿名ユーザーM",
    age: "30代",
    rating: 4,
    date: "2026-04-02",
    verifiedPurchase: true,
    title: "自分に合う相手の基準が定まった",
    content:
      "彼氏はまだいませんが、何を重視すべきかが明確になり、婚活のストレスが減りました。セルフイメージの章も良かったです。",
    purchasePrice: 68000,
    sellerName: "伊藤愛子",
    hasRefundGuarantee: "no",
    purchaseYear: 2026,
    purchaseMonth: 2,
    pros: ["価値観の整理ができる", "Instagram連動の課題が続けやすい"],
    cons: ["即効性は期待しすぎない方がよい"],
    situation: "30代前半で結婚を意識し始めましたが、条件ばかり見てしまい、良い出会いがありませんでした。",
    learned: "自分の譲れない条件と妥協点が整理でき、婚活の方向性が前向きになりました。",
    recommendFor: "婚活で迷いがある30代女性に向いている講座です。",
    contentSatisfaction: 4,
    resultRealization: 3.5,
    supportQuality: 4,
    costPerformance: 3.5,
    recommendation: 4,
  },
  {
    id: "r13",
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
    sellerName: "恋愛屋ジュン合同会社",
    hasRefundGuarantee: "yes",
    purchaseYear: 2025,
    purchaseMonth: 7,
    pros: ["コスパ抜群", "実体験ベース", "ボリュームがある"],
    cons: ["情報量が多くて整理が必要"],
    situation: "恋愛経験ゼロで、女性との会話すら苦手。YouTubeでジュンさんを知り購入しました。",
    learned: "外見改善とデートの流れを実践し、6ヶ月で初めて彼女ができました。自信もついて仕事にも良い影響が出ています。",
    recommendFor: "恋愛初心者で、コスパ良く総合的に学びたい20代男性におすすめです。",
    contentSatisfaction: 5,
    resultRealization: 4,
    supportQuality: 4,
    costPerformance: 5,
    recommendation: 5,
  },
  {
    id: "r14",
    productId: "7",
    userName: "匿名ユーザーN",
    age: "30代",
    rating: 4,
    date: "2026-03-18",
    verifiedPurchase: true,
    title: "復縁ではなく新しい出会いに",
    content:
      "復縁目的ではなく、新しい出会いの仕方を学びたくて受講。マッチングアプリとリアル両方の戦略が整理でき、良い出会いがありました。",
    purchasePrice: 39800,
    sellerName: "恋愛屋ジュン",
    hasRefundGuarantee: "yes",
    purchaseYear: 2025,
    purchaseMonth: 11,
    pros: ["アプリとリアル両方をカバー", "具体例が多い"],
    cons: ["動画が長く全部見るのに時間がかかる"],
    situation: "30代で離婚後、再びパートナーを探していましたが、出会いの場が限られていました。",
    learned: "プロフィール改善と初デートの進め方を実践し、3ヶ月で交際相手ができました。",
    recommendFor: "30代以降で恋愛を再スタートしたい男性に向いています。",
    contentSatisfaction: 4,
    resultRealization: 4,
    supportQuality: 3.5,
    costPerformance: 4.5,
    recommendation: 4,
  },
  {
    id: "r15",
    productId: "8",
    userName: "匿名ユーザーO",
    age: "30代",
    rating: 4.5,
    date: "2026-05-15",
    verifiedPurchase: true,
    title: "業務時間が週5時間短縮",
    content:
      "ChatGPTを使った議事録作成とメール下書きの自動化で、週5時間以上の削減ができました。プロンプト集がそのまま使えて助かります。",
    purchasePrice: 29800,
    sellerName: "AI活用ラボ",
    hasRefundGuarantee: "yes",
    purchaseYear: 2026,
    purchaseMonth: 3,
    pros: ["実務ですぐ使えるプロンプト", "業務自動化の事例が豊富"],
    cons: ["最新モデルの情報は追記待ち"],
    situation: "事務職で毎日の資料作成とメール対応に追われ、残業が続いていました。AIは触ったことがありませんでした。",
    learned: "受講後は定型的な文書作成の大半をAIで効率化。残業が週5時間減り、定時退社が増えました。",
    recommendFor: "事務・企画職でAIを業務に取り入れたい社会人におすすめです。",
    contentSatisfaction: 4.5,
    resultRealization: 4.5,
    supportQuality: 4,
    costPerformance: 5,
    recommendation: 4.5,
  },
  {
    id: "r16",
    productId: "8",
    userName: "匿名ユーザーP",
    age: "40代",
    rating: 4,
    date: "2026-04-20",
    verifiedPurchase: false,
    title: "基礎は十分学べる",
    content:
      "未経験でもプロンプトの書き方から学べました。自社への導入提案資料を作るきっかけにもなり、上司から評価されました。",
    purchasePrice: 29800,
    sellerName: "AI活用ラボ",
    hasRefundGuarantee: "unknown",
    purchaseYear: 2025,
    purchaseMonth: 9,
    pros: ["未経験者向けの丁寧な説明", "導入事例が参考になる"],
    cons: ["高度な自動化は別途学習が必要"],
    situation: "中小企業の管理職で、部下にAI活用を促す必要がありましたが、自分の知識が不足していました。",
    learned: "社内勉強会を開催し、チーム全体の生産性向上に貢献。AI推進担当を任されるようになりました。",
    recommendFor: "社内でAI導入を推進する管理職・リーダー向けです。",
    contentSatisfaction: 4,
    resultRealization: 4,
    supportQuality: 3.5,
    costPerformance: 4.5,
    recommendation: 4,
  },
  {
    id: "r17",
    productId: "9",
    userName: "匿名ユーザーQ",
    age: "30代",
    rating: 4,
    date: "2026-05-08",
    verifiedPurchase: true,
    title: "副業で月3万円達成",
    content:
      "案件獲得の流れが体系的に学べ、受講3ヶ月でライティング案件を2社獲得。月3万円の副収入になりました。",
    purchasePrice: 49800,
    sellerName: "副業コンサル田中",
    hasRefundGuarantee: "yes",
    purchaseYear: 2025,
    purchaseMonth: 11,
    pros: ["案件獲得までのロードマップ", "ポートフォリオ添削"],
    cons: ["競合が多い分野", "継続の努力が必要"],
    situation: "本業の給与だけでは不安があり、在宅でできる副業を探していました。スキルも実績もありませんでした。",
    learned: "クラウドソーシングでの提案文とポートフォリオを整え、初案件を獲得。現在は月3〜5万円を安定して稼いでいます。",
    recommendFor: "副業初心者で、在宅ワークから始めたい会社員におすすめです。",
    contentSatisfaction: 4,
    resultRealization: 4,
    supportQuality: 3.5,
    costPerformance: 4,
    recommendation: 4,
  },
  {
    id: "r18",
    productId: "9",
    userName: "匿名ユーザーR",
    age: "20代",
    rating: 3.5,
    date: "2026-02-28",
    verifiedPurchase: true,
    title: "目標の月5万には届かず",
    content:
      "内容は悪くないですが、講座名の月5万円には届いていません。月1万円程度です。それでも副業の第一歩にはなりました。",
    purchasePrice: 49800,
    sellerName: "副業コンサル田中",
    hasRefundGuarantee: "no",
    purchaseYear: 2026,
    purchaseMonth: 1,
    pros: ["副業の全体像が掴める", "コミュニティで質問できる"],
    cons: ["目標金額は個人差大", "案件単価が低い"],
    situation: "大学卒業後2年、貯金を増やしたくて副業を始めましたが、何が向いているか分かりませんでした。",
    learned: "データ入力系の案件を2件獲得し、月1万円程度の収入。スキルアップして単価を上げる段階です。",
    recommendFor: "まず副業の感覚を掴みたい20代向け。高い目標は控えめに考えた方がよいです。",
    contentSatisfaction: 3.5,
    resultRealization: 3,
    supportQuality: 3.5,
    costPerformance: 3,
    recommendation: 3.5,
  },
  {
    id: "r19",
    productId: "10",
    userName: "匿名ユーザーS",
    age: "30代",
    rating: 4.5,
    date: "2026-05-25",
    verifiedPurchase: true,
    title: "宅建に一発合格",
    content:
      "過去問演習と解説動画の組み合わせが効きました。独学6ヶ月で一発合格。解説の丁寧さは他の教材より上だと思います。",
    purchasePrice: 88000,
    sellerName: "資格のプロ佐々木",
    hasRefundGuarantee: "yes",
    purchaseYear: 2025,
    purchaseMonth: 5,
    pros: ["過去問解説が丁寧", "学習計画表が使いやすい"],
    cons: ["価格はやや高め"],
    situation: "不動産業界への転職を目指し、宅建取得が必要でした。仕事しながらの独学で不安でした。",
    learned: "計画表に沿って6ヶ月勉強し、2025年度の試験に合格。転職活動も進められています。",
    recommendFor: "仕事しながら宅建合格を目指す社会人におすすめです。",
    contentSatisfaction: 4.5,
    resultRealization: 5,
    supportQuality: 4,
    costPerformance: 4,
    recommendation: 4.5,
  },
  {
    id: "r20",
    productId: "10",
    userName: "匿名ユーザーT",
    age: "40代",
    rating: 4,
    date: "2026-03-10",
    verifiedPurchase: true,
    title: "2回目で合格できた",
    content:
      "1回目は不合格でしたが、この講座で弱点分野を克服し、2回目で合格。権利関係の解説が特に分かりやすかったです。",
    purchasePrice: 88000,
    sellerName: "資格のプロ佐々木",
    hasRefundGuarantee: "no",
    purchaseYear: 2024,
    purchaseMonth: 12,
    pros: ["権利関係の図解が秀逸", "誤答分析が役立つ"],
    cons: ["量が多く継続が大変"],
    situation: "1度宅建に挑戦して落ち、権利関係で点数が足りませんでした。",
    learned: "弱点の権利関係を重点学習し、次の試験で合格。不動産仲介の資格として活かしています。",
    recommendFor: "一度不合格で再挑戦する人、権利関係が苦手な人向けです。",
    contentSatisfaction: 4.5,
    resultRealization: 4,
    supportQuality: 4,
    costPerformance: 3.5,
    recommendation: 4,
  },
  {
    id: "r21",
    productId: "11",
    userName: "匿名ユーザーU",
    age: "30代",
    rating: 4.5,
    date: "2026-05-18",
    verifiedPurchase: true,
    title: "成約率が1.5倍に",
    content:
      "ロールプレイ形式の商談練習が実践的で、受講後3ヶ月で成約率が20%から30%に向上。営業数字が明確に改善しました。",
    purchasePrice: 68000,
    sellerName: "営業王ケン",
    hasRefundGuarantee: "yes",
    purchaseYear: 2025,
    purchaseMonth: 10,
    pros: ["ロールプレイが本格的", "クロージングの型が使える"],
    cons: ["営業経験者向けの内容が多い"],
    situation: "BtoB営業3年目で、数字が伸び悩み、上司から改善を求められていました。",
    learned: "ヒアリングとクロージングの型を身につけ、四半期の売上目標を初めて達成しました。",
    recommendFor: "営業経験1年以上で、成約率を上げたい人におすすめです。",
    contentSatisfaction: 4.5,
    resultRealization: 4.5,
    supportQuality: 4,
    costPerformance: 4,
    recommendation: 4.5,
  },
  {
    id: "r22",
    productId: "11",
    userName: "匿名ユーザーV",
    age: "20代",
    rating: 3.5,
    date: "2026-04-05",
    verifiedPurchase: false,
    title: "初心者には難しい部分も",
    content:
      "内容は良いのですが、営業未経験の私には専門用語が多く、最初の2週間はついていくのが大変でした。",
    purchasePrice: 68000,
    sellerName: "営業王ケン",
    hasRefundGuarantee: "unknown",
    purchaseYear: 2026,
    purchaseMonth: 2,
    pros: ["営業の型が学べる", "動画のテンポが良い"],
    cons: ["未経験者にはハードル高め", "価格に見合う成果はこれから"],
    situation: "新卒1年目の営業職で、商談の進め方が分からず上司に勧められて受講しました。",
    learned: "基本的な商談フローは理解できましたが、まだ実践で成果を出せる段階ではありません。",
    recommendFor: "営業経験がある人向け。未経験者は予習が必要かもしれません。",
    contentSatisfaction: 3.5,
    resultRealization: 3,
    supportQuality: 3.5,
    costPerformance: 3,
    recommendation: 3.5,
  },
  {
    id: "r23",
    productId: "12",
    userName: "匿名ユーザーW",
    age: "20代",
    rating: 4,
    date: "2026-05-02",
    verifiedPurchase: true,
    title: "Instagramから問い合わせが増えた",
    content:
      "投稿テンプレートとストーリーズの使い方を真似したら、問い合わせDMが月5件から20件に増えました。小さなサロン運営に役立っています。",
    purchasePrice: 45800,
    sellerName: "インスタマーケ美咲",
    hasRefundGuarantee: "yes",
    purchaseYear: 2025,
    purchaseMonth: 8,
    pros: ["テンプレートがそのまま使える", "リールの作り方が詳しい"],
    cons: ["アルゴリズム変更の影響大"],
    situation: "ネイルサロンを一人で経営しており、Instagram集客に頼っていましたが伸び悩んでいました。",
    learned: "リールとストーリーズの投稿頻度を上げ、フォロワーと問い合わせが増加。新規予約が2割アップしました。",
    recommendFor: "小規模店舗・個人事業主でInstagram集客を強化したい人向けです。",
    contentSatisfaction: 4,
    resultRealization: 4,
    supportQuality: 3.5,
    costPerformance: 4,
    recommendation: 4,
  },
  {
    id: "r24",
    productId: "12",
    userName: "匿名ユーザーX",
    age: "30代",
    rating: 3.5,
    date: "2026-03-25",
    verifiedPurchase: true,
    title: "ジャンルによって効果差あり",
    content:
      "美容系以外のジャンルでは参考になる部分とそうでない部分があります。ただ分析の考え方は汎用的で学びになりました。",
    purchasePrice: 45800,
    sellerName: "インスタマーケ美咲",
    hasRefundGuarantee: "no",
    purchaseYear: 2026,
    purchaseMonth: 1,
    pros: ["分析のフレームワーク", "競合リサーチの方法"],
    cons: ["美容・ライフスタイル系向け", "成果は時間がかかる"],
    situation: "士業の個人アカウントを運用していましたが、フォロワーが500人で停滞していました。",
    learned: "投稿の分析手法は身につきましたが、フォロワー増は緩やか。長期的な運用継続中です。",
    recommendFor: "美容・ライフスタイル系アカウントの運用者に特におすすめです。",
    contentSatisfaction: 3.5,
    resultRealization: 3,
    supportQuality: 3.5,
    costPerformance: 3.5,
    recommendation: 3.5,
  },
  {
    id: "r25",
    productId: "13",
    userName: "匿名ユーザーY",
    age: "30代",
    rating: 3.5,
    date: "2026-04-12",
    verifiedPurchase: true,
    title: "分析は学べたがリスクも大きい",
    content:
      "チャート分析の考え方は身につきましたが、FXはやはりリスクが高いです。講座ではリスク管理も説明されていますが、自己責任の部分が大きいです。",
    purchasePrice: 128000,
    sellerName: "トレード研究家 木村",
    hasRefundGuarantee: "no",
    purchaseYear: 2025,
    purchaseMonth: 7,
    pros: ["チャート分析が体系的", "デモ口座演習がある"],
    cons: ["高額", "損失リスクの説明が不足との声も"],
    situation: "株式投資経験者で、FXデイトレードに興味がありましたが、仕組みが分からず高額な講座に踏み切りました。",
    learned: "デモ口座で3ヶ月練習し、小ロットのリアルトレードを開始。まだ安定収益には至っていません。",
    recommendFor: "投資経験者で、FXのリスクを理解した上で学びたい人向け。初心者は慎重に。",
    contentSatisfaction: 4,
    resultRealization: 3,
    supportQuality: 3.5,
    costPerformance: 2.5,
    recommendation: 3,
  },
  {
    id: "r26",
    productId: "13",
    userName: "匿名ユーザーZ",
    age: "40代",
    rating: 3,
    date: "2026-02-20",
    verifiedPurchase: false,
    title: "期待したほどの成果は出ず",
    content:
      "高額を払った割に、リアル口座での成果は限定的でした。教材の質は悪くないですが、FXの難しさを痛感しています。",
    purchasePrice: 128000,
    sellerName: "トレード研究家 木村",
    hasRefundGuarantee: "unknown",
    purchaseYear: 2025,
    purchaseMonth: 11,
    pros: ["トレード日記の付け方", "指標の見方"],
    cons: ["非常に高額", "成果保証はない"],
    situation: "会社員の副収入としてFXを始めたいと思い、短期間で稼げるイメージがありました。",
    learned: "3ヶ月で小さな利益は出ましたが、月5万円には遠く、継続学習が必要だと痛感しました。",
    recommendFor: "高額を覚悟で、長期的にトレードスキルを磨きたい人向けです。",
    contentSatisfaction: 3.5,
    resultRealization: 2.5,
    supportQuality: 3,
    costPerformance: 2,
    recommendation: 2.5,
  },
  {
    id: "r27",
    productId: "14",
    userName: "匿名ユーザーAA",
    age: "20代",
    rating: 4.5,
    date: "2026-05-20",
    verifiedPurchase: true,
    title: "副業案件を初獲得",
    content:
      "HTML/CSS/JavaScriptの基礎からポートフォリオ作成まで伴走してもらい、受講5ヶ月でWeb制作の副業案件を初獲得しました。",
    purchasePrice: 79800,
    sellerName: "コードキャリア山本",
    hasRefundGuarantee: "yes",
    purchaseYear: 2025,
    purchaseMonth: 6,
    pros: ["ポートフォリオ添削", "案件紹介のサポート"],
    cons: ["学習期間が長い", "継続が必要"],
    situation: "文系出身でプログラミング未経験。在宅ワークできるスキルを身につけたいと思っていました。",
    learned: "5ヶ月でポートフォリオ3点を完成させ、LP制作案件（5万円）を初受注。現在は追加案件も検討中です。",
    recommendFor: "未経験からWeb制作副業を目指す人におすすめ。継続できる人向けです。",
    contentSatisfaction: 4.5,
    resultRealization: 4.5,
    supportQuality: 4.5,
    costPerformance: 4,
    recommendation: 4.5,
  },
  {
    id: "r28",
    productId: "14",
    userName: "匿名ユーザーAB",
    age: "30代",
    rating: 4,
    date: "2026-03-15",
    verifiedPurchase: true,
    title: "スキルは身についたが案件獲得はこれから",
    content:
      "コーディングスキルは確実に上がりました。ポートフォリオもできましたが、案件獲得競争は激しく、まだ受注には至っていません。",
    purchasePrice: 79800,
    sellerName: "コードキャリア山本",
    hasRefundGuarantee: "yes",
    purchaseYear: 2025,
    purchaseMonth: 9,
    pros: ["カリキュラムが段階的", "質問しやすいコミュニティ"],
    cons: ["案件獲得まで時間がかかる", "競合が多い"],
    situation: "デザイン経験はあり、Web制作に幅を広げたいと思い受講しました。",
    learned: "React基礎まで学び、ポートフォリオサイトを公開。スキル面では自信がつきました。",
    recommendFor: "デザイン経験者がWeb制作に進みたい場合に向いています。",
    contentSatisfaction: 4.5,
    resultRealization: 3.5,
    supportQuality: 4,
    costPerformance: 3.5,
    recommendation: 4,
  },
  {
    id: "r30",
    productId: "15",
    userName: "匿名ユーザーAC",
    age: "30代",
    rating: 4.5,
    date: "2026-05-28",
    verifiedPurchase: true,
    title: "実務でデータ分析ができるように",
    content:
      "Pythonとpandas、scikit-learnの基礎から実データ演習まで。受講後、社内の売上分析レポートを自動化できました。",
    purchasePrice: 98000,
    sellerName: "データサイエンス研究所",
    hasRefundGuarantee: "yes",
    purchaseYear: 2025,
    purchaseMonth: 4,
    pros: ["実データ演習が充実", "実務に直結する内容"],
    cons: ["数学の基礎がないと難しい部分も"],
    situation: "マーケティング職でExcel分析に限界を感じ、Pythonを学びたいと思っていました。",
    learned: "売上データの可視化と予測モデルを社内で構築。分析業務の工数が半分になりました。",
    recommendFor: "データ分析を仕事に活かしたい社会人、数学に苦手意識がなければおすすめです。",
    contentSatisfaction: 4.5,
    resultRealization: 4.5,
    supportQuality: 4,
    costPerformance: 4,
    recommendation: 4.5,
  },
  {
    id: "r29",
    productId: "15",
    userName: "匿名ユーザーAD",
    age: "20代",
    rating: 4,
    date: "2026-04-18",
    verifiedPurchase: true,
    title: "転職の武器になった",
    content:
      "機械学習の基礎とKaggle風の演習を経験し、データサイエンティスト職への転職活動でアピールできました。内定を2社もらえました。",
    purchasePrice: 98000,
    sellerName: "データサイエンス研究所",
    hasRefundGuarantee: "no",
    purchaseYear: 2025,
    purchaseMonth: 10,
    pros: ["転職向けポートフォリオ", "面接対策のヒント"],
    cons: ["内容が濃く時間がかかる"],
    situation: "エンジニア2年目で、データサイエンス分野にキャリアチェンジしたいと考えていました。",
    learned: "3つの分析プロジェクトをポートフォリオに追加し、データアナリスト職で内定。年収も100万円アップしました。",
    recommendFor: "エンジニアからデータ系職種への転職を目指す人におすすめです。",
    contentSatisfaction: 4.5,
    resultRealization: 4.5,
    supportQuality: 3.5,
    costPerformance: 4,
    recommendation: 4,
  },
];

function getCategoryLabel(value) {
  return CATEGORIES.find((c) => c.value === value)?.label || value;
}

let _dbProductsPublished = [];
let _dbProductsAdmin = [];
let _dbProductRegistry = [];

/** 公開サイト用: 公開中の DB サービスのみ */
function setDbProducts(products) {
  _dbProductsPublished = Array.isArray(products) ? products : [];
}

/** DB 上の全サービス id（公開サイトでデモとの重複判定に使用） */
function setDbProductRegistry(entries) {
  _dbProductRegistry = Array.isArray(entries) ? entries : [];
}

/** 運営画面用: 公開・非公開を含む DB サービス */
function setDbProductsAdmin(products) {
  _dbProductsAdmin = Array.isArray(products) ? products : [];
  if (typeof setDbProductRegistry === "function") {
    setDbProductRegistry(
      products.map((p) => ({
        id: p.id,
        isPublished: p.isPublished !== false,
      }))
    );
  }
}

/** 静的データ（data.js）と DB 登録サービスを統合（公開サイト向け） */
function getAllProducts() {
  const publishedDb = _dbProductsPublished;
  const overriddenStaticIds = new Set(_dbProductRegistry.map((p) => p.id));
  const staticOnly = PRODUCTS.filter((p) => !overriddenStaticIds.has(p.id));
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
