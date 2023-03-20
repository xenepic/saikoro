const { Message } = require('discord.js');
const { BotFunctionBase } = require('../BotFunctionBase');
const { Util } = require('../Util');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');


class Lottery extends BotFunctionBase {
    constructor(){
        super('TEMPLATE');
    }

    async do(msg){
        try{
            // 本文を抽出
            let message = this.getBodyText(msg, 'keytemplate');

            // 処理
            let output = message

            // at the top of your file
            

            // inside a command, event listener, etc.
            const exampleEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Some title')
                .setURL('https://discord.js.org/')
                // .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
                .setDescription('Some description here')
                // .setThumbnail('https://i.imgur.com/AfFp7pu.png')
                .addFields(
                    { name: 'Regular field title', value: 'Some value here' },
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Inline field title', value: 'Some value here', inline: true },
                    { name: 'Inline field title', value: 'Some value here', inline: true },
                )
                .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
                .setTimestamp()
                .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

            this.replyEmbed(msg, exampleEmbed, {thumbnail:'C:/sample/saikoro/makoto.jpg'});

        }catch(e){
            Util.error(e);
            this.replyMessage(msg, 'なんか失敗したわ、もっかい頼む', {normal:true});
        }
    }

}

module.exports = { Lottery };