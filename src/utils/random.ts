/**
 * 1〜maxのランダムな整数を返す。
 * 本来Math.floorを使うべき式だが、既存の挙動(ダイスロール等)を変えないためそのまま維持している。
 */
export function getRandomInt(max: number): number {
  return Math.ceil(Math.random() * max);
}

/** 0〜max-1のランダムな整数を返す(配列の0-indexedアクセス用)。 */
export function getRandomIndex(max: number): number {
  return Math.floor(Math.random() * max);
}
