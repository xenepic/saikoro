import { env } from './config/env';
import { createDiscordClient } from './discord/client';
import { registerCommands } from './discord/router';
import { writeCsvLog } from './utils/logger';
import type { Command } from './discord/types';
import type { TextBasedChannel } from 'discord.js';
import { pokemonCommands } from './commands/pokemon';
import { diceRollCommand } from './commands/diceRoll';
import { lotteryCommands } from './commands/lottery';
import { fortuneCommands } from './commands/fortune';
import { splatoonCommands } from './commands/splatoon';
import { weatherCommands } from './commands/weather';
import { gachaCommands } from './commands/gacha';
import { dishCommands } from './commands/dish';
import { wordWolfCommands } from './commands/wordwolf';
import { dmCommands } from './commands/dm';
import { mahjongCommands } from './commands/mahjong';
import { quizCommands } from './commands/quiz';
import { chatGptCommands } from './commands/chatgpt';
import { timerCommands } from './commands/timer';
import { miscCommands } from './commands/misc';

const client = createDiscordClient();

// Phase4で各コマンドをここに追加していく
const commands: Command[] = [
  diceRollCommand,
  ...lotteryCommands,
  ...fortuneCommands,
  ...pokemonCommands,
  ...splatoonCommands,
  ...weatherCommands,
  ...gachaCommands,
  ...dishCommands,
  ...wordWolfCommands,
  ...dmCommands,
  ...mahjongCommands,
  ...quizCommands,
  ...chatGptCommands,
  ...timerCommands,
  ...miscCommands,
];

client.on('messageCreate', (message) => {
  if (!message.guild || !message.channel) return;
  const channel = message.channel as TextBasedChannel & { name?: string };
  const timestamp = new Date().toLocaleString('ja-JP');
  writeCsvLog(
    [timestamp, message.guild.name, channel.name ?? '', message.author.tag, message.content.replace(/\n/g, ' ')].join(
      ',',
    ),
  );

  if (message.attachments.size > 0 && !message.author.bot) {
    const files = message.attachments.map((attachment) => attachment.url).join(';');
    writeCsvLog([timestamp, message.guild.name, channel.name ?? '', message.author.tag, files].join(','));
  }
});

registerCommands(client, commands);

client.once('ready', (readyClient) => {
  console.log(`${readyClient.user.tag} でログインしています。`);
});

client.login(env.discordBotToken);
