import { parseStringPromise } from 'xml2js';
import type { Command } from '../discord/types';
import { iconsABC, icons123 } from '../utils/icons';
import {
  prefRegions,
  getWeatherURL,
  getWeeklyEmbed,
  getDailyEmbed,
} from '../domain/weather';

const keyWeather = '【天気】';

async function fetchWeatherXml(url: string) {
  const response = await fetch(url);
  const body = await response.text();
  return parseStringPromise(body);
}

function resolvePrefAndRegion(prefNameInput: string, regionNameInput: string, isDetail: boolean) {
  let prefName = prefRegions.some((p) => p.pref.startsWith(prefNameInput)) ? prefNameInput : '東京';
  prefName = prefRegions.find((p) => p.pref.startsWith(prefName))!.pref;
  const prefNo = prefRegions.find((p) => p.pref === prefName)!.no;

  let regionName = regionNameInput;
  let regionNo: number;
  const matchedRegion = prefRegions[prefNo].region.find((r) => r.startsWith(regionNameInput));
  if (isDetail && matchedRegion) {
    regionNo = prefRegions[prefNo].region.indexOf(matchedRegion);
  } else {
    regionNo = prefRegions[prefNo].capital;
    regionName = prefRegions[prefNo].region[regionNo];
  }
  return { prefName, prefNo, regionName, regionNo };
}

/**
 * 【天気】 天気予報を表示する。
 * 例）【天気】 / 【天気】京都 / 【天気】京都 北部 / 【天気】京都 週間
 */
export const weatherCommand: Command = {
  name: 'weather',
  async handle(message) {
    if (!message.content.startsWith(keyWeather)) return;

    const searchWords = message.content.replace(keyWeather, '').replace(/　/g, ' ').split(' ');
    const isWeekly = searchWords.some((e) => e === '週間');
    const isDetail = (searchWords.length === 3) || (searchWords.length === 2 && !isWeekly);
    const prefNameInput = searchWords[0] === '' ? '東京' : searchWords[0];
    const regionNameInput = isDetail ? searchWords[1] : '';

    const { prefNo, regionNo } = resolvePrefAndRegion(prefNameInput, regionNameInput, isDetail);
    const url = getWeatherURL(prefNameInput);
    const result = await fetchWeatherXml(url);

    const now = new Date();
    const weatherEmbed = isWeekly
      ? getWeeklyEmbed(prefNo, regionNo, result)
      : now.getHours() <= 6 || now.getHours() > 19
        ? getDailyEmbed(prefNo, regionNo, result, 1)
        : getDailyEmbed(prefNo, regionNo, result);

    const rep = await message.reply({ embeds: [weatherEmbed] });
    if (isWeekly) {
      if (weatherEmbed.title !== 'あかん') {
        for (let i = 0; i < 7; i++) await rep.react(icons123[i]);
        for (let i = 0; i < Math.min(prefRegions[prefNo].region.length, 12); i++) await rep.react(iconsABC[i]);
      }
    } else {
      await rep.react('🇼');
      for (let i = 0; i < prefRegions[prefNo].region.length; i++) await rep.react(iconsABC[i]);
    }
  },
};

/**
 * 天気予報Embedへのリアクションで、地域や期間(デイリー/ウィークリー)を変更して再検索する機能。
 * 自分自身(Bot)が送信した天気Embedに対しても発火することで、リアクション操作による再検索を実現している。
 */
export const weatherFollowUpCommand: Command = {
  name: 'weather-follow-up',
  async handle(message) {
    const embed = message.embeds[0];
    if (!embed || !embed.description || embed.description.slice(-2) !== '天気') return;
    if (!embed.title) return;

    const [prefName, regionName] = embed.title.split(' ');
    const prefNo = prefRegions.find((p) => p.pref === prefName)!.no;
    const regionNo = prefRegions[prefNo].region.indexOf(regionName);
    const url = getWeatherURL(prefName);
    const result = await fetchWeatherXml(url);

    const collector = message.createReactionCollector({ time: 5 * 60 * 1000 });
    collector.on('collect', async (reaction, user) => {
      if (user.bot) return;
      const otherField = embed.fields.find((f) => f.name === 'その他');
      const regionCount = otherField ? otherField.value.split('\n').length : 0;

      if (embed.fields.length === 5) {
        // デイリーの場合
        if (reaction.emoji.name === '🇼') {
          const weatherEmbed2 = getWeeklyEmbed(prefNo, regionNo, result);
          const rep = await message.reply({ embeds: [weatherEmbed2] });
          if (weatherEmbed2.title !== 'あかん') {
            for (let i = 0; i < 7; i++) await rep.react(icons123[i]);
            for (let i = 0; i < Math.min(prefRegions[prefNo].region.length, 12); i++) await rep.react(iconsABC[i]);
          }
        }
        if (iconsABC.slice(0, regionCount).includes(reaction.emoji.name ?? '')) {
          const newRegionNo = iconsABC.slice(0, regionCount).indexOf(reaction.emoji.name ?? '');
          const weatherEmbed2 = getDailyEmbed(prefNo, newRegionNo, result);
          const rep = await message.reply({ embeds: [weatherEmbed2] });
          await rep.react('🇼');
          for (let i = 0; i < prefRegions[prefNo].region.length; i++) await rep.react(iconsABC[i]);
        }
      } else {
        // ウィークリーの場合
        if (icons123.slice(0, 7).includes(reaction.emoji.name ?? '')) {
          const offset = icons123.slice(0, 7).indexOf(reaction.emoji.name ?? '');
          const weatherEmbed2 = getDailyEmbed(prefNo, regionNo, result, offset);
          const rep = await message.reply({ embeds: [weatherEmbed2] });
          await rep.react('🇼');
          for (let i = 0; i < prefRegions[prefNo].region.length; i++) await rep.react(iconsABC[i]);
        }
        if (iconsABC.slice(0, regionCount).includes(reaction.emoji.name ?? '')) {
          const newRegionNo = iconsABC.slice(0, regionCount).indexOf(reaction.emoji.name ?? '');
          const weatherEmbed2 = getWeeklyEmbed(prefNo, newRegionNo, result);
          const rep = await message.reply({ embeds: [weatherEmbed2] });
          if (weatherEmbed2.title !== 'あかん') {
            for (let i = 0; i < 7; i++) await rep.react(icons123[i]);
            for (let i = 0; i < Math.min(prefRegions[prefNo].region.length, 12); i++) await rep.react(iconsABC[i]);
          }
        }
      }
    });
  },
};

export const weatherCommands: Command[] = [weatherCommand, weatherFollowUpCommand];
