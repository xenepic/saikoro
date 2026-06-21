import 'dotenv/config';

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`環境変数 ${key} が設定されていません。.envを確認してください。`);
  }
  return value;
}

export const env = {
  discordBotToken: requireEnv('DISCORD_BOT_TOKEN'),
  openaiApiKey: process.env.OPENAI_API_KEY,
  db: {
    host: process.env.DB_HOST ?? '127.0.0.1',
    name: process.env.DB_NAME ?? 'saikoro',
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD,
  },
};
