const { Message, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { DiscordUtil } = require('../DiscordUtil');
const { Util } = require('../Util');
const { commands, getCommand, getBodyText } = require('../command');


class Lottery {
    constructor(){
    }

    /**
     * 抽選受付処理
     * 受付用
     * @param {Message} msg Messageオブジェクト
     */
    async acceptLots(msg){
        try{
            let command = getCommand(msg.content);
            let bodyText = getBodyText(msg.content, command);

            // 使用する絵文字の読み込み
            let hand = Util.emoji['raised_hand'];
            let right = Util.emoji['arrow_right'];
            let cycle = Util.emoji['arrows_counterclockwise'];
            
            // inside a command, event listener, etc.
            const embed = new EmbedBuilder()
                .setTitle(bodyText ? bodyText : '抽選受付')
                .setDescription(`${hand}：抽選に参加\n${right}：参加者の中から1名抽選\n${cycle}：リセット`)
                .addFields(
                    { name: '\u200B', value: '\u200B'},
                    { name: '参加者', value: 'なし', inline: true },
                    { name: '\u200B', value: right, inline: true },
                    { name: '当選者', value: 'なし', inline: true },
                    { name: '\u200B', value: '\u200B'},
                    { name: '\u200B', value: '\u200B'},
                );

            let rep = await DiscordUtil.replyEmbed(msg, embed);
            await rep.react(hand);
            await rep.react(right);
            await rep.react(cycle);

            const filter = (reaction, user) => {
                return [hand,right,cycle].includes(reaction.emoji.name) && !user.bot;
            };
            const collector = rep.createReactionCollector({ filter, time: 5 * 60 * 1000 });


            let participants = new Set(); // 参加者一覧
            let selected = new Set(); // 当選者一覧

            collector.on('collect', async (reaction, user) => {
                let emoji = reaction.emoji.name;
                switch(emoji){
                    case hand:
                        // 参加者を追加
                        participants.add(user.username);                        
                        break;
                    case right:
                        // 当選者以外の参加者から一人抽選
                        let select = Util.getRandomElement([...participants].filter(e=>!selected.has(e)));
                        if(select) selected.add(select);
                        break;
                    case cycle:
                        // 参加者と当選者をリセット（リセットはコマンド送信主のみ）
                        if(msg.author.id === user.id){
                            participants = new Set();
                            selected = new Set();
                        }                        
                        break;
                }

                // 新しい参加者と当選者にEmbedを更新
                let p_names = [...participants].join('\n');
                embed.data.fields[1] = { name: '参加者', value: p_names?p_names:'なし', inline: true };
                let c_names = [...selected].join('\n');
                embed.data.fields[3] = { name: '当選者', value: c_names?c_names:'なし', inline: true };
                DiscordUtil.editEmbed(rep, embed);

                // リアクションを削除
                reaction.users.remove(user.id);                
            });
            
            collector.on('end', collected => {
                embed.setTimestamp()
                    .setFooter({ text: '※抽選受付は終了しました'});
                DiscordUtil.editEmbed(rep, embed);
                rep.reactions.removeAll();
            });


        }catch(e){
            Util.error(e);
        }
    }

}

module.exports = { Lottery };