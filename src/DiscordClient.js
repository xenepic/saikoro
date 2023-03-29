const { Client, Events, User, EmbedBuilder } = require('discord.js');
const { Util } = require('./library/Util');
const { DiscordUtil } = require('./library/DiscordUtil');
const { commands, getCommand, getBodyText } = require('./library/command');
const { Random } = require('./library/Random');
const { Divination } = require('./library/Divination');
const { ChatGPT } = require('./library/ChatGPT');
const { Lottery } = require('./library/discord/Lottery');
const { DiscordWeatherForecast } = require('./library/discord/DiscordWeatherForecast');

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
                DiscordUtil.isAdministrator(msg.author) && 
                getCommand(msg.content) === 'keyStart') this.acceptable = true;
            if(this.acceptable) this.parseMessage(msg);
        });

        // クライアントログイン完了時の処理
        this.client.on(Events.ClientReady, () => {
            Util.log(`${this.client.user.tag} でログインしています。`);
        });

        // クライアントにログイン
        this.client.login(process?.env['DISCORD_BOT_TOKEN']);
    }

    /**
     * メッセージを解析して、コマンドだった場合実行結果を取得し、msgにリプライする
     * @param {Message} msg 
     * @returns 
     */
    async parseMessage(msg){

        // botのメッセージは処理しない
        if(msg.author.bot) return;

        // コマンドメッセージの場合コマンドを取得
        let command = getCommand(msg.content);

        // メッセージが返信の場合、返信元の一番最初のメッセージのコマンドを取得する
        let messages = [msg];
        if(!command && msg.reference){
            let msg_p = msg;
            let chan = await this.client.channels.fetch(msg.channelId);
            while(msg_p.reference){
                msg_p = await chan.messages.fetch(msg_p.reference.messageId);
                if(msg_p) messages.push(msg_p);
            }
            messages.reverse();
            command = getCommand(messages[0].content);
        }

        // コマンドメッセージではない場合は処理しない
        if(!command) return;

        let bodyText = getBodyText(msg.content, command);
        let response;

        switch (command) {
            case "keyDiceRoll" : // ダイスロール
                if(!this.Random) this.Random = new Random();
                response = await this.Random.rollDice(bodyText);
                if(response){
                    let style;
                    if (response.isComparison) {
                        if (response.isSuccess) style = {color:'green'};
                        else style = {color:'red'};
                    } else {
                        style = {normal:true};
                    }
                    DiscordUtil.replyCodeText(msg, [{text:response.text, style}]);
                }else{
                    DiscordUtil.replyErrorMessage(msg);
                }
                break;
            case "keyStop" : // さいころ君停止機能
                if(DiscordUtil.isAdministrator(msg.author)){
                    Util.log('さいころ君停止コマンド');
                    await msg.reply('さいころ君を停止します');
                    this.acceptable = false;
                }
                break;
            case "keyStart" : // さいころ君再開機能
                if(DiscordUtil.isAdministrator(msg.author)){
                    Util.log('さいころ君再稼働コマンド');
                    await msg.reply('さいころ君を再稼働します');
                }
                break;
            case "keyUranai" : // 占い機能
                if(!this.Divination) this.Divination = new Divination();
                response = await this.Divination.doDivination(msg.author.username);
                if(response) DiscordUtil.replyCodeText(msg, [{text:response, style:{normal:true}}]);
                break;
            case "keyChusen" : // 抽選機能
                if(!this.Lottery) this.Lottery = new Lottery();
                this.Lottery.acceptLots(msg);
                break;
            case "keySuimin" : // 睡眠チャレンジ
                if(!this.Random) this.Random = new Random();
                response = await this.Random.goToBed(bodyText);                
                DiscordUtil.replyCodeText(msg, [response]);
                break;
            case "keyPokeFromNameShousai" :
                break;
            case "keyHelp" : // ヘルプ表示機能
                let textArr = [];
                textArr.push({
                    text: 'さいころ君で使えるコマンド一覧です。\nコマンド名：コマンド1, コマンド2, ...'
                });
                textArr.push({
                    codeArray:[{text: 'コマンドの説明', style:{normal:true}}]
                });
                textArr.push({
                    text: '\nとなっています\n\n'
                });
                commands.filter(command=>command.title && command.kind != 'secret').forEach((command, index) => {
                    textArr.push({
                        text: '\n' + command.title + '：' + command.command.join(', ') + '\n'
                    });
                    textArr.push({
                        codeArray:[{text: command.description, style:{normal:true}}]
                    });
                });
                DiscordUtil.replyComplexText(msg, textArr);
                break;
            case "keyWeather" :
                DiscordWeatherForecast.showWeatherForecast(msg, bodyText);
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
            case "chatGPT" : // chatGPTでおしゃべり機能
                // 受付完了のリアクション
                msg.react(Util.emoji.arrows_counterclockwise);

                // リプライツリーをchatGPT用に整形
                messages = messages.map(messageIt => {
                    return {
                        role: messageIt.author.bot ? 'assistant' : 'user',
                        content: getBodyText(messageIt.content, command)
                    }
                });
                // 管理者以外は1000文字までの制限付き
                if(!DiscordUtil.isAdministrator(msg.author)){
                    while(messages.length!==1 && messages.reduce((sum,message)=>message.content.length+sum,0)>=1000){
                        messages = messages.slice(1);
                    }
                }

                // chatGPTの返答を取得
                if(!this.ChatGPT) this.ChatGPT = new ChatGPT();
                response = await this.ChatGPT.getAnswer(messages);

                // リプライ
                if(response) await DiscordUtil.replyText(msg, response);
                else await DiscordUtil.replyErrorMessage(msg);

                // 受付完了リアクション除去
                msg.reactions.resolve(Util.emoji.arrows_counterclockwise).users.remove(this.client.user.id);
                break;
        }

    }
    
    




}

module.exports = { DiscordClient };