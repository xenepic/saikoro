import type { Message, MessageReaction, PartialUser, User } from 'discord.js';
import type { Command } from '../discord/types';
import { iconsABC } from '../utils/icons';
import { getRandomInt } from '../utils/random';
import { sendDM } from '../utils/dm';
import { removeReactionSafely } from '../utils/reactions';
import {
  getWordWolfEmbed,
  getWordWolfMessageList,
  getWordWolfVoteEmbed,
  getWordWolfVoteResultEmbed,
  getWordWolfRuleEmbed,
  type WordWolfParticipants,
  type WordWolfVoteEntry,
} from '../domain/wordwolf';

const keyWordWolf = '【ワードウルフ】';

/** 投票用エンベッドを返信し、参加者の投票を集計する。 */
async function replyWordWolfVoteEmbed(message: Message, participants: WordWolfParticipants): Promise<void> {
  const rep = await message.reply(getWordWolfVoteEmbed(participants));

  const isFinalVote = participants.player.some((e) => e.finalVote === true);
  const votingPlayers = isFinalVote ? participants.player.filter((e) => e.finalVote === true) : participants.player;
  for (let i = 0; i < votingPlayers.length; i++) await rep.react(iconsABC[i]);

  const vote: WordWolfVoteEntry[] = participants.player.map((e) => ({ name: e.name, voted: [], killed: false }));

  const filter = (r: MessageReaction, u: User | PartialUser) =>
    iconsABC.slice(0, votingPlayers.length).includes(r.emoji.name ?? '') &&
    votingPlayers.map((e) => e.name).includes(u.tag?.split('#')[0] ?? '');
  const collector = rep.createReactionCollector({ filter, time: 10 * 60 * 1000 });
  collector.on('collect', async (reaction, user) => {
    const voterName = user.tag.split('#')[0];
    //既に投票していた場合は取り消してから新しい投票先に入れる
    const existing = vote.find((e) => e.voted.includes(voterName));
    if (existing) existing.voted = existing.voted.filter((name) => name !== voterName);
    vote[iconsABC.indexOf(reaction.emoji.name ?? '')].voted.push(voterName);

    if (vote.reduce((sum, e) => sum + e.voted.length, 0) === votingPlayers.length) {
      await replyWordWolfVoteResultEmbed(rep, participants, vote);
    }
    await removeReactionSafely(reaction, user);
  });
}

/** 投票結果エンベッドを返信し、処刑・決選投票・勝敗判定を行う。 */
async function replyWordWolfVoteResultEmbed(
  message: Message,
  participants: WordWolfParticipants,
  vote: WordWolfVoteEntry[],
): Promise<void> {
  const isFinalVote = participants.player.some((e) => e.finalVote === true);
  const max = Math.max(...vote.map((e) => e.voted.length));
  let killedName: string;

  if (vote.filter((e) => e.voted.length === max).length >= 2) {
    if (isFinalVote) {
      //既に決選投票だった場合、2回連続では行わずランダムで処刑者を決定
      const tied = vote.filter((e) => e.voted.length === max);
      killedName = tied[getRandomInt(tied.length) - 1].name;
      vote.find((e) => e.name === killedName)!.killed = true;
      participants.player.forEach((e) => {
        e.finalVote = false;
      });
    } else {
      //決選投票へ移行
      vote.filter((e) => e.voted.length === max).forEach((e) => {
        participants.player.find((p) => p.name === e.name)!.finalVote = true;
      });
      await message.reply(getWordWolfVoteResultEmbed(participants, vote, 'continue'));
      await replyWordWolfVoteEmbed(message, participants);
      return;
    }
  } else {
    killedName = vote.find((e) => e.voted.length === max)!.name;
    vote[vote.findIndex((e) => e.name === killedName)].killed = true;
  }

  //処刑されたプレイヤーはwatcherに移動する
  const killedEntry = vote.find((e) => e.name === killedName)!;
  participants.watcher.push({ name: killedEntry.name, id: '' });
  const index = participants.player.map((e) => e.name).indexOf(killedName);
  participants.player = participants.player.slice(0, index).concat(participants.player.slice(index + 1));

  const villagerNum = participants.player.filter((e) => e.role === 'Villager').length;
  const wolfNum = participants.player.filter((e) => e.role === 'Wolf').length;
  const state = wolfNum === 0 ? 'winVillager' : villagerNum === 0 ? 'winWolf' : 'continue';

  const rep = await message.reply(getWordWolfVoteResultEmbed(participants, vote, state));
  await rep.react('📄');
  if (state === 'continue') await rep.react('📮');

  const filter = (r: MessageReaction, u: User | PartialUser) =>
    ['📄', '📮'].includes(r.emoji.name ?? '') && participants.player.map((e) => e.name).includes(u.tag?.split('#')[0] ?? '');
  const collector = rep.createReactionCollector({ filter, time: 10 * 60 * 1000 });
  collector.on('collect', async (reaction, user) => {
    if (reaction.emoji.name === '📄' && !user.bot) {
      await rep.edit(getWordWolfVoteResultEmbed(participants, vote, state, true));
      await removeReactionSafely(reaction, user);
    }
    if (state === 'continue' && reaction.emoji.name === '📮' && !user.bot) {
      await removeReactionSafely(reaction, user);
      await replyWordWolfVoteEmbed(rep, participants);
    }
  });
}

/** 【ワードウルフ】 参加受付から投票・勝敗判定までの一連のゲーム進行を管理する。 */
export const wordWolfCommand: Command = {
  name: 'wordwolf',
  async handle(message, client) {
    if (!message.content.startsWith(keyWordWolf)) return;
    const participants: WordWolfParticipants = { player: [], watcher: [] };

    const rep = await message.reply(getWordWolfEmbed(participants));
    await rep.react('🐺');
    await rep.react('👀');
    await rep.react('☑️');
    await rep.react('❌');
    await rep.react('💡');

    const filter = (r: MessageReaction) => ['🐺', '👀', '☑️', '❌', '💡'].includes(r.emoji.name ?? '');
    const collector = rep.createReactionCollector({ filter, time: 210 * 60 * 1000 });
    collector.on('collect', async (reaction, user) => {
      if (user.bot) return;
      const userName = user.tag.split('#')[0];

      if (reaction.emoji.name === '🐺') {
        if (!participants.player.map((e) => e.name).includes(userName)) {
          participants.player.push({ name: userName, id: user.id, role: 'Villager', finalVote: false });
        }
        const watcherIndex = participants.watcher.map((e) => e.name).indexOf(userName);
        if (watcherIndex !== -1) {
          participants.watcher = participants.watcher.slice(0, watcherIndex).concat(participants.watcher.slice(watcherIndex + 1));
        }
        await rep.edit(getWordWolfEmbed(participants));
        await removeReactionSafely(reaction, user);
      }

      if (reaction.emoji.name === '👀') {
        if (!participants.watcher.map((e) => e.name).includes(userName)) {
          participants.watcher.push({ name: userName, id: user.id });
        }
        const playerIndex = participants.player.map((e) => e.name).indexOf(userName);
        if (playerIndex !== -1) {
          participants.player = participants.player.slice(0, playerIndex).concat(participants.player.slice(playerIndex + 1));
        }
        await rep.edit(getWordWolfEmbed(participants));
        await removeReactionSafely(reaction, user);
      }

      if (reaction.emoji.name === '☑️') {
        if (participants.player.length <= 2) {
          await rep.edit(getWordWolfEmbed(participants, true));
        } else {
          //狼の人数は参加者数を3で割った数
          const wolfNum = Math.floor(participants.player.length / 3);
          for (let i = 0; i < wolfNum; i++) {
            const villagers = participants.player.filter((e) => e.role === 'Villager');
            villagers[getRandomInt(villagers.length) - 1].role = 'Wolf';
          }
          //全員にDMでお題を伝える
          const messageList = getWordWolfMessageList(participants);
          for (const m of messageList) await sendDM(client, m.id, m.message);

          await replyWordWolfVoteEmbed(rep, participants);
        }
        await removeReactionSafely(reaction, user);
      }

      if (reaction.emoji.name === '❌') {
        const playerIndex = participants.player.map((e) => e.name).indexOf(userName);
        if (playerIndex !== -1) {
          participants.player = participants.player.slice(0, playerIndex).concat(participants.player.slice(playerIndex + 1));
        }
        const watcherIndex = participants.watcher.map((e) => e.name).indexOf(userName);
        if (watcherIndex !== -1) {
          participants.watcher = participants.watcher.slice(0, watcherIndex).concat(participants.watcher.slice(watcherIndex + 1));
        }
        await rep.edit(getWordWolfEmbed(participants));
        await removeReactionSafely(reaction, user);
      }

      if (reaction.emoji.name === '💡') {
        await rep.reply(getWordWolfRuleEmbed());
      }
    });
  },
};

export const wordWolfCommands: Command[] = [wordWolfCommand];
