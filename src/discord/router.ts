import type { Client } from 'discord.js';
import type { Command } from './types';
import { reactFailure } from '../utils/reactions';

const keyLotteryAccept = '【抽選受付】';

/**
 * Botが送信したメッセージは、原則コマンド処理の対象外とする。
 * 例外: 天気予報の追従コマンドのようにBot自身のEmbed付きメッセージに
 * リアクションして再検索する機能や、抽選受付メッセージへの反応が必要なため、
 * Embedを持つメッセージと【抽選受付】はガードを通す。
 */
function shouldSkip(message: { author: { bot: boolean }; content: string; embeds: unknown[] }): boolean {
  if (!message.author.bot) return false;
  if (message.content.startsWith(keyLotteryAccept)) return false;
  if (message.embeds.length > 0) return false;
  return true;
}

/**
 * 各Commandを独立して評価する。旧index.jsのif分岐の連続と同様、
 * 複数のコマンドが同時に反応してよい(最初の一致で処理を止めない)。
 * 1コマンドの例外が他のコマンドの処理を妨げないよう、個別にtry/catchする。
 */
export function registerCommands(client: Client, commands: Command[]): void {
  client.on('messageCreate', async (message) => {
    if (shouldSkip(message)) return;
    for (const command of commands) {
      try {
        await command.handle(message, client);
      } catch (error) {
        console.error(`[${command.name}] コマンド処理中にエラーが発生しました`, error);
        await reactFailure(message);
      }
    }
  });
}
