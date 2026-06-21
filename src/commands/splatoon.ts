import type { Message } from 'discord.js';
import type { Command } from '../discord/types';
import { iconsABC, iconsRedAB } from '../utils/icons';
import { getRandomInt } from '../utils/random';
import { strLength, getEqualLengthStr } from '../utils/discordText';
import { isFromUnei } from '../utils/permissions';
import {
  searchFor,
  getWeaponByMain,
  getWeaponEmbedByMain,
  getNoMatchesEmbed,
  getSubWeaponByName,
  getWeaponBySub,
  getSubWeaponListEmbed,
  getWeaponListEmbed,
  getWeaponListEmbedBySub,
  getWeaponListEmbedBySpecial,
  getSpecialByName,
  getWeaponBySpecial,
  getSpecialListEmbed,
  howManyHitBySub,
  howManyHitBySpecial,
  weapons,
  weaponsInfo,
  getFesVoteEmbed,
  getFesKumiwakeEmbed,
} from '../domain/splatoon';

const keySplatoonWeapon = '!spw';
const keySplatoonSub = '!sps';
const keySplatoonSpecial = '!spp';
const keySplatoon = '!sp';
const keyWeaponLottery = '【武器抽選】';
const keyFesSplatoon = '【フェス】';

/*
 * スプラトゥーン検索機能。
 * Searchは候補が複数ある場合の候補表示、Dispは武器の詳細表示。
 * M・S・Pはそれぞれ「メイン」「サブ」「スペシャル」の意味。
 * 例えばSearchPは「スペシャルの名前からメイン武器を検索」、SearchPbyPは
 * 「SearchPの結果スペシャルが複数ヒットしたので候補を表示する」関数。
 */

async function spSearchM(message: Message, key: string): Promise<void> {
  const matches = getWeaponByMain(key);
  if (matches.length === 0) await message.reply({ embeds: [getNoMatchesEmbed(key)] });
  else if (matches.length === 1) await spDispM(message, matches[0]);
  else await spSearchMbyM(message, key);
}

async function spSearchMbyM(message: Message, key: string): Promise<void> {
  const searchResult = getWeaponByMain(key);
  const rep = await message.reply({ embeds: [getWeaponListEmbed(key, searchResult)] });
  const limit = Math.min(searchResult.length, 19);
  for (let i = 0; i < limit; i++) await rep.react(iconsABC[i]);

  const collector = rep.createReactionCollector({ time: 5 * 60 * 1000 });
  collector.on('collect', async (reaction, user) => {
    if (iconsABC.indexOf(reaction.emoji.name ?? '') <= limit && !user.bot) {
      const index = iconsABC.indexOf(reaction.emoji.name ?? '');
      await spDispM(rep, searchResult[index]);
    }
  });
}

async function spDispM(message: Message, key: string): Promise<void> {
  const rep = await message.reply({ embeds: [getWeaponEmbedByMain(key)] });
  const sub = rep.embeds[0].fields[0].value;
  const special = rep.embeds[0].fields[1].value;
  await rep.react('🇸');
  await rep.react('🇵');

  const collector = rep.createReactionCollector({ time: 5 * 60 * 1000 });
  collector.on('collect', async (reaction, user) => {
    if (reaction.emoji.name === '🇸' && !user.bot) await spSearchMbyS(rep, sub);
    if (reaction.emoji.name === '🇵' && !user.bot) await spSearchMbyP(rep, special);
  });
}

async function spSearchS(message: Message, key: string): Promise<void> {
  const howManyHit = howManyHitBySub(key);
  if (howManyHit === 0) await message.reply({ embeds: [getNoMatchesEmbed(key)] });
  else if (howManyHit === 1) await spSearchMbyS(message, getSubWeaponByName(key)[0]);
  else await spSearchSbyS(message, key);
}

async function spSearchSbyS(message: Message, key: string): Promise<void> {
  const searchResult = getSubWeaponByName(key);
  const rep = await message.reply({ embeds: [getSubWeaponListEmbed(key, searchResult)] });
  const limit = Math.min(searchResult.length, 19);
  for (let i = 0; i < limit; i++) await rep.react(iconsABC[i]);

  const collector = rep.createReactionCollector({ time: 5 * 60 * 1000 });
  collector.on('collect', async (reaction, user) => {
    if (iconsABC.indexOf(reaction.emoji.name ?? '') <= limit && !user.bot) {
      const index = iconsABC.indexOf(reaction.emoji.name ?? '');
      await spSearchMbyS(rep, searchResult[index]);
    }
  });
}

async function spSearchMbyS(message: Message, key: string): Promise<void> {
  const searchResult = getWeaponBySub(key);
  const rep = await message.reply({ embeds: [getWeaponListEmbedBySub(key)] });
  const limit = Math.min(searchResult.length, 19);
  for (let i = 0; i < limit; i++) await rep.react(iconsABC[i]);

  const collector = rep.createReactionCollector({ time: 5 * 60 * 1000 });
  collector.on('collect', async (reaction, user) => {
    if (iconsABC.indexOf(reaction.emoji.name ?? '') <= limit && !user.bot) {
      const index = iconsABC.indexOf(reaction.emoji.name ?? '');
      await spDispM(rep, searchResult[index]);
    }
  });
}

async function spSearchP(message: Message, key: string): Promise<void> {
  const howManyHit = howManyHitBySpecial(key);
  if (howManyHit === 0) await message.reply({ embeds: [getNoMatchesEmbed(key)] });
  else if (howManyHit === 1) await spSearchMbyP(message, getSpecialByName(key)[0]);
  else await spSearchPbyP(message, key);
}

async function spSearchPbyP(message: Message, key: string): Promise<void> {
  const searchResult = getSpecialByName(key);
  const rep = await message.reply({ embeds: [getSpecialListEmbed(key, searchResult)] });
  const limit = Math.min(searchResult.length, 19);
  for (let i = 0; i < limit; i++) await rep.react(iconsABC[i]);

  const collector = rep.createReactionCollector({ time: 5 * 60 * 1000 });
  collector.on('collect', async (reaction, user) => {
    if (iconsABC.indexOf(reaction.emoji.name ?? '') <= limit && !user.bot) {
      const index = iconsABC.indexOf(reaction.emoji.name ?? '');
      await spSearchMbyP(rep, searchResult[index]);
    }
  });
}

async function spSearchMbyP(message: Message, key: string): Promise<void> {
  const searchResult = getWeaponBySpecial(key);
  const rep = await message.reply({ embeds: [getWeaponListEmbedBySpecial(key)] });
  const limit = Math.min(searchResult.length, 19);
  for (let i = 0; i < limit; i++) await rep.react(iconsABC[i]);

  const collector = rep.createReactionCollector({ time: 5 * 60 * 1000 });
  collector.on('collect', async (reaction, user) => {
    if (iconsABC.indexOf(reaction.emoji.name ?? '') <= limit && !user.bot) {
      const index = iconsABC.indexOf(reaction.emoji.name ?? '');
      await spDispM(rep, searchResult[index]);
    }
  });
}

/** !spw メイン武器を検索 */
export const splatoonWeaponCommand: Command = {
  name: 'splatoon-weapon',
  async handle(message) {
    if (!message.content.startsWith(keySplatoonWeapon)) return;
    const key = message.content.replace('　', ' ').split(' ')[1];
    await spSearchM(message, key);
  },
};

/** !sps サブウェポンを検索 */
export const splatoonSubCommand: Command = {
  name: 'splatoon-sub',
  async handle(message) {
    if (!message.content.startsWith(keySplatoonSub)) return;
    const key = message.content.replace('　', ' ').split(' ')[1];
    await spSearchS(message, key);
  },
};

/** !spp スペシャルを検索 */
export const splatoonSpecialCommand: Command = {
  name: 'splatoon-special',
  async handle(message) {
    if (!message.content.startsWith(keySplatoonSpecial)) return;
    const key = message.content.replace('　', ' ').split(' ')[1];
    await spSearchP(message, key);
  },
};

/** !sp メイン・サブ・スペシャルをあいまいに検索 */
export const splatoonAmbiguousCommand: Command = {
  name: 'splatoon-ambiguous',
  async handle(message) {
    if (message.content.replace('　', ' ').split(' ')[0] !== keySplatoon) return;
    const key = message.content.replace('　', ' ').split(' ')[1];
    const result = searchFor(key);
    if (result.main) await spSearchM(message, key);
    if (result.sub) await spSearchS(message, key);
    if (result.special) await spSearchP(message, key);
    if (result.main && result.sub && result.special) await message.reply({ embeds: [getNoMatchesEmbed(key)] });
  },
};

/** 【武器抽選】 リアクションした人にランダムな武器を割り当てる */
export const weaponLotteryCommand: Command = {
  name: 'weapon-lottery',
  async handle(message) {
    if (!message.content.startsWith(keyWeaponLottery)) return;
    let gearUsers: string[] = [];
    const rep = await message.reply('リアクションしてね');
    await rep.react('✋');
    await rep.react('☑️');

    const collector = rep.createReactionCollector({ time: 30 * 60 * 1000 });
    collector.on('collect', (reaction, user) => {
      if (reaction.emoji.name === '✋' && !user.bot) {
        gearUsers.push((user.tag.split('#')[0] + '　　　　　　　　　　　　').slice(0, 10));
      }
      if (reaction.emoji.name === '☑️' && !user.bot) {
        const bukis = gearUsers.map(() => weapons[getRandomInt(weapons.length) - 1]);
        const output = gearUsers.map((u, i) => `${u} : 【${bukis[i]}】`);
        rep.reply(output.join('\n'));
      }
    });
  },
};

interface FesUsers {
  A: string[];
  B: string[];
  redA: string[];
  redB: string[];
}

const fesThemas = [
  { A: 'リアル麻雀', B: 'ネット麻雀' },
  { A: '犬', B: '猫' },
  { A: '文系', B: '理系' },
];

/** 【フェス】 忘年祭で使用したスプラトゥーンフェス機能(運営限定)。 */
export const splatoonFesCommand: Command = {
  name: 'splatoon-fes',
  async handle(message) {
    if (!message.content.startsWith(keyFesSplatoon) || !isFromUnei(message.author)) return;

    const themaIndex =
      (parseInt(
        message.content.replace(keyFesSplatoon, '').replace('１', '1').replace('２', '2').replace('３', '3').replace(/\s/g, ''),
        10,
      ) - 1) % fesThemas.length;
    const thema = fesThemas[themaIndex];
    const users: FesUsers = { A: [], B: [], redA: [], redB: [] };

    const rep = await message.reply(getFesVoteEmbed(thema, users));
    await rep.react(iconsABC[0]);
    await rep.react(iconsABC[1]);
    await rep.react(iconsRedAB[0]);
    await rep.react(iconsRedAB[1]);
    await rep.react('☑️');

    const removeFromAllGroups = (tag: string) => {
      (Object.keys(users) as Array<keyof FesUsers>).forEach((group) => {
        const i = users[group].indexOf(tag);
        if (i !== -1) users[group] = users[group].slice(0, i).concat(users[group].slice(i + 1));
      });
    };

    const collector = rep.createReactionCollector({ time: 5 * 60 * 1000 });
    collector.on('collect', async (reaction, user) => {
      if (reaction.emoji.name === iconsABC[0] && !user.bot) {
        removeFromAllGroups(user.tag);
        users.A.push(user.tag);
        await rep.edit(getFesVoteEmbed(thema, users));
      }
      if (reaction.emoji.name === iconsABC[1] && !user.bot) {
        removeFromAllGroups(user.tag);
        users.B.push(user.tag);
        await rep.edit(getFesVoteEmbed(thema, users));
      }
      if (reaction.emoji.name === iconsRedAB[0] && !user.bot) {
        removeFromAllGroups(user.tag);
        users.redA.push(user.tag);
        await rep.edit(getFesVoteEmbed(thema, users));
      }
      if (reaction.emoji.name === iconsRedAB[1] && !user.bot) {
        removeFromAllGroups(user.tag);
        users.redB.push(user.tag);
        await rep.edit(getFesVoteEmbed(thema, users));
      }

      if (reaction.emoji.name === '☑️' && !user.bot && isFromUnei(user)) {
        const allUsers = users.A.concat(users.B, users.redA, users.redB).map((e) => strLength(e));
        const maxLength = Math.max(...allUsers);
        users.A = users.A.map((e) => getEqualLengthStr(e.split('#')[0], maxLength + 4));
        users.B = users.B.map((e) => getEqualLengthStr(e.split('#')[0], maxLength + 4));
        users.redA = users.redA.map((e) => getEqualLengthStr(e.split('#')[0], maxLength + 4));
        users.redB = users.redB.map((e) => getEqualLengthStr(e.split('#')[0], maxLength + 4));

        const rep2 = await rep.reply(getFesKumiwakeEmbed(thema, users));
        await rep2.react('🔄');
        const collector2 = rep2.createReactionCollector({ time: 5 * 60 * 1000 });
        collector2.on('collect', async (reaction2, user2) => {
          if (reaction2.emoji.name === '🔄' && !user2.bot && isFromUnei(user2)) {
            const nonHeroWeapons = weaponsInfo.filter((e) => !e['メイン'].includes('ヒーロー'));
            const temp = getRandomInt(nonHeroWeapons.length);
            const weaponName = nonHeroWeapons[temp]['メイン'];
            const weaponClass = String(nonHeroWeapons[temp]['ジャンル']);
            await rep2.reply('```\n' + weaponClass + '(' + weaponName + ')' + '\n```');
          }
        });
      }
    });
  },
};

export const splatoonCommands: Command[] = [
  splatoonWeaponCommand,
  splatoonSubCommand,
  splatoonSpecialCommand,
  splatoonAmbiguousCommand,
  weaponLotteryCommand,
  splatoonFesCommand,
];
