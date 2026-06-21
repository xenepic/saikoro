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

## 補足: GitHub Actionsでの自動デプロイ

`git push`時に自動でVPSへデプロイしたい場合は、GitHub ActionsからSSHで上記4の手順を実行するワークフローを別途追加できます(VPSのホスト・SSH鍵をGitHub Secretsに登録する必要があります)。必要であれば作成しますので、その際は声をかけてください。
