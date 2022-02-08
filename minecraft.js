const proc = require('child_process');

// サーバーの実行
var server = proc.spawn(
    "java",
   ['-Xms1024M', '-Xmx1024M', '-jar', 'minecraft_server.1.18.1.jar', 'nogui'],
   { cwd: "C:\\Minecraft" } // サーバーファイルのディレクトリ
);
// ログを表示する
server.stdout.on('data', function (log) {
   console.log(""+log);
});
server.stderr.on('data', function (log) {
   console.log(""+log);
});

// コマンドを実行する 以下ではhelpコマンドを実行している
server.stdin.write("help" + "\r");