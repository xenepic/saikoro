import OpenAI from 'openai';
import type { Command } from '../discord/types';
import { env } from '../config/env';

const keyChatGPT = '!c';

/**
 * !c ChatGPTとおしゃべりする。
 * 以前は返信チェーンを遡って会話履歴を組み立てていたが、すべての受信メッセージに対して
 * 毎回チェーンを遡る処理が走ってしまい無駄が大きく、トークン数による履歴間引きにも
 * バグがあったため、単発の質問・応答のみのシンプルな形に変更している。
 */
export const chatGptCommand: Command = {
  name: 'chatgpt',
  async handle(message) {
    if (!message.content.startsWith(keyChatGPT)) return;
    if (!env.openaiApiKey) {
      await message.reply('OpenAIのAPIキーが設定されてへんから喋れんわ。');
      return;
    }

    const ask = message.content.slice(keyChatGPT.length).trim();
    const openai = new OpenAI({ apiKey: env.openaiApiKey });

    try {
      const res = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: ask }],
      });
      const answer = res.choices[0].message?.content ?? 'なんも言えんかったわ。';
      console.log(`「${ask}」\n「${answer}」`);
      console.log('total tokens:', res.usage?.total_tokens);
      await message.reply(answer);
    } catch (e) {
      console.log(e);
      await message.reply('なんやて？もっかい頼むわ');
    }
  },
};

export const chatGptCommands: Command[] = [chatGptCommand];
