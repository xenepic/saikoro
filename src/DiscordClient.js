const { Util } = requre('./livrary/Util');
const { commands } = requre('./livrary/command');

class DiscordClient{
    constructor(client){
        this.client = client;
        this.client.on('messageCreate', async msg => {
    
        })
        this.client.on('ready', () => {
            console.log(`${client.user.tag} でログインしています。`);
        });
        this.client.login(process?.env['DISCORD_BOT_TOKEN']);
    }

    /**
     * メッセージがコマンドメッセージだった場合、
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
                break;
            case "keyStop" :
                break;
            case "keyUranai" :
                break;
            case "keyChusen" :
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