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

/** Discordのスレッド名の文字数上限(100文字)に収まるよう、改行を取り除いて安全にトリムする。 */
function toThreadName(text: string, maxLength: number): string {
  return text.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

/**
 * 質問文を20文字程度の日本語タイトルに要約する。web_searchツールは使わないので、
 * 回答取得のリクエストと並行して呼んでもコスト・レイテンシへの影響はごく小さい。
 * 失敗したり空文字が返ってきた場合は、質問文の先頭をそのままタイトルとして使う。
 */
async function generateThreadTitle(openai: OpenAI, ask: string): Promise<string> {
  try {
    const res = await openai.responses.create({
      model: 'gpt-4o-mini',
      input: `次の質問を20文字以内の日本語タイトルに要約して。タイトルの文字列だけを出力して、説明や引用符は付けないこと。\n質問：${ask}`,
    });
    const title = toThreadName(res.output_text, 90);
    return title === '' ? toThreadName(ask, 30) : title;
  } catch (e) {
    console.log(e);
    return toThreadName(ask, 30);
  }
}

/**
 * !c ChatGPTとおしゃべりする。
 * !cで話しかけるとスレッドが作られ、そのスレッド内での発言は!c無しで会話を継続できる。
 * スレッドのタイトルは最初の質問内容を要約したものになる。
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
      const [res, title] = await Promise.all([
        openai.responses.create({
          model: 'gpt-4o-mini',
          input: ask,
          previous_response_id: previousResponseId,
          tools: [{ type: 'web_search' }],
          tool_choice: 'auto',
        }),
        isThreadMessage ? Promise.resolve(null) : generateThreadTitle(openai, ask),
      ]);
      const answer = res.output_text || 'なんも言えんかったわ。';
      console.log(`「${ask}」\n「${answer}」`);
      console.log('total tokens:', res.usage?.total_tokens);

      if (isThreadMessage) {
        threadResponseIds.set(message.channel.id, res.id);
        await message.reply(answer);
      } else {
        const thread = await message.startThread({ name: title ?? 'ChatGPTとおしゃべり' });
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
