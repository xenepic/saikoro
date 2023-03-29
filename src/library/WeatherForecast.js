const { Util } = require('./Util');
const { GeoCoding } = require('./GeoCoding');
const axios = require("axios").default;

class WeatherForecast {

    /**
     * その土地の天気予報情報を取得する
     * @param {string} location 場所名・建物名など
     * @param {string|Date} startDate デフォルトは今日
     * @param {string|Date} endDate デフォルトは一週間後
     * @returns {Object}
     */
    static async getWeatherForecastInfo(location, startDate, endDate){
        try{
            if(!location) return;
            // 場所名から緯度経度情報を取得
            let geocode = await GeoCoding.getGeoCode(location);
            if(!geocode) return;
            let [longitude, latitude] = geocode.geometry.coordinates;
            let locationName = geocode.properties.title;

            // 開始/終了日の書式をAPI用に整形。指定されていない場合は、取得範囲は現在時から一週間に設定
            if(startDate){
                startDate = Util.getTime(startDate).slice(1,4).join('-');
            }else{
                startDate = Util.getTime().slice(1,4).join('-');
            }

            if(endDate){
                endDate = Util.getTime(endDate).slice(1,4).join('-');
            }else{
                let weeklater = new Date();
                weeklater.setDate(weeklater.getDate() + 7);
                endDate = Util.getTime(weeklater).slice(1,4).join('-');
            }

            // Open-MeteoのAPIを利用して天気を取得する
            let url = "https://api.open-meteo.com/v1/forecast";

            let response = await axios.get(url, {
                params: {
                    latitude,
                    longitude,
                    hourly: "temperature_2m,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weathercode",
                    daily: "weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,snowfall_sum,precipitation_probability_max",
                    timezone: "Asia/Tokyo",
                    start_date: startDate,
                    end_date: endDate
                }
            });

            if(response.status !== 200){
                Util.error(response);
                return;
            }

            // 天気を取得した場所名を追加
            response.data.locationName = locationName;

            return response.data;

        }catch(e){
            Util.error(e);
            return;
        }
    }

    /**
     * WMO Codeに基づいて気象コードを絵文字に変換する
     * 参考URL：https://www.jodc.go.jp/data_format/weather-code_j.html
     * @param {number} weatherCode 
     * @returns {string} 絵文字
     */
    static getWeatherEmoji(weatherCode){
        weatherCode = parseInt(weatherCode);
        if(weatherCode<0 || 99<weatherCode) return '';
        if(weatherCode === 0) return Util.emoji['sunny'];
        else if(weatherCode === 1)return Util.emoji['white_sun_small_cloud'];
        else if(weatherCode === 2)return Util.emoji['partly_sunny'];
        else if(weatherCode === 3)return Util.emoji['cloud'];
        else if(weatherCode <=  12)return Util.emoji['fog'];
        else if(weatherCode === 13)return Util.emoji['cloud_lightning'];
        else if(weatherCode <=  24)return Util.emoji['closed_umbrella'];
        else if(weatherCode === 25)return Util.emoji['white_sun_rain_cloud'];
        else if(weatherCode <=  27)return Util.emoji['cloud_snow'];
        else if(weatherCode === 28)return Util.emoji['fog'];
        else if(weatherCode === 29)return Util.emoji['thunder_cloud_rain'];
        else if(weatherCode <=  35)return Util.emoji['fog'];
        else if(weatherCode <=  40)return Util.emoji['snowman2'];
        else if(weatherCode <=  49)return Util.emoji['fog'];
        else if(weatherCode <=  59)return Util.emoji['umbrella2'];
        else if(weatherCode <=  69)return Util.emoji['umbrella'];
        else if(weatherCode <=  79)return Util.emoji['snowman2'];
        else if(weatherCode === 80)return Util.emoji['white_sun_rain_cloud'];
        else if(weatherCode <=  84)return Util.emoji['umbrella'];
        else if(weatherCode <=  90)return Util.emoji['snowman2'];
        else if(weatherCode === 91)return Util.emoji['closed_umbrella'];
        else if(weatherCode === 92)return Util.emoji['umbrella'];
        else if(weatherCode <=  94)return Util.emoji['snowman2'];
        else if(weatherCode <=  99)return Util.emoji['thunder_cloud_rain'];
    }

}

module.exports = { WeatherForecast };