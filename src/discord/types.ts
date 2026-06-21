import type { Client, Message } from 'discord.js';

/**
 * 旧index.jsの「独立したif判定がそれぞれ反応する」挙動を維持するための単位。
 * 1コマンド(または密接に関連する複数コマンド)につき1つのCommandを実装する。
 */
export interface Command {
  name: string;
  handle(message: Message, client: Client): Promise<void> | void;
}
