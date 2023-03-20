const { Util } = require('./library/Util');
const { commands } = require('./library/command');
const { Dice } = require('./library/function/Dice');
const { Divination } = require('./library/function/Divination');
const { Lottery } = require('./library/function/Lottery');

class DiscordClient{
    constructor(client){
        this.client = client;
        this.client.on('messageCreate', async msg => {
            this.parseMessage(msg);
        })
        this.client.on('ready', () => {
            Util.log('info', `${client.user.tag} でログインしています。`);
        });
        this.client.login(process?.env['DISCORD_BOT_TOKEN']);
    }

    /**
     * メッセージを解析して、コマンドだった場合各コマンド用関数を実行する
     * @param {*} msg 
     * @returns 
     */
    async parseMessage(msg){
        let command = '';
        commands.forEach(e => {
            e.command.forEach(comm => {
                if(msg.content.startsWith(comm)) command = e.name;
            });
        });
        if (!command) return ;

        switch (command) {
            case "keyDiceRoll" :
                if(!this.Dice) this.Dice = new Dice();
                this.Dice.rollDice(msg);
                break;
            case "keyStop" :
                if(msg.author.id === process?.env['ADMINISTRATOR_DISCORD_ID']){
                    Util.log('info', 'さいころ君強制終了コマンド');
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
    }


}

module.exports = { DiscordClient };