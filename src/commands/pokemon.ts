import { EmbedBuilder } from 'discord.js';
import type { Command } from '../discord/types';
import {
  getPokemonByName,
  getTokusei,
  getPokemonEmbed,
  getPCDEmbed,
  types,
  typeCompatibilities,
  getTypeCompatibilityD,
  getTypeCompatibilityS,
} from '../domain/pokemon';

const keyPokeFromName = '!pn';
const keyPokeFromNameShousai = '!ps';
const keyPokeTokusei = '!pt';
const keyPokeTypeCompatibilitiesFromAttack = '!pca';
const keyPokeTypeCompatibilitiesFromDefence = '!pcd';

/** !pn ポケモンの名前からタイプ情報を引く */
export const pokemonByNameCommand: Command = {
  name: 'pokemon-by-name',
  async handle(message) {
    if (!message.content.startsWith(keyPokeFromName)) return;
    const pokeName = message.content.replace(keyPokeFromName, '').replace(' ', '');
    const poke = getPokemonByName(pokeName);

    if (poke.length === 0) {
      await message.reply('```\n' + pokeName + 'っていうポケモンは見つからんみたいや。\n```');
      return;
    }
    if (poke.length > 4 && pokeName !== 'ロトム') {
      await message.reply('```\nなんかいっぱい出たわ。\n```');
      return;
    }
    for (const p of poke) {
      const type = p[3] === '' ? `${p[2]}` : `${p[2]},${p[3]}`;
      const output = `なまえ：${p[1]}\nタイプ：${type}\n`;
      await message.reply('```\n' + output + '\n```');
    }
  },
};

/** !ps ポケモンの名前からタイプ・特性・種族値情報を引く */
export const pokemonDetailCommand: Command = {
  name: 'pokemon-detail',
  async handle(message) {
    if (!message.content.startsWith(keyPokeFromNameShousai)) return;
    const pokeName = message.content.replace(keyPokeFromNameShousai, '').replace('　', ' ').replace(' ', '');
    const poke = getPokemonByName(pokeName);

    if (poke.length === 0) {
      const noEmbed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('あかん')
        .setDescription(pokeName + 'っていうポケモンはおらんみたいや')
        .setThumbnail('https://cdn.discordapp.com/attachments/791331941524701199/908179452792565760/FALVzyoUcAYAztK.jpg');
      await message.reply({ embeds: [noEmbed] });
      return;
    }
    if (poke.length > 4 && pokeName !== 'ロトム') {
      await message.reply('```\nなんかいっぱい出たわ。\n```');
      return;
    }
    for (const p of poke) {
      const name = String(p[1]);
      const rep = await message.reply({ embeds: [getPokemonEmbed(name)] });
      await rep.react('🎨');
      const collector = rep.createReactionCollector({ time: 5 * 60 * 1000 });
      collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === '🎨' && !user.bot) {
          await message.reply({ embeds: [getPCDEmbed(name)] });
        }
      });
    }
  },
};

/** !pt 特性名から特性の説明を引く */
export const pokemonTokuseiCommand: Command = {
  name: 'pokemon-tokusei',
  async handle(message) {
    if (!message.content.startsWith(keyPokeTokusei)) return;
    const tokName = message.content.replace(keyPokeTokusei, '').replace(' ', '');
    const tok = getTokusei(tokName);

    if (!tok) {
      await message.reply('```\n' + tokName + 'っていう特性は見つからんみたいや。\n```');
      return;
    }
    await message.reply('```\n' + tokName + '：' + tok + '\n```');
  },
};

/** !pca 攻撃側タイプからタイプ相性を引く */
export const pokemonTypeCompatibilityFromAttackCommand: Command = {
  name: 'pokemon-type-compatibility-attack',
  async handle(message) {
    if (!message.content.startsWith(keyPokeTypeCompatibilitiesFromAttack)) return;
    const type = message.content.replace(keyPokeTypeCompatibilitiesFromAttack, '').replace('　', ' ').replace(' ', '');
    const table = typeCompatibilities[types.indexOf(type)];

    let output = type + 'わざで攻撃した場合\n';
    output += table[0].length !== 0 ? '2倍：' + table[0].join(',') + '\n' : '2倍：なし\n';
    output += '0.5倍：' + table[1].join(',');
    output += table[2].length !== 0 ? '\n0倍：' + table[2].join(',') : '\n0倍：なし\n';

    await message.reply('```\n' + output + '```');
  },
};

/** !pcd 防御側タイプ(単体・複合)からタイプ相性を引く */
export const pokemonTypeCompatibilityFromDefenceCommand: Command = {
  name: 'pokemon-type-compatibility-defence',
  async handle(message) {
    if (!message.content.startsWith(keyPokeTypeCompatibilitiesFromDefence)) return;
    const parts = message.content.split(/ |　|,/);
    let type1: string;
    let type2 = '';
    let outTypes;

    if (parts.length >= 3 && types.includes(parts[2])) {
      type1 = parts[1];
      type2 = parts[2];
      outTypes = getTypeCompatibilityD(type1, type2);
    } else {
      type1 = parts[1];
      outTypes = getTypeCompatibilityS(type1);
    }

    let output = (type2 === '' ? type1 : [type1, type2].join(',')) + 'タイプのポケモンに対する攻撃タイプの倍率\n';
    output += '4倍   ：' + (outTypes[0].length !== 0 ? outTypes[0].join(',') : 'なし') + '\n';
    output += '2倍   ：' + (outTypes[1].length !== 0 ? outTypes[1].join(',') : 'なし') + '\n';
    output += '0.5倍 ：' + (outTypes[2].length !== 0 ? outTypes[2].join(',') : 'なし') + '\n';
    output += '0.25倍：' + (outTypes[3].length !== 0 ? outTypes[3].join(',') : 'なし') + '\n';
    output += '0倍   ：' + (outTypes[4].length !== 0 ? outTypes[4].join(',') : 'なし');

    await message.reply('```\n' + output + '\n```');
  },
};

export const pokemonCommands: Command[] = [
  pokemonByNameCommand,
  pokemonDetailCommand,
  pokemonTokuseiCommand,
  pokemonTypeCompatibilityFromAttackCommand,
  pokemonTypeCompatibilityFromDefenceCommand,
];
