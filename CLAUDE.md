# CLAUDE.md

このファイルは、このリポジトリで作業する際にClaude Code (claude.ai/code) に向けたガイダンスを提供します。

## プロジェクト概要

「さいころ君」は個人運営のDiscord多機能Bot。元々はTRPG用ダイスロール(ココフォリア互換)のために作られたが、ポケモン検索・天気予報・スプラトゥーン武器検索・麻雀系クイズ・ワードウルフ・通常クイズ・ガチャ(ポイント制)・ChatGPT連携など、機能が継続的に追加されてきた。

2023年頃の素のJavaScript実装から、TypeScriptへの全面移行とコマンドのモジュール化を実施済み(旧`index.js`等のルート直下のJSファイルは廃止)。

- 言語/ランタイム: TypeScript(Node.js, CommonJS出力)
- Discordライブラリ: discord.js v14
- DB: MySQL(knex + mysql2)。`gacha`(さいころポイント)・`quiz_score`(クイズ連続正解数ランキング)テーブル
- 外部API/連携: OpenAI(ChatGPT, SDK v4系)、気象庁系XML(drk7.jp、標準fetch+xml2js)、楽天レシピ(cheerioでスクレイピング)

## セットアップと起動

```bash
npm install
cp .env.example .env   # DISCORD_BOT_TOKEN / OPENAI_API_KEY / DB_* を設定
npx knex migrate:latest   # gacha・quiz_scoreテーブルを作成(初回のみ)

npm run dev     # tsx watchで開発実行
npm run build   # tscでdist/へビルド
npm start        # dist/index.js を実行(本番用)
npm run lint     # ESLint
npm run format   # Prettier
```

MySQLサーバーが`saikoro`データベースで稼働している必要がある(`knexfile.js`参照、接続情報は環境変数化済み)。

テストは現状存在しない。CI(テスト実行)もないが、`main`へのpushをトリガーにVPSへ自動デプロイするCDパイプラインは存在する(`.github/workflows/deploy.yml`、詳細は[DEPLOY.md](./DEPLOY.md)参照)。

## ディレクトリ構成

```
.github/workflows/deploy.yml   # mainへのpushでVPSへ自動デプロイ(SSH経由、DEPLOY.md参照)
src/
  index.ts          # bootstrap: Discordクライアント生成・ログイン・イベント登録
  config/env.ts      # 環境変数の読み込みとバリデーション
  db/client.ts        # knexインスタンス
  discord/
    client.ts          # Discord Client生成(intents)
    router.ts           # messageCreateを受け取り、登録済みCommand群に振り分ける
    types.ts             # Commandインターフェース
  commands/            # 1コマンド(または密接に関連する複数コマンド)= 1ファイル
  domain/               # データ・純粋ロジック層(ポケモン/スプラトゥーン/麻雀/クイズ等のデータと計算)
  utils/                # 共通ユーティリティ(乱数・絵文字・テキスト整形・DM送信・リアクション等)
migrations/            # knexマイグレーション(gacha, quiz_score)
images/                # 麻雀牌・天気アイコン等の画像アセット
```

## アーキテクチャ上の注意点

- ルーティングは「最初に一致したものだけ処理する」ではなく、`discord/router.ts`が登録済みの`Command[]`を**すべて**評価する。複数のコマンドが同じメッセージに対して独立して反応してよい(旧実装のif分岐の連続と同じ挙動)。
- 各`Command.handle()`の例外はrouter側で個別にcatchされ、ユーザーには重い文面ではなく`utils/reactions.ts`の`reactFailure()`による絵文字リアクション(💦)のみを返す。コマンド内で独自にtry/catchして専用の文言を返したい場合のみ追加で実装する。
- Bot自身が送信したメッセージは、Embedを持つもの(天気予報の追従検索など)と`【抽選受付】`を除き、router側で処理対象外にしている(`shouldSkip`)。
- `isFromUnei(user)`(`utils/permissions.ts`)は常に`false`を返す。運営限定機能(`!stop`、麻雀フェス・スプラフェス)は意図的にこの状態を維持しており、実質誰も実行できない。
- 麻雀のシャンテン計算(`domain/mahjong.ts`の`makePattern`)は再帰の結果配列を引数で明示的に受け渡す設計にしている(旧実装はモジュールスコープのグローバル変数に蓄積していた)。
- ChatGPT機能(`commands/chatgpt.ts`)はOpenAIの Responses API(`openai.responses.create`)を使用し、`!c`発言時にスレッドを作成、そのスレッド内の発言は`!c`無しで会話を継続できる。会話履歴は`previous_response_id`でOpenAI側に委ねており、スレッドID→直前のResponse IDのマップ(`threadResponseIds`)をBotプロセスのメモリ上だけで保持している。そのため、デプロイ等でBotが再起動すると進行中の会話スレッドは文脈を失う(エラーにはならず、新規の会話として応答するだけ)。Web検索ツール(`web_search`、`tool_choice: "auto"`)も有効化しており、必要な時だけモデルが自律的に検索する。スレッドのタイトルは最初の質問を要約したもの(`generateThreadTitle`、回答取得と並行実行)を使う。旧実装(Chat Completions API)は返信チェーンを毎メッセージで再帰的に遡って履歴を構築していたため無駄な処理やトークン間引きのバグがあった。

## 開発方針

- 既存コマンドの応答内容(出力文言・絵文字)を変更する場合は、着手前にユーザーに確認する。
- 新しいコマンドは`src/commands/`に追加し、`Command`インターフェースを実装して`src/index.ts`に登録する。データ・計算ロジックは`src/domain/`に分離する。
