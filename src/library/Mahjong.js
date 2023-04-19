const { joinImages } = require('./joinimages');
const { MessageEmbed } = require('discord.js');

class Mahjong{
    constructor(){
        
    }



}

const iconsABC = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

const allPaiList = [
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
    'j7', 'j7', 'j7', 'j7'
];

const allSouzuList = [
    's1', 's1', 's1', 's1',
    's2', 's2', 's2', 's2',
    's3', 's3', 's3', 's3',
    's4', 's4', 's4', 's4',
    's5a', 's5', 's5', 's5',
    's6', 's6', 's6', 's6',
    's7', 's7', 's7', 's7',
    's8', 's8', 's8', 's8',
    's9', 's9', 's9', 's9'
]

function strLength(str) {
    let len = 0;

    for (let i = 0; i < str.length; i++) {
        (str[i].match(/[ -~]/)) ? len += 1: len += 2;
    }
    return len;
}

function getEqualLengthStr(str, len) {
    if (strLength(str) % 2 == 1) str += ' ';
    while (strLength(str) < len) {
        str += '　';
    }
    return str;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function ripai(pais) {
    pais.sort((a, b) => paiList.find(e => e.name1 == a).order - paiList.find(e => e.name1 == b).order)
    return pais;
}

function getRandomPaiAndImage(howManyPais = 14) {

    return new Promise((resolve, reject) => {
        // console.log('ゲットランダム牌姿');
        let nums = [];
        let pais = [];
        for (let i = 0; i < howManyPais; i++) {
            let num = getRandomInt(allPaiList.length);

            while (nums.includes(num)) {
                num = getRandomInt(allPaiList.length);
            }
            let pai = allPaiList[num];
            nums.push(num);
            pais.push(pai);
        }

        pais = ripai(pais);
        // console.log(pais);
        let paiPaths = pais.map(p => paiList.find(e => e.name1 == p).path);

        joinImages(paiPaths)
            .then(() => {
                resolve(pais);
            })
            .catch(e => {
                console.log(e);
                reject(['s1', 's1', 's1', 's1', 'm2', 'm2', 'm2', 'm2', 'p3', 'p3', 'p3', 'p3', 'j1', 'j1']);
            })
    })
}

//牌姿とツモ牌を与えると、その連結した画像をoutput.pngに出力する
function getPaisImage(pais, drawPai = '') {

    return new Promise((resolve, reject) => {
        // console.log('ゲットランダム牌姿');

        // console.log('make Image');
        // console.log(pais);
        // console.log(drawPai);
        pais = ripai(pais);
        // console.log(pais);
        let paiPaths = pais.map(p => paiList.find(e => e.name1 == p).path);

        if (drawPai != '') {
            paiPaths.push('images/01.png')
            paiPaths.push(paiList.find(e => e.name1 == drawPai).path)
        }


        // console.log(paiPaths);
        joinImages(paiPaths)
            .then(() => {
                resolve(pais);
            })
            .catch(e => {
                console.log(e);
                reject(['s1', 's1', 's1', 's1', 'm2', 'm2', 'm2', 'm2', 'p3', 'p3', 'p3', 'p3', 'j1', 'j1']);
            })
    })
}

//ランダムな牌を返し、その連結した画像をoutput.pngに出力する。一応引数で牌の枚数も変えられる。
function getRandomPai(howManyPais = 14) {
    // console.log('ゲットランダム牌姿');
    let nums = [];
    let pais = [];
    for (let i = 0; i < howManyPais; i++) {
        let num = getRandomInt(allPaiList.length);

        while (nums.includes(num)) {
            num = getRandomInt(allPaiList.length);
        }
        let pai = allPaiList[num];
        nums.push(num);
        pais.push(pai);
    }

    pais = ripai(pais);


    return pais;
}

//ランダムな索子のみの牌を返し、その連結した画像をoutput.pngに出力する。一応引数で牌の枚数も変えられる。
function getRandomPaiBamboo(howManyPais = 14) {
    // console.log('ゲットランダム牌姿');
    let nums = [];
    let pais = [];
    for (let i = 0; i < howManyPais; i++) {
        let num = getRandomInt(allSouzuList.length);

        while (nums.includes(num)) {
            num = getRandomInt(allSouzuList.length);
        }
        let pai = allSouzuList[num];
        nums.push(num);
        pais.push(pai);
    }

    pais = ripai(pais);
    return pais;
}

let patterns = [];

//paisで与えられた牌姿を、順子、刻子、対子、両面ターツ、ペンタ―ツ、カンターツとゴミ牌に分ける。
//赤ドラ牌のs5aとかのaとかは事前に除去してから関数を呼び出すこと。
function makePattern(pais, shuntsu, kotsu, toitsu, tartsu23, tartsu12, tartsu13, dusts) {

    //判定牌が無くなったらpatternsにパターンを追加する。
    if (pais.length == 0) {
        patterns.push({
            'shuntsu': shuntsu,
            'kotsu': kotsu,
            'toitsu': toitsu,
            'tartsu23': tartsu23,
            'tartsu12': tartsu12,
            'tartsu13': tartsu13,
            'dusts': dusts
        });
        return;
    }


    if (pais.filter(e => e == pais[0]).length >= 3) { //刻子がある場合
        makePattern(pais.slice(3), shuntsu, kotsu.concat([
            [pais[0], pais[1], pais[2]]
        ]), toitsu, tartsu23, tartsu12, tartsu13, dusts);
        makePattern(pais.slice(2), shuntsu, kotsu, toitsu.concat([
            [pais[0], pais[1]]
        ]), tartsu23, tartsu12, tartsu13, dusts);
    } else if (pais.filter(e => e == pais[0]).length == 2) { //対子がある場合
        makePattern(pais.slice(2), shuntsu, kotsu, toitsu.concat([
            [pais[0], pais[1]]
        ]), tartsu23, tartsu12, tartsu13, dusts);
    }

    if (pais[0].slice(0, 1) == 'j' || pais[0].slice(1, 2) == '9') { //1枚しかない字牌と、数牌の9はゴミ（9が8とくっつく場合は8の時に一緒に呼び出されてるはずなので）
        makePattern(pais.slice(1), shuntsu, kotsu, toitsu, tartsu23, tartsu12, tartsu13, dusts.concat(pais[0]));
        return;
    }

    //次の牌と次の次の牌の位置を調べる
    let nextP = pais.indexOf(pais[0].slice(0, 1) + String(parseInt(pais[0].slice(1, 2)) + 1));
    let nextnextP = pais.indexOf(pais[0].slice(0, 1) + String(parseInt(pais[0].slice(1, 2)) + 2));

    if (nextP >= 0 && nextnextP >= 0) {
        //順子（123，678などの形）として取れる場合
        let _pais = pais.slice(0, nextnextP).concat(pais.slice(nextnextP + 1));
        _pais = _pais.slice(0, nextP).concat(_pais.slice(nextP + 1));
        _pais = _pais.slice(1);

        makePattern(_pais, shuntsu.concat([
            [pais[0], pais[nextP], pais[nextnextP]]
        ]), kotsu, toitsu, tartsu23, tartsu12, tartsu13, dusts);

    }
    if (nextP >= 0) {
        //ターツ（12、78などの形）として取れる場合
        let _pais = pais.slice(0, nextP).concat(pais.slice(nextP + 1));
        _pais = _pais.slice(1);

        if (pais[0].slice(1, 2) == '1' || pais[0].slice(1, 2) == '8') {
            //ペンターツとして取れる場合
            makePattern(_pais, shuntsu, kotsu, toitsu, tartsu23, tartsu12.concat([
                [pais[0], pais[nextP]]
            ]), tartsu13, dusts);
        } else {
            //両面ターツとして取れる場合
            makePattern(_pais, shuntsu, kotsu, toitsu, tartsu23.concat([
                [pais[0], pais[nextP]]
            ]), tartsu12, tartsu13, dusts);
        }
    }
    if (nextnextP >= 0) {
        let _pais = pais.slice(0, nextnextP).concat(pais.slice(nextnextP + 1));
        _pais = _pais.slice(1);
        makePattern(_pais, shuntsu, kotsu, toitsu, tartsu23, tartsu12, tartsu13.concat([
            [pais[0], pais[nextnextP]]
        ]), dusts);

    }
    //その牌をゴミとしてのパターンも呼び出す。
    makePattern(pais.slice(1), shuntsu, kotsu, toitsu, tartsu23, tartsu12, tartsu13, dusts.concat(pais[0]));
}

function getShantenMents(pattern) {
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


    block = pattern.shuntsu.length + pattern.kotsu.length + pattern.toitsu.length + pattern.tartsu23.length + pattern.tartsu12.length + pattern.tartsu13.length;
    if (block >= 5 && pattern.toitsu.length == 0) shanten -= 1;
    return 8 - shanten;
}

function getShantenChitoi(pattern) {
    let shanten = 6 - [...new Set(pattern.toitsu.flat())].length;
    if (pattern.toitsu.filter(t => pattern.dusts.includes(t[0])).length >= 1) shanten++;
    return shanten;
}

function getShantenKokushi(pattern) {
    // console.log('国士のシャンテン数');
    // console.log(pattern);
    // let pais = pattern.shuntsu.flat().concat(pattern.kotsu.flat()).concat(pattern.toitsu.flat()).concat(pattern.tartsu23.flat()).concat(pattern.tartsu12.flat()).concat(pattern.tartsu13.flat()).concat(pattern.dusts.flat());
    let pais = pattern.dusts;
    pais = ripai(pais);
    let kokushi = [
        pais.filter(e => e == 's1').length,
        pais.filter(e => e == 's9').length,
        pais.filter(e => e == 'm1').length,
        pais.filter(e => e == 'm9').length,
        pais.filter(e => e == 'p1').length,
        pais.filter(e => e == 'p9').length,
        pais.filter(e => e == 'j1').length,
        pais.filter(e => e == 'j2').length,
        pais.filter(e => e == 'j3').length,
        pais.filter(e => e == 'j4').length,
        pais.filter(e => e == 'j5').length,
        pais.filter(e => e == 'j6').length,
        pais.filter(e => e == 'j7').length
    ];

    return 13 - kokushi.filter(e => e >= 1).length - (kokushi.filter(e => e >= 2).length >= 1 ? 1 : 0);
}

function getTenhouEmbed() {
    return new Promise((resolve, reject) => {
        patterns = [];
        // console.log('getTenhouEmbed');
        // let pais = await getRandomPaiAndImage();
        getRandomPaiAndImage()
            .then(pais => {
                // console.log('embed作成');
                pais = pais.map(p => p.slice(0, 2));
                console.log(pais);
                let tenhouEmbed = new MessageEmbed();
                tenhouEmbed.setTitle('天和チャレンジ');
                tenhouEmbed.setColor('#ffff00');
                tenhouEmbed.setImage(url = "attachment://upload.png");
                // tenhouEmbed.addField(name = 'test', value = pais.join(), inline = true);

                // console.log('パターン解析');
                makePattern(pais, [], [], [], [], [], [], []);
                let shantens = patterns.map(p => [getShantenMents(p), getShantenChitoi(p), getShantenKokushi(p)]);
                let shanten = Math.min(...[Math.min(...shantens.map(p => p[0])), Math.min(...shantens.map(p => p[1])), Math.min(...shantens.map(p => p[2]))]);
                let result = '';
                // console.log(shanten);
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
                if (Math.min(...shantens.map(p => p[2])) < 5) {
                    result += `\nちなみに国士やったら${Math.min(...shantens.map(p => p[2]))}シャンテンやな。`;
                }
                // console.log(result);
                tenhouEmbed.setDescription(result);
                resolve({ embeds: [tenhouEmbed], files: [{ attachment: 'output.png', name: 'upload.png' }] });
            })
            .catch(e => {
                console.log(e);
                reject('ちょいまってや、テンポ早いとミスるからゆっくりな。');
            });
    })
}

function draw(pais) {
    let allPais = allPaiList;

    pais.forEach(p => {
        let i = allPais.indexOf(p);
        allPais = allPais.slice(0, i).concat(allPais.slice(i + 1));
    })
    return allPais[getRandomInt(allPais.length)];
}

function getDoubleRiichiEmbed() {
    return new Promise((resolve, reject) => {
        patterns = [];
        let [pais, waitPais] = getTempai();
        let drawPai = 0;

        drawPai = draw(pais);

        getPaisImage(pais, drawPai)
            .then(() => {
                // console.log('embed作成');
                pais = pais.map(p => p.slice(0, 2));
                console.log(pais);
                let doubleRiichiEmbed = new MessageEmbed();
                doubleRiichiEmbed.setTitle('ダブリー一発チャレンジ');
                doubleRiichiEmbed.setColor('#ffff00');
                doubleRiichiEmbed.setImage(url = "attachment://upload.png");
                // tenhouEmbed.addField(name = 'test', value = pais.join(), inline = true);


                let result = '';
                if (waitPais.includes(drawPai)) result = 'ダブリー一発！！！';
                else result = '一発ならず～'

                // console.log(result);
                doubleRiichiEmbed.setDescription(result);
                resolve({ embeds: [doubleRiichiEmbed], files: [{ attachment: 'output.png', name: 'upload.png' }] });
            })
            .catch(e => {
                console.log(e);
                reject('ちょいまってや、テンポ早いとミスるからゆっくりな。');
            });
    })
}

function getMachiateEmbed(bamboo = false) {
    return new Promise((resolve, reject) => {
        patterns = [];
        let [pais, waitPais] = getTempai(bamboo);

        drawPai = draw(pais);

        getPaisImage(pais)
            .then(() => {
                // console.log('embed作成');
                // pais = pais.map(p => p.slice(0, 2));
                console.log(pais);
                console.log(waitPais);
                let machiateEmbed = new MessageEmbed();
                machiateEmbed.setTitle('バンブー麻雀待ち当てクイズ');
                machiateEmbed.setColor('#008000');
                machiateEmbed.setImage(url = "attachment://upload.png");
                machiateEmbed.setDescription('このテンパイの待ちを返信してね。\n例）「147」「6789」など');

                waitPais = waitPais.map(p => p.slice(1, 2)).join('');
                resolve([{ embeds: [machiateEmbed], files: [{ attachment: 'output.png', name: 'upload.png' }] }, waitPais]);
            })
            .catch(e => {
                return ['error', 'error'];
                console.log(e);
                reject('ちょいまってや、テンポ早いとミスるからゆっくりな。');
            });
    })
}
// getMachiateEmbed(bamboo = true);

function neighborPai(pai, num) {
    return pai.slice(0, 1) + String(parseInt(pai.slice(1, 2)) + num);
}



//捨て牌候補（テンパイパターン専用）
function whatDiscard(pattern) {
    let howManyPais = pattern.shuntsu.flat().concat(pattern.kotsu.flat()).concat(pattern.toitsu.flat()).concat(pattern.tartsu23.flat()).concat(pattern.tartsu12.flat()).concat(pattern.tartsu13.flat()).concat(pattern.dusts.flat()).length;
    let shantens = [getShantenMents(pattern), getShantenChitoi(pattern), getShantenKokushi(pattern)];
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
        let pais = pattern.shuntsu.flat().concat(pattern.kotsu.flat()).concat(pattern.toitsu.flat()).concat(pattern.tartsu23.flat()).concat(pattern.tartsu12.flat()).concat(pattern.tartsu13.flat()).concat(pattern.dusts.flat());
        pais = ripai(pais);
        let yaochu = ['m1', 'm9', 'p1', 'p9', 's1', 's9', 'j1', 'j2', 'j3', 'j4', 'j5', 'j6', 'j7'];

        if (yaochu.filter(p => !pais.includes(p)).length == 0) {
            //13面待ちの場合は么九牌に含まれてない牌が捨て牌
            return pais.find(p => !yaochu.includes(p));
        } else {
            //13面ではない場合は、かぶっている么九牌が二種類以上あればその牌、一種類だけなら么九牌以外の牌が捨て牌
            if (yaochu.filter(p => pais.filter(e => e == p).length >= 2).length >= 2) return yaochu.filter(p => pais.filter(e => e == p).length >= 2);
            else pais.filter(p => !yaochu.includes(p));
        }
        //テンパイちゃうやん
    } else {
        return [];
    }
}

//待ち配候補（テンパイパターン専用）
function whatWait(pattern) {
    let shantens = [getShantenMents(pattern), getShantenChitoi(pattern), getShantenKokushi(pattern)];
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
            else if (pattern.tartsu12.length == 1) return pattern.tartsu12[0][0].slice(1, 2) == '1' ? [neighborPai(pattern.tartsu12[0][1], 1)] : [neighborPai(pattern.tartsu12[0][0], -1)];
            //嵌張待ち
            else if (pattern.tartsu13.length == 1) return [neighborPai(pattern.tartsu13[0][0], 1)];
            else return ['え、なになに何待ち怖い'];
        }

        //チートイテンパイ
    } else if (shantens[1] == 0) {
        return pattern.dusts;

        //国士無双テンパイ
    } else if (shantens[2] == 0) {
        let pais = pattern.shuntsu.flat().concat(pattern.kotsu.flat()).concat(pattern.toitsu.flat()).concat(pattern.tartsu23.flat()).concat(pattern.tartsu12.flat()).concat(pattern.tartsu13.flat()).concat(pattern.dusts.flat());
        pais = ripai(pais);
        let yaochu = ['m1', 'm9', 'p1', 'p9', 's1', 's9', 'j1', 'j2', 'j3', 'j4', 'j5', 'j6', 'j7'];
        let kokushi = yaochu.map(p => pais.filter(e => e == p).length);
        // console.log('kokushi');
        // console.log(kokushi);
        // // [
        //     pais.filter(e => e == 's1').length,
        //     pais.filter(e => e == 's9').length,
        //     pais.filter(e => e == 'm1').length,
        //     pais.filter(e => e == 'm9').length,
        //     pais.filter(e => e == 'p1').length,
        //     pais.filter(e => e == 'p9').length,
        //     pais.filter(e => e == 'j1').length,
        //     pais.filter(e => e == 'j2').length,
        //     pais.filter(e => e == 'j3').length,
        //     pais.filter(e => e == 'j4').length,
        //     pais.filter(e => e == 'j5').length,
        //     pais.filter(e => e == 'j6').length,
        //     pais.filter(e => e == 'j7').length
        // ];

        if (kokushi.indexOf(0) == -1) { //13面待ち
            return yaochu;
        } else {
            return [yaochu[kokushi.indexOf(0)]];
        }
        //テンパイちゃうやん
    } else {
        return [];
    }
}

// let pp = {
//     shuntsu: [
//         ['s1', 's2', 's3'],
//         ['s3', 's4', 's5'],
//         ['s4', 's5', 's6'],
//         ['s6', 's7', 's8']
//     ],
//     kotsu: [],
//     toitsu: [
//         ['s9', 's9']
//     ],
//     tartsu23: [],
//     tartsu12: [],
//     tartsu13: [],
//     dusts: []
// }
// let discards = ripai([...new Set(whatDiscard(pp).flat())]);

//テンパイしているパターン配列から、最も良い捨て牌とその時の待ち配を返す。待ちの種類優先と待ちの枚数優先があり、デフォルトは待ちの種類優先
function getBestDiscard(tempaiPatterns, priorityKind = true) {
    console.log(tempaiPatterns[0]);
    let pais = tempaiPatterns[0].shuntsu.flat().concat(tempaiPatterns[0].kotsu.flat()).concat(tempaiPatterns[0].toitsu.flat()).concat(tempaiPatterns[0].tartsu23.flat()).concat(tempaiPatterns[0].tartsu12.flat()).concat(tempaiPatterns[0].tartsu13.flat()).concat(tempaiPatterns[0].dusts.flat());

    if (pais.length != 14) return [
        ['error'],
        ['error']
    ];
    let discards = ripai([...new Set(tempaiPatterns.map(p => whatDiscard(p)).flat())]);
    winningPais = tempaiPatterns.map(p => whatWait(p));
    discardPais = tempaiPatterns.map(p => whatDiscard(p));
    let waitForEachDiscard = discards.map(p => {
        //ｗは各捨て牌毎の待ち牌配列
        let set = new Set(winningPais.filter((e, i) => discardPais[i].includes(p)).flat());
        set.delete(p);
        let w = [...set];
        return {
            'discard': p,
            'winning': ripai(w),
            'winningKind': w.length,
            'winningCount': w.map(e => 4 - pais.filter(x => x == e).length).reduce((sum, e) => sum + e)
        };
    });
    // console.log(waitForEachDiscard);
    if (priorityKind) {
        let d = waitForEachDiscard.filter(p => p.winningKind == Math.max(...waitForEachDiscard.map(e => e.winningKind)));
        if (d.length == 1) return [d[0].discard, d[0].winning];
        else {
            d = d.filter(p => p.winningCount == Math.max(...d.map(e => e.winningCount)));
            return [d[0].discard, d[0].winning];
        };


    } else {
        let d = waitForEachDiscard.filter(p => p.winningCount == Math.max(...waitForEachDiscard.map(e => e.winningCount))).winning;
        if (d.length == 1) return [d[0].discard, d[0].winning];
        else {
            d = d.filter(p => p.winningKind == Math.max(...d.map(e => e.winningKind)));
            return [d[0].discard, d[0].winning];
        };
    }

}



//テンパイしている13枚の牌とその待ち牌を返す。
function getTempai(bamboo = false) {
    let shanten = 2;
    let pais;
    let akaDoras;
    while (shanten > 1 || shanten < 0) {
        patterns = [];


        pais = bamboo ? getRandomPaiBamboo(14) : getRandomPai(14);

        akaDoras = [pais.includes('m5a'), pais.includes('p5a'), pais.includes('s5a')]
        //赤ドラ要素を削除
        pais = pais.map(p => p.slice(0, 2));


        // console.log('パターン解析');
        makePattern(pais, [], [], [], [], [], [], []);
        let shantens = patterns.map(p => [getShantenMents(p), getShantenChitoi(p), getShantenKokushi(p)]);
        shanten = Math.min(...[Math.min(...shantens.map(p => p[0])), Math.min(...shantens.map(p => p[1])), Math.min(...shantens.map(p => p[2]))]);
    }
    // console.log(pais);

    if (shanten == 1) {
        // console.log('イーシャンテン');
        let shanten1Patterns = patterns.filter(p => Math.min(getShantenMents(p), getShantenChitoi(p), getShantenKokushi(p)) <= 1);
        let wasteAndWaitPais = getWasteAndWaitPaisFrom1shantens(shanten1Patterns);
        // console.log(wasteAndWaitPais);
        let best = wasteAndWaitPais[wasteAndWaitPais.map(e => e.wait.length).indexOf(Math.max(...wasteAndWaitPais.map(e => e.wait.length)))]; //最も有効牌の種類が多い捨て牌と待ち牌
        let i = pais.indexOf(best.waste);
        pais = pais.slice(0, i).concat(pais.slice(i + 1)).concat(best.wait[getRandomInt(best.wait.length)]);

        if (akaDoras[0]) pais[pais.indexOf('m5')] = 'm5a';
        if (akaDoras[1]) pais[pais.indexOf('p5')] = 'p5a';
        if (akaDoras[2]) pais[pais.indexOf('s5')] = 's5a';
        pais = ripai(pais);
        // console.log(pais);

        // shantens = patterns.map(p => [getShantenMents(p), getShantenChitoi(p), getShantenKokushi(p)])
    }

    akaDoras = [pais.includes('m5a'), pais.includes('p5a'), pais.includes('s5a')]
    //赤ドラ要素を削除
    pais = pais.map(p => p.slice(0, 2));
    makePattern(pais, [], [], [], [], [], [], []);
    let tempaiPatterns = patterns.filter(p => Math.min(getShantenMents(p), getShantenChitoi(p), getShantenKokushi(p)) <= 0);
    // console.log(tempaiPatterns);
    let [bestDiscard, bestDiscardWait] = getBestDiscard(tempaiPatterns);
    // console.log(`bestDiscard:${bestDiscard}`);
    // console.log(`bestDiscardWait:[${bestDiscardWait}]`);
    let index = pais.indexOf(bestDiscard);
    pais = pais.slice(0, index).concat(pais.slice(index + 1));
    if (akaDoras[0] && pais.includes('m5')) pais[pais.indexOf('m5')] = 'm5a';
    if (akaDoras[1] && pais.includes('p5')) pais[pais.indexOf('p5')] = 'p5a';
    if (akaDoras[2] && pais.includes('s5')) pais[pais.indexOf('s5')] = 's5a';
    pais = ripai(pais);

    return [pais, bestDiscardWait];
}

//イーシャンテン何切る問題のEmbedと、4択の答えの順番、正解発表時のテキスト（各切り牌の受け入れ枚数など）
function get1shantenEmbed(bamboo = false) {
    let shanten = 2;
    let pais;
    let akaDoras;
    let wasteAndWaitPais;
    let howManyWaits;
    let answerText;
    let choices = [];
    let answer;
    return new Promise((resolve, reject) => {
        while (true) {
            patterns = [];
            choices = [];

            pais = bamboo ? getRandomPaiBamboo(14) : getRandomPai(14);

            akaDoras = [pais.includes('m5a'), pais.includes('p5a'), pais.includes('s5a')]
            //赤ドラ要素を削除
            pais = pais.map(p => p.slice(0, 2));


            // console.log('パターン解析');
            makePattern(pais, [], [], [], [], [], [], []);
            let shantens = patterns.map(p => [getShantenMents(p), getShantenChitoi(p), getShantenKokushi(p)]);
            shanten = Math.min(...[Math.min(...shantens.map(p => p[0])), Math.min(...shantens.map(p => p[1])), Math.min(...shantens.map(p => p[2]))]);
            if (shanten != 1) continue;

            //イーシャンテンになるパターンを抽出
            let shanten1Patterns = patterns.filter(p => Math.min(getShantenMents(p), getShantenChitoi(p), getShantenKokushi(p)) <= 1);
            //各イーシャンテンパターンに対して捨て牌とそれに対応する待ち牌を取得
            wasteAndWaitPais = getWasteAndWaitPaisFrom1shantens(shanten1Patterns).sort((a, b) => b.wait.reduce((sum, e) => sum + getHowManyRest(pais, e), 0) - a.wait.reduce((sum, e) => sum + getHowManyRest(pais, e), 0));
            //各イーシャンテンパターンに対して捨て牌とそれに対応する待ち牌の枚数を取得
            wasteAndWaitPais = wasteAndWaitPais.map(p => {
                return { 'waste': p.waste, 'wait': p.wait, 'waitCount': p.wait.reduce((sum, e) => sum + getHowManyRest(pais, e), 0), 'waitKind': p.wait.length }
            });

            if (!([...new Set(wasteAndWaitPais.map(p => p.waitCount))].length >= 4 && wasteAndWaitPais[0].waste.slice(0, 1) != 'j')) continue;

            //赤ドラ復活
            if (akaDoras[0] && pais.includes('m5')) pais[pais.indexOf('m5')] = 'm5a';
            if (akaDoras[1] && pais.includes('p5')) pais[pais.indexOf('p5')] = 'p5a';
            if (akaDoras[2] && pais.includes('s5')) pais[pais.indexOf('s5')] = 's5a';

            //選択肢をchoicesに追加していく。各受け入れ枚数種類につき1つずつ
            let temp;
            for (let i = 0; i < 4; i++) {
                temp = wasteAndWaitPais.filter(p => p.waitCount == [...new Set(wasteAndWaitPais.map(p => p.waitCount))][i]);
                choices.push(temp[getRandomInt(temp.length)]);
            }
            //答え合わせの文章を作成(各捨牌の時の受け入れ枚数など)
            answerText = [];
            answerText.push('各受け入れ枚数');
            console.log(choices);
            for (let i = 0; i < 4; i++) {
                // console.log(i);
                answerText.push(`${choices[i].waste}切り：${('  '+wasteAndWaitPais.find(p => p.waste == choices[i].waste).waitKind).slice(-2)}種${('  '+wasteAndWaitPais.find(p => p.waste == choices[i].waste).waitCount).slice(-2)}枚[${wasteAndWaitPais.find(p => p.waste == choices[i].waste).wait.join(', ')}]`);
            }
            answerText = answerText.join('\n');
            console.log(answerText);

            //待ち牌の枚数の種類が4種類ずつかつ、最も枚数が多い時の捨牌が字牌以外の時、牌姿固定
            console.log(`差：${choices[0].waitCount - choices[1].waitCount}`);
            if ([...new Set(wasteAndWaitPais.map(p => p.waitCount))].length >= 4 && wasteAndWaitPais[0].waste.slice(0, 1) != 'j' && choices[0].waitCount - choices[1].waitCount <= 3) break;
        }
        //選択肢を順番に並び替え
        choices = choices.sort((a, b) => paiList.find(e => e.name1 == a.waste).order - paiList.find(e => e.name1 == b.waste).order);
        answer = choices.map(p => p.waste).indexOf(wasteAndWaitPais[0].waste);


        // console.log(choices);
        // console.log(answer);

        getPaisImage(pais)
            .then(() => {
                // console.log('embed作成');
                pais = pais.map(p => p.slice(0, 2));
                console.log(pais);
                let shanten1Embed = new MessageEmbed();
                shanten1Embed.setTitle('1シャンテン何切る');
                shanten1Embed.setDescription('受け入れ枚数が最大となる切り牌はどれ？')
                shanten1Embed.setColor('#87cefa');
                shanten1Embed.setImage(url = "attachment://upload.png");
                let text = choices.map((p, i) => `${iconsABC[i]}：${p.waste}`).join('\n');
                shanten1Embed.addField(name = '選択肢', value = text, inline = false);


                // console.log(result);
                // shanten1Embed.setDescription(result);
                let answerPai = choices[answer].waste;
                resolve([{ embeds: [shanten1Embed], files: [{ attachment: 'output.png', name: 'upload.png' }] }, answer, answerPai, answerText]);
            })
            .catch(e => {
                console.log(e);
                reject('ちょいまってや、テンポ早いとミスるからゆっくりな。');
            });
    })
}


// get1shantenEmbed();


function getHowManyRest(_pais, wait) {
    let pais = _pais.map(p => p.slice(0, 2));
    return 4 - pais.filter(p => p == wait).length;
}

function getWasteAndWaitPaisFrom1shantens(shanten1Patterns) {
    let unite = []
    shanten1Patterns.forEach((p, i) => {
        getWasteAndWaitPaisFrom1shanten(p).forEach((w, j) => {
            if (unite.filter(e => e.waste === w.waste).length == 0) unite.push(w);
            else unite.filter(e => e.waste == w.waste)[0].wait = ripai([...new Set(unite.filter(e => e.waste == w.waste)[0].wait.concat(w.wait))]);
        })
    });
    // console.log('待ちはこれ？');
    // console.log(unite);
    return unite;
}




//イーシャンテンのパターンから捨て牌と待ち牌の配列を返す
//
function getWasteAndWaitPaisFrom1shanten(shanten1Pattern) {

    // console.log(shanten1Pattern);
    let blocks = shanten1Pattern.shuntsu.length + shanten1Pattern.kotsu.length + shanten1Pattern.toitsu.length + shanten1Pattern.tartsu23.length + shanten1Pattern.tartsu13.length + shanten1Pattern.tartsu12.length;
    let wasteAndWaitPais = [];
    // console.log(`${blocks}ブロック`);


    if (getShantenMents(shanten1Pattern) == 1) {
        //4ブロックの場合
        if (blocks == 4) {
            //対子がない場合
            if (shanten1Pattern.toitsu.length == 0) {

                shanten1Pattern.dusts.forEach((d, i) => {
                    let waitPais = [];
                    //両面ターツがある場合、その待ち牌
                    if (shanten1Pattern.tartsu23.length != 0) {
                        waitPais.push(shanten1Pattern.tartsu23.map(e => neighborPai(e[0], -1)).flat());
                        waitPais.push(shanten1Pattern.tartsu23.map(e => neighborPai(e[1], 1)).flat());
                    }
                    //ペンチャンターツがある場合、その待ち牌
                    if (shanten1Pattern.tartsu12.length != 0) {
                        waitPais.push(shanten1Pattern.tartsu12.map(e => e[0].slice(1, 2) == '1' ? neighborPai(e[1], 1) : neighborPai(e[0], -1)).flat());
                    }
                    //カンチャンターツがある場合、その待ち牌
                    if (shanten1Pattern.tartsu13.length != 0) {
                        waitPais.push(shanten1Pattern.tartsu13.map(e => neighborPai(e[0], 1)).flat());
                    }
                    //残りのゴミ牌も待ち牌になる
                    waitPais.push(shanten1Pattern.dusts.slice(0, i).concat(shanten1Pattern.dusts.slice(i + 1)).flat());
                    waitPais = [...new Set(waitPais.flat(2))];

                    wasteAndWaitPais.push({
                        'waste': d,
                        'wait': waitPais
                    });


                });


                //対子がある場合
            } else {


                shanten1Pattern.dusts.forEach((d, i) => {
                    let waitPais = [];
                    //残りのゴミ牌とその周辺牌も待ち牌になる
                    let restDust = shanten1Pattern.dusts.slice(0, i).concat(shanten1Pattern.dusts.slice(i + 1));
                    restDust.forEach(r => {
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
                    waitPais = ripai([...new Set(waitPais.flat(2).filter(e => allPaiList.includes(e)))]);
                    // console.log(d);
                    // console.log(waitPais);

                    wasteAndWaitPais.push({
                        'waste': d,
                        'wait': waitPais
                    });


                });



            }
            //5ブロックの場合
        } else if (blocks == 5) {
            //対子がない場合
            if (shanten1Pattern.toitsu.length == 0) {
                let waitPais = [];

                //両面ターツがある場合、その待ち牌とその構成牌
                if (shanten1Pattern.tartsu23.length != 0) {
                    waitPais.push(shanten1Pattern.tartsu23.map(e => neighborPai(e[0], -1)).flat());
                    waitPais.push(shanten1Pattern.tartsu23.map(e => e[0]).flat());
                    waitPais.push(shanten1Pattern.tartsu23.map(e => e[1]).flat());
                    waitPais.push(shanten1Pattern.tartsu23.map(e => neighborPai(e[1], 1)).flat());
                }
                //ペンチャンターツがある場合、その待ち牌とその構成牌
                if (shanten1Pattern.tartsu12.length != 0) {
                    waitPais.push(shanten1Pattern.tartsu12.map(e => e[0]).flat());
                    waitPais.push(shanten1Pattern.tartsu12.map(e => e[1]).flat());
                    waitPais.push(shanten1Pattern.tartsu12.map(e => e[0].slice(1, 2) == '1' ? neighborPai(e[1], 1) : neighborPai(e[0], -1)).flat());

                }
                //カンチャンターツがある場合、その待ち牌とその構成牌
                if (shanten1Pattern.tartsu13.length != 0) {
                    waitPais.push(shanten1Pattern.tartsu13.map(e => e[0]).flat());
                    waitPais.push(shanten1Pattern.tartsu13.map(e => neighborPai(e[0], 1)).flat());
                    waitPais.push(shanten1Pattern.tartsu13.map(e => e[1]).flat());
                }
                waitPais = [...new Set(waitPais.flat(2))];
                shanten1Pattern.dusts.forEach(d => {
                    wasteAndWaitPais.push({
                        'waste': d,
                        'wait': waitPais
                    });

                });

                //対子が一つの場合
            } else if (shanten1Pattern.toitsu.length == 1) {
                let waitPais = [];

                //両面ターツがある場合、その待ち牌
                if (shanten1Pattern.tartsu23.length != 0) {
                    waitPais.push(shanten1Pattern.tartsu23.map(e => neighborPai(e[0], -1)).flat());
                    waitPais.push(shanten1Pattern.tartsu23.map(e => neighborPai(e[1], 1)).flat());
                }
                //ペンチャンターツがある場合、その待ち牌
                if (shanten1Pattern.tartsu12.length != 0) {
                    waitPais.push(shanten1Pattern.tartsu12.map(e => e[0].slice(1, 2) == '1' ? neighborPai(e[1], 1) : neighborPai(e[0], -1)).flat());
                }
                //カンチャンターツがある場合、その待ち牌
                if (shanten1Pattern.tartsu13.length != 0) {
                    waitPais.push(shanten1Pattern.tartsu13.map(e => neighborPai(e[0], 1)).flat());
                }
                // console.log('waitPais');
                // console.log(waitPais);
                waitPais = [...new Set(waitPais.flat(2))];
                // console.log(waitPais);
                shanten1Pattern.dusts.forEach(d => {
                    wasteAndWaitPais.push({
                        'waste': d,
                        'wait': waitPais
                    });

                });

                //対子が2つ以上の場合
            } else {
                let waitPais = [];

                //対子の構成牌も有効牌
                waitPais.push(shanten1Pattern.toitsu.map(e => e[0]).flat());
                //両面ターツがある場合、その待ち牌
                if (shanten1Pattern.tartsu23.length != 0) {
                    waitPais.push(shanten1Pattern.tartsu23.map(e => neighborPai(e[0], -1)).flat());
                    waitPais.push(shanten1Pattern.tartsu23.map(e => neighborPai(e[1], 1)).flat());
                }
                //ペンチャンターツがある場合、その待ち牌
                if (shanten1Pattern.tartsu12.length != 0) {
                    waitPais.push(shanten1Pattern.tartsu12.map(e => e[0].slice(1, 2) == '1' ? neighborPai(e[1], 1) : neighborPai(e[0], -1)).flat());
                }
                //カンチャンターツがある場合、その待ち牌
                if (shanten1Pattern.tartsu13.length != 0) {
                    waitPais.push(shanten1Pattern.tartsu13.map(e => neighborPai(e[0], 1)).flat());
                }
                waitPais = ripai([...new Set(waitPais.flat(2))]);
                shanten1Pattern.dusts.forEach(d => {
                    // console.log('5ブロック');
                    // console.log(d);
                    // console.log(waitPais)
                    wasteAndWaitPais.push({
                        'waste': d,
                        'wait': waitPais
                    });

                });

            }
            //6ブロックの場合
        } else {

            //対子が2つ以上ある場合は、各対子に対して対子崩しも選択肢
            if (shanten1Pattern.toitsu.length >= 2) {
                let waitPais = [];
                shanten1Pattern.toitsu.forEach((t, i, array) => {
                    waitPais = [];
                    //両面ターツがある場合、その待ち牌
                    if (shanten1Pattern.tartsu23.length != 0) {
                        waitPais.push(shanten1Pattern.tartsu23.map(e => neighborPai(e[0], -1)).flat());
                        waitPais.push(shanten1Pattern.tartsu23.map(e => neighborPai(e[1], 1)).flat());
                    }
                    //ペンチャンターツがある場合、その待ち牌
                    if (shanten1Pattern.tartsu12.length != 0) {
                        waitPais.push(shanten1Pattern.tartsu12.map(e => e[0].slice(1, 2) == '1' ? neighborPai(e[1], 1) : neighborPai(e[0], -1)).flat());
                    }
                    //カンチャンターツがある場合、その待ち牌
                    if (shanten1Pattern.tartsu13.length != 0) {
                        waitPais.push(shanten1Pattern.tartsu13.map(e => neighborPai(e[0], 1)).flat());
                    }
                    waitPais = [...new Set(waitPais.flat(2))];
                    wasteAndWaitPais.push({
                        'waste': t[0],
                        'wait': waitPais
                    });
                })



            }

            //両面ターツがある場合、各両面を崩した時の待ち牌を追加
            if (shanten1Pattern.tartsu23.length != 0) {
                let waitPais = [];
                shanten1Pattern.tartsu23.forEach((t, i, array) => {
                    waitPais = [];
                    let restTarts23 = array.slice(0, i).concat(array.slice(i + 1));
                    if (restTarts23.length != 0) {
                        waitPais.push(restTarts23.map(e => neighborPai(e[0], -1)).flat());
                        waitPais.push(restTarts23.map(e => neighborPai(e[1], 1)).flat());
                    }
                    //ペンチャンターツがある場合、その待ち牌
                    if (shanten1Pattern.tartsu12.length != 0) {
                        waitPais.push(shanten1Pattern.tartsu12.map(e => e[0].slice(1, 2) == '1' ? neighborPai(e[1], 1) : neighborPai(e[0], -1)).flat());
                    }
                    //カンチャンターツがある場合、その待ち牌
                    if (shanten1Pattern.tartsu13.length != 0) {
                        waitPais.push(shanten1Pattern.tartsu13.map(e => neighborPai(e[0], 1)).flat());
                    }
                    waitPais = [...new Set(waitPais.flat(2))];
                    wasteAndWaitPais.push({
                        'waste': t[0],
                        'wait': waitPais
                    });
                    wasteAndWaitPais.push({
                        'waste': t[1],
                        'wait': waitPais
                    });
                })

            }
            //ペンチャンターツがある場合、各ペンチャンを崩した時の待ち牌を追加
            if (shanten1Pattern.tartsu12.length != 0) {
                let waitPais = [];
                shanten1Pattern.tartsu12.forEach((t, i, array) => {
                    waitPais = [];
                    let restTarts12 = array.slice(0, i).concat(array.slice(i + 1));

                    if (shanten1Pattern.tartsu23.length != 0) {
                        waitPais.push(shanten1Pattern.tartsu23.map(e => neighborPai(e[0], -1)).flat());
                        waitPais.push(shanten1Pattern.tartsu23.map(e => neighborPai(e[1], 1)).flat());
                    }
                    //ペンチャンターツがある場合、その待ち牌
                    if (restTarts12.length != 0) {
                        waitPais.push(restTarts12.map(e => e[0].slice(1, 2) == '1' ? neighborPai(e[1], 1) : neighborPai(e[0], -1)).flat());
                    }
                    //カンチャンターツがある場合、その待ち牌
                    if (shanten1Pattern.tartsu13.length != 0) {
                        waitPais.push(shanten1Pattern.tartsu13.map(e => neighborPai(e[0], 1)).flat());
                    }
                    waitPais = [...new Set(waitPais.flat(2))];
                    wasteAndWaitPais.push({
                        'waste': t[0],
                        'wait': waitPais
                    });
                    wasteAndWaitPais.push({
                        'waste': t[1],
                        'wait': waitPais
                    });
                })

            }
            //カンチャンターツがある場合、各カンチャンを崩した時の待ち牌を追加
            if (shanten1Pattern.tartsu13.length != 0) {
                let waitPais = [];
                shanten1Pattern.tartsu13.forEach((t, i, array) => {
                    waitPais = [];
                    let restTarts13 = array.slice(0, i).concat(array.slice(i + 1));

                    if (shanten1Pattern.tartsu23.length != 0) {
                        waitPais.push(shanten1Pattern.tartsu23.map(e => neighborPai(e[0], -1)).flat());
                        waitPais.push(shanten1Pattern.tartsu23.map(e => neighborPai(e[1], 1)).flat());
                    }
                    //ペンチャンターツがある場合、その待ち牌
                    if (shanten1Pattern.tartsu12.length != 0) {
                        waitPais.push(shanten1Pattern.tartsu12.map(e => e[0].slice(1, 2) == '1' ? neighborPai(e[1], 1) : neighborPai(e[0], -1)).flat());
                    }
                    //カンチャンターツがある場合、その待ち牌
                    if (restTarts13.length != 0) {
                        waitPais.push(restTarts13.map(e => neighborPai(e[0], 1)).flat());
                    }
                    waitPais = [...new Set(waitPais.flat(2))];
                    wasteAndWaitPais.push({
                        'waste': t[0],
                        'wait': waitPais
                    });
                    wasteAndWaitPais.push({
                        'waste': t[1],
                        'wait': waitPais
                    });
                })
            }
        }
        //チートイイーシャンテンの場合
    }
    if (getShantenChitoi(shanten1Pattern) == 1) {
        shanten1Pattern.dusts.forEach((d, i) => {
            wasteAndWaitPais.push({
                'waste': d,
                'wait': shanten1Pattern.dusts.slice(0, i).concat(shanten1Pattern.dusts.slice(i + 1))
            });
        });

        //国士イーシャンテンの場合
    }

    if (getShantenKokushi(shanten1Pattern) == 1) {
        let kokushi = ['m1', 'm9', 'p1', 'p9', 's1', 's9', 'j1', 'j2', 'j3', 'j4', 'j5', 'j6', 'j7'];
        //么九牌のかぶりが無い場合
        if (Math.max(...kokushi.map(e => shanten1Pattern.dusts.filter(d => d == e).length)) == 1) {
            let restDust = shanten1Pattern.dusts.filter(e => !kokushi.includes(e));
            restDust.forEach(d => {
                wasteAndWaitPais.push({
                    'waste': d,
                    'wait': kokushi
                });
            });
            //么九牌のかぶりがある場合
        } else {
            //么九牌以外の牌を持っている場合はそれらが捨て牌候補
            if (shanten1Pattern.dusts.filter(e => !kokushi.includes(e)).length != 0) {
                shanten1Pattern.dusts.filter(e => !kokushi.includes(e)).forEach(d => {
                    wasteAndWaitPais.push({
                        'waste': d,
                        'wait': kokushi.filter(k => !shanten1Pattern.dusts.includes(k))
                    });
                });
            } else {
                //手牌が么九牌のみの場合、二枚以上あるものについて、捨牌はその牌、待ち牌は持ってない么九牌
                kokushi.map(k => shanten1Pattern.dusts.filter(d => d == k).length).filter(k => k >= 2).forEach(k => {
                    wasteAndWaitPais.push({
                        'waste': k,
                        'wait': kokushi.filter(k => !shanten1Pattern.dusts.includes(k))
                    });
                });
            }
        }
    }

    return wasteAndWaitPais;
}


/*
users = {
    'A':['ひとで','まるば',''],
    'B':['ATS','のーや',''],
    'C':['ゆいな','ぞんび',''],
}
games = [
{
    'A':'ひとで',
    'B':'ATS',
    'C':'ゆいな',
    'done':false
},
{
    'A':'まるば',
    'B':'のーや',
    'C':'ぞんび',
    'done':false
},
]
*/

function getMahjongFesEmbed(users, games) {
    let mahjongFesEmbed = new MessageEmbed();
    mahjongFesEmbed.setTitle('国士無双 vs 四暗刻 vs 大三元');
    mahjongFesEmbed.setColor('#8b008b');
    mahjongFesEmbed.setFooter('試合が終わったら✓を押して下さい。\n次の試合をマッチします。');

    mahjongFesEmbed.addField(name = iconsABC[0] + '国士無双チーム', value = users['A'].length === 0 ? '\u200B' : users['A'].join(','), inline = false);
    mahjongFesEmbed.addField(name = iconsABC[1] + '四暗刻チーム', value = users['B'].length === 0 ? '\u200B' : users['B'].join(','), inline = false);
    mahjongFesEmbed.addField(name = iconsABC[2] + '大三元チーム', value = users['C'].length === 0 ? '\u200B' : users['C'].join(','), inline = false);
    //Adone Bdone Cdoneどれか一つでもtrueならその試合の表示をスポイラーする。
    mahjongFesEmbed.addField(name = getEqualLengthStr('国士無双', 15) + getEqualLengthStr('四暗刻', 15) + getEqualLengthStr('大三元', 15) , value = games.length === 0 ? '\u200B' : (games.map(e => (e['Adone'] || e['Bdone'] || e['Cdone']) ? `~~${e['A']}${e['B']}${e['C']}~~` : `${e['A']}${e['B']}${e['C']}`).join('\n')), inline = false);

    return { embeds: [mahjongFesEmbed] };
}




// getTempai();




let test = {
    shuntsu: [
        ['s3', 's4', 's5'],
        ['s6', 's7', 's8']
    ],
    kotsu: [],
    toitsu: [
        ['s3', 's3']
    ],
    tartsu23: [
        ['m2', 'm3']
    ],
    tartsu12: [],
    tartsu13: [
        ['m7', 'm9']
    ],
    dusts: ['s1', 'j3']
};


// console.log(getWasteAndWaitPaisFrom1shanten(test));



//自由に遊ぼうコーナー
// let shanten = 2;
// let i = 0;

// let test = [1, 2, 3, 4, 5];

// test.forEach(e => console.log(e));


// console.log([[[[1]],1],[[1],1]].flat(3));
// let paai;
// console.clear();
// let pais;
// while (shanten > 0) {
//     patterns = [];

//     let nums = [];
//     pais = [];
//     for (let i = 0; i < 14; i++) {
//         let num = getRandomInt(allPaiList.length);

//         while (nums.includes(num)) {
//             num = getRandomInt(allPaiList.length);
//         }
//         let pai = allPaiList[num];
//         nums.push(num);
//         pais.push(pai);
//     }

//     pais = ripai(pais);

//     // console.log('embed作成');
//     pais = pais.map(p => p.slice(0, 2));
//     // console.log(pais);
//     require('readline').cursorTo(process.stdout, 0, 0);
//     process.stdout.write(`${i}回目`);
//     process.stdout.write(`[${pais.join()}]`);
//     let tenhouEmbed = new MessageEmbed();


//     // console.log('パターン解析');
//     makePattern(pais, [], [], [], [], [], [], []);
//     let shantens = patterns.map(p => [getShantenMents(p), getShantenChitoi(p), getShantenKokushi(p)]);
//     shanten = Math.min(...[Math.min(...shantens.map(p => p[0])), Math.min(...shantens.map(p => p[1])), Math.min(...shantens.map(p => p[2]))]);
//     let result = '';
//     // console.log(shanten);
//     if (shanten == -1) result = '天和！！！！！！！！！！！！！！！！！！！';
//     else if (shanten == 0) result = 'テンパイ！！惜しい！！！';
//     else if (shanten == 1) result = '1シャンテン！後少し！';
//     else if (shanten == 2) result = '2シャンテン。結構いいんじゃない？';
//     else if (shanten == 3) result = '3シャンテン。悪くはない配牌だ。';
//     else if (shanten == 4) result = '4シャンテン。こんなもんでしょ。';
//     else if (shanten == 5) result = '5シャンテン。微妙やなぁ。';
//     else if (shanten == 6) result = '6シャンテン。調子悪い？';
//     else if (shanten == 7) result = '7シャンテン。配牌降りしていいよ。';
//     else if (shanten == 8) result = '8シャンテン。逆にすげぇよ。';
//     process.stdout.write(result);

//     i++;
// }
// console.log(`${i}回目：[${pais.join()}]`);
// console.log(i);
// console.log(pais);
// pais = pais.map(p => paiList.find(e => e.name1 == p).path);
// joinImages(pais,'tenhou('+i+').png');



// let date1;
// let date2;
// const sleep = (time) => {
//  date1 = new Date();
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve()
//         }, time)
//     })
// }

// async function sample() {
//     await sleep(2000);
//     return 123;

// }

// sample()
//     .then(value => {
//      date2 = new Date();
//         // console.log(value)
//         console.log(date2-date1);
//     });
// 123
// getRandomPaiAndImage();


//テンパイ状態での待ちを出力
// let test = ['m1', 'm9', 'p1', 'p9', 's1', 's9', 'j1', 'j2', 'j3', 'j4', 'j5', 'j6', 'j7', 'j7'];
// [
//     's6', 's7', 's8',
//     's9', 'm6', 'm7',
//     'm8', 'm9', 'p5',
//     'p5', 'p5', 'j2',
//     'j2', 'j2'
// ]
// test = ripai(test);
// console.log(test);
// makePattern(test, [], [], [], [], [], [], []);
// console.log(patterns.filter(p => p.tartsu13.length != 0 && p.shuntsu.length == 2)[0].shuntsu);
// console.log(patterns.filter(p => p.tartsu13.length != 0 && p.shuntsu.length == 2)[0].kotsu);
// console.log(patterns.filter(p => p.tartsu13.length != 0 && p.shuntsu.length == 2)[0].toitsu);
// console.log(patterns.filter(p => p.tartsu13.length != 0 && p.shuntsu.length == 2)[0].tartsu13);
// console.log(getShantenMents(patterns.filter(p => p.tartsu13.length != 0 && p.shuntsu.length == 2)[0]));
// console.log(patterns);
// // console.log(patterns[0].tartsu12);
// let shantens = patterns.map(p => [getShantenMents(p), getShantenChitoi(p), getShantenKokushi(p)]);
// require('readline').cursorTo(process.stdout, 0, 1);
// let tempaiPatterns = patterns.filter(p => Math.min(getShantenMents(p), getShantenChitoi(p), getShantenKokushi(p)) <= 0);
// console.log(shantens);
// console.log(tempaiPatterns);
// let shanten = Math.min(...[Math.min(...shantens.map(p => p[0])), Math.min(...shantens.map(p => p[1])), Math.min(...shantens.map(p => p[2]))]);
// // console.log(shanten);
// console.log('待ち牌候補')
// console.log(tempaiPatterns.map(p => whatWait(p)));
// console.log('捨て牌候補');
// console.log(tempaiPatterns.map(p => whatDiscard(p)));
// console.log('最も良い捨て牌');
// console.log(getBestDiscard(tempaiPatterns)[0]);
// console.log('最も良い捨て牌の待ち牌');
// console.log(getBestDiscard(tempaiPatterns)[1]);

// let [tempai, wait] = getTempai();
// console.log(`テンパイ配牌[${tempai.join()}]`);
// console.log(`待ち牌[${wait.join()}]`);



// console.log(test.filter(e => e == test[0]).length);

// console.log([].concat([[1,2]]).concat(2).concat([2]));
// console.log('patterns');
// console.log(patterns);
// console.log(getShantenMents(patterns[0]));
// let shantens = patterns.map(p => [getShantenMents(p), getShantenChitoi(p), getShantenKokushi(p)]);
// console.log(patterns.filter(p=>getShantenChitoi(p)==0));
// console.log();

// for (let i = 0; i < 1; i++) console.log('出力');

// console.log(test.indexOf(test[0].slice(0, 1) + String(parseInt(test[0].slice(1, 2)) + 1))) //1
// console.log(test.indexOf(test[3].slice(0, 1) + String(parseInt(test[3].slice(1, 2)) + 1))) //-1
// console.log(-1 ? 'OK' : 'NG'); //OK
// console.log(0 ? 'OK' : 'NG'); //NG
// console.log(1 ? 'OK' : 'NG'); //OK
// console.log('j1'.slice(0, 1));
// console.log('j1'.slice(1, 2));
// console.log('012345'.length);



module.exports = { getTenhouEmbed, getDoubleRiichiEmbed, getMachiateEmbed, get1shantenEmbed, getMahjongFesEmbed };