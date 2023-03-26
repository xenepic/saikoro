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
                
                // 今日から一週間分の天気情報を取得
                const weatherInfo = await WeatherForecast.getWeatherForecastInfo(location, today, weeklater);

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
                
                let index = 1;
                console.log("debug: ", embeds[index]);
                console.log("debug: ", embeds);
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
                            DiscordUtil.editEmbed(rep, embeds[(index-1)%8]);
                            index = (index-1)%8;
                            break;
                        case right:
                            DiscordUtil.editEmbed(rep, embeds[(index+1)%8]);
                            index = (index+1)%8;
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
            console.log('debug index:', index);
            const left = Util.emoji['arrow_left'];
            const right = Util.emoji['arrow_right'];
            const empty = Util.emoji['space'];
            const red = DiscordUtil.makeStyleKeyword({color:'red'});
            const blue = DiscordUtil.makeStyleKeyword({color:'blue'});

            // 日付文字列を取得
            let date = weatherInfo.hourly.time[index*24].split('T')[0].split('-');
            date = `${date[0]}年${date[1]}月${date[2]}日`;

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
        return await DiscordWeatherForecast.getOneDayWeatherEmbed(weatherInfo, 0);
    }

    static async getNationalOneDayWeatherEmbed(date){

    }

}

module.exports = { DiscordWeatherForecast };