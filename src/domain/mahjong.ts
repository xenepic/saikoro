import { EmbedBuilder, type AttachmentPayload } from 'discord.js';
import { joinImages } from './joinimages';
import { iconsABC } from '../utils/icons';
import { getRandomIndex } from '../utils/random';
import { getEqualLengthStr } from '../utils/discordText';

export type Pai = string;

interface PaiInfo {
  order: number;
  name1: Pai;
  name2: string;
  path: string;
}

export interface Pattern {
  shuntsu: Pai[][];
  kotsu: Pai[][];
  toitsu: Pai[][];
  tartsu23: Pai[][];
  tartsu12: Pai[][];
  tartsu13: Pai[][];
  dusts: Pai[];
}

interface WasteAndWait {
  waste: Pai;
  wait: Pai[];
}

const paiList: PaiInfo[] = [
  { order: 1, name1: 'm1', name2: '一', path: 'images/m1.png' },
  { order: 2, name1: 'm2', name2: '二', path: 'images/m2.png' },
  { order: 3, name1: 'm3', name2: '三', path: 'images/m3.png' },
  { order: 4, name1: 'm4', name2: '四', path: 'images/m4.png' },
  { order: 5, name1: 'm5', name2: '五', path: 'images/m5.png' },
  { order: 6, name1: 'm5a', name2: '赤五', path: 'images/m5a.png' },
  { order: 7, name1: 'm6', name2: '六', path: 'images/m6.png' },
  { order: 8, name1: 'm7', name2: '七', path: 'images/m7.png' },
  { order: 9, name1: 'm8', name2: '八', path: 'images/m8.png' },
  { order: 10, name1: 'm9', name2: '九', path: 'images/m9.png' },

  { order: 11, name1: 'p1', name2: '①', path: 'images/p1.png' },
  { order: 12, name1: 'p2', name2: '②', path: 'images/p2.png' },
  { order: 13, name1: 'p3', name2: '③', path: 'images/p3.png' },
  { order: 14, name1: 'p4', name2: '④', path: 'images/p4.png' },
  { order: 15, name1: 'p5', name2: '⑤', path: 'images/p5.png' },
  { order: 16, name1: 'p5a', name2: '赤⑤', path: 'images/p5a.png' },
  { order: 17, name1: 'p6', name2: '⑥', path: 'images/p6.png' },
  { order: 18, name1: 'p7', name2: '⑦', path: 'images/p7.png' },
  { order: 19, name1: 'p8', name2: '⑧', path: 'images/p8.png' },
  { order: 20, name1: 'p9', name2: '⑨', path: 'images/p9.png' },

  { order: 21, name1: 's1', name2: '1', path: 'images/s1.png' },
  { order: 22, name1: 's2', name2: '2', path: 'images/s2.png' },
  { order: 23, name1: 's3', name2: '3', path: 'images/s3.png' },
  { order: 24, name1: 's4', name2: '4', path: 'images/s4.png' },
  { order: 25, name1: 's5', name2: '5', path: 'images/s5.png' },
  { order: 26, name1: 's5a', name2: '赤5', path: 'images/s5a.png' },
  { order: 27, name1: 's6', name2: '6', path: 'images/s6.png' },
  { order: 28, name1: 's7', name2: '7', path: 'images/s7.png' },
  { order: 29, name1: 's8', name2: '8', path: 'images/s8.png' },
  { order: 30, name1: 's9', name2: '9', path: 'images/s9.png' },

  { order: 31, name1: 'j1', name2: '東', path: 'images/j1.png' },
  { order: 32, name1: 'j2', name2: '南', path: 'images/j2.png' },
  { order: 33, name1: 'j3', name2: '西', path: 'images/j3.png' },
  { order: 34, name1: 'j4', name2: '北', path: 'images/j4.png' },
  { order: 35, name1: 'j5', name2: '白', path: 'images/j5.png' },
  { order: 36, name1: 'j6', name2: '發', path: 'images/j6.png' },
  { order: 37, name1: 'j7', name2: '中', path: 'images/j7.png' },

  { order: 38, name1: '00', name2: '空白', path: 'images/00.png' },
  { order: 39, name1: '99', name2: '裏', path: 'images/99.png' },
];

const allPaiList: Pai[] = [
  'm1', 'm1', 'm1', 'm1',
  'm2', 'm2', 'm2', 'm2',
  'm3', 'm3', 'm3', 'm3',
  'm4', 'm4', 'm4', 'm4',
  'm5a', 'm5', 'm5', 'm5',
  'm6', 'm6', 'm6', 'm6',
  'm7', 'm7', 'm7', 'm7',
  'm8', 'm8', 'm8', 'm8',
  'm9', 'm9', 'm9', 'm9',

  'p1', 'p1', 'p1', 'p1',
  'p2', 'p2', 'p2', 'p2',
  'p3', 'p3', 'p3', 'p3',
  'p4', 'p4', 'p4', 'p4',
  'p5a', 'p5', 'p5', 'p5',
  'p6', 'p6', 'p6', 'p6',
  'p7', 'p7', 'p7', 'p7',
  'p8', 'p8', 'p8', 'p8',
  'p9', 'p9', 'p9', 'p9',

  's1', 's1', 's1', 's1',
  's2', 's2', 's2', 's2',
  's3', 's3', 's3', 's3',
  's4', 's4', 's4', 's4',
  's5a', 's5', 's5', 's5',
  's6', 's6', 's6', 's6',
  's7', 's7', 's7', 's7',
  's8', 's8', 's8', 's8',
  's9', 's9', 's9', 's9',

  'j1', 'j1', 'j1', 'j1',
  'j2', 'j2', 'j2', 'j2',
  'j3', 'j3', 'j3', 'j3',
  'j4', 'j4', 'j4', 'j4',
  'j5', 'j5', 'j5', 'j5',
  'j6', 'j6', 'j6', 'j6',
  'j7', 'j7', 'j7', 'j7',
];

const allSouzuList: Pai[] = [
  's1', 's1', 's1', 's1',
  's2', 's2', 's2', 's2',
  's3', 's3', 's3', 's3',
  's4', 's4', 's4', 's4',
  's5a', 's5', 's5', 's5',
  's6', 's6', 's6', 's6',
  's7', 's7', 's7', 's7',
  's8', 's8', 's8', 's8',
  's9', 's9', 's9', 's9',
];

/** 牌の並び順を整える(引数自体は変更しない)。 */
function ripai(pais: Pai[]): Pai[] {
  return [...pais].sort(
    (a, b) => paiList.find((e) => e.name1 == a)!.order - paiList.find((e) => e.name1 == b)!.order,
  );
}

//ランダムな牌姿を取得し、その連結画像をoutput.pngに出力する
async function getRandomPaiAndImage(howManyPais = 14): Promise<Pai[]> {
  const nums: number[] = [];
  let pais: Pai[] = [];
  for (let i = 0; i < howManyPais; i++) {
    let num = getRandomIndex(allPaiList.length);
    while (nums.includes(num)) {
      num = getRandomIndex(allPaiList.length);
    }
    nums.push(num);
    pais.push(allPaiList[num]);
  }
  pais = ripai(pais);
  const paiPaths = pais.map((p) => paiList.find((e) => e.name1 == p)!.path);

  try {
    await joinImages(paiPaths);
    return pais;
  } catch (e) {
    console.log(e);
    return ['s1', 's1', 's1', 's1', 'm2', 'm2', 'm2', 'm2', 'p3', 'p3', 'p3', 'p3', 'j1', 'j1'];
  }
}

//牌姿とツモ牌を与えると、その連結した画像をoutput.pngに出力する
async function getPaisImage(pais: Pai[], drawPai: Pai | '' = ''): Promise<Pai[]> {
  const sorted = ripai(pais);
  const paiPaths = sorted.map((p) => paiList.find((e) => e.name1 == p)!.path);

  if (drawPai !== '') {
    paiPaths.push('images/01.png');
    paiPaths.push(paiList.find((e) => e.name1 == drawPai)!.path);
  }

  try {
    await joinImages(paiPaths);
    return sorted;
  } catch (e) {
    console.log(e);
    return ['s1', 's1', 's1', 's1', 'm2', 'm2', 'm2', 'm2', 'p3', 'p3', 'p3', 'p3', 'j1', 'j1'];
  }
}

//ランダムな牌姿を返す。一応引数で牌の枚数も変えられる。
function getRandomPai(howManyPais = 14): Pai[] {
  const nums: number[] = [];
  let pais: Pai[] = [];
  for (let i = 0; i < howManyPais; i++) {
    let num = getRandomIndex(allPaiList.length);
    while (nums.includes(num)) {
      num = getRandomIndex(allPaiList.length);
    }
    nums.push(num);
    pais.push(allPaiList[num]);
  }
  return ripai(pais);
}

//ランダムな索子のみの牌姿を返す。一応引数で牌の枚数も変えられる。
function getRandomPaiBamboo(howManyPais = 14): Pai[] {
  const nums: number[] = [];
  let pais: Pai[] = [];
  for (let i = 0; i < howManyPais; i++) {
    let num = getRandomIndex(allSouzuList.length);
    while (nums.includes(num)) {
      num = getRandomIndex(allSouzuList.length);
    }
    nums.push(num);
    pais.push(allSouzuList[num]);
  }
  return ripai(pais);
}

/**
 * paisで与えられた牌姿を、順子・刻子・対子・両面ターツ・ペンターツ・カンターツとゴミ牌に分けた
 * パターンを全列挙し、resultに追加する。赤ドラ牌(m5aなど)は事前に除去してから呼び出すこと。
 * 旧実装ではresultをモジュールスコープのグローバル変数で持っていたが、複数セッション同時実行時の
 * 競合を避けるため引数で明示的に受け渡す形にしている。
 */
function makePattern(
  pais: Pai[],
  shuntsu: Pai[][],
  kotsu: Pai[][],
  toitsu: Pai[][],
  tartsu23: Pai[][],
  tartsu12: Pai[][],
  tartsu13: Pai[][],
  dusts: Pai[],
  result: Pattern[],
): void {
  //判定牌が無くなったらresultにパターンを追加する。
  if (pais.length == 0) {
    result.push({ shuntsu, kotsu, toitsu, tartsu23, tartsu12, tartsu13, dusts });
    return;
  }

  if (pais.filter((e) => e == pais[0]).length >= 3) {
    //刻子がある場合
    makePattern(pais.slice(3), shuntsu, kotsu.concat([[pais[0], pais[1], pais[2]]]), toitsu, tartsu23, tartsu12, tartsu13, dusts, result);
    makePattern(pais.slice(2), shuntsu, kotsu, toitsu.concat([[pais[0], pais[1]]]), tartsu23, tartsu12, tartsu13, dusts, result);
  } else if (pais.filter((e) => e == pais[0]).length == 2) {
    //対子がある場合
    makePattern(pais.slice(2), shuntsu, kotsu, toitsu.concat([[pais[0], pais[1]]]), tartsu23, tartsu12, tartsu13, dusts, result);
  }

  if (pais[0].slice(0, 1) == 'j' || pais[0].slice(1, 2) == '9') {
    //1枚しかない字牌と、数牌の9はゴミ(9が8とくっつく場合は8の時に一緒に呼び出されてるはず)
    makePattern(pais.slice(1), shuntsu, kotsu, toitsu, tartsu23, tartsu12, tartsu13, dusts.concat(pais[0]), result);
    return;
  }

  //次の牌と次の次の牌の位置を調べる
  const nextP = pais.indexOf(pais[0].slice(0, 1) + String(parseInt(pais[0].slice(1, 2)) + 1));
  const nextnextP = pais.indexOf(pais[0].slice(0, 1) + String(parseInt(pais[0].slice(1, 2)) + 2));

  if (nextP >= 0 && nextnextP >= 0) {
    //順子(123、678などの形)として取れる場合
    let _pais = pais.slice(0, nextnextP).concat(pais.slice(nextnextP + 1));
    _pais = _pais.slice(0, nextP).concat(_pais.slice(nextP + 1));
    _pais = _pais.slice(1);
    makePattern(_pais, shuntsu.concat([[pais[0], pais[nextP], pais[nextnextP]]]), kotsu, toitsu, tartsu23, tartsu12, tartsu13, dusts, result);
  }
  if (nextP >= 0) {
    //ターツ(12、78などの形)として取れる場合
    let _pais = pais.slice(0, nextP).concat(pais.slice(nextP + 1));
    _pais = _pais.slice(1);

    if (pais[0].slice(1, 2) == '1' || pais[0].slice(1, 2) == '8') {
      //ペンターツとして取れる場合
      makePattern(_pais, shuntsu, kotsu, toitsu, tartsu23, tartsu12.concat([[pais[0], pais[nextP]]]), tartsu13, dusts, result);
    } else {
      //両面ターツとして取れる場合
      makePattern(_pais, shuntsu, kotsu, toitsu, tartsu23.concat([[pais[0], pais[nextP]]]), tartsu12, tartsu13, dusts, result);
    }
  }
  if (nextnextP >= 0) {
    let _pais = pais.slice(0, nextnextP).concat(pais.slice(nextnextP + 1));
    _pais = _pais.slice(1);
    makePattern(_pais, shuntsu, kotsu, toitsu, tartsu23, tartsu12, tartsu13.concat([[pais[0], pais[nextnextP]]]), dusts, result);
  }
  //その牌をゴミとしてのパターンも呼び出す
  makePattern(pais.slice(1), shuntsu, kotsu, toitsu, tartsu23, tartsu12, tartsu13, dusts.concat(pais[0]), result);
}

function getShantenMents(pattern: Pattern): number {
  let shanten = 0;
  let block = 0;
  shanten += pattern.shuntsu.length * 2 + pattern.kotsu.length * 2;
  block += pattern.shuntsu.length + pattern.kotsu.length;
  for (let i = 0; i < pattern.toitsu.length; i++) {
    if (block >= 5) break;
    shanten++;
    block++;
  }
  for (let i = 0; i < pattern.tartsu23.length; i++) {
    if (block >= 5) break;
    shanten++;
    block++;
  }
  for (let i = 0; i < pattern.tartsu13.length; i++) {
    if (block >= 5) break;
    shanten++;
    block++;
  }
  for (let i = 0; i < pattern.tartsu12.length; i++) {
    if (block >= 5) break;
    shanten++;
    block++;
  }

  block =
    pattern.shuntsu.length +
    pattern.kotsu.length +
    pattern.toitsu.length +
    pattern.tartsu23.length +
    pattern.tartsu12.length +
    pattern.tartsu13.length;
  if (block >= 5 && pattern.toitsu.length == 0) shanten -= 1;
  return 8 - shanten;
}

function getShantenChitoi(pattern: Pattern): number {
  let shanten = 6 - [...new Set(pattern.toitsu.flat())].length;
  if (pattern.toitsu.filter((t) => pattern.dusts.includes(t[0])).length >= 1) shanten++;
  return shanten;
}

function getShantenKokushi(pattern: Pattern): number {
  let pais = pattern.dusts;
  pais = ripai(pais);
  const kokushi = [
    pais.filter((e) => e == 's1').length,
    pais.filter((e) => e == 's9').length,
    pais.filter((e) => e == 'm1').length,
    pais.filter((e) => e == 'm9').length,
    pais.filter((e) => e == 'p1').length,
    pais.filter((e) => e == 'p9').length,
    pais.filter((e) => e == 'j1').length,
    pais.filter((e) => e == 'j2').length,
    pais.filter((e) => e == 'j3').length,
    pais.filter((e) => e == 'j4').length,
    pais.filter((e) => e == 'j5').length,
    pais.filter((e) => e == 'j6').length,
    pais.filter((e) => e == 'j7').length,
  ];

  return 13 - kokushi.filter((e) => e >= 1).length - (kokushi.filter((e) => e >= 2).length >= 1 ? 1 : 0);
}

function shantenOf(pais: Pai[]): { shanten: number; patterns: Pattern[] } {
  const result: Pattern[] = [];
  makePattern(pais, [], [], [], [], [], [], [], result);
  const shantens = result.map((p) => [getShantenMents(p), getShantenChitoi(p), getShantenKokushi(p)]);
  const shanten = Math.min(
    Math.min(...shantens.map((p) => p[0])),
    Math.min(...shantens.map((p) => p[1])),
    Math.min(...shantens.map((p) => p[2])),
  );
  return { shanten, patterns: result };
}

/** 【天和】 配牌14枚を引き、天和(あがり)に近いかどうかを判定するEmbedを返す。 */
async function getTenhouEmbed() {
  let pais = await getRandomPaiAndImage();
  pais = pais.map((p) => p.slice(0, 2));
  console.log(pais);

  const { shanten, patterns } = shantenOf(pais);
  const tenhouEmbed = new EmbedBuilder();
  tenhouEmbed.setTitle('天和チャレンジ');
  tenhouEmbed.setColor('#ffff00');
  tenhouEmbed.setImage('attachment://upload.png');

  let result = '';
  if (shanten == -1) result = '天和！！！！！！！！！！！！！！！！！！！';
  else if (shanten == 0) result = 'テンパイ！！惜しい！！！';
  else if (shanten == 1) result = '1シャンテン！後少し！';
  else if (shanten == 2) result = '2シャンテン。結構いいんじゃない？';
  else if (shanten == 3) result = '3シャンテン。悪くはない配牌だ。';
  else if (shanten == 4) result = '4シャンテン。こんなもんでしょ。';
  else if (shanten == 5) result = '5シャンテン。微妙やなぁ。';
  else if (shanten == 6) result = '6シャンテン。調子悪い？';
  else if (shanten == 7) result = '7シャンテン。配牌降りしていいよ。';
  else if (shanten == 8) result = '8シャンテン。逆にすげぇよ。';

  const kokushiShantens = patterns.map((p) => getShantenKokushi(p));
  if (Math.min(...kokushiShantens) < 5) {
    result += `\nちなみに国士やったら${Math.min(...kokushiShantens)}シャンテンやな。`;
  }
  tenhouEmbed.setDescription(result);
  return { embeds: [tenhouEmbed], files: [{ attachment: 'output.png', name: 'upload.png' }] };
}

function draw(pais: Pai[]): Pai {
  let allPais = allPaiList;
  pais.forEach((p) => {
    const i = allPais.indexOf(p);
    allPais = allPais.slice(0, i).concat(allPais.slice(i + 1));
  });
  return allPais[getRandomIndex(allPais.length)];
}

/** 【ダブリー】 テンパイ13枚とツモ牌1枚を与え、一発ツモとなるかをチャレンジするEmbedを返す。 */
async function getDoubleRiichiEmbed() {
  const [pais, waitPais] = getTempai();
  const drawPai = draw(pais);

  await getPaisImage(pais, drawPai);
  const displayPais = pais.map((p) => p.slice(0, 2));
  console.log(displayPais);

  const doubleRiichiEmbed = new EmbedBuilder();
  doubleRiichiEmbed.setTitle('ダブリー一発チャレンジ');
  doubleRiichiEmbed.setColor('#ffff00');
  doubleRiichiEmbed.setImage('attachment://upload.png');

  const result = waitPais.includes(drawPai) ? 'ダブリー一発！！！' : '一発ならず～';
  doubleRiichiEmbed.setDescription(result);
  return { embeds: [doubleRiichiEmbed], files: [{ attachment: 'output.png', name: 'upload.png' }] };
}

/** 【バンブー】 索子のみのテンパイ牌姿と待ちのEmbedを返す。bamboo=trueでバンブー(索子限定)。 */
async function getMachiateEmbed(bamboo = false): Promise<[{ embeds: EmbedBuilder[]; files: AttachmentPayload[] }, string]> {
  const [pais, waitPaisRaw] = getTempai(bamboo);

  await getPaisImage(pais);
  console.log(pais);
  console.log(waitPaisRaw);

  const machiateEmbed = new EmbedBuilder();
  machiateEmbed.setTitle('バンブー麻雀待ち当てクイズ');
  machiateEmbed.setColor('#008000');
  machiateEmbed.setImage('attachment://upload.png');
  machiateEmbed.setDescription('このテンパイの待ちを返信してね。\n例）「147」「6789」など');

  const waitPais = waitPaisRaw.map((p) => p.slice(1, 2)).join('');
  return [{ embeds: [machiateEmbed], files: [{ attachment: 'output.png', name: 'upload.png' }] }, waitPais];
}

function neighborPai(pai: Pai, num: number): Pai {
  return pai.slice(0, 1) + String(parseInt(pai.slice(1, 2)) + num);
}

const yaochuPais: Pai[] = ['m1', 'm9', 'p1', 'p9', 's1', 's9', 'j1', 'j2', 'j3', 'j4', 'j5', 'j6', 'j7'];

function allPaisOf(pattern: Pattern): Pai[] {
  return pattern.shuntsu
    .flat()
    .concat(pattern.kotsu.flat())
    .concat(pattern.toitsu.flat())
    .concat(pattern.tartsu23.flat())
    .concat(pattern.tartsu12.flat())
    .concat(pattern.tartsu13.flat())
    .concat(pattern.dusts.flat());
}

//捨て牌候補(テンパイパターン専用)
function whatDiscard(pattern: Pattern): Pai[] {
  const howManyPais = allPaisOf(pattern).length;
  const shantens = [getShantenMents(pattern), getShantenChitoi(pattern), getShantenKokushi(pattern)];
  if (Math.min(...shantens) == -1) return ['和了ってるでこれ'];
  if (Math.min(...shantens) > 0) return ['テンパイしてないでコレ'];
  if (howManyPais != 14) return [];

  //面子手テンパイ
  if (shantens[0] == 0) {
    return pattern.dusts;
    //チートイテンパイ
  } else if (shantens[1] == 0) {
    return pattern.dusts;
    //国士無双テンパイ
  } else if (shantens[2] == 0) {
    const pais = ripai(allPaisOf(pattern));
    if (yaochuPais.filter((p) => !pais.includes(p)).length == 0) {
      //13面待ちの場合は么九牌に含まれてない牌が捨て牌
      const p = pais.find((p) => !yaochuPais.includes(p));
      return p ? [p] : [];
    } else {
      //13面ではない場合は、かぶっている么九牌が二種類以上あればその牌、一種類だけなら么九牌以外の牌が捨て牌
      if (yaochuPais.filter((p) => pais.filter((e) => e == p).length >= 2).length >= 2) {
        return yaochuPais.filter((p) => pais.filter((e) => e == p).length >= 2);
      } else {
        return pais.filter((p) => !yaochuPais.includes(p));
      }
    }
    //テンパイちゃうやん
  } else {
    return [];
  }
}

//待ち牌候補(テンパイパターン専用)
function whatWait(pattern: Pattern): Pai[] {
  const shantens = [getShantenMents(pattern), getShantenChitoi(pattern), getShantenKokushi(pattern)];
  if (Math.min(...shantens) == -1) return ['和了ってるでこれ'];
  if (Math.min(...shantens) > 0) return ['テンパイしてないでコレ'];

  //面子手テンパイ
  if (shantens[0] == 0) {
    if (pattern.toitsu.length == 0) {
      //単騎待ち
      return pattern.dusts;
    } else if (pattern.toitsu.length == 2) {
      //シャンポン待ち
      return [pattern.toitsu[0][0], pattern.toitsu[1][0]];
    } else {
      //両面待ち
      if (pattern.tartsu23.length == 1) return [neighborPai(pattern.tartsu23[0][0], -1), neighborPai(pattern.tartsu23[0][1], 1)];
      //辺張待ち
      else if (pattern.tartsu12.length == 1)
        return pattern.tartsu12[0][0].slice(1, 2) == '1' ? [neighborPai(pattern.tartsu12[0][1], 1)] : [neighborPai(pattern.tartsu12[0][0], -1)];
      //嵌張待ち
      else if (pattern.tartsu13.length == 1) return [neighborPai(pattern.tartsu13[0][0], 1)];
      else return ['え、なになに何待ち怖い'];
    }
    //チートイテンパイ
  } else if (shantens[1] == 0) {
    return pattern.dusts;
    //国士無双テンパイ
  } else if (shantens[2] == 0) {
    const pais = ripai(allPaisOf(pattern));
    const kokushi = yaochuPais.map((p) => pais.filter((e) => e == p).length);
    if (kokushi.indexOf(0) == -1) {
      //13面待ち
      return yaochuPais;
    } else {
      return [yaochuPais[kokushi.indexOf(0)]];
    }
    //テンパイちゃうやん
  } else {
    return [];
  }
}

//テンパイしているパターン配列から、最も良い捨て牌とその時の待ち牌を返す。
//待ちの種類優先と待ちの枚数優先があり、デフォルトは待ちの種類優先
function getBestDiscard(tempaiPatterns: Pattern[], priorityKind = true): [Pai, Pai[]] {
  const pais = allPaisOf(tempaiPatterns[0]);
  if (pais.length != 14) return [['error'].join(), ['error']];

  const discards = ripai([...new Set(tempaiPatterns.map((p) => whatDiscard(p)).flat())]);
  const winningPais = tempaiPatterns.map((p) => whatWait(p));
  const discardPais = tempaiPatterns.map((p) => whatDiscard(p));
  const waitForEachDiscard = discards.map((p) => {
    const set = new Set(winningPais.filter((_e, i) => discardPais[i].includes(p)).flat());
    set.delete(p);
    const w = [...set];
    return {
      discard: p,
      winning: ripai(w),
      winningKind: w.length,
      winningCount: w.map((e) => 4 - pais.filter((x) => x == e).length).reduce((sum, e) => sum + e, 0),
    };
  });

  if (priorityKind) {
    let d = waitForEachDiscard.filter((p) => p.winningKind == Math.max(...waitForEachDiscard.map((e) => e.winningKind)));
    if (d.length == 1) return [d[0].discard, d[0].winning];
    d = d.filter((p) => p.winningCount == Math.max(...d.map((e) => e.winningCount)));
    return [d[0].discard, d[0].winning];
  } else {
    let d = waitForEachDiscard.filter((p) => p.winningCount == Math.max(...waitForEachDiscard.map((e) => e.winningCount)));
    if (d.length == 1) return [d[0].discard, d[0].winning];
    d = d.filter((p) => p.winningKind == Math.max(...d.map((e) => e.winningKind)));
    return [d[0].discard, d[0].winning];
  }
}

//テンパイしている13枚の牌とその待ち牌を返す
function getTempai(bamboo = false): [Pai[], Pai[]] {
  let shanten = 2;
  let pais: Pai[] = [];
  let akaDoras: boolean[] = [];

  while (shanten > 1 || shanten < 0) {
    pais = bamboo ? getRandomPaiBamboo(14) : getRandomPai(14);
    akaDoras = [pais.includes('m5a'), pais.includes('p5a'), pais.includes('s5a')];
    //赤ドラ要素を削除
    pais = pais.map((p) => p.slice(0, 2));
    shanten = shantenOf(pais).shanten;
  }

  if (shanten == 1) {
    const { patterns } = shantenOf(pais);
    const shanten1Patterns = patterns.filter((p) => Math.min(getShantenMents(p), getShantenChitoi(p), getShantenKokushi(p)) <= 1);
    const wasteAndWaitPais = getWasteAndWaitPaisFrom1shantens(shanten1Patterns);
    //最も有効牌の種類が多い捨て牌と待ち牌
    const best = wasteAndWaitPais[wasteAndWaitPais.map((e) => e.wait.length).indexOf(Math.max(...wasteAndWaitPais.map((e) => e.wait.length)))];
    const i = pais.indexOf(best.waste);
    pais = pais.slice(0, i).concat(pais.slice(i + 1)).concat(best.wait[getRandomIndex(best.wait.length)]);

    if (akaDoras[0]) pais[pais.indexOf('m5')] = 'm5a';
    if (akaDoras[1]) pais[pais.indexOf('p5')] = 'p5a';
    if (akaDoras[2]) pais[pais.indexOf('s5')] = 's5a';
    pais = ripai(pais);
  }

  akaDoras = [pais.includes('m5a'), pais.includes('p5a'), pais.includes('s5a')];
  //赤ドラ要素を削除
  pais = pais.map((p) => p.slice(0, 2));
  const { patterns } = shantenOf(pais);
  const tempaiPatterns = patterns.filter((p) => Math.min(getShantenMents(p), getShantenChitoi(p), getShantenKokushi(p)) <= 0);
  const [bestDiscard, bestDiscardWait] = getBestDiscard(tempaiPatterns);
  const index = pais.indexOf(bestDiscard);
  pais = pais.slice(0, index).concat(pais.slice(index + 1));
  if (akaDoras[0] && pais.includes('m5')) pais[pais.indexOf('m5')] = 'm5a';
  if (akaDoras[1] && pais.includes('p5')) pais[pais.indexOf('p5')] = 'p5a';
  if (akaDoras[2] && pais.includes('s5')) pais[pais.indexOf('s5')] = 's5a';
  pais = ripai(pais);

  return [pais, bestDiscardWait];
}

/** 【何切る】 イーシャンテン何切る問題のEmbedと、4択の答えの順番、正解発表時のテキストを返す。 */
async function get1shantenEmbed(
  bamboo = false,
): Promise<[{ embeds: EmbedBuilder[]; files: AttachmentPayload[] }, number, Pai, string]> {
  let pais: Pai[] = [];
  let akaDoras: boolean[] = [];
  let wasteAndWaitPais: { waste: Pai; wait: Pai[]; waitCount: number; waitKind: number }[] = [];
  let choices: { waste: Pai; wait: Pai[]; waitCount: number; waitKind: number }[] = [];
  let answerText = '';

  for (;;) {
    choices = [];
    pais = bamboo ? getRandomPaiBamboo(14) : getRandomPai(14);
    akaDoras = [pais.includes('m5a'), pais.includes('p5a'), pais.includes('s5a')];
    //赤ドラ要素を削除
    pais = pais.map((p) => p.slice(0, 2));

    const { shanten, patterns } = shantenOf(pais);
    if (shanten != 1) continue;

    //イーシャンテンになるパターンを抽出
    const shanten1Patterns = patterns.filter((p) => Math.min(getShantenMents(p), getShantenChitoi(p), getShantenKokushi(p)) <= 1);
    //各イーシャンテンパターンに対して捨て牌とそれに対応する待ち牌を取得
    const wasteAndWait = getWasteAndWaitPaisFrom1shantens(shanten1Patterns).sort(
      (a, b) =>
        b.wait.reduce((sum, e) => sum + getHowManyRest(pais, e), 0) - a.wait.reduce((sum, e) => sum + getHowManyRest(pais, e), 0),
    );
    //各イーシャンテンパターンに対して捨て牌とそれに対応する待ち牌の枚数を取得
    wasteAndWaitPais = wasteAndWait.map((p) => ({
      waste: p.waste,
      wait: p.wait,
      waitCount: p.wait.reduce((sum, e) => sum + getHowManyRest(pais, e), 0),
      waitKind: p.wait.length,
    }));

    if (!([...new Set(wasteAndWaitPais.map((p) => p.waitCount))].length >= 4 && wasteAndWaitPais[0].waste.slice(0, 1) != 'j')) continue;

    //赤ドラ復活
    if (akaDoras[0] && pais.includes('m5')) pais[pais.indexOf('m5')] = 'm5a';
    if (akaDoras[1] && pais.includes('p5')) pais[pais.indexOf('p5')] = 'p5a';
    if (akaDoras[2] && pais.includes('s5')) pais[pais.indexOf('s5')] = 's5a';

    //選択肢をchoicesに追加していく。各受け入れ枚数種類につき1つずつ
    const distinctCounts = [...new Set(wasteAndWaitPais.map((p) => p.waitCount))];
    for (let i = 0; i < 4; i++) {
      const temp = wasteAndWaitPais.filter((p) => p.waitCount == distinctCounts[i]);
      choices.push(temp[getRandomIndex(temp.length)]);
    }

    //答え合わせの文章を作成(各捨牌の時の受け入れ枚数など)
    const answerLines = ['各受け入れ枚数'];
    for (let i = 0; i < 4; i++) {
      const matched = wasteAndWaitPais.find((p) => p.waste == choices[i].waste)!;
      answerLines.push(
        `${choices[i].waste}切り：${('  ' + matched.waitKind).slice(-2)}種${('  ' + matched.waitCount).slice(-2)}枚[${matched.wait.join(', ')}]`,
      );
    }
    answerText = answerLines.join('\n');

    //待ち牌の枚数の種類が4種類ずつかつ、最も枚数が多い時の捨牌が字牌以外の時、牌姿固定
    if (
      [...new Set(wasteAndWaitPais.map((p) => p.waitCount))].length >= 4 &&
      wasteAndWaitPais[0].waste.slice(0, 1) != 'j' &&
      choices[0].waitCount - choices[1].waitCount <= 3
    ) {
      break;
    }
  }

  //選択肢を順番に並び替え
  choices = choices.sort((a, b) => paiList.find((e) => e.name1 == a.waste)!.order - paiList.find((e) => e.name1 == b.waste)!.order);
  const answer = choices.map((p) => p.waste).indexOf(wasteAndWaitPais[0].waste);

  await getPaisImage(pais);
  console.log(pais.map((p) => p.slice(0, 2)));

  const shanten1Embed = new EmbedBuilder();
  shanten1Embed.setTitle('1シャンテン何切る');
  shanten1Embed.setDescription('受け入れ枚数が最大となる切り牌はどれ？');
  shanten1Embed.setColor('#87cefa');
  shanten1Embed.setImage('attachment://upload.png');
  const text = choices.map((p, i) => `${iconsABC[i]}：${p.waste}`).join('\n');
  shanten1Embed.addFields({ name: '選択肢', value: text, inline: false });

  const answerPai = choices[answer].waste;
  return [{ embeds: [shanten1Embed], files: [{ attachment: 'output.png', name: 'upload.png' }] }, answer, answerPai, answerText];
}

function getHowManyRest(_pais: Pai[], wait: Pai): number {
  const pais = _pais.map((p) => p.slice(0, 2));
  return 4 - pais.filter((p) => p == wait).length;
}

function getWasteAndWaitPaisFrom1shantens(shanten1Patterns: Pattern[]): WasteAndWait[] {
  const unite: WasteAndWait[] = [];
  shanten1Patterns.forEach((p) => {
    getWasteAndWaitPaisFrom1shanten(p).forEach((w) => {
      const existing = unite.find((e) => e.waste === w.waste);
      if (!existing) unite.push(w);
      else existing.wait = ripai([...new Set(existing.wait.concat(w.wait))]);
    });
  });
  return unite;
}

//イーシャンテンのパターンから捨て牌と待ち牌の配列を返す
function getWasteAndWaitPaisFrom1shanten(shanten1Pattern: Pattern): WasteAndWait[] {
  const blocks =
    shanten1Pattern.shuntsu.length +
    shanten1Pattern.kotsu.length +
    shanten1Pattern.toitsu.length +
    shanten1Pattern.tartsu23.length +
    shanten1Pattern.tartsu13.length +
    shanten1Pattern.tartsu12.length;
  const wasteAndWaitPais: WasteAndWait[] = [];

  if (getShantenMents(shanten1Pattern) == 1) {
    //4ブロックの場合
    if (blocks == 4) {
      //対子がない場合
      if (shanten1Pattern.toitsu.length == 0) {
        shanten1Pattern.dusts.forEach((d, i) => {
          let waitPais: Pai[][] = [];
          //両面ターツがある場合、その待ち牌
          if (shanten1Pattern.tartsu23.length != 0) {
            waitPais.push(shanten1Pattern.tartsu23.map((e) => neighborPai(e[0], -1)).flat());
            waitPais.push(shanten1Pattern.tartsu23.map((e) => neighborPai(e[1], 1)).flat());
          }
          //ペンチャンターツがある場合、その待ち牌
          if (shanten1Pattern.tartsu12.length != 0) {
            waitPais.push(shanten1Pattern.tartsu12.map((e) => (e[0].slice(1, 2) == '1' ? neighborPai(e[1], 1) : neighborPai(e[0], -1))).flat());
          }
          //カンチャンターツがある場合、その待ち牌
          if (shanten1Pattern.tartsu13.length != 0) {
            waitPais.push(shanten1Pattern.tartsu13.map((e) => neighborPai(e[0], 1)).flat());
          }
          //残りのゴミ牌も待ち牌になる
          waitPais.push(shanten1Pattern.dusts.slice(0, i).concat(shanten1Pattern.dusts.slice(i + 1)).flat());
          const flatWaitPais = [...new Set(waitPais.flat(2))];

          wasteAndWaitPais.push({ waste: d, wait: flatWaitPais });
        });
        //対子がある場合
      } else {
        shanten1Pattern.dusts.forEach((d, i) => {
          const waitPais: Pai[] = [];
          //残りのゴミ牌とその周辺牌も待ち牌になる
          const restDust = shanten1Pattern.dusts.slice(0, i).concat(shanten1Pattern.dusts.slice(i + 1));
          restDust.forEach((r) => {
            if (r.slice(0, 1) == 'j') waitPais.push(r);
            else {
              waitPais.push(neighborPai(r, -2));
              waitPais.push(neighborPai(r, -1));
              waitPais.push(r);
              waitPais.push(neighborPai(r, 1));
              waitPais.push(neighborPai(r, 2));
            }
          });
          waitPais.push(shanten1Pattern.toitsu[0][0]);
          //s10とかも混入してるので、牌リストにあるものだけ被りを除去して追加
          const flatWaitPais = ripai([...new Set(waitPais.filter((e) => allPaiList.includes(e)))]);

          wasteAndWaitPais.push({ waste: d, wait: flatWaitPais });
        });
      }
      //5ブロックの場合
    } else if (blocks == 5) {
      //対子がない場合
      if (shanten1Pattern.toitsu.length == 0) {
        let waitPais: Pai[][] = [];
        //両面ターツがある場合、その待ち牌とその構成牌
        if (shanten1Pattern.tartsu23.length != 0) {
          waitPais.push(shanten1Pattern.tartsu23.map((e) => neighborPai(e[0], -1)).flat());
          waitPais.push(shanten1Pattern.tartsu23.map((e) => e[0]).flat());
          waitPais.push(shanten1Pattern.tartsu23.map((e) => e[1]).flat());
          waitPais.push(shanten1Pattern.tartsu23.map((e) => neighborPai(e[1], 1)).flat());
        }
        //ペンチャンターツがある場合、その待ち牌とその構成牌
        if (shanten1Pattern.tartsu12.length != 0) {
          waitPais.push(shanten1Pattern.tartsu12.map((e) => e[0]).flat());
          waitPais.push(shanten1Pattern.tartsu12.map((e) => e[1]).flat());
          waitPais.push(shanten1Pattern.tartsu12.map((e) => (e[0].slice(1, 2) == '1' ? neighborPai(e[1], 1) : neighborPai(e[0], -1))).flat());
        }
        //カンチャンターツがある場合、その待ち牌とその構成牌
        if (shanten1Pattern.tartsu13.length != 0) {
          waitPais.push(shanten1Pattern.tartsu13.map((e) => e[0]).flat());
          waitPais.push(shanten1Pattern.tartsu13.map((e) => neighborPai(e[0], 1)).flat());
          waitPais.push(shanten1Pattern.tartsu13.map((e) => e[1]).flat());
        }
        const flatWaitPais = [...new Set(waitPais.flat(2))];
        shanten1Pattern.dusts.forEach((d) => {
          wasteAndWaitPais.push({ waste: d, wait: flatWaitPais });
        });
        //対子が一つの場合
      } else if (shanten1Pattern.toitsu.length == 1) {
        let waitPais: Pai[][] = [];
        //両面ターツがある場合、その待ち牌
        if (shanten1Pattern.tartsu23.length != 0) {
          waitPais.push(shanten1Pattern.tartsu23.map((e) => neighborPai(e[0], -1)).flat());
          waitPais.push(shanten1Pattern.tartsu23.map((e) => neighborPai(e[1], 1)).flat());
        }
        //ペンチャンターツがある場合、その待ち牌
        if (shanten1Pattern.tartsu12.length != 0) {
          waitPais.push(shanten1Pattern.tartsu12.map((e) => (e[0].slice(1, 2) == '1' ? neighborPai(e[1], 1) : neighborPai(e[0], -1))).flat());
        }
        //カンチャンターツがある場合、その待ち牌
        if (shanten1Pattern.tartsu13.length != 0) {
          waitPais.push(shanten1Pattern.tartsu13.map((e) => neighborPai(e[0], 1)).flat());
        }
        const flatWaitPais = [...new Set(waitPais.flat(2))];
        shanten1Pattern.dusts.forEach((d) => {
          wasteAndWaitPais.push({ waste: d, wait: flatWaitPais });
        });
        //対子が2つ以上の場合
      } else {
        let waitPais: Pai[][] = [];
        //対子の構成牌も有効牌
        waitPais.push(shanten1Pattern.toitsu.map((e) => e[0]).flat());
        //両面ターツがある場合、その待ち牌
        if (shanten1Pattern.tartsu23.length != 0) {
          waitPais.push(shanten1Pattern.tartsu23.map((e) => neighborPai(e[0], -1)).flat());
          waitPais.push(shanten1Pattern.tartsu23.map((e) => neighborPai(e[1], 1)).flat());
        }
        //ペンチャンターツがある場合、その待ち牌
        if (shanten1Pattern.tartsu12.length != 0) {
          waitPais.push(shanten1Pattern.tartsu12.map((e) => (e[0].slice(1, 2) == '1' ? neighborPai(e[1], 1) : neighborPai(e[0], -1))).flat());
        }
        //カンチャンターツがある場合、その待ち牌
        if (shanten1Pattern.tartsu13.length != 0) {
          waitPais.push(shanten1Pattern.tartsu13.map((e) => neighborPai(e[0], 1)).flat());
        }
        const flatWaitPais = ripai([...new Set(waitPais.flat(2))]);
        shanten1Pattern.dusts.forEach((d) => {
          wasteAndWaitPais.push({ waste: d, wait: flatWaitPais });
        });
      }
      //6ブロックの場合
    } else {
      //対子が2つ以上ある場合は、各対子に対して対子崩しも選択肢
      if (shanten1Pattern.toitsu.length >= 2) {
        shanten1Pattern.toitsu.forEach((t) => {
          let waitPais: Pai[][] = [];
          //両面ターツがある場合、その待ち牌
          if (shanten1Pattern.tartsu23.length != 0) {
            waitPais.push(shanten1Pattern.tartsu23.map((e) => neighborPai(e[0], -1)).flat());
            waitPais.push(shanten1Pattern.tartsu23.map((e) => neighborPai(e[1], 1)).flat());
          }
          //ペンチャンターツがある場合、その待ち牌
          if (shanten1Pattern.tartsu12.length != 0) {
            waitPais.push(shanten1Pattern.tartsu12.map((e) => (e[0].slice(1, 2) == '1' ? neighborPai(e[1], 1) : neighborPai(e[0], -1))).flat());
          }
          //カンチャンターツがある場合、その待ち牌
          if (shanten1Pattern.tartsu13.length != 0) {
            waitPais.push(shanten1Pattern.tartsu13.map((e) => neighborPai(e[0], 1)).flat());
          }
          const flatWaitPais = [...new Set(waitPais.flat(2))];
          wasteAndWaitPais.push({ waste: t[0], wait: flatWaitPais });
        });
      }

      //両面ターツがある場合、各両面を崩した時の待ち牌を追加
      if (shanten1Pattern.tartsu23.length != 0) {
        shanten1Pattern.tartsu23.forEach((t, i, array) => {
          let waitPais: Pai[][] = [];
          const restTarts23 = array.slice(0, i).concat(array.slice(i + 1));
          if (restTarts23.length != 0) {
            waitPais.push(restTarts23.map((e) => neighborPai(e[0], -1)).flat());
            waitPais.push(restTarts23.map((e) => neighborPai(e[1], 1)).flat());
          }
          //ペンチャンターツがある場合、その待ち牌
          if (shanten1Pattern.tartsu12.length != 0) {
            waitPais.push(shanten1Pattern.tartsu12.map((e) => (e[0].slice(1, 2) == '1' ? neighborPai(e[1], 1) : neighborPai(e[0], -1))).flat());
          }
          //カンチャンターツがある場合、その待ち牌
          if (shanten1Pattern.tartsu13.length != 0) {
            waitPais.push(shanten1Pattern.tartsu13.map((e) => neighborPai(e[0], 1)).flat());
          }
          const flatWaitPais = [...new Set(waitPais.flat(2))];
          wasteAndWaitPais.push({ waste: t[0], wait: flatWaitPais });
          wasteAndWaitPais.push({ waste: t[1], wait: flatWaitPais });
        });
      }
      //ペンチャンターツがある場合、各ペンチャンを崩した時の待ち牌を追加
      if (shanten1Pattern.tartsu12.length != 0) {
        shanten1Pattern.tartsu12.forEach((t, i, array) => {
          let waitPais: Pai[][] = [];
          const restTarts12 = array.slice(0, i).concat(array.slice(i + 1));

          if (shanten1Pattern.tartsu23.length != 0) {
            waitPais.push(shanten1Pattern.tartsu23.map((e) => neighborPai(e[0], -1)).flat());
            waitPais.push(shanten1Pattern.tartsu23.map((e) => neighborPai(e[1], 1)).flat());
          }
          //ペンチャンターツがある場合、その待ち牌
          if (restTarts12.length != 0) {
            waitPais.push(restTarts12.map((e) => (e[0].slice(1, 2) == '1' ? neighborPai(e[1], 1) : neighborPai(e[0], -1))).flat());
          }
          //カンチャンターツがある場合、その待ち牌
          if (shanten1Pattern.tartsu13.length != 0) {
            waitPais.push(shanten1Pattern.tartsu13.map((e) => neighborPai(e[0], 1)).flat());
          }
          const flatWaitPais = [...new Set(waitPais.flat(2))];
          wasteAndWaitPais.push({ waste: t[0], wait: flatWaitPais });
          wasteAndWaitPais.push({ waste: t[1], wait: flatWaitPais });
        });
      }
      //カンチャンターツがある場合、各カンチャンを崩した時の待ち牌を追加
      if (shanten1Pattern.tartsu13.length != 0) {
        shanten1Pattern.tartsu13.forEach((t, i, array) => {
          let waitPais: Pai[][] = [];
          const restTarts13 = array.slice(0, i).concat(array.slice(i + 1));

          if (shanten1Pattern.tartsu23.length != 0) {
            waitPais.push(shanten1Pattern.tartsu23.map((e) => neighborPai(e[0], -1)).flat());
            waitPais.push(shanten1Pattern.tartsu23.map((e) => neighborPai(e[1], 1)).flat());
          }
          //ペンチャンターツがある場合、その待ち牌
          if (shanten1Pattern.tartsu12.length != 0) {
            waitPais.push(shanten1Pattern.tartsu12.map((e) => (e[0].slice(1, 2) == '1' ? neighborPai(e[1], 1) : neighborPai(e[0], -1))).flat());
          }
          //カンチャンターツがある場合、その待ち牌
          if (restTarts13.length != 0) {
            waitPais.push(restTarts13.map((e) => neighborPai(e[0], 1)).flat());
          }
          const flatWaitPais = [...new Set(waitPais.flat(2))];
          wasteAndWaitPais.push({ waste: t[0], wait: flatWaitPais });
          wasteAndWaitPais.push({ waste: t[1], wait: flatWaitPais });
        });
      }
    }
  }

  //チートイイーシャンテンの場合
  if (getShantenChitoi(shanten1Pattern) == 1) {
    shanten1Pattern.dusts.forEach((d, i) => {
      wasteAndWaitPais.push({
        waste: d,
        wait: shanten1Pattern.dusts.slice(0, i).concat(shanten1Pattern.dusts.slice(i + 1)),
      });
    });
  }

  //国士イーシャンテンの場合
  if (getShantenKokushi(shanten1Pattern) == 1) {
    //么九牌のかぶりが無い場合
    if (Math.max(...yaochuPais.map((e) => shanten1Pattern.dusts.filter((d) => d == e).length)) == 1) {
      const restDust = shanten1Pattern.dusts.filter((e) => !yaochuPais.includes(e));
      restDust.forEach((d) => {
        wasteAndWaitPais.push({ waste: d, wait: yaochuPais });
      });
      //么九牌のかぶりがある場合
    } else {
      //么九牌以外の牌を持っている場合はそれらが捨て牌候補
      if (shanten1Pattern.dusts.filter((e) => !yaochuPais.includes(e)).length != 0) {
        shanten1Pattern.dusts.filter((e) => !yaochuPais.includes(e)).forEach((d) => {
          wasteAndWaitPais.push({ waste: d, wait: yaochuPais.filter((k) => !shanten1Pattern.dusts.includes(k)) });
        });
      } else {
        //手牌が么九牌のみの場合、二枚以上あるものについて、捨牌はその牌、待ち牌は持ってない么九牌
        yaochuPais
          .map((k) => ({ k, count: shanten1Pattern.dusts.filter((d) => d == k).length }))
          .filter((e) => e.count >= 2)
          .forEach((e) => {
            wasteAndWaitPais.push({ waste: e.k, wait: yaochuPais.filter((k) => !shanten1Pattern.dusts.includes(k)) });
          });
      }
    }
  }

  return wasteAndWaitPais;
}

interface MahjongFesUsers {
  A: string[];
  B: string[];
  C: string[];
}

interface MahjongFesGame {
  A: string;
  B: string;
  C: string;
  Adone: boolean;
  Bdone: boolean;
  Cdone: boolean;
}

/** 忘年祭で使用した麻雀フェス(国士無双 vs 四暗刻 vs 大三元)の対戦表Embedを返す。 */
function getMahjongFesEmbed(users: MahjongFesUsers, games: MahjongFesGame[]) {
  const mahjongFesEmbed = new EmbedBuilder();
  mahjongFesEmbed.setTitle('国士無双 vs 四暗刻 vs 大三元');
  mahjongFesEmbed.setColor('#8b008b');
  mahjongFesEmbed.setFooter({ text: '試合が終わったら✓を押して下さい。\n次の試合をマッチします。' });

  mahjongFesEmbed.addFields(
    { name: iconsABC[0] + '国士無双チーム', value: users.A.length === 0 ? '​' : users.A.join(','), inline: false },
    { name: iconsABC[1] + '四暗刻チーム', value: users.B.length === 0 ? '​' : users.B.join(','), inline: false },
    { name: iconsABC[2] + '大三元チーム', value: users.C.length === 0 ? '​' : users.C.join(','), inline: false },
  );
  //Adone/Bdone/Cdoneどれか一つでもtrueならその試合の表示をスポイラーする
  const header = getEqualLengthStr('国士無双', 15) + getEqualLengthStr('四暗刻', 15) + getEqualLengthStr('大三元', 15);
  const body = games.length === 0
    ? '​'
    : games.map((e) => (e.Adone || e.Bdone || e.Cdone ? `~~${e.A}${e.B}${e.C}~~` : `${e.A}${e.B}${e.C}`)).join('\n');
  mahjongFesEmbed.addFields({ name: header, value: body, inline: false });

  return { embeds: [mahjongFesEmbed] };
}

export { getTenhouEmbed, getDoubleRiichiEmbed, getMachiateEmbed, get1shantenEmbed, getMahjongFesEmbed };
export type { MahjongFesUsers, MahjongFesGame };
