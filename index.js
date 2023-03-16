/*************************************************************************************************************
* Discord bot 「さいころ君」                                                                                      *
* 開発者：星野ひとで（https://twitter.com/hitode_mogu）                                                         *
* 概要：さいころ君は私ひとでが個人で開発しているディスコードの多機能ボットです。                                                *
* 機能追加の要望があれば、上記TwitterのDMまでご連絡下さい。                                                           *
* またさいころ君を自分の鯖に追加したい場合も、Twitterまでご連絡下さい。                                                      *
* このソースコードは自由に使用して頂いて構いませんが、それにより生じた不具合や損害に関しては、一切の責任を負いかねますのでご了承下さい。    *
*                                                                                                           *
*                                                                                                           *
*************************************************************************************************************/


require('dotenv').config();
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { DiscordClient } = require('./src/DiscordClient');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});


// discordBot開始
new DiscordClient(client);




//ボットが感知する先頭コマンド一覧
const keyDiceRoll = '!d';
const keyStop = '!stop';
const keyUranai = '【占い】';
const keyChusen = '【抽選】';
const keyChusenUketsuke = '【抽選受付】';
const keySuimin = '【睡眠】';
const keyKishou = '【起床】';
const keyPokeFromName = '!pn';
const keyPokeFromNameShousai = '!ps';
const keyPokeTokusei = '!pt';
const keyPokeTypeCompatibilitiesFromAttack = '!pca';
const keyPokeTypeCompatibilitiesFromDefence = '!pcd';
const keyHelp = '!help';
const keyWeather = '【天気】';
const keyLuna = '【ルナ】';
const keySplatoonWeapon = '!spw';
const keySplatoonSub = '!sps';
const keySplatoonSpecial = '!spp';
const keySplatoon = '!sp';
const keyQuiz = '【クイズ】';
const keyQuizReset = '!qreset';
const keyQuizRanking = '!qranking';
const keyTenhou = '【天和】';
const keyDoubeRiichi = '【ダブリー】';
const keyQuizBambooMachiate = '【バンブー】'
const keyQuiz1shanten = '【何切る】';
const keySingleGacha = '【ガチャ】';
const key10renGacha = '【10連】';
const keyDishGacha = '【料理】';
const keyFesSplatoon = '【フェス】';
const keyFesMahjong = '【麻雀フェス】';
const keyWordWolf = '【ワードウルフ】';
const keyDM = '!DM';
const keyTimer = '!timer';
const chatGPT = '!c';

