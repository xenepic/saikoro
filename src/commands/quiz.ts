import type { Message } from 'discord.js';
import { EmbedBuilder } from 'discord.js';
import type { Command } from '../discord/types';
import { Quiz } from '../domain/quiz';
import { quizNextBamboo, quizNext1shanten } from './mahjong';

const keyQuiz = '【クイズ】';
const keyQuizReset = '!qreset';
const keyQuizRanking = '!qranking';

type QuizAnswers = Record<string, string[]>;

/** 解答を表示し、▶️で次の問題、👋で終了する。 */
async function quizCheckAnswer(message: Message, quiz: Quiz, answers: QuizAnswers): Promise<void> {
  const answerEmbed = await quiz.getAnswerEmbed(answers);
  const rep = await message.reply({ embeds: [answerEmbed] });
  await rep.react('▶️');
  await rep.react('👋');

  let nextQuizFlag = true;
  const collector = rep.createReactionCollector({ time: 5 * 60 * 1000 });
  collector.on('collect', async (reaction, user) => {
    if (reaction.emoji.name === '▶️' && !user.bot && nextQuizFlag) {
      nextQuizFlag = false;
      await quizNextQuestion(rep, quiz);
    }
    if (reaction.emoji.name === '👋' && !user.bot) {
      await quiz.endQuiz();
      await rep.reply('またきてね！');
    }
  });
  collector.on('end', async () => {
    await quiz.endQuiz();
  });
}

/** 次の4択クイズを出題する。 */
async function quizNextQuestion(message: Message, quiz: Quiz): Promise<void> {
  const answers: QuizAnswers = { '🇦': [], '🇧': [], '🇨': [], '🇩': [] };
  const iconsAD = ['🇦', '🇧', '🇨', '🇩'] as const;
  let answerFlag = false;
  let checkReactionFlag = false;

  const rep = await message.reply({ embeds: [quiz.getQuestionEmbed()] });
  for (const icon of iconsAD) await rep.react(icon);

  const collector = rep.createReactionCollector({ time: 5 * 60 * 1000 });
  collector.on('collect', async (reaction, user) => {
    const emoji = reaction.emoji.name as (typeof iconsAD)[number] | null;
    if (emoji && iconsAD.includes(emoji) && !user.bot) {
      //既にリアクションが付いている場合があるので、回答配列から一旦名前を削除
      for (const icon of iconsAD) {
        answers[icon] = answers[icon].filter((name) => name != user.tag.split('#')[0]);
      }
      answers[emoji].push(user.tag.split('#')[0]);
      if (!checkReactionFlag) {
        checkReactionFlag = true;
        await rep.react('☑️');
      }
    }

    if (reaction.emoji.name === '☑️' && !user.bot && !answerFlag) {
      answerFlag = true;
      await quizCheckAnswer(rep, quiz, answers);
    }
  });

  collector.on('end', async () => {
    if (!answerFlag) await quizCheckAnswer(rep, quiz, answers);
  });
}

/** 【クイズ】 4択クイズ・バンブー麻雀待ち当て・1シャンテン何切るのメニューを表示する */
export const quizMenuCommand: Command = {
  name: 'quiz-menu',
  async handle(message) {
    if (!message.content.startsWith(keyQuiz)) return;

    const quizEmbed = new EmbedBuilder();
    quizEmbed.setTitle('クイズ');
    quizEmbed.setDescription('色々なクイズが遊べます');
    quizEmbed.setColor('#8a2be2');
    quizEmbed.addFields(
      { name: '4️⃣4択クイズ', value: '普通の4択クイズです。\n難易度はバラバラ。', inline: false },
      { name: '🎍バンブー麻雀待ち当てクイズ', value: 'テンパイしている索子のみの配牌が出てくるので、その待ちを答えてください。', inline: false },
      { name: '🀄1シャンテン何切る問題', value: '受け入れ枚数が最も多くなるように牌を切ってください', inline: false },
    );

    const rep = await message.reply({ embeds: [quizEmbed] });
    await rep.react('4️⃣');
    await rep.react('🎍');
    await rep.react('🀄');

    const collector = rep.createReactionCollector({ time: 5 * 60 * 1000 });
    collector.on('collect', async (reaction, user) => {
      if (user.bot) return;
      if (reaction.emoji.name === '4️⃣') await quizNextQuestion(message, new Quiz());
      if (reaction.emoji.name === '🎍') await quizNextBamboo(message);
      if (reaction.emoji.name === '🀄') await quizNext1shanten(message);
    });
  },
};

/** !qreset クイズの出題カウントをリセットする */
export const quizResetCommand: Command = {
  name: 'quiz-reset',
  async handle(message) {
    if (!message.content.startsWith(keyQuizReset)) return;
    const quiz = new Quiz();
    quiz.resetQuestions();
    await quiz.endQuiz();
    await message.reply('クイズの出題カウントをリセットしました。');
  },
};

/** !qranking クイズの連続正解数ランキングを表示する */
export const quizRankingCommand: Command = {
  name: 'quiz-ranking',
  async handle(message) {
    if (!message.content.startsWith(keyQuizRanking)) return;
    const quiz = new Quiz();
    const rankingEmbed = await quiz.getRankingEmbed();
    await message.reply({ embeds: [rankingEmbed] });
    await quiz.endQuiz();
  },
};

export const quizCommands: Command[] = [quizMenuCommand, quizResetCommand, quizRankingCommand];
