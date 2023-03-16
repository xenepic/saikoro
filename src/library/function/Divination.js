const { Message } = require('discord.js');
const { BotFunctionBase } = require('../BotFunctionBase');
const { Util } = require('../Util');

class Divination extends BotFunctionBase {
    constructor(){
        super('DIVINATION');
        this.participants = {};
    }

    async doDivination(msg){
        try{

            // 前回の占いから12時間経たないと新しい占いは出来ない
            if(this.participants[msg.author.id] && Date.now() - this.participants[msg.author.id] <= 60 * 60 * 12){
                return await this.replyMessage(msg, '日に何回もするもんやないで', {normal:true});
            }
            this.participants[msg.author.id] = Date.now();

            let fortune = Util.getRandomInt(100);
            let output = '';
            let items = ['たけのこの里', 'ハンバーグ', '天一のラーメン', '陶器のコップ', '蜘蛛', '綾鷹', '昔のゲーム', 'サイコロ', '茶色いキーホルダー', 'モンスターボール',
                'おっぱい', '傘', '20円玉', '蚊取り線香', 'ポケットティッシュ配りお姉さん', '鳥居', '液晶画面', 'ソイラテ', '黒いお箸', 'チルタリス', '女神',
                '　ひとで　', '波の音', '剥げてるおじさん', '20cm以上の髪の毛', '呪いのお札', '丸めたアルミホイル', '優しい人の心臓', '臓器移植', 'undefined', '一筒',
                '黒マスク', '生爪', 'とかげの黒焼き', 'フォロー数＝フォロワー数の人', 'Gの右足', '原子力潜水艦', '映画の半券', '親への手紙', 'いちご系女子',
                'ディズニーアニメ', '雪の結晶', 'ワンセグ付きスマホ', 'うぃんがでぃあむ、れびおさーｗｗｗ', 'アルミ缶の上にある玉ねぎ', '傘の先端の部品', '駅員さんの笑顔', '髪以外の毛', '栗抜きモンブラン', 'チーズ抜きダブチー',
                '乾燥剤', 'ニワトリ以外の卵', '四角いペットボトル', 'うずくまる人', 'BIG ISSUE（雑誌）', 'でかいテレビ'
            ];

            //運勢
            if (fortune <= 5) output = ('今日の運勢は大大大吉クリティカル！これであなたも一発チルタリス！');
            else if (fortune <= 10) output = ('今日の運勢は、大大吉！カップラーメンが３０秒で出来上がる！');
            else if (fortune <= 20) output = ('今日の運勢は、大吉！シャーペンの芯が一回も折れない！');
            else if (fortune <= 30) output = ('今日の運勢は、中吉！Twitterでやべぇ発言しても一回くらい許されるよ。');
            else if (fortune <= 40) output = ('今日の運勢は、中吉！爪切ったら白い部分の幅が全て均等になるよ。');
            else if (fortune <= 50) output = ('今日の運勢は、吉！回転寿司行ったらサーモン10個くらい流れてくるよ。');
            else if (fortune <= 60) output = ('今日の運勢は、平！単眼猫に食われるよ。');
            else if (fortune <= 70) output = ('今日の運勢は、半吉！開かない方のドアの前で待ってそう。');
            else if (fortune <= 80) output = ('今日の運勢は、末吉！週末ならフィーバーしてもヨシ！');
            else if (fortune <= 90) output = ('今日の運勢は、凶！トイレットペーパーの予備を持ち歩こう。');
            else if (fortune <= 95) output = ('---error--- \nYour divination has been invalidated.');
            else output = ('今日の運勢は、大大大凶！布団の中にGが居ないかちゃんと確かめてね。');

            output += '\nラッキーアイテムは、' + items[Util.getRandomInt(items.length - 1)] + '！';
            // output += '\nラッキーポケモンは、' + getPokemonByRandom() + '！';

            await this.replyMessage(msg, output, {normal:true});

        }catch(e){
            Util.log('error', e);
            this.replyMessage(msg, 'なんか失敗したわ、もっかい頼む', {normal:true});
        }
    }
}

module.exports = { Divination };