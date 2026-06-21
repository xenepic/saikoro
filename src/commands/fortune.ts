import type { Command } from '../discord/types';
import { getRandomInt } from '../utils/random';
import { zenkakuToHankaku } from '../utils/discordText';
import { getPokemonByRandom } from '../domain/pokemon';

const keyUranai = '【占い】';
const keyLuna = '【ルナ】';
const keySuimin = '【睡眠】';
const keyKishou = '【起床】';

const lunaMonth: Record<string, string> = {
  '1': '麻雀を打って',
  '2': '歩いただけで',
  '3': '絶対に',
  '4': '滑って転んで',
  '5': '信仰心で',
  '6': '雨が降るたび',
  '7': '本を読んだら',
  '8': '運動すると',
  '9': '女神を慕うと',
  '10': '締切に追われて',
  '11': '月を眺めて',
  '12': 'まぁまぁ',
};

const lunaDay: Record<string, string> = {
  '1': 'いっぱい褒められる',
  '2': '女神ルナに占われる',
  '3': '年末ジャンボ宝くじ券を披露',
  '4': '某魔女さんが通る',
  '5': '女神に酷使される',
  '6': 'カップ焼きそばの湯切りに失敗',
  '7': '助けられる',
  '8': '残業させられる',
  '9': '大金を拾う',
  '10': '某アイドルの総選挙に出馬',
  '11': '女神に刺される',
  '12': '女神にばぶばぶできる',
  '13': '毎日が誕生日',
  '14': '過去と決別する',
  '15': '卵の黄身が2つ入っている',
  '16': '自分を省みる',
  '17': '道に迷う',
  '18': 'Twitterが炎上する',
  '19': 'クロワッサンになる',
  '20': 'iPhone6sが使えなくなる',
  '21': '異臭が漂う',
  '22': '立ち止まる',
  '23': 'ポッキーを突っ込まれる',
  '24': '風邪をひく',
  '25': '何かに執着する',
  '26': '振られる',
  '27': '猫を拾う',
  '28': '大成功する',
  '29': '警察に捕まる',
  '30': '普段見れない役満が出る',
  '31': 'スムーズにことが運ぶ',
};

const luckyItems = [
  'たけのこの里', 'ハンバーグ', '天一のラーメン', '陶器のコップ', '蜘蛛', '綾鷹', '昔のゲーム', 'サイコロ', '茶色いキーホルダー', 'モンスターボール',
  'おっぱい', '傘', '20円玉', '蚊取り線香', 'ポケットティッシュ配りお姉さん', '鳥居', '液晶画面', 'ソイラテ', '黒いお箸', 'チルタリス', '女神',
  '　ひとで　', '波の音', '剥げてるおじさん', '20cm以上の髪の毛', '呪いのお札', '丸めたアルミホイル', '優しい人の心臓', '臓器移植', 'undefined', '一筒',
  '黒マスク', '生爪', 'とかげの黒焼き', 'フォロー数＝フォロワー数の人', 'Gの右足', '原子力潜水艦', '映画の半券', '親への手紙', 'いちご系女子',
  'ディズニーアニメ', '雪の結晶', 'ワンセグ付きスマホ', 'うぃんがでぃあむ、れびおさーｗｗｗ', 'アルミ缶の上にある玉ねぎ', '傘の先端の部品', '駅員さんの笑顔', '髪以外の毛', '栗抜きモンブラン', 'チーズ抜きダブチー',
  '乾燥剤', 'ニワトリ以外の卵', '四角いペットボトル', 'うずくまる人', 'BIG ISSUE（雑誌）', 'でかいテレビ',
];

/** 【占い】 今日の運勢・ラッキーアイテム・ラッキーポケモンを占う */
export const fortuneCommand: Command = {
  name: 'fortune',
  async handle(message) {
    if (!message.content.startsWith(keyUranai)) return;
    const fortune = getRandomInt(100);
    let output: string;

    if (fortune <= 5) output = '今日の運勢は大大大吉クリティカル！これであなたも一発チルタリス！';
    else if (fortune <= 10) output = '今日の運勢は、大大吉！カップラーメンが３０秒で出来上がる！';
    else if (fortune <= 20) output = '今日の運勢は、大吉！シャーペンの芯が一回も折れない！';
    else if (fortune <= 30) output = '今日の運勢は、中吉！Twitterでやべぇ発言しても一回くらい許されるよ。';
    else if (fortune <= 40) output = '今日の運勢は、中吉！爪切ったら白い部分の幅が全て均等になるよ。';
    else if (fortune <= 50) output = '今日の運勢は、吉！回転寿司行ったらサーモン10個くらい流れてくるよ。';
    else if (fortune <= 60) output = '今日の運勢は、平！単眼猫に食われるよ。';
    else if (fortune <= 70) output = '今日の運勢は、半吉！開かない方のドアの前で待ってそう。';
    else if (fortune <= 80) output = '今日の運勢は、末吉！週末ならフィーバーしてもヨシ！';
    else if (fortune <= 90) output = '今日の運勢は、凶！トイレットペーパーの予備を持ち歩こう。';
    else if (fortune <= 95) output = '---error--- \nYour divination has been invalidated.';
    else output = '今日の運勢は、大大大凶！布団の中にGが居ないかちゃんと確かめてね。';

    output += '\nラッキーアイテムは、' + luckyItems[getRandomInt(luckyItems.length - 1)] + '！';
    output += '\nラッキーポケモンは、' + getPokemonByRandom() + '！';

    await message.reply('```\n' + output + '\n```');
  },
};

/** 【ルナ】月日 ルナさんの誕生日占い */
export const lunaFortuneCommand: Command = {
  name: 'luna-fortune',
  async handle(message) {
    if (!message.content.startsWith(keyLuna)) return;
    const normalized = zenkakuToHankaku(message.content.replace(keyLuna, '').replace('月', '/').replace('日', ''));
    const [month, day] = normalized.split('/');
    await message.reply('```\n' + lunaMonth[month] + ' ' + lunaDay[day] + '\n```');
  },
};

/** 【睡眠】 寝れるかどうかをランダム判定する */
export const sleepCommand: Command = {
  name: 'sleep-check',
  async handle(message) {
    if (!message.content.startsWith(keySuimin)) return;
    const border = getRandomInt(100);
    const point = getRandomInt(80);
    if (point <= border) await message.reply('```md\nCCB<=' + border + ' ➔ [' + point + ']\n#睡眠成功！ﾈﾛ\n```');
    else await message.reply('```cs\nCCB<=' + border + ' ➔ [' + point + ']\n#睡眠失敗！夜は長いよ。\n```');
  },
};

/** 【起床】 起きれるかどうかをランダム判定する */
export const wakeUpCommand: Command = {
  name: 'wake-up-check',
  async handle(message) {
    if (!message.content.startsWith(keyKishou)) return;
    const border = getRandomInt(100);
    const point = getRandomInt(80);
    if (point <= border) await message.reply('```md\nCCB<=' + border + ' ➔ [' + point + ']\n#起床成功！ｵﾊﾖ\n```');
    else await message.reply('```cs\nCCB<=' + border + ' ➔ [' + point + ']\n#起床失敗！おやすみﾉｼ\n```');
  },
};

export const fortuneCommands: Command[] = [fortuneCommand, lunaFortuneCommand, sleepCommand, wakeUpCommand];
