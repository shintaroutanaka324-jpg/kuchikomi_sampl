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

### パスワードリセット

Dashboard → **Authentication** → **URL Configuration**

- **Site URL**: `https://あなたのドメイン`（例: GitHub Pages の URL）
- **Redirect URLs** に以下を追加:
  - `https://あなたのドメイン/reset-password.html`
  - ローカル開発時: `http://localhost:5500/reset-password.html` など

## 5. 動作確認

1. サイトを開き **新規登録** でアカウント作成
2. Supabase Dashboard → **Authentication** → **Users** にユーザーが表示されること
3. **Table Editor** → `profiles` にユーザー名・メールが保存されること
4. ログアウト後、同じメール・パスワードで **ログイン** できること

## 保存される情報

| 場所 | 内容 |
|------|------|
| `auth.users`（Supabase管理） | メール、ハッシュ化されたパスワード |
| `public.profiles` | ユーザーID、表示名、メール |

パスワードは平文では保存されません。
