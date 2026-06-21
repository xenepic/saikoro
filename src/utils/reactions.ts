import type { Message, MessageReaction, PartialUser, User } from 'discord.js';

const FAILURE_EMOJI = '💦';

/**
 * 投票・選択用のリアクションを使い終わった後に取り除く。
 * 管理者権限が無い鯖では失敗するため、その場合は無視する。
 */
export async function removeReactionSafely(reaction: MessageReaction, user: User | PartialUser): Promise<void> {
  try {
    await reaction.users.remove(user.id);
  } catch (error) {
    console.log('リアクション除去エラー（おそらくサイコロ君botに管理者権限が無い鯖での使用）');
    console.log(error);
  }
}

/**
 * コマンド処理中にエラーが起きた際、重い文面の返信ではなく
 * 発言にリアクションを付けるだけで「あかんかった」ことを伝える。
 */
export async function reactFailure(message: Message): Promise<void> {
  try {
    await message.react(FAILURE_EMOJI);
  } catch (error) {
    console.error('失敗リアクションの付与にも失敗しました', error);
  }
}
