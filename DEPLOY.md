# デプロイ手順(VPS + PM2)

さいころ君はDiscord WebSocket接続を保持し続ける常駐プロセスです。VPS上にNode.jsとMySQLを用意し、PM2でプロセスを常駐・自動再起動させる構成を前提にしています。

## 1. VPSの準備

- 任意のVPS(さくらのVPS、ConoHa、Lightsailなど)を用意し、Ubuntu等のLinuxをセットアップ
- Node.js(20系以上を推奨)をインストール
- MySQLをインストールし、`saikoro`データベースとアプリ用ユーザーを作成
- PM2をグローバルインストール: `npm install -g pm2`

## 2. アプリの配置

```bash
git clone https://github.com/xenepic/saikoro.git /opt/saikoro
cd /opt/saikoro
npm ci
cp .env.example .env
# .env を編集: DISCORD_BOT_TOKEN, OPENAI_API_KEY, DB_HOST/DB_NAME/DB_USER/DB_PASSWORD
npx knex migrate:latest
npm run build
```

## 3. PM2で起動

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # 出力されたコマンドを実行し、サーバー再起動時にもPM2自体を自動起動させる
```

ログは`logs/out.log` / `logs/error.log`に出力されます。`pm2 logs saikoro`でも確認できます。

## 4. 更新時の反映

```bash
cd /opt/saikoro
git pull
npm ci
npm run build
pm2 restart saikoro
```

## 補足: systemdで直接管理する場合

PM2を使わず、systemdで直接プロセスを管理したい場合は`deploy/saikoro.service`を参考にしてください(`/etc/systemd/system/`へ配置し、パスとユーザーを実環境に合わせて編集)。

## 5. GitHub Actionsによる自動デプロイ(導入済み)

`main`ブランチへの`git push`をトリガーに、GitHub Actions(`.github/workflows/deploy.yml`)がSSH経由でVPS上の上記4の手順(`git pull` → `npm ci` → `npm run build` → `pm2 restart saikoro`)を自動実行する。

- 使用アクション: `appleboy/ssh-action`
- 接続先・認証情報はリポジトリのGitHub Secretsに登録(`DEPLOY_HOST` / `DEPLOY_USER` / `DEPLOY_SSH_KEY`)
- VPS側はデプロイ専用のSSH鍵を使用し、`~/.ssh/authorized_keys`で実行可能コマンドを上記の固定コマンドのみに制限している(`command="..."`のforced command形式)。鍵が漏洩してもログインシェルの取得や任意コマンド実行はできない
- ワークフロー内の`script`の内容はforced commandにより無視され、実際にはVPS側で固定された手順のみが実行される

通常運用では`main`へpushするだけで反映され、手動でのSSHログインや上記4の手順を都度実行する必要はない。
