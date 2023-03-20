const { Message, Embed } = require('discord.js');
const { Util } = require('./Util');

const { commands } = require('./command');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');

class BotFunctionBase {
    constructor(classification){
        this.classification = classification;
    }

    /**
     * メッセージから命令後を削除して本文を抽出
     * @param {Message} msg discord.jsのメッセージオブジェクト
     * @param {string} commandName コマンド名
     * @returns 命令後を削除した本文
     */
    getBodyText(msg, commandName){
        // メッセージから命令後を削除して本文を抽出
        let commandKeys = commands.find(c => c.name === commandName)?.command;
        if(!commandKeys) return '';
        let message = msg.content;
        commandKeys.forEach(key => {
            message = message.replace(key, '');
        });
        message = message.replace(/(^ )|(^　)/, '');
        return message;
    }


    /**
     * メッセージに平文をリプライする。装飾をつけることが出来る。
     * 参考：https://gist.github.com/sevenc-nanashi/67bfed2bdd0758eb20ac9bcd6fd88f84
     * @param {Message} msg リプライを送るもとのメッセージ
     * @param {string} rep 送るリプライの文章
     * @param {Object} style リプライの装飾 {normal:bool, bold:bool, underbar:bool, 
     *                                      color:'gray'|'red'|'green'|'yellow'|'blue'|'pink'|'water'|'white', 
     *                                      backcolor:'darkblue'|'orange'|'gray'|'lightgray'|'morelightgray'|'indigo'|'gray2'|'white'}
     * @returns 
     */
    async replyMessage(msg, rep, style){
        Util.log(this.classification, rep);
        if(!style){
            return msg.reply(rep);
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

        if(style.normal) return msg.reply('```\n' + rep + '\n```');
        if(style.bold) keyword.push('1');
        else if(style.underbar) keyword.push('4');
        if(style.color) keyword.push(color[style.color]);
        if(style.backcolor) keyword.push(backcolor[style.backcolor]);

        let replyText = '```ansi\n' + '[' + keyword.join(';') + 'm' + rep + '\n```';
        return msg.reply(replyText);
    }


    /**
     * メッセージにEnbedをリプライする。
     * @param {Message} msg リプライするもとのメッセージオブジェクト
     * @param {Embed} embed リプライするembedオブジェクト
     * @param {Object} imageUrls 添付画像とサムネ画像のURL {iamge:'./xxx.jpeg', thumbnail:'C:/local/folder/yyy.jpeg'}
     */
    async replyEmbed(msg, embed, imageUrls){
        console.log("00");
        let messageObj = {};
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
        console.log("01");
        // さいころ君の画像
        let authorIconUrl = './images/saikoro.png';
        let ext = authorIconUrl.split('.').pop();
        const authorIcon = new AttachmentBuilder()
            .setName('authorIconFile.' + ext)
            .setFile(authorIconUrl);
        embed.setAuthor({ name: 'さいころ君', iconURL: 'attachment://authorIconFile.' + ext});
        messageObj.files.push(authorIcon);

        messageObj.embeds = [embed];
        console.log("02");
        return msg.reply(messageObj);
    }
}

module.exports = { BotFunctionBase };