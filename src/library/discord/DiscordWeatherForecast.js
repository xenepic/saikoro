const { Message, AttachmentBuilder, EmbedBuilder, Embed } = require('discord.js');
const { DiscordUtil } = require('../DiscordUtil');
const { Util } = require('../Util');
const { WeatherForecast } = require('../WeatherForecast');


class DiscordWeatherForecast {

    /**
     * 天気予報を表示する
     * @param {Message} msg 
     * @param {string} location 
     * @returns 
     */
    static async showWeatherForecast(msg, location){
        try{
            const left = Util.emoji['arrow_left'];
            const right = Util.emoji['arrow_right'];

            // 今日と一週間後の日付を取得
            let today = Util.getTime().slice(1,4).join('-');
            let weeklater = new Date();
            weeklater.setDate(weeklater.getDate() + 7);
            weeklater = Util.getTime(weeklater).slice(1,4).join('-');

            // 一週間分の日付文字列を生成
            let dates = [];
            let day = new Date();
            for(let i=0;i<7;i++){                
                let date = Util.getTime(day);
                dates.push(`${parseInt(date[2])}/${parseInt(date[3])}(${["日","月","火","水","木","金","土" ][date[7]]})`);
                day.setDate(day.getDate() + 1);
            }

            // 表示するembed配列
            let embeds = [];

            let index = 0;

            // 場所が指名されている場合
            if(location){                
                
                // 一週間分の天気情報を取得
                const weatherInfo = await WeatherForecast.getWeatherForecastInfo(location, today, weeklater);

                // 天気情報を取得出来ていなかった場合は終了
                if(!weatherInfo){
                    DiscordUtil.replyErrorMessage(msg, "場所探せへんかったみたいやわ");
                    return;
                }

                // 一週間分の日付文字列に週間予報の文字列を追加してweatherInfoに付加
                weatherInfo.dates = ['週間予報'].concat(dates);
                console.log(weatherInfo.dates);
                

                // 週間天気と一週間分の1日天気のembedを取得
                embeds.push(await DiscordWeatherForecast.getWeekWeatherEmbed(weatherInfo));
                for(let i=0;i<7;i++){
                    embeds.push(await DiscordWeatherForecast.getOneDayWeatherEmbed(weatherInfo, i));
                }

            // 場所が指定されていない場合
            }else{
                // 全国9箇所の天気を取得
                let cities = ['札幌', '仙台', '新潟', '東京', '金沢', '名古屋', '大阪', '広島', '高知', '福岡', '那覇']; // 取得する主要地点名
                let nationalWeatherInfoPromise = []; // 全国の天気情報
                for(let i=0;i<cities.length;i++){
                    // 一週間分の天気情報を取得
                    const weatherInfo = WeatherForecast.getWeatherForecastInfo(cities[i], today, weeklater);

                    // 天気情報を取得出来ていなかった場合は終了
                    if(!weatherInfo){
                        DiscordUtil.replyErrorMessage(msg, "場所探せへんかったみたいやわ");
                        return;
                    }

                    nationalWeatherInfoPromise.push(weatherInfo);
                }

                // すべての天気情報が取得出来るのを待つ
                let nationalWeatherInfo = await Promise.all(nationalWeatherInfoPromise);

                for(let i=0;i<7;i++){
                    embeds.push(await DiscordWeatherForecast.getNationalOneDayWeatherEmbed(dates, cities, nationalWeatherInfo, i));
                }
            }

            // リプライしてリアクションを待機
            let rep = await DiscordUtil.replyEmbed(msg, embeds[index]);

            await rep.react(left);
            await rep.react(right);

            const filter = (reaction, user) => {
                return [left,right].includes(reaction.emoji.name) && !user.bot;
            };
            const collector = rep.createReactionCollector({ filter, time: 15 * 60 * 1000 });

            collector.on('collect', async (reaction, user) => {
                let emoji = reaction.emoji.name;
                switch(emoji){
                    case left:
                        index = Util.mod(index-1, embeds.length);
                        DiscordUtil.editEmbed(rep, embeds[index]);                            
                        break;
                    case right:
                        index = Util.mod(index+1, embeds.length);
                        DiscordUtil.editEmbed(rep, embeds[index]);                            
                        break;
                }

                // リアクションを削除
                reaction.users.remove(user.id);                
            });
            
            collector.on('end', collected => {
                rep.reactions.removeAll();
            });
        }catch(e){
            Util.error(e);
        }
        
    }

    /**
     * 1日の6時～21時までの天気を表示するエンベッドを生成する
     * @param {Object} weatherInfo 天気情報
     * @param {int} index weatherInfo.datesの何番目の日付か
     * @returns {Embed}
     */
    static async getOneDayWeatherEmbed(weatherInfo, index){
        try{
            const left = Util.emoji['arrow_left'];
            const right = Util.emoji['arrow_right'];
            const empty = Util.emoji['space'];
            const red = DiscordUtil.makeStyleKeyword({color:'red'});
            const blue = DiscordUtil.makeStyleKeyword({color:'blue'});

            let embed = new EmbedBuilder()
            .setTitle(weatherInfo.locationName)
            .setDescription(`${weatherInfo.dates[(index+1)%8]}の天気`)
            .setURL('https://open-meteo.com/');

            for(let i=0;i<6;i++){
                const hour = 6+i*3;
                const weatherEmoji = WeatherForecast.getWeatherEmoji(weatherInfo.hourly.weathercode[index*24+hour]);
                const temperature = weatherInfo.hourly.temperature_2m[index*24+hour] + weatherInfo.hourly_units.temperature_2m;
                const probability = weatherInfo.hourly.precipitation_probability[index*24+hour] + weatherInfo.hourly_units.precipitation_probability;
                embed.addFields({ name: `${hour}時　`+weatherEmoji+'　　'+empty, value: "```ansi\n" + `\n${red}${temperature}\n${blue}${probability}` + "\n```", inline: true });
            }
            embed.setFooter({text: `${left}${weatherInfo.dates[Util.mod(index,8)]}　　　　　　　　　　　　${weatherInfo.dates[Util.mod(index+2,8)]}${right}`});

            return embed;

        }catch(e){
            Util.error(e);
            return;
        }
    }

    /**
     * 一週間の天気を表示するEmbedを生成する
     * @param {Object} weatherInfo 天気情報
     * @returns {Embed}
     */
    static async getWeekWeatherEmbed(weatherInfo){
        try{
            const left = Util.emoji['arrow_left'];
            const right = Util.emoji['arrow_right'];
            const empty = Util.emoji['space'];
            const red = DiscordUtil.makeStyleKeyword({color:'red'});
            const blue = DiscordUtil.makeStyleKeyword({color:'blue'});
            const water = DiscordUtil.makeStyleKeyword({color:'water'});
            const normal = DiscordUtil.makeStyleKeyword({normal:true});

            let embed = new EmbedBuilder()
            .setTitle(weatherInfo.locationName)
            .setDescription(`一週間の天気`)
            .setURL('https://open-meteo.com/');

            for(let i=0;i<6;i++){
                const weatherEmoji = WeatherForecast.getWeatherEmoji(weatherInfo.daily.weathercode[i]);
                const temperature_max = weatherInfo.daily.temperature_2m_max[i] + weatherInfo.daily_units.temperature_2m_max;
                const temperature_min = weatherInfo.daily.temperature_2m_min[i] + weatherInfo.daily_units.temperature_2m_min;
                const probability = weatherInfo.daily.precipitation_probability_max[i] + weatherInfo.daily_units.precipitation_probability_max;
                embed.addFields({ name: `${weatherInfo.dates[i+1]}　`+weatherEmoji+'　　'+empty, value: "```ansi\n" + `\n${red}${temperature_max}${normal}/${blue}${temperature_min}\n${water}${probability}` + "\n```", inline: true });
            }
            embed.setFooter({text: `${left}${weatherInfo.dates[7]}　　　　　　　　　　　　　　　　　　　　${weatherInfo.dates[1]}${right}`});

            return embed;

        }catch(e){
            Util.error(e);
            return;
        }
    }

    /**
     * その日の全国の天気を表示するEmbedを生成する
     * @param {Array<string>} dates 一週間の日付文字列
     * @param {Array<string>} cities 都市名配列
     * @param {Array<Object>} nationalWeatherInfo 全国の天気情報配列
     * @param {int} index datesの何番目の日付か
     * @returns {Embed}
     */
    static async getNationalOneDayWeatherEmbed(dates, cities, nationalWeatherInfo, index){
        try{
            const left = Util.emoji['arrow_left'];
            const right = Util.emoji['arrow_right'];
            const empty = Util.emoji['space'];
            const red = DiscordUtil.makeStyleKeyword({color:'red'});
            const blue = DiscordUtil.makeStyleKeyword({color:'blue'});
            const water = DiscordUtil.makeStyleKeyword({color:'water'});
            const normal = DiscordUtil.makeStyleKeyword({normal:true});

            let embed = new EmbedBuilder()
            .setTitle(`${dates[index]} 全国の天気`)
            .setURL('https://open-meteo.com/');

            for(let i=0;i<cities.length;i++){
                const weatherEmoji = WeatherForecast.getWeatherEmoji(nationalWeatherInfo[i].daily.weathercode[index]);
                const temperature_max = nationalWeatherInfo[i].daily.temperature_2m_max[index] + nationalWeatherInfo[index].daily_units.temperature_2m_max;
                const temperature_min = nationalWeatherInfo[i].daily.temperature_2m_min[index] + nationalWeatherInfo[index].daily_units.temperature_2m_min;
                const probability = nationalWeatherInfo[i].daily.precipitation_probability_max[index] + nationalWeatherInfo[i].daily_units.precipitation_probability_max;
                embed.addFields({ name: `${cities[i]}　`+weatherEmoji+'　　'+empty, value: "```ansi\n" + `\n${red}${temperature_max}${normal}/${blue}${temperature_min}\n${water}${probability}` + "\n```", inline: true });
            }
            embed.setFooter({text: `${left}${dates[Util.mod(index-1,dates.length)]}　　　　　　　　　　　　　　　　　　　　${dates[Util.mod(index+1,dates.length)]}${right}`});

            return embed;

        }catch(e){
            Util.error(e);
            return;
        }
    }

}

module.exports = { DiscordWeatherForecast };