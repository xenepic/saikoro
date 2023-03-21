const { Client } = require('discord.js');
const { Util } = require('./library/Util');
const { DiscordUtil } = require('./library/DiscordUtil');
const {commands, getCommand, getBodyText} = require('./library/command');
const { Dice } = require('./library/function/Dice');
const { Divination } = require('./library/function/Divination');
const { Lottery } = require('./library/function/Lottery');

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
        this.client.on('messageCreate', async msg => {
            // !startコマンドのみここで解析
            if(!this.acceptable && 
                msg.author.id === process?.env['ADMINISTRATOR_DISCORD_ID'] && 
                getCommand(msg.content) === 'keyStart') this.acceptable = true;
            if(this.acceptable) this.parseMessage(msg);
        })
        this.client.on('ready', () => {
            Util.log(`${this.client.user.tag} でログインしています。`);
        });
        this.client.login(process?.env['DISCORD_BOT_TOKEN']);
    }

    /**
     * メッセージを解析して、コマンドだった場合実行結果を取得し、msgにリプライする
     * @param {*} msg 
     * @returns 
     */
    async parseMessage(msg){
        let message;
        let command = getCommand(msg.content);
        if (!command) return ;
        let response;

        switch (command) {
            case "keyDiceRoll" : // ダイスロール
                message = getBodyText(msg, 'keyDiceRoll');
                if(!this.Dice) this.Dice = new Dice();
                response = await this.Dice.rollDice(msg.content);
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
                response = await this.Divination.doDivination(msg);
                if(response) DiscordUtil.replyText(msg, response, {normal:true});
                break;
            case "keyChusen" :
                if(!this.Lottery) this.Lottery = new Lottery();
                this.Lottery.do(msg);
                break;
            case "keyChusenUketsuke" :
                break;
            case "keySuimin" :
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