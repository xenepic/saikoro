import type { Command } from '../discord/types';
import { isFromUnei } from '../utils/permissions';

const keyStop = '!stop';
const keyHelp = '!help';
const chatGPT = '!c';

const outputHelp = `
【さいころ君のコマンド一覧】

- !d
    クトゥルフ神話っぽいダイスロールを振るやで。
    例）!d 2d6
    例）!d CCB<=20 【酒値チェック】

- 【占い】
    占いするやで。

- 【ルナ】月日
    ルナさんの誕生日占いやで。
    例）【ルナ】3月14日

- 【抽選】
    抽選するやで。
    さいころ君のリプに✋のリアクションした人の中から一人選ぶ。
    🔄押したら抽選開始。
    受付時間は5分。

- 【睡眠】
    寝れるかどうか決めるやで。

- 【起床】
    起きれるかどうか決めるやで。

- !pn
    ポケモンのタイプ情報をポケモンの名前から引っ張ってくるやで。
    例）!pn ピカチュウ

- !ps
    ポケモンのタイプ・特性・種族値情報をポケモンの名前から引っ張ってくるやで。
    例）!ps ピカチュウ

- !pt
    ポケモンの特性情報を特性の名前から引っ張ってくるやで。
    例）!pt せいでんき

- !pca
    タイプ相性を攻撃側のタイプから引っ張ってくるやで。
    例）!pca でんき

- !pcd
    タイプ相性を防御側のタイプから引っ張ってくるやで。
    複合タイプも可能
    例）!pcd みず　ひこう

- 【天気】
    天気予報を流すやで。
    例）
    【天気】　　　　　　　　：東京の県庁所在地がある地方のその日の天気
    【天気】京都　　　　　　：京都の県庁所在地がある地方のその日の天気
    【天気】京都　週間　　　：京都の県庁所在地がある地方の一週間の天気
    【天気】京都　北部　　　：京都北部のその日の天気
    【天気】京都　北部　週間：京都北部の一週間の天気

- !spw
    スプラトゥーンの武器を検索するやで
    例）!spw ヒッセン
        !spw スシコラ

- !sps
    スプラトゥーンのサブを検索するやで
    例）!sps キューバン

- !spp
    スプラトゥーンのスペシャルを検索するやで
    例）!spp チャクチ

- !sp
    スプラトゥーンのメイン・サブ・スペシャルをあいまいに検索できるやで。
    わいが適当に判断するわ。
    例）!sp ボム

- 【武器抽選】
    リアクションした人にランダムな武器を割り当てるやで。

- 【ガチャ】
    さいころポイント(sp)を10sp使って1回ガチャを引くやで。

- 【10連】
    さいころポイント(sp)を100sp使って10連ガチャを引くやで。

- 【料理】
    楽天レシピからランダムに料理を紹介するやで。キーワード検索も可。
    例）【料理】カレー

- 【クイズ】
    クイズできるやで。

- !qranking
    クイズの連続正解数ランキングが見れるやで。

- !qreset
    クイズの出題カウントをリセットするやで。

- 【天和】
    天和チャレンジできるやで。

- 【ダブリー】
    ダブリー一発ツモチャレンジができるやで。

- 【バンブー】
    バンブー麻雀の待ち宛クイズができるやで。

- 【何切る】
    イーシャンテンから受け入れ枚数最大になる牌を当てる何切る問題ができるやで。

- 【ワードウルフ】
    ワードウルフできるやで。

- !DM
    DMでサイコロ君の機能が使えるようになるやで。

- !timer
    3分のカウントダウンタイマーを表示するやで。

- ${chatGPT}
    AIとおしゃべりできるやで。
`;

/** !help コマンド一覧を表示する */
export const helpCommand: Command = {
  name: 'help',
  async handle(message) {
    if (!message.content.startsWith(keyHelp) || !message.channel.isSendable()) return;
    await message.channel.send('```diff\n' + outputHelp + '\n```');
  },
};

/** !stop 運営限定のBot停止コマンド(現状isFromUneiが常にfalseのため実質無効)。 */
export const stopCommand: Command = {
  name: 'stop',
  async handle(message, client) {
    if (!message.content.startsWith(keyStop) || !isFromUnei(message.author) || !message.channel.isSendable()) return;
    await message.channel.send('ばいばーい！');
    client.destroy();
  },
};

/** 【ファントム】 ファントムさん周年お祝いの小ネタ */
export const phantomCommand: Command = {
  name: 'phantom-easter-egg',
  async handle(message) {
    if (!message.content.includes('【ファントム】')) return;
    await message.reply('ファントムさん4周年おめでとう！！\nVtuberがんばってくださいころ！！！');
  },
};

export const miscCommands: Command[] = [helpCommand, stopCommand, phantomCommand];
