import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import type { Message } from 'discord.js';
import type { Command } from '../discord/types';
import { env } from '../config/env';

const keyChatGPT = '!c';
const historyLimit = 10;

/**
 * スレッド内の直近のメッセージ(最大historyLimit件、古い順)から会話履歴を組み立てる。
 * 返信チェーンを遡る旧実装と違い、スレッドの直近メッセージをまとめて1回のAPI呼び出しで
 * 取得するだけなので、メッセージ毎に再帰処理が走ることはない。
 */
async function buildHistory(threadMessage: Message): Promise<ChatCompletionMessageParam[]> {
  const fetched = await threadMessage.channel.messages.fetch({ limit: historyLimit, before: threadMessage.id });
  const ordered = [...fetched.values()].reverse();
  const history: ChatCompletionMessageParam[] = ordered.map((m) => ({
    role: m.author.bot ? 'assistant' : 'user',
    content: m.content,
  }));
  history.push({ role: 'user', content: threadMessage.content });
  return history;
}

/**
 * !c ChatGPTとおしゃべりする。
 * !cで話しかけるとスレッドが作られ、そのスレッド内での発言は!c無しで会話を継続できる
 * (直近historyLimit件を会話履歴として送る)。
 * 以前は返信チェーンを遡って会話履歴を組み立てていたが、すべての受信メッセージに対して
 * 毎回チェーンを遡る処理が走ってしまい無駄が大きく、トークン数による履歴間引きにも
 * バグがあったため撤廃していた。スレッド単位にすることで、その問題を再発させずに
 * 会話継続を実現している。
 */
export const chatGptCommand: Command = {
  name: 'chatgpt',
  async handle(message) {
    const isThreadMessage = message.channel.isThread();

    if (isThreadMessage) {
      const starter = await message.channel.fetchStarterMessage().catch(() => null);
      if (!starter || !starter.content.startsWith(keyChatGPT)) return;
    } else if (!message.content.startsWith(keyChatGPT)) {
      return;
    }

    if (!env.openaiApiKey) {
      await message.reply('OpenAIのAPIキーが設定されてへんから喋れんわ。');
      return;
    }

    const openai = new OpenAI({ apiKey: env.openaiApiKey });

    try {
      const history = isThreadMessage
        ? await buildHistory(message)
        : [{ role: 'user', content: message.content.slice(keyChatGPT.length).trim() } as ChatCompletionMessageParam];

      const res = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: history,
      });
      const answer = res.choices[0].message?.content ?? 'なんも言えんかったわ。';
      console.log(`「${history[history.length - 1].content}」\n「${answer}」`);
      console.log('total tokens:', res.usage?.total_tokens);

      if (isThreadMessage) {
        await message.reply(answer);
      } else {
        const thread = await message.startThread({ name: 'ChatGPTとおしゃべり' });
        await thread.send(answer);
      }
    } catch (e) {
      console.log(e);
      await message.reply('なんやて？もっかい頼むわ');
    }
  },
};

export const chatGptCommands: Command[] = [chatGptCommand];
