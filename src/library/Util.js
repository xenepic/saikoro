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
     * @returns ['2023年01月01日00時00分00秒', ...]
     */
    static getTime(standard){
        let date1;
        if(standard) date1 = new Date(standard);
        else date1 = new Date();
        const year = date1.getFullYear();
        const month = this.padding((date1.getMonth() + 1), '0', 2);
        const date = this.padding(date1.getDate(), '0', 2);
        const hours = this.padding(date1.getHours(), '0', 2);
        const minutes = this.padding(date1.getMinutes(), '0', 2);
        const seconds = this.padding(date1.getSeconds(), '0', 2);
        const dayOfWeek = date1.getDay();
        const date2 = `${year}年${month}月${date}日${hours}時${minutes}分${seconds}秒`;

        return [date2, year, month, date, hours, minutes, seconds, dayOfWeek];
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

    /**
     * i mod j（剰余）を計算する
     * @param {*} i 
     * @param {*} j 
     * @returns {int}
     */
    static mod(i, j) {
        return (i % j) < 0 ? (i % j) + 0 + (j < 0 ? -j : j) : (i % j + 0);
    }


    static emoji = {
        space: '\u200B',
        raised_hand: '✋',
        arrows_counterclockwise: '🔄',
        arrow_right: '▶️',
        arrow_left: '◀️',
        sunny: '☀️',
        white_sun_small_cloud: '🌤️',
        partly_sunny: '⛅',
        white_sun_cloud: '🌥️',
        white_sun_rain_cloud: '🌦️',
        cloud: '☁️',
        cloud_rain: '🌧️',
        white_sun_rain_cloud: '🌦️',
        umbrella2: '☂️',
        closed_umbrella: '🌂',
        umbrella: '☔',
        cloud_snow: '🌨️',
        snowman2: '☃️',
        cyclone: '🌀',
        cloud_tornado: '🌪️',
        fog: '🌫️',
        zap: '⚡',
        cloud_lightning: '🌩️',
        thunder_cloud_rain: '⛈️',
    };
}

module.exports = { Util }