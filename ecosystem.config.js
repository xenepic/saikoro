// PM2用の設定ファイル。
// 使い方:
//   npm run build
//   pm2 start ecosystem.config.js
//   pm2 save && pm2 startup   # サーバー再起動時にも自動起動させる場合
module.exports = {
  apps: [
    {
      name: 'saikoro',
      script: 'dist/index.js',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
      },
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000,
      // 落ちたメッセージのログ
      out_file: 'logs/out.log',
      error_file: 'logs/error.log',
      time: true,
    },
  ],
};
