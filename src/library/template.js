const { Util } = require('./Util');

class template {

    constructor(){
    }

    async do(message){
        try{
            // 処理
            let output = message

            // inside a command, event listener, etc.
            // const exampleEmbed = new EmbedBuilder()
            //     .setTitle('Some title')
            //     .setURL('https://discord.js.org/')
            //     // .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
            //     .setDescription('Some description here')
            //     // .setThumbnail('https://i.imgur.com/AfFp7pu.png')
            //     .addFields(
            //         { name: 'Regular field title', value: 'Some value here' },
            //         { name: '\u200B', value: '\u200B' },
            //         { name: 'Inline field title', value: 'Some value here', inline: true },
            //         { name: 'Inline field title', value: 'Some value here', inline: true },
            //     )
            //     .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
            //     .setTimestamp()
            //     .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

            // リプライ
            return output;

        }catch(e){
            Util.error(e);
        }
    }

}

module.exports = { template };