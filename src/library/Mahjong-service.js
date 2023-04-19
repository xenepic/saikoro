class MahjongService{
    static paiList = [
        { 'kind':'m', 'order': 1, 'value': 1, 'name1': 'm1', 'name2': '一', 'yaochu':true},
        { 'kind':'m', 'order': 2, 'value': 2, 'name1': 'm2', 'name2': '二', 'yaochu':false},
        { 'kind':'m', 'order': 3, 'value': 3, 'name1': 'm3', 'name2': '三', 'yaochu':false},
        { 'kind':'m', 'order': 4, 'value': 4, 'name1': 'm4', 'name2': '四', 'yaochu':false},
        { 'kind':'m', 'order': 5, 'value': 5, 'name1': 'm5', 'name2': '五', 'yaochu':false},
        { 'kind':'m', 'order': 6, 'value': 5, 'name1': 'm5a', 'name2': '赤五', 'yaochu':false},
        { 'kind':'m', 'order': 7, 'value': 6, 'name1': 'm6', 'name2': '六', 'yaochu':false},
        { 'kind':'m', 'order': 8, 'value': 7, 'name1': 'm7', 'name2': '七', 'yaochu':false},
        { 'kind':'m', 'order': 9, 'value': 8, 'name1': 'm8', 'name2': '八', 'yaochu':false},
        { 'kind':'m', 'order': 10, 'value': 9, 'name1': 'm9', 'name2': '九', 'yaochu':true},
    
        { 'kind':'p', 'order': 1, 'value': 1, 'name1': 'p1', 'name2': '①', 'yaochu':true},
        { 'kind':'p', 'order': 2, 'value': 2, 'name1': 'p2', 'name2': '②', 'yaochu':false},
        { 'kind':'p', 'order': 3, 'value': 3, 'name1': 'p3', 'name2': '③', 'yaochu':false},
        { 'kind':'p', 'order': 4, 'value': 4, 'name1': 'p4', 'name2': '④', 'yaochu':false},
        { 'kind':'p', 'order': 5, 'value': 5, 'name1': 'p5', 'name2': '⑤', 'yaochu':false},
        { 'kind':'p', 'order': 6, 'value': 5, 'name1': 'p5a', 'name2': '赤⑤', 'yaochu':false},
        { 'kind':'p', 'order': 7, 'value': 6, 'name1': 'p6', 'name2': '⑥', 'yaochu':false},
        { 'kind':'p', 'order': 8, 'value': 7, 'name1': 'p7', 'name2': '⑦', 'yaochu':false},
        { 'kind':'p', 'order': 9, 'value': 8, 'name1': 'p8', 'name2': '⑧', 'yaochu':false},
        { 'kind':'p', 'order': 10, 'value': 9, 'name1': 'p9', 'name2': '⑨', 'yaochu':true},
    
        { 'kind':'s', 'order': 1, 'value': 1, 'name1': 's1', 'name2': '1', 'yaochu':true},
        { 'kind':'s', 'order': 2, 'value': 2, 'name1': 's2', 'name2': '2', 'yaochu':false},
        { 'kind':'s', 'order': 3, 'value': 3, 'name1': 's3', 'name2': '3', 'yaochu':false},
        { 'kind':'s', 'order': 4, 'value': 4, 'name1': 's4', 'name2': '4', 'yaochu':false},
        { 'kind':'s', 'order': 5, 'value': 5, 'name1': 's5', 'name2': '5', 'yaochu':false},
        { 'kind':'s', 'order': 6, 'value': 5, 'name1': 's5a', 'name2': '赤5', 'yaochu':false},
        { 'kind':'s', 'order': 7, 'value': 6, 'name1': 's6', 'name2': '6', 'yaochu':false},
        { 'kind':'s', 'order': 8, 'value': 7, 'name1': 's7', 'name2': '7', 'yaochu':false},
        { 'kind':'s', 'order': 9, 'value': 8, 'name1': 's8', 'name2': '8', 'yaochu':false},
        { 'kind':'s', 'order': 10, 'value': 9, 'name1': 's9', 'name2': '9', 'yaochu':true},
    
        { 'kind':'j', 'order': 1, 'value': undefined, 'name1': 'j1', 'name2': '東', 'yaochu':true},
        { 'kind':'j', 'order': 2, 'value': undefined, 'name1': 'j2', 'name2': '南', 'yaochu':true},
        { 'kind':'j', 'order': 3, 'value': undefined, 'name1': 'j3', 'name2': '西', 'yaochu':true},
        { 'kind':'j', 'order': 4, 'value': undefined, 'name1': 'j4', 'name2': '北', 'yaochu':true},
        { 'kind':'j', 'order': 5, 'value': undefined, 'name1': 'j5', 'name2': '白', 'yaochu':true},
        { 'kind':'j', 'order': 6, 'value': undefined, 'name1': 'j6', 'name2': '發', 'yaochu':true},
        { 'kind':'j', 'order': 7, 'value': undefined, 'name1': 'j7', 'name2': '中', 'yaochu':true},
    
        { 'kind':'o', 'order': 99, 'value': undefined, 'name1': '99', 'name2': '裏', 'yaochu':false},    
    ];

    

    /**
     * 牌配列をリー牌（並び替え）して返す。
     * @param {string[]} pais 牌姿配列 ex)['m1','m2','m3','m9', ... ]
     * @param {string[]} option 並び替えオプション。デフォルトは['m','p','s','j','o'](萬子→筒子→索子→字牌→その他)の順
     * @returns {string[]} リー牌後の牌姿配列
     */
    static ripai(pais, option=['m','p','s','j','o']) {
        return pais.sort((a, b) => {
            let pai_a = MahjongService.paiList.find(e => e.name1 === a);
            let pai_b = MahjongService.paiList.find(e => e.name1 === b);
            return (pai_a.order + option.indexOf(pai_a.kind)*10) - (pai_b.order + option.indexOf(pai_b.kind)*10);
        });
    }

    /**
     * MPS形式で書かれた牌姿文字列を、牌姿配列に変換する
     * @param {string} mpsStr MPS形式の牌姿文字列
     * @returns {string[]} 牌姿配列
     */
    static convertFromMPS(mpsStr){
        // MPS形式の正規表現（r5と5の順番は区別していない）
        const re = new RegExp(/^(([1-9]|r5)+m)?(([1-9]|r5)+p)?(([1-9]|r5)+s)?([東南西北白發中]*)$/);
        const regMatch = mpsStr.match(re)

        // 入力がMPSフォーマットに則していなければエラー
        if(!regMatch) throw new Error(`Invalid format. Please input MPS format string.\ninput:${mpsStr}`);

        let parseObj = {
            m: regMatch[1]?.slice(0,-1),
            p: regMatch[3]?.slice(0,-1),
            s: regMatch[5]?.slice(0,-1),
            j: regMatch[7],
        }

        // 変換後の牌姿配列
        let result = [];


        // 萬子筒子索子を本ライブラリ形式に変換して牌姿配列に追加
        ['m', 'p', 's'].forEach(key => {
            if(parseObj[key]){
                // rで分けて、その前後それぞれを追加。（rの後は赤5なのでshiftで先頭を削除して赤5追加）
                parseObj[key].split('r').forEach((str,index) => {
                    let arr = str.split('');
                    if(index===0){
                        arr.map(number=>key+number).forEach(pai=>result.push(pai));
                    }else{
                        arr.shift();
                        result.push(key+'5a');
                        arr.map(number=>key+number).forEach(pai=>result.push(pai));
                    }                    
                });
            }
        });
        // 字牌も変換して牌姿配列に追加
        parseObj['j'].split('').forEach(pai => {
            result.push(MahjongService.paiList.find(e=>e.name2 === pai).name1);
        });

        return result;
    }

    /**
     * 牌姿配列から、考え得るすべての面子・ターツの組み合わせの配列を生成する。
     * ゴミ牌が少ない（有効そうな組み合わせ）順にソートして返す。
     * 赤ドラは通常の牌として扱う。
     * @param {string[]} pais 牌姿配列 ['m1','m2','s5', ...]
     * @returns {{shuntsu:string[][],kotsu:string[][],toitsu:string[][],tartsu23:string[][],
     *          tartsu12:string[][],tartsu13:string[][],dusts:string[]}[]} 牌の組み合わせ配列
     */
    static makePattern(pais){
        let patterns = MahjongService._makePattern(pais.map(pai=>pai.slice(0,2)),[],[],[],[],[],[],[],[]);

        // 重複を削除してからソート
        patterns = Array.from(
                new Set(patterns.map(pattern=>JSON.stringify(pattern)))
                )
            .map(patternText => JSON.parse(patternText))
            .sort((a,b)=>a.dusts.length-b.dusts.length);

        return patterns;
    }

    /**
     * makePatternの補助関数。再帰的に呼び出すことで、全てのパターンを網羅する。
     * @param {string[]} pais 牌姿配列 ['m1','m2','s5', ...]
     * @param {string[][]} shuntsu 順子配列 [['m1','m2','m3'],['s5','s6','s7'], ...]
     * @param {string[][]} kotsu 刻子配列 [['m4','m4','m4'], ['j2','j2','j2'], ...]
     * @param {string[][]} toitsu 対子配列　[['m4','m4'], ['j2','j2'], ...]
     * @param {string[][]} tartsu23 両面ターツ配列 [['m2','m3'],['s5','s6'], ...]
     * @param {string[][]} tartsu12 辺張ターツ配列 [['m1','m2'],['s8','s9'], ...]
     * @param {string[][]} tartsu13 嵌張ターツ配列 [['m1','m3'],['s5','s7'], ...]
     * @param {string[]} dusts ゴミ牌配列 ['m1','m4','s7','j2', ...]
     * @param {{shuntsu:string[][],kotsu:string[][],toitsu:string[][],tartsu23:string[][],
     *          tartsu12:string[][],tartsu13:string[][],dusts:string[]}[]} patterns 牌の組み合わせ配列
     * @returns {{shuntsu:string[][],kotsu:string[][],toitsu:string[][],tartsu23:string[][],
     *          tartsu12:string[][],tartsu13:string[][],dusts:string[]}[]} 牌の組み合わせ配列
     */
    static _makePattern(pais, shuntsu, kotsu, toitsu, tartsu23, tartsu12, tartsu13, dusts, patterns) {

        //牌姿配列が無くなったら、そのパターンの解析を終了する
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
            return patterns;
        }

        // 同じ牌が2枚以上ある場合
        if (pais.filter(e => e === pais[0]).length >= 2) {
            // 対子としてカウント
            patterns.concat(MahjongService._makePattern(pais.slice(2), shuntsu, kotsu, toitsu.concat([
                [pais[0], pais[1]]
            ]), tartsu23, tartsu12, tartsu13, dusts, patterns));
        }
        // 同じ牌が3枚以上ある場合
        if (pais.filter(e => e === pais[0]).length >= 3) { 
            // 刻子としてカウント
            patterns.concat(MahjongService._makePattern(pais.slice(3), shuntsu, kotsu.concat([
                [pais[0], pais[1], pais[2]]
            ]), toitsu, tartsu23, tartsu12, tartsu13, dusts, patterns));
        }

        // 1枚しかない字牌と、数牌の9はゴミ（9が8とくっつく場合は8の時に一緒に呼び出されてるはずなので）
        if (pais[0].slice(0, 1) == 'j' || pais[0].slice(1, 2) == '9') { 
            patterns.concat(MahjongService._makePattern(pais.slice(1), shuntsu, kotsu, toitsu, tartsu23, tartsu12, tartsu13, dusts.concat(pais[0]), patterns));
            return patterns;
        }

        // ＋１した牌と＋２した牌があるか調べる。
        let nextPaiIndex = pais.indexOf(pais[0].slice(0, 1) + String(parseInt(pais[0].slice(1, 2)) + 1));
        let nextnextPaiIndex = pais.indexOf(pais[0].slice(0, 1) + String(parseInt(pais[0].slice(1, 2)) + 2));

        //＋１・＋２どちらもある場合は順子（123，678などの形）としてカウント
        if (nextPaiIndex >= 0 && nextnextPaiIndex >= 0) {
            let _pais = pais.filter((pai,index)=>![0,nextPaiIndex,nextnextPaiIndex].includes(index));

            patterns.concat(MahjongService._makePattern(_pais, shuntsu.concat([[pais[0], pais[nextPaiIndex], pais[nextnextPaiIndex]]]), 
                kotsu, toitsu, tartsu23, tartsu12, tartsu13, dusts, patterns));
        }

        //ターツ（12、78などの形）として取れる場合
        if (nextPaiIndex >= 0) {
            let _pais = pais.filter((pai,index)=>![0,nextPaiIndex].includes(index));

            if (pais[0].slice(1, 2) == '1' || pais[0].slice(1, 2) == '8') {
                //辺張ターツ（12、89など）としてカウント
                patterns.concat(MahjongService._makePattern(_pais, shuntsu, kotsu, toitsu, tartsu23, 
                    tartsu12.concat([[pais[0], pais[nextPaiIndex]]]), tartsu13, dusts, patterns));
            } else {
                // 両面ターツ（23、78など）としてカウント
                patterns.concat(MahjongService._makePattern(_pais, shuntsu, kotsu, toitsu, 
                    tartsu23.concat([[pais[0], pais[nextPaiIndex]]]), tartsu12, tartsu13, dusts, patterns));
            }
        }
        if (nextnextPaiIndex >= 0) {
            let _pais = pais.filter((pai,index)=>![0,nextnextPaiIndex].includes(index));
            // 嵌張ターツ（13、68など）としてカウント
            patterns.concat(MahjongService._makePattern(_pais, shuntsu, kotsu, toitsu, tartsu23, tartsu12, 
                tartsu13.concat([[pais[0], pais[nextnextPaiIndex]]]), dusts, patterns));

        }
        //その牌をゴミとしてカウント
        patterns.concat(MahjongService._makePattern(pais.slice(1), shuntsu, kotsu, toitsu, tartsu23, tartsu12, tartsu13, dusts.concat(pais[0]), patterns));

        return patterns;
    }
}

// let test = MahjongService.makePattern(['m1', 'm1', 'm2', 'm2', 'm3', 'm4', 'm5', 'm8', 'm9', 's1', 's1', 's1', 's2', 's3']);
// for(let i=0;i<10;i++){
//     console.log(test[i]);
// }


