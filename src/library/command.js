const commands = [
    { name: "keyDiceRoll", title:"さいころ機能", kind: "other", command: ["【さいころ】", "【サイコロ】", "【ダイス】", "!d"], description: "クトゥルフ神話っぽいダイスロールを振るやで。\n例）!d 2d6\n例）!d CCB<=20 【酒値チェック】"},
    { name: "keyStop", title:"", kind: "secret", command: ["!stop"], description: ""},
    { name: "keyStart", title:"", kind: "secret", command: ["!start"], description: ""},
    { name: "keyUranai", title:"占い機能", kind: "other", command: [ "【占い】", "!divi"], description: "占いするやで"},
    { name: "keyChusen", title:"抽選機能", kind: "other", command: ["【抽選】"], description: "抽選するやで。\nさいころ君のリプに✋のリアクションした人の中から一人選ぶ。\n🔄押したら抽選開始。\n受付時間は5分。"},
    { name: "keySuimin", title:"睡眠チャレンジ", kind: "other", command: ["【睡眠】"], description: "寝れるかどうか決めるやで。"},
    { name: "keyPokeFromNameShousai", title:"ポケモン検索", kind: "poke", command: ["【ポケモン】", "!poke"], description: "ポケモンの情報を検索するやで"},
    { name: "keyHelp", title:"", kind: "other", command: ["【コマンド】", "!help"], description: "さいころ君で使えるコマンド一覧を表示するやで"},
    { name: "keyWeather", title:"天気予報", kind: "other", command: ["【天気】", "!w"], description: "天気予報するやで。\n場所を指定することもできるで。"},
    { name: "keyLuna", title:"ルナさん占い", kind: "other", command: ["【ルナ】"], description: "女神ルナVer.の占いをするやで"},
    { name: "keySplatoon", title:"スプラトゥーン2検索", kind: "splatoon", command: ["【スプラ2】", "!sp2"], description: "スプラトゥーン２の情報を検索するやで。\n武器とかサブとかスペシャルを入れてや"},
    { name: "keyQuiz", title:"クイズ機能", kind: "other", command: ["【クイズ】", "!quiz"], description: "クイズできるやで"},
    { name: "keyQuizReset", title:"", kind: "delete", command: ["!qreset"], description: ""},
    { name: "keyQuizRanking", title:"", kind: "delete", command: ["!qranking"], description: ""},
    { name: "keyTenhou", title:"天和チャレンジ", kind: "mahjong", command: ["【天和】", "!tenho"], description: "天和チャレンジできるやで"},
    { name: "keyDoubeRiichi", title:"ダブリーチャレンジ", kind: "mahjong", command: ["【ダブリー】", "!wreach"], description: "ダブリー一発ツモチャレンジができるやで"},
    { name: "keyQuizBambooMachiate", title:"バンブーなに切るクイズ", kind: "mahjong", command: ["【バンブー】", "!bamboo"], description: "バンブー麻雀の待ち宛クイズができるやで"},
    { name: "keyQuiz1shanten", title:"なに切るクイズ", kind: "mahjong", command: ["【何切る】", "!nanikiru"], description: "イーシャンテンから受け入れ枚数最大になる牌を当てる何切る問題ができるやで"},
    { name: "keySingleGacha", title:"ガチャ機能", kind: "other", command: ["【ガチャ】", "!gacha"], description: "ガチャを回せるやで"},
    { name: "key10renGacha", title:"10連ガチャ機能", kind: "other", command: ["【10連】", "!gacha10"], description: "10連ガチャを回せるやで"},
    { name: "keyDishGacha", title:"お料理検索", kind: "other", command: ["【料理】", "!dish"], description: "おすすめ料理を検索できるやで。\nキーワードも入れれるで"},
    { name: "keyFesSplatoon", title:"", kind: "delete", command: ["【フェス】"], description: ""},
    { name: "keyFesMahjong", title:"", kind: "delete", command: ["【麻雀フェス】"], description: ""},
    { name: "keyWordWolf", title:"ワードウルフ機能", kind: "other", command: ["【ワードウルフ】"], description: "ワードウルフで遊べる屋で"},
    { name: "keyDM", title:"DM機能", kind: "other", command: ["【DM】", "!DM"], description: "さいころ君がDMでも使えるようになるやで"},
    { name: "keyTimer", title:"タイマー機能", kind: "other", command: ["【タイマー】", "!timer"], description: "時間はかるやで"},
    { name: "chatGPT", title:"会話機能", kind: "chat", command: ["【会話】", "!c"], description: "さいころ君とお話できるやで。\nお返事に返信してくれたら対話が続くやで。"},
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