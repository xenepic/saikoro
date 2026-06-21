import type { Client } from 'discord.js';

/** 指定ユーザーにDMを送る。失敗してもエラーはログに出すだけで上位には伝播しない。 */
export async function sendDM(client: Client, userId: string, text: string): Promise<void> {
  try {
    const user = await client.users.fetch(userId);
    await user.send(text);
    console.log(`DM送信(${user.tag.split('#')[0]}): ${text}`);
  } catch (e) {
    console.log(e);
  }
}
