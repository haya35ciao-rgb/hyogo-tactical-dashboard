# HYOGO Tactical Dashboard — GitHub → Vercel版

このフォルダをそのままGitHubリポジトリ直下へpushし、VercelからImportしてください。

## 構成
- `index.html` : ダッシュボード
- `api/data.js` : Vercel Function。共有データのGET/PUT
- `vercel.json` : セキュリティヘッダー
- `package.json`

## 共有データ
Upstash Redisを利用します。

Vercel Marketplaceから Upstash Redis をプロジェクトへ接続すると、
次の環境変数を利用できます。

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

さらにVercelの Project Settings → Environment Variables で次を追加:

- `ADMIN_TOKEN` = 監督・コーチだけが知る長いパスコード

環境変数追加後は再デプロイしてください。

## GitHub → Vercel
1. GitHubで新規リポジトリ作成
2. このフォルダの中身をpush
3. Vercel → Add New → Project
4. GitHubリポジトリをImport
5. Framework Preset: Other
6. Build Command: 空欄
7. Output Directory: 空欄
8. Deploy
9. Upstash RedisをVercel Marketplaceから接続
10. `ADMIN_TOKEN`を設定
11. Redeploy

## 運用
- 選手: Vercel URLを開いて閲覧
- 監督・コーチ: 右上の「監督・コーチ」→ ADMIN_TOKENを入力して編集
- 保存内容はRedisに保存され、全員の同じURLへ反映されます

## 注意
管理者パスコードやRedisのTokenはGitHubへコミットしないでください。
