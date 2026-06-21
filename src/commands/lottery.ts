import type { Command } from '../discord/types';
import { getRandomInt } from '../utils/random';

const keyChusen = '【抽選】';
const keyChusenUketsuke = '【抽選受付】';

/** 【抽選】 リアクションした人の中から1名抽選する受付メッセージを送る */
export const lotteryAnnounceCommand: Command = {
  name: 'lottery-announce',
  async handle(message) {
    if (!message.content.startsWith(keyChusen) || !message.channel.isSendable()) return;
    await message.channel.send(
      '\n' + keyChusenUketsuke + '\nリアクションをした人の中から1名抽選します。\n✋：抽選に参加\n🔄：抽選開始\n※受付時間は5分間です。\n',
    );
  },
};

/** 【抽選受付】 ✋で参加登録、🔄で抽選を実行する */
export const lotteryAcceptCommand: Command = {
  name: 'lottery-accept',
  async handle(message) {
    if (!message.content.startsWith(keyChusenUketsuke) || !message.channel.isSendable()) return;
    const channel = message.channel;
    await message.react('✋');
    await message.react('🔄');

    let users: string[] = [];
    let noLotted = true;

    const filter = (reaction: { emoji: { name: string | null } }, user: { id: string }) =>
      (reaction.emoji.name === '✋' || reaction.emoji.name === '🔄') && user.id !== message.author.id;
    const collector = message.createReactionCollector({ filter, time: 5 * 60 * 1000 });

    collector.on('collect', (reaction, user) => {
      if (reaction.emoji.name === '✋') {
        users.push(user.tag.slice(0, -5));
        users = [...new Set(users)];
      }
      if (reaction.emoji.name === '🔄') {
        if (users.length === 0) {
          channel.send('```\n全員の抽選が終わったよ！\n```');
        } else {
          const i = getRandomInt(users.length - 1);
          channel.send('```\n抽選結果：' + users[i] + 'さん\n```');
          users = users.slice(0, i).concat(users.slice(i + 1));
        }
        noLotted = false;
      }
    });

    collector.on('end', () => {
      if (noLotted && users[0] !== undefined) {
        channel.send('```\n抽選結果：' + users[getRandomInt(users.length - 1)] + 'さん\n```');
      }
    });
  },
};

export const lotteryCommands: Command[] = [lotteryAnnounceCommand, lotteryAcceptCommand];
