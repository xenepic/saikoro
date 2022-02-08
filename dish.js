const request = require('request');
const cheerio = require('cheerio');
const { MessageEmbed } = require('discord.js');

const rakutenURL = 'https://recipe.rakuten.co.jp/category/30/simple/' // 

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


function doRequest(url) {
    return new Promise(function(resolve, reject) {
        request(url, function(error, res, body) {
            if (!error && res.statusCode == 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
}


async function getDishEmbed(searchWord = 'default') {
    let dishEmbed = new MessageEmbed();
    let dishes = [];
    let searchURL;
    if (searchWord === 'default') searchURL = rakutenURL;
    else searchURL = 'https://recipe.rakuten.co.jp/search/' + encodeURIComponent(searchWord) + '/';

    await doRequest(searchURL)
        .then(body => {
            const $ = cheerio.load(body) //bodyの読み込み

            if ($('li.recipe_ranking__item').length === 0) {
                let dish = {
                    title: '検索失敗',
                    image: '',
                    description: `「${searchWord}」で検索したけど見つからんっぽいわ`
                }
                dishes.push(dish);
            } else {
                $('li.recipe_ranking__item').each((i, elem) => { //'title'クラス内のh3タグ内要素に対して処理実行
                    let dish = {
                        title: $('span.recipe_ranking__recipe_title', elem).text(),
                        url: 'https://recipe.rakuten.co.jp/' + $('a', elem).attr('href'),
                        image: $('img', elem).attr('src'),
                        material: $('span.recipe_ranking__material', elem).text()
                    }
                    dish.description = `${dish.material}\n[レシピはこちら](${dish.url})`

                    dishes.push(dish);
                })
            }

        })
        .catch(e => {
            console.log(e);
        })

    let i = getRandomInt(dishes.length);


    dishEmbed.setTitle(dishes[i].title);
    dishEmbed.setDescription(dishes[i].description);
    dishEmbed.setImage(dishes[i].image);
    dishEmbed.setColor('#ff4500');
    dishEmbed.setFooter('rakuten recipe');
    console.log(dishes[i].title);
    return dishEmbed;

}
module.exports = { getDishEmbed };