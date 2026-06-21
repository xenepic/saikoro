import OpenAI from 'openai';
import type { Command } from '../discord/types';
import { env } from '../config/env';

const keyChatGPT = '!c';

/**
 * スレッドID→直前のResponse IDのマップ。
 * プロセスのメモリ上だけで保持しており、デプロイ等でBotが再起動すると
 * 進行中の会話スレッドは文脈を失う(エラーにはならず、新規の会話として応答するだけ)。
 */
const threadResponseIds = new Map<string, string>();

/**
 * !c ChatGPTとおしゃべりする。
 * !cで話しかけるとスレッドが作られ、そのスレッド内での発言は!c無しで会話を継続できる。
 * Responses APIの`previous_response_id`で会話履歴をOpenAI側に委ねているため、
 * こちらでメッセージ履歴を組み立てる必要はない。
 * 必要に応じてWeb検索ツール(web_search)を使えるようにしている(tool_choice: "auto"なので
 * 検索が要らない会話では使われない)。
 */
export const chatGptCommand: Command = {
  name: 'chatgpt',
  async handle(message) {
    const isThreadMessage = message.channel.isThread();
    const previousResponseId = isThreadMessage ? threadResponseIds.get(message.channel.id) : undefined;

    if (isThreadMessage) {
      if (!previousResponseId) return;
    } else if (!message.content.startsWith(keyChatGPT)) {
      return;
    }

    if (!env.openaiApiKey) {
      await message.reply('OpenAIのAPIキーが設定されてへんから喋れんわ。');
      return;
    }

    const openai = new OpenAI({ apiKey: env.openaiApiKey });
    const ask = isThreadMessage ? message.content : message.content.slice(keyChatGPT.length).trim();

    try {
      const res = await openai.responses.create({
        model: 'gpt-4o-mini',
        input: ask,
        previous_response_id: previousResponseId,
        tools: [{ type: 'web_search' }],
        tool_choice: 'auto',
      });
      const answer = res.output_text || 'なんも言えんかったわ。';
      console.log(`「${ask}」\n「${answer}」`);
      console.log('total tokens:', res.usage?.total_tokens);

      if (isThreadMessage) {
        threadResponseIds.set(message.channel.id, res.id);
        await message.reply(answer);
      } else {
        const thread = await message.startThread({ name: 'ChatGPTとおしゃべり' });
        threadResponseIds.set(thread.id, res.id);
        await thread.send(answer);
      }
    } catch (e) {
      console.log(e);
      await message.reply('なんやて？もっかい頼むわ');
    }
  },
};

export const chatGptCommands: Command[] = [chatGptCommand];
