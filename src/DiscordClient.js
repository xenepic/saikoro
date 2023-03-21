const { Util } = require('./library/Util');
const { DiscordUtil } = require('./library/DiscordUtil');
const {commands, getBodyText} = require('./library/command');
const { Dice } = require('./library/function/Dice');
const { Divination } = require('./library/function/Divination');
const { Lottery } = require('./library/function/Lottery');

class DiscordClient{
    constructor(client){
        this.client = client;
        this.client.on('messageCreate', async msg => {
            console.log(msg);
            this.parseMessage(msg);
        })
        this.client.on('ready', () => {
            Util.log(`${client.user.tag} でログインしています。`);
        });
        this.client.login(process?.env['DISCORD_BOT_TOKEN']);
    }

    /**
     * メッセージを解析して、コマンドだった場合実行結果を取得し、msgにリプライする
     * @param {*} msg 
     * @returns 
     */
    async parseMessage(msg){
        console.log("AAA" + msg.content);
        let command = '';
        commands.forEach(e => {
            e.command.forEach(comm => {
                if(msg.content.startsWith(comm)) command = e.name;
            });
        });
        if (!command) return ;
        let replyTextObject;
        let replyEmbedObject;

        switch (command) {
            case "keyDiceRoll" : // ダイスロール
                if(!this.Dice) this.Dice = new Dice();
                let response = await this.Dice.rollDice(msg.content);
                if(response){
                    let style;
                    if (response.isComparison) {
                        if (response.isSuccess) style = {color:'green'};
                        else style = {color:'red'};
                    } else {
                        style = {normal:true};
                    }
                    replyTextObject = {
                        text: response.text,
                        style: style
                    };
                }
                break;
            case "keyStop" :
                if(msg.author.id === process?.env['ADMINISTRATOR_DISCORD_ID']){
                    Util.log('さいころ君強制終了コマンド');
                    await msg.reply('ばいば～い');
                    await this.client.destroy();
                }
                break;
            case "keyUranai" :
                if(!this.Divination) this.Divination = new Divination();
                this.Divination.doDivination(msg);
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
        if(replyTextObject){
            await DiscordUtil.replyText(msg, replyTextObject.text, replyTextObject.style);
        }
    }


}

module.exports = { DiscordClient };