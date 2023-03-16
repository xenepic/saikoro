const { Message } = require('discord.js');
const { Util } = require('./Util');

const { commands } = require('./command');

class BotFunctionBase {
    constructor(client, classification){
        this.client = client;
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
        let commandKeys = commands.find(c => c.name === commandName).command;
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
}

module.exports = { BotFunctionBase };