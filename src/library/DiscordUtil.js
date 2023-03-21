const { Message, Embed } = require('discord.js');
const { Util } = require('./Util');

const { AttachmentBuilder, EmbedBuilder } = require('discord.js');

class DiscordUtil {
    /**
     * メッセージに平文をリプライする。装飾をつけることが出来る。
     * 参考：https://gist.github.com/sevenc-nanashi/67bfed2bdd0758eb20ac9bcd6fd88f84
     * @param {Message} msg リプライを送るもとのメッセージ
     * @param {string} text 送るリプライの文章
     * @param {Object} style リプライの装飾 {normal:bool, bold:bool, underbar:bool, 
     *                                      color:'gray'|'red'|'green'|'yellow'|'blue'|'pink'|'water'|'white', 
     *                                      backcolor:'darkblue'|'orange'|'gray'|'lightgray'|'morelightgray'|'indigo'|'gray2'|'white'}
     * @returns 
     */
    static async replyText(msg, text, style){
        Util.log(text);
        if(!style){
            return msg.reply(text);
        }
        let keyword =[];
        let color = {
            gray : 30,
            red : 31,
            green : 32,
            yellow : 33,
            blue : 34,
            pink : 35,
            water : 36,
            white : 37
        };
        let backcolor = {
            darkblue : 40,
            orange : 41,
            gray : 42,
            lightgray : 43,
            morelightgray : 44,
            indigo : 45,
            gray2 : 46,
            white : 47
        };

        if(style.normal) return msg.reply('```\n' + text + '\n```');
        if(style.bold) keyword.push('1');
        else if(style.underbar) keyword.push('4');
        if(style.color) keyword.push(color[style.color]);
        if(style.backcolor) keyword.push(backcolor[style.backcolor]);

        let replyText = '```ansi\n' + '[' + keyword.join(';') + 'm' + text + '\n```';
        return msg.reply(replyText);
    }


    /**
     * メッセージにEnbedをリプライする。
     * @param {Message} msg リプライするもとのメッセージオブジェクト
     * @param {Embed} embed リプライするembedオブジェクト
     * @param {Object} imageUrls 添付画像とサムネ画像のURL {iamge:'./xxx.jpeg', thumbnail:'C:/local/folder/yyy.jpeg'}
     */
    static async replyEmbed(msg, embed, imageUrls){
        let messageObj = {};
        Util.log(`${embed.title}\n${embed.description}`);
        messageObj.files = [];
        // 添付画像
        if(imageUrls.image){
            let ext = imageUrls.image.split('.').pop();
            const attachment = new AttachmentBuilder()
                .setName('attachmentFile.' + ext)
                .setFile(imageUrls.image);
            embed.setImage('attachment://attachmentFile.' + ext);
            messageObj.files.push(attachment);
        }
        // サムネイル画像
        if(imageUrls.thumbnail){
            let ext = imageUrls.thumbnail.split('.').pop();
            const thumbnail = new AttachmentBuilder()
                .setName('thumbnailFile.' + ext)
                .setFile(imageUrls.thumbnail);
            embed.setThumbnail('attachment://thumbnailFile.' + ext);
            messageObj.files.push(thumbnail);
        }
        // さいころ君の画像
        let authorIconUrl = './images/saikoro.png';
        let ext = authorIconUrl.split('.').pop();
        const authorIcon = new AttachmentBuilder()
            .setName('authorIconFile.' + ext)
            .setFile(authorIconUrl);
        embed.setAuthor({ name: 'さいころ君', iconURL: 'attachment://authorIconFile.' + ext});
        messageObj.files.push(authorIcon);

        messageObj.embeds = [embed];
        return msg.reply(messageObj);
    }
}

module.exports = { DiscordUtil };