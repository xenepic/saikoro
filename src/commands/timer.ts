import { EmbedBuilder, type Message } from 'discord.js';
import type { Command } from '../discord/types';

const keyTimer = '!timer';

function sleep(seconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

function getTimerEmbed(time: number): EmbedBuilder {
  const min = Math.floor(time / 60);
  const sec = time % 60;
  const timerEmbed = new EmbedBuilder();
  timerEmbed.setTitle('タイマー');
  timerEmbed.addFields({ name: `${min}分${sec}秒`, value: '​', inline: false });
  return timerEmbed;
}

async function countDown(message: Message, fromTime: number): Promise<void> {
  for (let remaining = fromTime; remaining >= 0; remaining--) {
    await sleep(1);
    await message.edit({ embeds: [getTimerEmbed(remaining)] });
  }
}

/** !timer 3分のカウントダウンタイマーを表示する */
export const timerCommand: Command = {
  name: 'timer',
  async handle(message) {
    if (!message.content.startsWith(keyTimer)) return;
    const time = 3 * 60;
    const rep = await message.reply({ embeds: [getTimerEmbed(time)] });
    await countDown(rep, time - 1);
  },
};

export const timerCommands: Command[] = [timerCommand];
