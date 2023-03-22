const { Client, Events } = require('discord.js');
const { Util } = require('./library/Util');
const { DiscordUtil } = require('./library/DiscordUtil');
const { getCommand, getBodyText } = require('./library/command');
const { Random } = require('./library/Random');
const { Divination } = require('./library/Divination');
const { Lottery } = require('./library/discord/Lottery');

/**
 * discordのclientクラス
 * clientにログインし、メッセージを解析して、それがコマンドの場合
 * 各ライブラリの関数を実行してそのレスポンスをリプライする
 */
class DiscordClient{

    /**
     * コンストラクタ
     * @param {Client} client discordのクライアントオブジェクト 
     */
    constructor(client){
        this.acceptable = true;
        this.client = client;

        this.init();        
    }

    /**
     * 初期処理
     */
    init(){
        // メッセージ検出時の処理
        this.client.on(Events.MessageCreate, async msg => {
            // !startコマンドのみここで解析
            if(!this.acceptable && 
                msg.author.id === process?.env['ADMINISTRATOR_DISCORD_ID'] && 
                getCommand(msg.content) === 'keyStart') this.acceptable = true;
            if(this.acceptable) this.parseMessage(msg);
        });

        // リアクション付与検出時の処理


        // クライアントログイン完了時の処理
        this.client.on(Events.ClientReady, () => {
            Util.log(`${this.client.user.tag} でログインしています。`);
        });

        // クライアントにログイン
        this.client.login(process?.env['DISCORD_BOT_TOKEN']);
    }

    /**
     * メッセージを解析して、コマンドだった場合実行結果を取得し、msgにリプライする
     * @param {*} msg 
     * @returns 
     */
    async parseMessage(msg){
        let command = getCommand(msg.content);
        let message = getBodyText(msg.content, command);
        if (!command) return ;
        let response;

        switch (command) {
            case "keyDiceRoll" : // ダイスロール
                if(!this.Random) this.Random = new Random();
                response = await this.Random.rollDice(message);
                if(response){
                    let style;
                    if (response.isComparison) {
                        if (response.isSuccess) style = {color:'green'};
                        else style = {color:'red'};
                    } else {
                        style = {normal:true};
                    }
                    DiscordUtil.replyText(msg, response.text, style);
                }
                break;
            case "keyStop" :
                if(msg.author.id === process?.env['ADMINISTRATOR_DISCORD_ID']){
                    Util.log('さいころ君停止コマンド');
                    await msg.reply('さいころ君を停止します');
                    this.acceptable = false;
                }
                break;
            case "keyStart" :
                if(msg.author.id === process?.env['ADMINISTRATOR_DISCORD_ID']){
                    Util.log('さいころ君再稼働コマンド');
                    await msg.reply('さいころ君を再稼働します');
                }
                break;
            case "keyUranai" :
                if(!this.Divination) this.Divination = new Divination();
                response = await this.Divination.doDivination(msg.author.username);
                if(response) DiscordUtil.replyText(msg, response, {normal:true});
                break;
            case "keyChusen" :
                if(!this.Lottery) this.Lottery = new Lottery();
                this.Lottery.acceptLots(msg);
                break;
            case "keySuimin" :
                if(!this.Random) this.Random = new Random();
                response = await this.Random.goToBed(message);                
                DiscordUtil.replyText(msg, response.text, response.style);
                break;
            case "keyKishou" :
                break;
            case "keyPokeFromNameShousai" :
                break;
            case "keyHelp" :
                break;
            case "keyWeather" :
                break;
            case "keyLuna" :
                break;
            case "keySplatoon" :
                break;
            case "keyQuiz" :
                break;
            case "keyQuizReset" :
                break;
            case "keyQuizRanking" :
                break;
            case "keyTenhou" :
                break;
            case "keyDoubeRiichi" :
                break;
            case "keyQuizBambooMachiate" :
                break;
            case "keyQuiz1shanten" :
                break;
            case "keySingleGacha" :
                break;
            case "key10renGacha" :
                break;
            case "keyDishGacha" :
                break;
            case "keyFesSplatoon" :
                break;
            case "keyFesMahjong" :
                break;
            case "keyWordWolf" :
                break;
            case "keyDM" :
                break;
            case "keyTimer" :
                break;
            case "chatGPT" :
                break;
        }

    }
    
    isRestartCommand(msg){

    }


}

module.exports = { DiscordClient };