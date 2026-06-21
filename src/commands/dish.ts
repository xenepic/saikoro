import type { Command } from '../discord/types';
import { getDishEmbed } from '../domain/dish';

const keyDishGacha = '【料理】';

/** 【料理】 楽天レシピからランダムな料理を紹介する(キーワード検索も可) */
export const dishCommand: Command = {
  name: 'dish',
  async handle(message) {
    if (!message.content.startsWith(keyDishGacha)) return;
    let searchWord = message.content.replace(keyDishGacha, '').replace(/\s+/g, '');
    if (searchWord === '') searchWord = 'default';

    const embed = await getDishEmbed(searchWord);
    await message.reply({ embeds: [embed] });
  },
};

export const dishCommands: Command[] = [dishCommand];
