import type { Command } from '../discord/types';
import { sendDM } from '../utils/dm';

const keyDM = '!DM';

/** !DM さいころ君の機能をDMでも使えるようにする */
export const dmCommand: Command = {
  name: 'dm-enable',
  async handle(message, client) {
    if (!message.content.startsWith(keyDM)) return;
    await sendDM(client, message.author.id, 'よろしゅう');
    try {
      await message.delete();
    } catch (e) {
      console.log('メッセージ削除エラー（おそらくサイコロ君botに管理者権限が無い鯖での使用）');
      console.log(e);
    }
  },
};

export const dmCommands: Command[] = [dmCommand];
