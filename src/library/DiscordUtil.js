const { Message, Embed } = require('discord.js');
const { Util } = require('./Util');

const { AttachmentBuilder, EmbedBuilder } = require('discord.js');

class DiscordUtil {

    static color = {
        gray : 30,
        red : 31,
        green : 32,
        yellow : 33,
        blue : 34,
        pink : 35,
        water : 36,
        white : 37
    };
    static backcolor = {
        darkblue : 40,
        orange : 41,
        gray : 42,
        lightgray : 43,
        morelightgray : 44,
        indigo : 45,
        gray2 : 46,
        white : 47
    };

    /**
     * メッセージに平文をリプライする。
     * @param {Message} msg 返信するDiscordメッセージオブジェクト
     * @param {string} text 返信するテキスト
     * @returns {Message}
     */
    static async replyText(msg, text){
        try{
            Util.log(text);
            return msg.reply(text);
        }catch(e){
            Util.error(e);
            return msg.reply("エラーやわ");
        }
    }

    /**
     * メッセージに装飾文をリプライする。
     * 参考：https://gist.github.com/sevenc-nanashi/67bfed2bdd0758eb20ac9bcd6fd88f84
     * @param {Message} msg リプライを送るもとのメッセージ
     * @param {Array} textArray リプライする文章とスタイルの配列
     *                          [{text:'reply text', style: {
     *                              normal      :bool, 
     *                              bold        :bool, 
    *                               underbar    :bool, 
     *                              color       :'gray'|'red'|'green'|'yellow'|'blue'|'pink'|'water'|'white', 
     *                              backcolor   :'darkblue'|'orange'|'gray'|'lightgray'|'morelightgray'|'indigo'|'gray2'|'white'}
     *                              }] 
     * @returns {Message}
     */
    static async replyCodeText(msg, textArray){
        try{
            let text = '';

            textArray.forEach(it => {
                text += DiscordUtil._makeStyleKeyword(it.style) + it.text;
            });

            let replyText = '```ansi\n' + text + '\n```';

            return msg.reply(replyText);
        }catch(e){
            Util.error(e);
            return msg.reply('エラーやわ。');
        }
        
    }

    /**
     * メッセージに平文と装飾文が混じった文章をリプライする。
     * 参考：https://gist.github.com/sevenc-nanashi/67bfed2bdd0758eb20ac9bcd6fd88f84
     * @param {Message} msg リプライを送るもとのメッセージ
     * @param {Array} textArray リプライする文章とスタイルの配列
     *                          [
     *                              {
     *                                  text:'xxx'
     *                              },
     *                              {
     *                                  codeArray:[
     *                                      {
     *                                          text:'xxx',
     *                                          style:{normal:true}
     *                                      },
     *                                      {
     *                                          text:'xxx',
     *                                          style:{color:'red', backcolor:'gray'}
     *                                      }
     *                                  ]
     *                                  
     *                              }
     *                          ]
     * @returns {Message}
     */
    static async replyComplexText(msg, textArray){
        try{
            // Util.log(text);
            let text = '';
            textArray.forEach(it => {
                if(it.text) text += it.text;
                else{
                    let codeBlock = '';
                    it.codeArray.forEach(code => {
                        codeBlock += DiscordUtil._makeStyleKeyword(code.style) + code.text;
                    });
                    text += '```ansi\n' + codeBlock + '\n```';                    
                }
            });

            return msg.reply(text);
        }catch(e){
            Util.error(e);
            return msg.reply('エラーやわ。');
        }
        
    }

    static _makeStyleKeyword(style){
        if(!style) return '';
        let keyword =[];
        
        if(style.bold) keyword.push('1');
        else if(style.underbar) keyword.push('4');
        if(style.color) keyword.push(DiscordUtil.color[style.color]);
        if(style.backcolor) keyword.push(DiscordUtil.backcolor[style.backcolor]);
        if(style.normal) keyword = ['0'];
        return '[0m[' + keyword.join(';') + 'm';
    }


    /**
     * メッセージにEnbedをリプライする。
     * @param {Message} msg リプライするもとのメッセージオブジェクト
     * @param {Embed} embed リプライするembedオブジェクト
     * @param {Object} imageUrls 添付画像とサムネ画像のURL {iamge:'./xxx.jpeg', thumbnail:'C:/local/folder/yyy.jpeg'}
     */
    static async replyEmbed(msg, embed, imageUrls){
        try{
            Util.log(`[EMBED]:${embed.data.title}`);
            let messageObj = await DiscordUtil._createEmbedMessageObject(embed, imageUrls);
            return msg.reply(messageObj);
        }catch(e){
            Util.error(e);
            return msg.reply('エラーやわ。');
        }
    }

    /**
     * 送信したEmbedを編集する。
     * @param {Message} msg 編集するもとのメッセージオブジェクト
     * @param {Embed} embed 変更先のembedオブジェクト
     * @param {Object} imageUrls 添付画像とサムネ画像のURL {iamge:'./xxx.jpeg', thumbnail:'C:/local/folder/yyy.jpeg'}
     */
    static async editEmbed(msg, embed, imageUrls){
        try{
            let messageObj = await DiscordUtil._createEmbedMessageObject(embed, imageUrls);
            return msg.edit(messageObj);
        }catch(e){
            Util.error(e);
            return;
        }
    }

    /**
     * メッセージ送信（編集）用のエンベッド付きメッセージオブジェクトを返す
     * @param {Embed} embed 変更先のembedオブジェクト
     * @param {Object} imageUrls 添付画像とサムネ画像のURL {iamge:'./xxx.jpeg', thumbnail:'C:/local/folder/yyy.jpeg'}
     * @return {Object} 
     */
    static async _createEmbedMessageObject(embed, imageUrls){
        let messageObj = {};
        // Util.log(`[EMBED]:${embed.data.title}`);
        messageObj.files = [];

        if(!embed.color) embed.setColor(0x0099FF);
        // 添付画像
        if(imageUrls?.image){
            let ext = imageUrls.image.split('.').pop();
            const attachment = new AttachmentBuilder()
                .setName('attachmentFile.' + ext)
                .setFile(imageUrls.image);
            embed.setImage('attachment://attachmentFile.' + ext);
            messageObj.files.push(attachment);
        }
        // サムネイル画像
        if(imageUrls?.thumbnail){
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
        
        return messageObj;
    }

    /**
     * エラーメッセージをリプライする
     * @param {Message} msg 
     * @param {string} errorMessage 
     */
    static replyErrorMessage(msg, errorMessage = 'エラーやわ'){
        msg.reply(errorMessage);
    }

    /**
     * メッセージの送信者が管理者かどうか判定する
     * @param {User} author 
     * @returns {boolean}
     */
    static isAdministrator(author){
        return author.id === process?.env['ADMINISTRATOR_DISCORD_ID'];
    }
}

module.exports = { DiscordUtil };