const commands = [
    { name: "keyDiceRoll", kind: "other", command: ["!d", "【さいころ】", "【サイコロ】", "【ダイス】"], description: "クトゥルフ神話っぽいダイスロールを振るやで。\n例）!d 2d6\n例）!d CCB<=20 【酒値チェック】"},
    { name: "keyStop", kind: "secret", command: ["!stop"], description: ""},
    { name: "keyStart", kind: "secret", command: ["!start"], description: ""},
    { name: "keyUranai", kind: "other", command: ["!divi", "【占い】"], description: "占いするやで"},
    { name: "keyChusen", kind: "other", command: ["【抽選】"], description: "抽選するやで。\nさいころ君のリプに✋のリアクションした人の中から一人選ぶ。\n🔄押したら抽選開始。\n受付時間は5分。"},
    { name: "keyChusenUketsuke", kind: "other", command: ["【抽選受付】"], description: ""},
    { name: "keySuimin", kind: "other", command: ["【睡眠】"], description: "寝れるかどうか決めるやで。"},
    { name: "keyKishou", kind: "other", command: ["【起床】"], description: "起きれるかどうか決めるやで。"},
    { name: "keyPokeFromNameShousai", kind: "poke", command: ["!poke", "【ポケモン】"], description: "ポケモンの情報を検索するやで"},
    { name: "keyHelp", kind: "other", command: ["!help", "【コマンド】"], description: "さいころ君で使えるコマンド一覧を表示するやで"},
    { name: "keyWeather", kind: "other", command: ["!w", "【天気】"], description: "天気予報するやで。\n場所を指定することもできるで。"},
    { name: "keyLuna", kind: "other", command: ["【ルナ】"], description: "女神ルナVer.の占いをするやで"},
    { name: "keySplatoon", kind: "splatoon", command: ["!sp2", "【スプラ2】"], description: "スプラトゥーン２の情報を検索するやで。\n武器とかサブとかスペシャルを入れてや"},
    { name: "keyQuiz", kind: "other", command: ["!quiz", "【クイズ】"], description: "クイズできるやで"},
    { name: "keyQuizReset", kind: "delete", command: ["!qreset"], description: ""},
    { name: "keyQuizRanking", kind: "delete", command: ["!qranking"], description: ""},
    { name: "keyTenhou", kind: "mahjong", command: ["!tenho", "【天和】"], description: "天和チャレンジできるやで"},
    { name: "keyDoubeRiichi", kind: "mahjong", command: ["!wreach", "【ダブリー】"], description: "ダブリー一発ツモチャレンジができるやで"},
    { name: "keyQuizBambooMachiate", kind: "mahjong", command: ["!bamboo", "【バンブー】"], description: "バンブー麻雀の待ち宛クイズができるやで"},
    { name: "keyQuiz1shanten", kind: "mahjong", command: ["!nanikiru", "【何切る】"], description: "イーシャンテンから受け入れ枚数最大になる牌を当てる何切る問題ができるやで"},
    { name: "keySingleGacha", kind: "other", command: ["!gacha", "【ガチャ】"], description: "ガチャを回せるやで"},
    { name: "key10renGacha", kind: "other", command: ["!gacha10", "【10連】"], description: "10連ガチャを回せるやで"},
    { name: "keyDishGacha", kind: "other", command: ["!dish", "【料理】"], description: "おすすめ料理を検索できるやで。\nキーワードも入れれるで"},
    { name: "keyFesSplatoon", kind: "delete", command: ["【フェス】"], description: ""},
    { name: "keyFesMahjong", kind: "delete", command: ["【麻雀フェス】"], description: ""},
    { name: "keyWordWolf", kind: "other", command: ["【ワードウルフ】"], description: "ワードウルフで遊べる屋で"},
    { name: "keyDM", kind: "other", command: ["!DM"], description: "さいころ君がDMでも使えるようになるやで"},
    { name: "keyTimer", kind: "other", command: ["!timer", "【タイマー】"], description: "時間はかるやで"},
    { name: "chatGPT", kind: "chat", command: ["!c", "【会話】"], description: "さいころ君とお話できるやで。\nお返事に返信してくれたら対話が続くやで。"},
    ];

    /**
     * メッセージがコマンドであれば、コマンド名を返す
     * @param {string} message 
     * @returns {string} コマンド名
     */
    function getCommand(message){
        let command = '';
        commands.forEach(e => {
            e.command.forEach(comm => {
                if(message.startsWith(comm)) command = e.name;
            });
        });
        return command;
    }

    /**
     * メッセージから命令後を削除して本文を抽出
     * @param {string} message discord.jsのメッセージオブジェクト
     * @param {string} commandName コマンド名
     * @returns {string} 命令後を削除した本文
     */
    function getBodyText(message, commandName){
        // メッセージから命令後を削除して本文を抽出
        let commandKeys = commands.find(c => c.name === commandName)?.command;
        if(!commandKeys) return '';
        commandKeys.forEach(key => {
            message = message.replace(key, '');
        });
        message = message.replace(/(^ +)|(^　+)/, '');
        return message;
    }

module.exports = {commands, getCommand, getBodyText};