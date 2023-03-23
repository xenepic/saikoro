class Util{
    
    /**
     * 0~maxまでの整数を一つ返す
     * @param {int} max 
     * @returns {int} 
     */
    static getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    /**
     * 現在日時を返す
     * @returns ['2023年01月01日00時00分00秒', '2023-1-1_0:0:0']
     */
    static getTime(){
        const date1 = new Date();
        const date2 = date1.getFullYear()                   + "年" +
            this.padding((date1.getMonth() + 1), '0', 2)    + "月" +
            this.padding(date1.getDate(), '0', 2)           + "日" +
            this.padding(date1.getHours(), '0', 2)          + "時" +
            this.padding(date1.getMinutes(), '0', 2)        + "分" +
            this.padding(date1.getSeconds(), '0', 2)        + "秒";
        const date3 = date1.getFullYear() + "-" +
            this.padding((date1.getMonth() + 1), '0', 2) + "-" +
            this.padding(date1.getDate(), '0', 2) + "_" +
            this.padding(date1.getHours(), '0', 2) + ":" +
            this.padding(date1.getMinutes(), '0', 2) + ":" +
            this.padding(date1.getSeconds(), '0', 2);

        return [date2, date3];
    }

    /**
     * 日付を付けてログを出力する
     * 2023年1月1日0時0分0秒...
     * @param {*} arguments 可変パラメータ
     */
    static log(){
        let args = [];
        if(arguments.length >= 1){
            Object.keys(arguments).forEach(key=>{
                args.push(arguments[key]);
            });
            args[0] = args[0].includes('\n') ? '\n'+args[0] : args[0];    
        }
        console.log(this.getTime()[0], ...args);
    }

    /**
     * エラーを出力する
     * @param {*} e エラーオブジェクト
     */
    static error(e){
        console.log(`${this.getTime()[0]} [error]\n`, e);
    }

    /**
     * パディング関数
     * @param {string} text パディングする文字列
     * @param {string} char 埋める文字
     * @param {int} len 長さ
     */
    static padding(text, char, len){
        let output = String(char).repeat(len) + String(text);
        output = output.slice(-parseInt(len));
        return output
    }

    /**
     * 配列の中からランダム1つ要素を返す
     * @param {Array} arr 
     * @returns 
     */
    static getRandomElement(arr){
        if(!arr) return;
        return arr[Util.getRandomInt(arr.length)];
    }


    static emoji = {
        raised_hand: '✋',
        arrows_counterclockwise: '🔄',
        arrow_right: '➡️'
    };
}

module.exports = { Util }