/**
 * 文字列の表示幅を返す(半角=1、全角=2)。Discordの等幅表示崩れを防ぐための整形に使用する。
 */
export function strLength(str: string): number {
  let len = 0;
  for (const ch of str) {
    len += /[ -~]/.test(ch) ? 1 : 2;
  }
  return len;
}

/**
 * 文字列が指定された表示幅になるまで全角スペースを付与する。
 * Discordでは半角スペースが行頭・連続箇所で削除されるため、全角スペースで桁を揃える。
 */
export function getEqualLengthStr(str: string, len: number): string {
  let result = str;
  if (strLength(result) % 2 === 1) result += ' ';
  while (strLength(result) < len) {
    result += '　';
  }
  return result;
}

/** 全角英数文字を半角英数文字に変換する。 */
export function zenkakuToHankaku(str: string): string {
  return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0));
}
