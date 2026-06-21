import { load } from 'cheerio';
import { EmbedBuilder } from 'discord.js';
import { getRandomIndex } from '../utils/random';

const rakutenURL = 'https://recipe.rakuten.co.jp/category/30/simple/';

interface Dish {
  title: string;
  image: string;
  description: string;
}

/** 【料理】 楽天レシピをスクレイピングしてランダムな料理を1つ紹介するEmbedを返す。 */
async function getDishEmbed(searchWord = 'default'): Promise<EmbedBuilder> {
  const searchURL =
    searchWord === 'default' ? rakutenURL : 'https://recipe.rakuten.co.jp/search/' + encodeURIComponent(searchWord) + '/';

  const response = await fetch(searchURL);
  const body = await response.text();
  const $ = load(body);

  const dishes: Dish[] = [];
  const items = $('li.recipe_ranking__item');
  if (items.length === 0) {
    dishes.push({
      title: '検索失敗',
      image: '',
      description: `「${searchWord}」で検索したけど見つからんっぽいわ`,
    });
  } else {
    items.each((_i, elem) => {
      const url = 'https://recipe.rakuten.co.jp/' + $('a', elem).attr('href');
      const material = $('span.recipe_ranking__material', elem).text();
      dishes.push({
        title: $('span.recipe_ranking__recipe_title', elem).text(),
        image: $('img', elem).attr('src') ?? '',
        description: `${material}\n[レシピはこちら](${url})`,
      });
    });
  }

  const dish = dishes[getRandomIndex(dishes.length)];

  return new EmbedBuilder()
    .setTitle(dish.title)
    .setDescription(dish.description)
    .setImage(dish.image || null)
    .setColor('#ff4500')
    .setFooter({ text: 'rakuten recipe' });
}

export { getDishEmbed };
