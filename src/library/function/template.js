const { Message } = require('discord.js');
const { BotFunctionBase } = require('../DiscordUtil');
const { Util } = require('../Util');

class template extends BotFunctionBase {
    constructor(){
        super('TEMPLATE');
    }

    async do(msg){
        try{
            // 本文を抽出
            let message = this.getBodyText(msg, 'keytemplate');

            // 処理
            let output = message

            // リプライ
            await this.replyMessage(msg, output, {normal:true});

        }catch(e){
            Util.error(e);
            this.replyMessage(msg, 'なんか失敗したわ、もっかい頼む', {normal:true});
        }
    }

}

module.exports = { template };