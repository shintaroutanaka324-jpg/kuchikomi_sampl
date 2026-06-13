# Stripe 課金セットアップ（カウマエ）

月額 **880円（税込）** のサブスクリプションで口コミ全文を閲覧できる機能です。

## アーキテクチャ

```
[ブラウザ] → BillingApi.startCheckout()
    → [Edge Function: create-checkout-session] → Stripe Checkout
    → 決済完了 → Webhook → [Edge Function: stripe-webhook]
    → profiles.is_paid = true
```

Stripe 秘密鍵は **Edge Functions の Secrets のみ** に保存し、フロントエンドには置きません。

---

## 1. SQL の実行

Supabase SQL Editor で順に実行:

1. `schema-stripe.sql`（課金カラム・トリガー・RLS保護）

---

## 2. Stripe アカウント設定

1. [Stripe Dashboard](https://dashboard.stripe.com/) でアカウント作成
2. **商品** → 月額 **880円** のサブスクリプション Price を作成
3. Price ID（`price_...`）を控える
4. **開発者** → API キー → シークレットキー（`sk_test_...`）を控える

---

## 3. Edge Functions のデプロイ

[Supabase CLI](https://supabase.com/docs/guides/cli) をインストール後:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook --no-verify-jwt
```

> `stripe-webhook` は Stripe からの呼び出しのため JWT 検証を無効化します。

### Secrets の設定（Dashboard → Edge Functions → Secrets）

| 名前 | 値 |
|------|-----|
| `STRIPE_SECRET_KEY` | `sk_live_...` または `sk_test_...` |
| `STRIPE_PRICE_ID` | `price_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...`（Webhook 作成後） |
| `SUPABASE_SERVICE_ROLE_KEY` | Settings → API → service_role |

---

## 4. Stripe Webhook の設定

Stripe Dashboard → **開発者** → **Webhook** → エンドポイントを追加:

```
https://YOUR_PROJECT_REF.supabase.co/functions/v1/stripe-webhook
```

受信イベント:

- `checkout.session.completed`
- `customer.subscription.deleted`
- `invoice.payment_failed`

署名シークレット（`whsec_...`）を `STRIPE_WEBHOOK_SECRET` に設定。

---

## 5. リダイレクト URL

Checkout の成功・キャンセル URL（コード内で自動設定）:

| 種別 | URL |
|------|-----|
| 成功 | `https://www.kaumae-info.com/?payment=success` |
| キャンセル | `https://www.kaumae-info.com/?payment=cancel` |

---

## 6. 動作確認チェックリスト

- [ ] 未ログインで「月額880円」ボタン → ログインへ誘導
- [ ] ログイン後 → Stripe Checkout へ遷移
- [ ] テストカードで決済 → `?payment=success` に戻る
- [ ] `profiles.is_paid = true` になる
- [ ] 口コミ全文・評価ポイントが表示される
- [ ] ヘッダーに「有料会員」バッジ
- [ ] 口コミ投稿済みユーザーも全文閲覧可能
- [ ] 未課金・未投稿はぼかし表示

### Stripe テストカード

```
4242 4242 4242 4242
```

---

## 7. Stripe 未登録時（デモ）

Edge Functions にプレースホルダーキーが入っている間は:

- 料金ページの UI は表示される
- 決済ボタン押下時に「Stripe はまだ設定されていません」と表示

`js/supabase-config.js` の `billingEnabled: false` にすると UI 確認のみ可能。

---

## 8. 本番切り替え時

1. Stripe を本番モードに切り替え
2. 本番の `STRIPE_SECRET_KEY` / `STRIPE_PRICE_ID` を Secrets に設定
3. 本番 Webhook エンドポイントを登録
4. テスト決済で end-to-end 確認
