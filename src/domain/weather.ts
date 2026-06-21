import { iconsABC, icons123 } from '../utils/icons';

interface PrefRegion {
  pref: string;
  no: number;
  capital: number;
  region: string[];
}

const prefRegions: PrefRegion[] = [
    { 'pref': '北海道', 'no': 0, 'capital': 10, 'region': ['上川地方', '北見地方', '十勝地方', '宗谷地方', '後志地方', '日高地方', '根室地方', '檜山地方', '渡島地方', '留萌地方', '石狩地方', '空知地方', '紋別地方', '網走地方', '胆振地方', '釧路地方'] },
    { 'pref': '青森', 'no': 1, 'capital': 2, 'region': ['三八上北', '下北', '津軽'] },
    { 'pref': '岩手', 'no': 2, 'capital': 0, 'region': ['内陸', '沿岸北部', '沿岸南部'] },
    { 'pref': '宮城', 'no': 3, 'capital': 0, 'region': ['東部', '西部'] },
    { 'pref': '秋田', 'no': 4, 'capital': 1, 'region': ['内陸', '沿岸'] },
    { 'pref': '山形', 'no': 5, 'capital': 2, 'region': ['庄内', '最上', '村山', '置賜'] },
    { 'pref': '福島', 'no': 6, 'capital': 0, 'region': ['中通り', '会津', '浜通り'] },
    { 'pref': '茨城', 'no': 7, 'capital': 0, 'region': ['北部', '南部'] },
    { 'pref': '栃木', 'no': 8, 'capital': 1, 'region': ['北部', '南部'] },
    { 'pref': '群馬', 'no': 9, 'capital': 1, 'region': ['北部', '南部'] },
    { 'pref': '埼玉', 'no': 10, 'capital': 1, 'region': ['北部', '南部', '秩父地方'] },
    { 'pref': '千葉', 'no': 11, 'capital': 1, 'region': ['北東部', '北西部', '南部'] },
    { 'pref': '東京', 'no': 12, 'capital': 3, 'region': ['伊豆諸島北部', '伊豆諸島南部', '小笠原諸島', '東京地方'] },
    { 'pref': '神奈川', 'no': 13, 'capital': 0, 'region': ['東部', '西部'] },
    { 'pref': '新潟', 'no': 14, 'capital': 1, 'region': ['上越', '下越', '中越', '佐渡'] },
    { 'pref': '富山', 'no': 15, 'capital': 0, 'region': ['東部', '西部'] },
    { 'pref': '石川', 'no': 16, 'capital': 0, 'region': ['加賀', '能登'] },
    { 'pref': '福井', 'no': 17, 'capital': 0, 'region': ['嶺北', '嶺南'] },
    { 'pref': '山梨', 'no': 18, 'capital': 0, 'region': ['中・西部', '東部・富士五湖'] },
    { 'pref': '長野', 'no': 19, 'capital': 1, 'region': ['中部', '北部', '南部'] },
    { 'pref': '岐阜', 'no': 20, 'capital': 0, 'region': ['美濃地方', '飛騨地方'] },
    { 'pref': '静岡', 'no': 21, 'capital': 1, 'region': ['中部', '伊豆', '東部', '西部'] },
    { 'pref': '愛知', 'no': 22, 'capital': 1, 'region': ['東部', '西部'] },
    { 'pref': '三重', 'no': 23, 'capital': 0, 'region': ['北中部', '南部'] },
    { 'pref': '滋賀', 'no': 24, 'capital': 1, 'region': ['北部', '南部'] },
    { 'pref': '京都', 'no': 25, 'capital': 1, 'region': ['北部', '南部'] },
    { 'pref': '大阪', 'no': 26, 'capital': 0, 'region': ['大阪府'] },
    { 'pref': '兵庫', 'no': 27, 'capital': 1, 'region': ['北部', '南部'] },
    { 'pref': '奈良', 'no': 28, 'capital': 0, 'region': ['北部', '南部'] },
    { 'pref': '和歌山', 'no': 29, 'capital': 0, 'region': ['北部', '南部'] },
    { 'pref': '鳥取', 'no': 30, 'capital': 1, 'region': ['中・西部', '東部'] },
    { 'pref': '島根', 'no': 31, 'capital': 0, 'region': ['東部', '西部', '隠岐'] },
    { 'pref': '岡山', 'no': 32, 'capital': 1, 'region': ['北部', '南部'] },
    { 'pref': '広島', 'no': 33, 'capital': 1, 'region': ['北部', '南部'] },
    { 'pref': '山口', 'no': 34, 'capital': 0, 'region': ['中部', '北部', '東部', '西部'] },
    { 'pref': '徳島', 'no': 35, 'capital': 0, 'region': ['北部', '南部'] },
    { 'pref': '香川', 'no': 36, 'capital': 0, 'region': ['香川県'] },
    { 'pref': '愛媛', 'no': 37, 'capital': 0, 'region': ['中予', '南予', '東予'] },
    { 'pref': '高知', 'no': 38, 'capital': 0, 'region': ['中部', '東部', '西部'] },
    { 'pref': '福岡', 'no': 39, 'capital': 1, 'region': ['北九州地方', '福岡地方', '筑後地方', '筑豊地方'] },
    { 'pref': '佐賀', 'no': 40, 'capital': 1, 'region': ['北部', '南部'] },
    { 'pref': '長崎', 'no': 41, 'capital': 2, 'region': ['五島', '北部', '南部', '壱岐・対馬'] },
    { 'pref': '熊本', 'no': 42, 'capital': 1, 'region': ['天草・芦北地方', '熊本地方', '球磨地方', '阿蘇地方'] },
    { 'pref': '大分', 'no': 43, 'capital': 0, 'region': ['中部', '北部', '南部', '西部'] },
    { 'pref': '宮崎', 'no': 44, 'capital': 3, 'region': ['北部山沿い', '北部平野部', '南部山沿い', '南部平野部'] },
    { 'pref': '鹿児島', 'no': 45, 'capital': 3, 'region': ['大隅地方', '奄美地方', '種子島・屋久島地方', '薩摩地方'] },
    { 'pref': '沖縄', 'no': 46, 'capital': 4, 'region': ['与那国島地方', '久米島', '大東島地方', '宮古島地方', '本島中南部', '本島北部', '石垣島地方'] }
]

const weatherIcons: { weather: string; icon: string }[] = [
    { 'weather': '晴', 'icon': ':sunny:' },
    { 'weather': '曇', 'icon': ':cloud:' },
    { 'weather': '雨', 'icon': ':umbrella:' },
    { 'weather': '雪', 'icon': ':snowman2:' },
    { 'weather': '晴のち曇', 'icon': ':white_sun_small_cloud:' },
    { 'weather': '晴のち雨', 'icon': ':white_sun_rain_cloud:' },
    { 'weather': '晴のち雪', 'icon': '' },
    { 'weather': '曇のち晴', 'icon': ':sunny::arrow_right::snowman2:' },
    { 'weather': '曇のち雨', 'icon': ':cloud_rain:' },
    { 'weather': '曇のち雪', 'icon': ':cloud_snow:' },
    { 'weather': '雨のち晴', 'icon': ':umbrella::arrow_right::sunny:' },
    { 'weather': '雨のち曇', 'icon': ':umbrella::arrow_right::cloud:' },
    { 'weather': '雨のち雪', 'icon': ':umbrella::arrow_right::snowman2:' },
    { 'weather': '雪のち晴', 'icon': ':snowman2::arrow_right::sunny:' },
    { 'weather': '雪のち曇', 'icon': ':snowman2::arrow_right::cloud:' },
    { 'weather': '雪のち雨', 'icon': ':snowman2::arrow_right::umbrella:' },
    { 'weather': '晴一時曇', 'icon': ':partly_sunny:' },
    { 'weather': '晴一時雨', 'icon': ':white_sun_rain_cloud:' },
    { 'weather': '晴一時雪', 'icon': ':sunny::repeat::snowman2:' },
    { 'weather': '曇一時晴', 'icon': ':partly_sunny:' },
    { 'weather': '曇一時雨', 'icon': ':cloud_rain:' },
    { 'weather': '曇一時雪', 'icon': ':cloud_snow:' },
    { 'weather': '雨一時晴', 'icon': ':white_sun_rain_cloud:' },
    { 'weather': '雨一時曇', 'icon': ':cloud_rain:' },
    { 'weather': '雨一時雪', 'icon': ':umbrella::repeat::snowman2:' },
    { 'weather': '雪一時晴', 'icon': ':snowman2::repeat::sunny:' },
    { 'weather': '雪一時曇', 'icon': ':snowman2::repeat::cloud:' },
    { 'weather': '雪一時雨', 'icon': ':snowman2::repeat::umbrella:' },
    { 'weather': '晴時々曇', 'icon': ':white_sun_cloud:' },
    { 'weather': '晴時々雨', 'icon': ':sunny::repeat::umbrella:' },
    { 'weather': '晴時々雪', 'icon': ':sunny::repeat::snowman2:' },
    { 'weather': '曇時々晴', 'icon': ':white_sun_cloud:' },
    { 'weather': '曇時々雨', 'icon': ':cloud_rain:' },
    { 'weather': '曇時々雪', 'icon': ':cloud_snow:' },
    { 'weather': '雨時々晴', 'icon': ':white_sun_rain_cloud:' },
    { 'weather': '雨時々曇', 'icon': ':cloud_rain:' },
    { 'weather': '雨時々雪', 'icon': ':umbrella::repeat::snowman2:' },
    { 'weather': '雪時々晴', 'icon': ':snowman2::repeat::sunny:' },
    { 'weather': '雪時々曇', 'icon': ':cloud_snow:' },
    { 'weather': '雪時々雨', 'icon': ':snowman2::repeat::umbrella:' }
]



function getWeatherURL(prefecture: string): string {
    const region = prefRegions.find((value) => value.pref.startsWith(prefecture));
    return 'https://www.drk7.jp/weather/xml/' + ('0' + (region!.no + 1)).slice(-2) + '.xml';
}

function getWeeklyDate(date: string): string[] {
    const date1 = new Date(date);
    const weeklyDates: string[] = [];
    const youbi = ['日', '月', '火', '水', '木', '金', '土'];
    weeklyDates.push((date1.getMonth() + 1) + '月' + date1.getDate() + '日' + '(' + youbi[date1.getDay()] + ')');
    for (let i = 0; i < 7; i++) {
        date1.setDate(date1.getDate() + 1);
        weeklyDates.push((date1.getMonth() + 1) + '月' + date1.getDate() + '日' + '(' + youbi[date1.getDay()] + ')');
    }
    return weeklyDates;
}

interface WeatherEmbedField {
    name: string;
    value: string;
    inline: boolean;
}

interface WeatherEmbedResult {
    color: number;
    title: string;
    description?: string;
    thumbnail?: { url: string };
    fields?: WeatherEmbedField[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DrkWeatherResult = any;

function getWeeklyEmbed(prefNo: number, regionNo: number, result: DrkWeatherResult): WeatherEmbedResult {
    try {
        const weeklyDates = getWeeklyDate(result.weatherforecast.pref[0].area[regionNo].info[0]['$'].date);
        const fields: WeatherEmbedField[] = [];
        for (let i = 0; i < 7; i++) {
            const weather = result.weatherforecast.pref[0].area[regionNo].info[i].weather[0]
                .replace('後', 'のち').replace('のち一時', 'のち').replace('のち時々', 'のち');
            let max = result.weatherforecast.pref[0].area[regionNo].info[i].temperature[0].range[0]._;
            let min = result.weatherforecast.pref[0].area[regionNo].info[i].temperature[0].range[1]._;
            max = max === undefined ? '-' : max;
            min = min === undefined ? '-' : min;
            fields.push({
                name: icons123[i] + weeklyDates[i] + '     ',
                value: weatherIcons.find((e) => e.weather === weather)!.icon + '\n' + max + '℃/' + min + '℃',
                inline: i !== 0,
            });
        }
        let other = '';
        for (let i = 0; i < prefRegions[prefNo].region.length; i++) other += iconsABC[i] + '：' + prefRegions[prefNo].region[i] + '\n';
        fields.push({ name: 'その他', value: other, inline: true });

        return {
            color: 0x4169e1,
            title: prefRegions[prefNo].pref + ' ' + prefRegions[prefNo].region[regionNo],
            description: '一週間の天気',
            fields,
        };
    } catch {
        return {
            color: 0x4169e1,
            title: 'あかん',
            description: 'データが無いみたいや',
        };
    }
}

//その日の天気をembedを返す。offsetに入れた日数だけ未来の日の天気を返す。
function getDailyEmbed(prefNo: number, regionNo: number, result: DrkWeatherResult, offset = 0): WeatherEmbedResult {
    const info = result.weatherforecast.pref[0].area[regionNo].info[0 + offset];
    const weather = info.weather[0].replace('後', 'のち').replace('のち一時', 'のち').replace('のち時々', 'のち');
    const weatherDetail = Object.prototype.hasOwnProperty.call(info, 'weather_detail') ? info.weather_detail[0] : weather; //2日以降後の日の予報には詳細な天気予報が無い。
    let max = info.temperature[0].range[0]._;
    let min = info.temperature[0].range[1]._;
    max = max === undefined ? '-' : max;
    min = min === undefined ? '-' : min;

    const rainyFallChances = [
        info.rainfallchance[0].period[0]._,
        info.rainfallchance[0].period[1]._,
        info.rainfallchance[0].period[2]._,
        info.rainfallchance[0].period[3]._,
    ];

    let other = ':regional_indicator_w:：週間予報\n';
    for (let i = 0; i < prefRegions[prefNo].region.length; i++) other += iconsABC[i] + '：' + prefRegions[prefNo].region[i] + '\n';

    return {
        color: 0x4169e1,
        title: prefRegions[prefNo].pref + ' ' + prefRegions[prefNo].region[regionNo],
        description: getWeeklyDate(result.weatherforecast.pref[0].area[regionNo].info[0]['$'].date)[0 + offset] + 'の天気',
        thumbnail: { url: info.img[0] },
        fields: [
            { name: '天気', value: weatherDetail, inline: false },
            { name: '最高気温', value: max + '℃', inline: true },
            { name: '最低気温', value: min + '℃', inline: true },
            { name: '降水確率', value: '- 6時：' + rainyFallChances[0] + '%\n' + '-12時：' + rainyFallChances[1] + '%\n' + '-18時：' + rainyFallChances[2] + '%\n' + '-24時：' + rainyFallChances[3] + '%', inline: true },
            { name: 'その他', value: other, inline: true },
        ],
    };
}

export { prefRegions, weatherIcons, getWeatherURL, getWeeklyDate, getWeeklyEmbed, getDailyEmbed };
