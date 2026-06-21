import type { Message } from 'discord.js';
import { EmbedBuilder } from 'discord.js';
import type { Command } from '../discord/types';
import { iconsABC } from '../utils/icons';
import { getEqualLengthStr } from '../utils/discordText';
import { isFromUnei } from '../utils/permissions';
import { addSP } from '../domain/gacha';
import {
  getTenhouEmbed,
  getDoubleRiichiEmbed,
  getMachiateEmbed,
  get1shantenEmbed,
  getMahjongFesEmbed,
  type MahjongFesUsers,
  type MahjongFesGame,
} from '../domain/mahjong';

const keyTenhou = '【天和】';
const keyDoubeRiichi = '【ダブリー】';
const keyQuizBambooMachiate = '【バンブー】';
const keyQuiz1shanten = '【何切る】';
const keyFesMahjong = '【麻雀フェス】';

/** 【天和】 配牌14枚を引き、天和に近いかどうかを判定する */
export const tenhouCommand: Command = {
  name: 'mahjong-tenhou',
  async handle(message) {
    if (!message.content.startsWith(keyTenhou)) return;
    const embed = await getTenhouEmbed();
    await message.reply(embed);
  },
};

/** 【ダブリー】 テンパイ13枚とツモ牌で一発ツモとなるかをチャレンジする */
export const doubleRiichiCommand: Command = {
  name: 'mahjong-double-riichi',
  async handle(message) {
    if (!message.content.startsWith(keyDoubeRiichi)) return;
    const embed = await getDoubleRiichiEmbed();
    await message.reply(embed);
  },
};

/** バンブー麻雀(索子のみ)の待ち当てクイズ。出題と正誤判定・連戦を行う再帰関数。 */
export async function quizNextBamboo(message: Message): Promise<void> {
  const [bambooEmbed, waitPais] = await getMachiateEmbed(true);
  console.log(waitPais);
  const rep = await message.reply(bambooEmbed);

  const filter = (m: Message) => m.reference != null && m.reference.messageId == rep.id && !m.author.bot;
  const collector = rep.channel.createMessageCollector({ filter, time: 5 * 60 * 1000 });

  collector.on('collect', async (answerMessage) => {
    if ([...new Set(answerMessage.content.split(''))].sort().join('') === waitPais) {
      console.log('正解');
      await addSP(rep.author.tag.split('#')[0], 30);
      const rep2 = await rep.reply('正解！もう一問やる？');
      await rep2.react('🎍');
      const collector2 = rep2.createReactionCollector({ time: 5 * 60 * 1000 });
      collector2.on('collect', async (reaction2, user2) => {
        if (reaction2.emoji.name === '🎍' && !user2.bot) {
          await quizNextBamboo(rep2);
        }
      });
    } else {
      await answerMessage.react('❌');
      console.log('ちがうよ');
    }
  });
}

/** 【バンブー】 バンブー麻雀の待ち当てクイズコマンド */
export const bambooMachiateCommand: Command = {
  name: 'mahjong-bamboo-machiate',
  async handle(message) {
    if (!message.content.startsWith(keyQuizBambooMachiate)) return;
    await quizNextBamboo(message);
  },
};

/** イーシャンテン何切る問題。出題と正誤判定・連戦を行う再帰関数。 */
export async function quizNext1shanten(message: Message): Promise<void> {
  const [shanten1embed, answer, answerPai, answerText] = await get1shantenEmbed();
  const rep = await message.reply(shanten1embed);
  await rep.react(iconsABC[0]);
  await rep.react(iconsABC[1]);
  await rep.react(iconsABC[2]);
  await rep.react(iconsABC[3]);

  const answers: Record<string, string[]> = { '🇦': [], '🇧': [], '🇨': [], '🇩': [] };
  let answerFlag = false;
  let checkReactionFlag = false;

  const collector = rep.createReactionCollector({ time: 5 * 60 * 1000 });
  collector.on('collect', async (reaction, user) => {
    if (iconsABC.slice(0, 4).includes(reaction.emoji.name ?? '') && !user.bot && !answerFlag) {
      //既にリアクションが付いている場合があるので、回答配列から一旦名前を削除
      for (let i = 0; i < 4; i++) {
        answers[iconsABC[i]] = answers[iconsABC[i]].filter((name) => name != user.tag.split('#')[0]);
      }
      answers[reaction.emoji.name as string].push(user.tag.split('#')[0]);
      if (!checkReactionFlag) {
        checkReactionFlag = true;
        await rep.react('☑️');
      }
    }

    if (reaction.emoji.name === '☑️' && !user.bot && !answerFlag) {
      answerFlag = true;
      const correctNames = answers[iconsABC[answer]];
      const shanten1Answerembed = new EmbedBuilder();
      shanten1Answerembed.setTitle('正解発表');
      shanten1Answerembed.setColor('#87cefa');
      shanten1Answerembed.setDescription(`正解者は、${correctNames.join(',') == '' ? 'なし' : correctNames.join(',')}！`);
      shanten1Answerembed.addFields({ name: `正解：${answerPai}`, value: answerText, inline: false });
      shanten1Answerembed.setFooter({ text: 'もう一問やる？' });

      for (const name of correctNames) await addSP(name, 30);

      const rep2 = await rep.reply({ embeds: [shanten1Answerembed] });
      await rep2.react('🀄');
      answerFlag = false;
      const collector2 = rep2.createReactionCollector({ time: 5 * 60 * 1000 });
      collector2.on('collect', async (reaction2, user2) => {
        if (reaction2.emoji.name == '🀄' && !user2.bot && !answerFlag) {
          answerFlag = true;
          await quizNext1shanten(rep2);
        }
      });
    }
  });
}

/** 【何切る】 イーシャンテン何切る問題コマンド */
export const shanten1Command: Command = {
  name: 'mahjong-1shanten',
  async handle(message) {
    if (!message.content.startsWith(keyQuiz1shanten)) return;
    await quizNext1shanten(message);
  },
};

/** 【麻雀フェス】 忘年祭で使用した麻雀フェス機能(運営限定)。 */
export const mahjongFesCommand: Command = {
  name: 'mahjong-fes',
  async handle(message) {
    if (!message.content.startsWith(keyFesMahjong) || !isFromUnei(message.author)) return;

    const users: MahjongFesUsers = { A: [], B: [], C: [] };
    const games: MahjongFesGame[] = [];
    const teams: Record<string, 'A' | 'B' | 'C'> = {};

    const rep = await message.reply(getMahjongFesEmbed(users, games));
    await rep.react(iconsABC[0]);
    await rep.react(iconsABC[1]);
    await rep.react(iconsABC[2]);
    await rep.react('✅');
    await rep.react('⛔');

    const filter = (r: { emoji: { name: string | null } }) =>
      [iconsABC[0], iconsABC[1], iconsABC[2], '✅', '⛔', '⚠️'].includes(r.emoji.name ?? '');
    const collector = rep.createReactionCollector({ filter, time: 210 * 60 * 1000 });
    collector.on('collect', async (reaction, user) => {
      if (user.bot) return;
      const userName = user.tag.split('#')[0];

      const assignTeam = async (team: 'A' | 'B' | 'C') => {
        if (!teams[userName]) {
          users[team].push(userName);
          teams[userName] = team;
          await rep.edit(getMahjongFesEmbed(users, games));
        }
      };

      if (reaction.emoji.name == iconsABC[0]) await assignTeam('A');
      if (reaction.emoji.name == iconsABC[1]) await assignTeam('B');
      if (reaction.emoji.name == iconsABC[2]) await assignTeam('C');

      //試合終了＋続行
      if (reaction.emoji.name == '✅') {
        try {
          await reaction.users.remove(user);
          const team = teams[userName];
          if (team) {
            if (!users[team].includes(userName)) users[team].push(userName);
            const target = games.find((e) => !e[`${team}done`] && e[team] === getEqualLengthStr(userName, 15));
            if (target) target[`${team}done`] = true;
          }
        } catch (e) {
          console.log('gamesの履歴変更エラー：' + userName);
          console.log(e);
        }
        await rep.edit(getMahjongFesEmbed(users, games));
      }

      //試合終了 次は打たない
      if (reaction.emoji.name == '⛔') {
        try {
          await reaction.users.remove(user);
          const team = teams[userName];
          if (team) {
            const target = games.find((e) => !e[`${team}done`] && e[team] === getEqualLengthStr(userName, 15));
            if (target) target[`${team}done`] = true;
          }
        } catch (e) {
          console.log('gamesの履歴変更エラー：' + userName);
          console.log(e);
        }
        await rep.edit(getMahjongFesEmbed(users, games));
      }

      if (reaction.emoji.name == '⚠️') {
        try {
          await reaction.users.remove(user);
        } catch (e) {
          console.log('リアクション除去エラー（おそらくサイコロ君botに管理者権限が無い鯖での使用）');
          console.log(e);
        }

        (['A', 'B', 'C'] as const).forEach((team) => {
          const i = users[team].indexOf(userName);
          if (i !== -1) users[team] = users[team].slice(0, i).concat(users[team].slice(i + 1));
        });
        delete teams[userName];
      }

      if (users.A.length > 0 && users.B.length > 0 && users.C.length > 0) {
        games.push({
          A: getEqualLengthStr(users.A.shift()!, 15),
          B: getEqualLengthStr(users.B.shift()!, 15),
          C: getEqualLengthStr(users.C.shift()!, 15),
          Adone: false,
          Bdone: false,
          Cdone: false,
        });
        const last = games[games.length - 1];
        console.log(`start  A[${last.A.replace(/\s/g, '')}] B[${last.B.replace(/\s/g, '')}] C[${last.C.replace(/\s/g, '')}]`);
        await rep.edit(getMahjongFesEmbed(users, games));
      }
    });
  },
};

export const mahjongCommands: Command[] = [tenhouCommand, doubleRiichiCommand, bambooMachiateCommand, shanten1Command, mahjongFesCommand];
