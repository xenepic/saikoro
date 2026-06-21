import type { Command } from '../discord/types';
import { getGachaMessage } from '../domain/gacha';

const keySingleGacha = '【ガチャ】';
const key10renGacha = '【10連】';

/** 【ガチャ】 1回ガチャを引く */
export const singleGachaCommand: Command = {
  name: 'gacha-single',
  async handle(message) {
    if (!message.content.startsWith(keySingleGacha)) return;
    const result = await getGachaMessage(message.author.tag.split('#')[0], 1);
    await message.reply(result);
  },
};

/** 【10連】 10回ガチャを引く */
export const tenGachaCommand: Command = {
  name: 'gacha-ten',
  async handle(message) {
    if (!message.content.startsWith(key10renGacha)) return;
    const result = await getGachaMessage(message.author.tag.split('#')[0], 10);
    await message.reply(result);
  },
};

export const gachaCommands: Command[] = [singleGachaCommand, tenGachaCommand];
