const { Message, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { DiscordUtil } = require('../DiscordUtil');
const { Util } = require('../Util');
const { commands, getCommand, getBodyText } = require('../command');
const { WeatherForecast } = require('../WeatherForecast');


class DiscordWeatherForecast {

    static async showWeatherForecast(msg, location){
        try{
            const left = Util.emoji['arrow_left'];
            const right = Util.emoji['arrow_right'];
            // 場所が指名されている場合
            if(location){
                // 今日と一週間後の日付を取得
                let today = Util.getTime().slice(1,4).join('-');
                let weeklater = new Date();
                weeklater.setDate(weeklater.getDate() + 7);
                weeklater = Util.getTime(weeklater).slice(1,4).join('-')
                
                // 一週間分の天気情報を取得
                const weatherInfo = await WeatherForecast.getWeatherForecastInfo(location, today, weeklater);

                // 天気情報を取得出来ていなかった場合は終了
                if(!weatherInfo){
                    DiscordUtil.replyErrorMessage(msg, "場所探せへんかったみたいやわ");
                    return;
                }

                // 週間天気と一週間分の日付文字列を生成してweatherInfoに付加
                let dates = [];
                dates.push('週間予報');
                for(let i=0;i<7;i++){
                    let date = weatherInfo.hourly.time[i*24].split('T')[0];
                    date = Util.getTime(date);
                    dates.push(`${parseInt(date[2])}/${parseInt(date[3])}(${["日","月","火","水","木","金","土" ][date[7]]})`);
                }
                weatherInfo.dates = dates;
                

                // 週間天気と一週間分の1日天気のembedを取得
                let embeds = [];
                embeds.push(await DiscordWeatherForecast.getWeekWeatherEmbed(weatherInfo));
                for(let i=0;i<7;i++){
                    embeds.push(await DiscordWeatherForecast.getOneDayWeatherEmbed(weatherInfo, i));
                }
                
                let index = 0;
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
                            index = Util.mod(index-1, 8);
                            DiscordUtil.editEmbed(rep, embeds[index]);                            
                            break;
                        case right:
                            index = Util.mod(index+1, 8);
                            DiscordUtil.editEmbed(rep, embeds[index]);                            
                            break;
                    }

                    // リアクションを削除
                    reaction.users.remove(user.id);                
                });
                
                collector.on('end', collected => {
                    rep.reactions.removeAll();
                });

            // 場所が指定されていない場合
            }else{

            }
        }catch(e){
            Util.error(e);
        }
        
    }

    static async getOneDayWeatherEmbed(weatherInfo, index){
        try{
            const left = Util.emoji['arrow_left'];
            const right = Util.emoji['arrow_right'];
            const empty = Util.emoji['space'];
            const red = DiscordUtil.makeStyleKeyword({color:'red'});
            const blue = DiscordUtil.makeStyleKeyword({color:'blue'});

            let embed = new EmbedBuilder()
            .setTitle(weatherInfo.locationName)
            .setDescription(`${weatherInfo.dates[(index+1)%8]}の天気`);

            for(let i=0;i<6;i++){
                const hour = 6+i*3;
                const weatherEmoji = WeatherForecast.getWeatherEmoji(weatherInfo.hourly.weathercode[index*24+hour]);
                const temperature = weatherInfo.hourly.temperature_2m[index*24+hour] + weatherInfo.hourly_units.temperature_2m;
                const probability = weatherInfo.hourly.precipitation_probability[index*24+hour] + weatherInfo.hourly_units.precipitation_probability;
                embed.addFields({ name: `${hour}時　`+weatherEmoji+'　　'+empty, value: "```ansi\n" + `\n${red}${temperature}\n${blue}${probability}` + "\n```", inline: true });
            }
            embed.setFooter({text: `${left}${weatherInfo.dates[(index)%8]}　　　　　　　　　　　　${weatherInfo.dates[(index+2)%8]}${right}`});

            return embed;

        }catch(e){
            Util.error(e);
            return;
        }
    }

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
            .setDescription(`一週間の天気`);

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

    static async getNationalOneDayWeatherEmbed(date){

    }

}

module.exports = { DiscordWeatherForecast };