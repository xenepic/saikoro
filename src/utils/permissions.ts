import type { User } from 'discord.js';

/**
 * 運営陣かどうかを判定する。旧実装から判定ロジックがコメントアウトされた状態で
 * 引き継いでおり、現状は常にfalseを返す(運営限定コマンドは事実上誰も実行できない)。
 * この挙動は意図的に維持している。
 */
export function isFromUnei(_user: User): boolean {
  return false;
}
