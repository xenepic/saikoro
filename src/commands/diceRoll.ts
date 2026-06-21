import type { Command } from '../discord/types';
import { getRandomInt } from '../utils/random';

const keyDiceRoll = '!d';

/**
 * !d 1d6 のようなダイスロール。不等号での成功判定にも対応する(四則演算は非対応)。
 * ココフォリアのダイス記法を簡易再現したもの。
 */
export const diceRollCommand: Command = {
  name: 'dice-roll',
  async handle(message) {
    if (!message.content.startsWith(keyDiceRoll)) return;

    let content = message.content.replace('CCB', '1d100').replace('ccb', '1d100').replace(keyDiceRoll + ' ', '');

    const match = content.match(/^(\d+)d(\d+)((<=|>=|<|>)\d+)?(.*)$/);
    if (!match) return;

    const [, countStr, sidesStr, borderExpr, comparator] = match;
    const count = parseInt(countStr, 10);
    const sides = parseInt(sidesStr, 10);
    const isComparison = borderExpr !== undefined;

    const resultEach: number[] = [];
    for (let i = 0; i < count; i++) {
      resultEach.push(getRandomInt(sides));
    }
    const result = resultEach.reduce((sum, value) => sum + value, 0);

    let output = content + ' ： ';
    output += count === 1 ? `[${result}]` : `[${resultEach.join()}]=[${result}]`;

    let isSuccess = false;
    if (isComparison && borderExpr && comparator) {
      const border = parseInt(borderExpr.replace(comparator, ''), 10);
      if (comparator === '<') isSuccess = result < border;
      else if (comparator === '<=') isSuccess = result <= border;
      else if (comparator === '>') isSuccess = result > border;
      else if (comparator === '>=') isSuccess = result >= border;

      if (isSuccess && result <= 5 && count === 1 && sides === 100) {
        output += ' ➔ クリティカル/成功';
      } else if (isSuccess && result <= 10 && count === 1 && sides === 100) {
        output += ' ➔ スペシャル/成功';
      } else if (!isSuccess && result >= 96 && count === 1 && sides === 100) {
        output += ' ➔ ファンブル/致命的失敗';
      } else if (isSuccess) {
        output += ' ➔ 成功';
      } else {
        output += ' ➔ 失敗';
      }
    }

    if (isComparison) {
      await message.reply(isSuccess ? '```md\n#' + output + '\n```' : '```cs\n#' + output + '\n```');
    } else {
      await message.reply('```\n' + output + '\n```');
    }
  },
};
