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
     * @returns ['2023年1月1日0時0分0秒', '2023-1-1_0:0:0']
     */
    static getTime(){
        const date1 = new Date();
        const date2 = date1.getFullYear() + "年" +
            (date1.getMonth() + 1) + "月" +
            date1.getDate() + "日" +
            date1.getHours() + "時" +
            date1.getMinutes() + "分" +
            date1.getSeconds() + "秒";
        const date3 = date1.getFullYear() + "-" +
            (date1.getMonth() + 1) + "-" +
            date1.getDate() + "_" +
            date1.getHours() + ":" +
            date1.getMinutes() + ":" +
            date1.getSeconds();

        return [date2, date3];
    }

    /**
     * ログを出力する
     * 2023年1月1日0時0分0秒 [DICE] 1d100 <= 20 
     * @param {string} text 
     */
    static log(classification, text){
        console.log(`${this.getTime()[0]} [${classification}] ${text.includes('\n') ? '\n'+text : text}`);
    }
}

module.exports = { Util }