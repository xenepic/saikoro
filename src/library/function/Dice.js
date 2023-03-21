const { Message } = require('discord.js');
const { Util } = require('../Util');
const {commands, getBodyText} = require('../command');

class Dice{
    constructor(){
    }

    /**
     * ダイスロールの結果を返す
     * @param {string} msg 
     */
    async rollDice(msg){
        try{
            // 本文を抽出
            let message = msg.replace(/(c|C)(c|C)(b|B)/, '1d100');

            let diceRollTimes = message.match(/^(\d+)d(\d+)((<=|>=|<|>)\d+)?(.*)$/);
            let text = '';
            let isComparison = false;
            let isSuccess;
            let result = 0;
            let resultEach = new Array(diceRollTimes[1]);

            /*
            diceRollTimes[]
            [0]：入力文の全文
            [1]：1d100の1。振るダイスの個数。
            [2]：1d100の100。振るダイスの最大値。
            [3]：<=50。不等号＋判定基準の数値（不等号無しの場合はundefined）
            [4]：<=不等号（不等号無しの場合はundefined）
            [5]：1d100の後のテキスト。"【SAN値チェック】"など。
            */

            //比較フラグの設定          
            if (diceRollTimes[3] === undefined) {
                isComparison = false;
            } else {
                isComparison = true;
            }


            if (diceRollTimes[1] != undefined && diceRollTimes[2] != undefined) {

                //取得した際は文字列なので数値に変換。（でも暗黙的変換で無くても動くっぽい？）    
                diceRollTimes[1] = parseInt(diceRollTimes[1]);
                diceRollTimes[2] = parseInt(diceRollTimes[2]);

                //ダイスを振る。resultは合計値、resultEachには個々のダイスの値を入れる。
                for (let i = 0; i < diceRollTimes[1]; i++) {
                    resultEach[i] = Util.getRandomInt(diceRollTimes[2]) + 1;
                    result += resultEach[i];
                }

                //ダイス目の結果を出力に追加する。複数ダイスの場合は各ダイス目の値も追加する。
                text += message + ' ： ';
                if (diceRollTimes[1] === 1) {
                    text += '[' + result + ']';
                } else {
                    text += '[' + resultEach.join() + ']' + '=[' + result + ']';
                }

                //比較の場合は「成功」「失敗」などの文字列を追加する。
                if (isComparison) {
                    let border = diceRollTimes[3].replace(diceRollTimes[4], '');
                    if (diceRollTimes[4] === '<') {
                        if (result < border) isSuccess = true;
                        else isSuccess = false;
                    } else if (diceRollTimes[4] === '<=') {
                        if (result <= border) isSuccess = true;
                        else isSuccess = false;
                    } else if (diceRollTimes[4] === '>') {
                        if (result > border) isSuccess = true;
                        else isSuccess = false;
                    } else if (diceRollTimes[4] === '>=') {
                        if (result >= border) isSuccess = true;
                        else isSuccess = false;
                    }

                    if (isSuccess && result <= 5 && diceRollTimes[1] === 1 && diceRollTimes[2] === 100) {
                        text += ' ➔ クリティカル/成功';
                    } else if (isSuccess && result <= 10 && diceRollTimes[1] === 1 && diceRollTimes[2] === 100) {
                        text += ' ➔ スペシャル/成功';
                    } else if (!isSuccess && result >= 96 && diceRollTimes[1] === 1 && diceRollTimes[2] === 100) {
                        text += ' ➔ ファンブル/致命的失敗';
                    } else if (isSuccess) {
                        text += ' ➔ 成功';
                    } else if (!isSuccess) {
                        text += ' ➔ 失敗';
                    }

                }

                // 結果を返す
                let output = {text, isComparison, isSuccess};
                return output;
            }
        
        }catch(e){
            Util.error(e);
            return ;
        }
    }      


}

module.exports = { Dice };