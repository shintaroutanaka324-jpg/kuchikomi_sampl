# Supabase 認証セットアップ

カウマエの新規登録・ログインは Supabase Auth でユーザー情報を管理します。

## 1. Supabase プロジェクトを作成

1. [Supabase](https://supabase.com) にログイン
2. **New project** でプロジェクトを作成

## 2. データベースを準備

1. Dashboard → **SQL Editor**
2. `supabase/schema.sql` の内容を貼り付けて **Run**

## 3. 接続情報を設定

1. Dashboard → **Settings** → **API**
2. **Project URL** と **anon public** key をコピー
3. `js/supabase-config.js` の `url` と `anonKey` に貼り付け

```javascript
window.SUPABASE_CONFIG = {
  url: "https://xxxxxxxx.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
};
```

> anon key はフロントエンドに公開されるキーです。Row Level Security で保護されています。

## 4. 認証設定（推奨）

Dashboard → **Authentication** → **Providers** → **Email**

| 設定 | 開発時 | 本番時 |
|------|--------|--------|
| Confirm email | OFF（すぐログイン可能） | ON（メール確認を推奨） |
| Secure email change | ON | ON |

### URL Configuration（重要）

Dashboard → **Authentication** → **URL Configuration**

**Site URL**（末尾スラッシュ付き・`/index` は付けない）:

```
https://shintaroutanaka324-jpg.github.io/kuchikomi_sampl/
```

**Redirect URLs** に以下をすべて追加:

```
https://shintaroutanaka324-jpg.github.io/kuchikomi_sampl/**
https://shintaroutanaka324-jpg.github.io/kuchikomi_sampl/auth-callback.html
https://shintaroutanaka324-jpg.github.io/kuchikomi_sampl/reset-password.html
```

ローカル開発時は例:

```
http://localhost:5500/**
http://localhost:5500/kuchikomi_sampl/**
```

メール確認リンクは `auth-callback.html` に戻り、そこでログイン状態になります。

## 5. メール重複チェック（新規登録）

SQL Editor で `supabase/schema-email-check.sql` を実行してください。  
登録済みメールで新規登録しようとしたときに、正しくエラーを表示できます。

## 6. 口コミ投稿・審査のセットアップ

1. SQL Editor で `supabase/schema-reviews.sql` を実行
2. **Storage** → `purchase-proofs` バケットが作成されていることを確認

### 運営者アカウントの設定

SQL Editor で、運営担当者のメールアドレスに管理者権限を付与します。

```sql
update public.profiles
set is_admin = true
where email = 'あなたの運営用メール@example.com';
```

運営者でログイン後、ヘッダーメニューから **口コミ審査（運営）** → `/admin.html` にアクセスできます。

## 7. 動作確認

### ユーザー登録

1. サイトを開き **新規登録** でアカウント作成
2. Supabase Dashboard → **Authentication** → **Users** にユーザーが表示されること
3. **Table Editor** → `profiles` にユーザー名・メールが保存されること
4. ログアウト後、同じメール・パスワードで **ログイン** できること

### 口コミ投稿フロー

1. ログイン後 **口コミを投稿** から内容を送信
2. `submitted_reviews` テーブルに `status = pending` で保存されること
3. 購入証明を添付した場合、`purchase-proofs` ストレージにファイルが保存されること
4. **投稿した口コミ** ページで「審査中」と表示されること
5. 運営者が **口コミ審査** で「承認して公開」
6. `status = approved` になり、紐づけたサービス詳細ページに口コミが表示されること

## 保存される情報

| 場所 | 内容 |
|------|------|
| `auth.users`（Supabase管理） | メール、ハッシュ化されたパスワード |
| `public.profiles` | ユーザーID、表示名、メール、運営者フラグ |
| `public.submitted_reviews` | 口コミ本文・評価・審査ステータス |
| `storage.purchase-proofs` | 購入証明ファイル（非公開） |

パスワードは平文では保存されません。口コミは **運営承認後** にのみ公開されます。
