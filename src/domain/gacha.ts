import { db } from '../db/client';
import { getRandomInt } from '../utils/random';

type GachaIcon = 'star' | 'face' | 'fire' | 'dango' | 'crab' | 'money' | 'skull';

interface GachaRow {
  name: string;
  sp: number;
  star: number;
  face: number;
  fire: number;
  dango: number;
  crab: number;
}

const icons: Record<GachaIcon, string> = {
  star: '[🌟]',
  face: '[🤪]',
  fire: '[🔥]',
  dango: '[🍡]',
  crab: '[🦀]',
  money: '[💰]',
  skull: '[💀]',
};

function getRandomIcon(): GachaIcon {
  const temp = Math.random() * 100;
  if (temp <= 50) return 'star';
  if (temp <= 70) return 'face';
  if (temp <= 90) return 'fire';
  if (temp <= 95) return 'dango';
  if (temp <= 99) return 'crab';
  if (temp <= 99.9) return 'money';
  return 'skull';
}

function getSP(name: GachaIcon): number {
  if (name === 'star') return 100;
  if (name === 'face') return 200;
  if (name === 'fire') return -200;
  if (name === 'dango') return getRandomInt(10) * 300;
  if (name === 'crab') return getRandomInt(10) * 1000;
  if (name === 'money') return 10000;
  return -10000; // skull
}

async function ensureUserExists(userName: string): Promise<GachaRow> {
  const rows = await db<GachaRow>('gacha').select('*').where('name', userName);
  if (rows.length === 0) {
    await db<GachaRow>('gacha').insert({ name: userName, sp: 100, star: 0, face: 0, fire: 0, dango: 0, crab: 0 });
    return { name: userName, sp: 100, star: 0, face: 0, fire: 0, dango: 0, crab: 0 };
  }
  return rows[0];
}

async function getSingleGacha(userName: string): Promise<[string[], string]> {
  const gachaIcons = [getRandomIcon(), getRandomIcon(), getRandomIcon()];
  let changeSP = 0;
  let result = 'ハズレ';

  const row = await db<GachaRow>('gacha').select('sp').where('name', userName).first();
  const oldSP = row?.sp ?? 0;

  if (gachaIcons[0] === gachaIcons[1] && gachaIcons[1] === gachaIcons[2]) {
    changeSP = getSP(gachaIcons[0]);
    result = '当たり';
  }
  changeSP += gachaIcons.filter((e) => e === 'money').length * 50;
  if (gachaIcons.includes('skull')) changeSP += (oldSP * -1) / 2;

  await db<GachaRow>('gacha').update('sp', oldSP + changeSP - 10).where('name', userName);

  return [gachaIcons.map((e) => icons[e]), `${result}(${changeSP})`];
}

/** 【ガチャ】【10連】 ガチャを指定回数引き、結果メッセージを返す。spが不足している場合はその旨を返す。 */
async function getGachaMessage(userName: string, count: number): Promise<string> {
  const user = await ensureUserExists(userName);
  if (user.sp < 10 * count) {
    return `さいころポイントが足りないよ！(必要sp:${10 * count})`;
  }

  const message: string[] = [];
  for (let i = 0; i < count; i++) {
    const [gachaIcons, result] = await getSingleGacha(userName);
    message.push(`${gachaIcons.join('')}    ${result}`);
  }

  const newRow = await db<GachaRow>('gacha').select('sp').where('name', userName).first();
  message.push(`\n残りspは${newRow?.sp}です。`);
  return message.join('\n');
}

/** クイズ正解時など、ガチャと共通のspをユーザーに加算する。 */
async function addSP(userName: string, addPoint: number): Promise<number> {
  const user = await ensureUserExists(userName);
  const newSP = user.sp + addPoint;
  await db<GachaRow>('gacha').update('sp', newSP).where('name', userName);
  return newSP;
}

export { getGachaMessage, addSP };
