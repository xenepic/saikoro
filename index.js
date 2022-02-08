// import * as xlsx from 'xlsx';
// const book = xlsx.readFile('test.xlsx');
// const sheet = book.Sheets[book.SheetNames[0]];

// import { P } from 'pokemon.js';

const token = require('./token');


const { pokemons, tokuseis, pokemonPic, types, typeCompatibilities, getAttribute, getPokemonByName, getPokemonByZukanNo, getPokemonByRandom, getTokusei, getDamageMagnification, getTypeCompatibilityS, getTypeCompatibilityD, getTypeCompatibilityByPokemon, getPokemonEmbed, getPCDEmbed } = require('./pokemon');
const { prefectures, prefRegions, weatherIcons, iconsABC, icons123, getWeatherURL, getWeeklyDate, getWeatherIcon, getWeeklyEmbed, getDailyEmbed } = require('./weather');
const { Client, Intents } = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { searchFor, getWeaponByMain, getWeaponEmbedByMain, getNoMatchesEmbed, getSubWeaponByName, getWeaponBySub, getSubWeaponListEmbed, getWeaponListEmbed, getWeaponListEmbedBySub, getWeaponListEmbedBySpecial, getSpecialByName, getWeaponBySpecial, getSpecialListEmbed, howManyHitBySub, howManyHitBySpecial, weapons, getFesVoteEmbed, getFesKumiwakeEmbed, weaponsInfo } = require('./splatoon');
const { getTenhouEmbed, getDoubleRiichiEmbed, getMachiateEmbed, get1shantenEmbed, getMahjongFesEmbed } = require('./mahjong');
const { getGachaMessage, addSP } = require('./gacha');
const { getDishEmbed } = require('./dish');
const { getWordWolfEmbed, getWordWolfMessageList, getWordWolfVoteEmbed, getWordWolfVoteResultEmbed, getWordWolfRuleEmbed } = require('./wordwolf');
const Quiz = require('./quiz.js');
const client = new Client({ intents: Object.keys(Intents.FLAGS) });

const fs = require("fs");
const outFile = 'discordData.csv';
const charaset = 'ascii';
const jschardet = require('jschardet');
const Iconv = require('iconv-lite');


const https = require('https'); // HTTPのモジュール
// const axios = require('axios');

//const pokemon = require('./pokemon');

const request = require('request');
const parseString = require('xml2js').parseString;

const mysql = require('mysql2');
const knexLib = require('knex');

// knexで生成するDB情報保存用ファイルのインポート
const knexfile = require('./knexfile')['development'];
const knex = knexLib({
    client: knexfile.client,
    connection: knexfile.connection
});

const discordUneiID = [{
    'name': '星野ひとで',
    'ID': '639094892051693594'
}, {
    'name': 'ゆいな',
    'ID': '485859087922233374'
}, {
    'name': 'ATS',
    'ID': '713365381766447164'
}];

const iconsRedAB = ['🅰️', '🅱️'];

/*function sendDM(userId, text, option = {}) {
    client.users.fetch(userId)
        .then(e => {
            e.send(text, option)
                .then(console.log("メッセージ送信: " + text + JSON.stringify(option)))
                .catch(console.error); // 1
        })
        .catch(console.error); // 2
}*/

//個人にDMを送る関数
function sendDM(userId, text, option = {}) {
    return new Promise((resolve, reject) => {
        client.users.fetch(userId)
            .then(user => {
                user.send(text, option)
                    .then(rep => {
                        console.log(`DM送信(${user.tag.split('#')[0]}): ${text}`);
                        resolve(rep);
                    })
                    .catch(e => {
                        console.log(e);
                        reject(e);
                    }); // 1
            })
            .catch(e => {
                console.log(e);
                reject(e);
            }); // 2
    })

}

/*********************************************************************************************************
 * 【ワードウルフ】投票エンベッド返信用関数
 * @param {msg} エンベッドを返信するメッセージオブジェクト
 * @param {participants} ワードウルフに参加している人のリスト
 *   participants = {
 *       player:[{name:'ひとで', id:12345789, role:'Villager', finalVote:false},{name:'ゆいな', id:987654321, role:'Wolf', finalVote:false}],
 *       watcher:[{name:'まるば', id:456789231},{name:'のーや', id:654987321}]
 *   }
 **********************************************************************************************************/
function replyWordWolfVoteEmbed(msg, participants) {
    msg.reply(getWordWolfVoteEmbed(participants))
        .then(rep => {
            //決選投票の場合はfinalVote==trueの人数分だけリアクション
            let isFinalVote = false;
            if (participants.player.filter(e => e.finalVote === true).length !== 0) isFinalVote = true;
            (isFinalVote ? participants.player.filter(e => e.finalVote === true) : participants.player).forEach((e, i) => {
                rep.react(iconsABC[i]);
            });

            /*
            vote = [
                {name:'ひとで',voted:['ゆいな','まるば','のーや']},
                {name:'まるば',voted:[]},
                {name:'のーや',voted:[]},
                {name:'ゆいな',voted:['ひとで']},
            ]
            */

            //投票結果格納用配列作成
            let vote = [];
            participants.player.forEach(e => {
                vote.push({ name: e.name, voted: [], killed: false });
            });

            //デバッグ用。後で削除すること。
            // vote = [
            //     { name: 'ひとで', voted: ['ゆいな', 'まるば'] },
            //     { name: 'まるば', voted: ['のーや'] },
            //     { name: 'のーや', voted: [] },
            //     { name: 'ゆいな', voted: ['ひとで'] },
            //     { name: '星野ひとで', voted: [] }
            // ];

            //参加者の投票のみ集計
            // console.log(`${iconsABC.slice(0, participants.player.length)}\n${participants.player.map(e => e.name)}`);
            const filter = (r, u) => iconsABC.slice(0, participants.player.length).includes(r.emoji.name) && participants.player.map(e => e.name).includes(u.tag.split('#')[0]);
            const collector = rep.createReactionCollector({ filter, time: 10 * 60 * 1000 });
            collector.on('collect', (reaction, user) => {
                // console.log(`${reaction.emoji.name}`);
                //既に名前がある場合はそれを削除する
                let arr = vote.filter(e => e.voted.includes(user.tag.split('#')[0]));
                if (arr.length !== 0) {
                    let index = arr.indexOf(user.tag.split('#')[0]);
                    vote.filter(e => e.voted.includes(user.tag.split('#')[0])).voted = arr.slice(0, index).concat(arr.slice(index + 1));
                }
                //投票先に名前を追加
                vote[iconsABC.indexOf(reaction.emoji.name)].voted.push(user.tag.split('#')[0]);

                //参加者全員の投票が終われば、投票結果エンベッドを返信する。
                if (vote.map(e => e.voted.length).reduce((acc, value) => acc + value) === participants.player.length) {
                    replyWordWolfVoteResultEmbed(rep, participants, vote);
                }
                //リアクションを除去
                try {
                    reaction.users.remove(user);
                } catch (e) {
                    console.log('リアクション除去エラー（おそらくサイコロ君botに管理者権限が無い鯖での使用）');
                    console.log(e);
                }
            })
        })
        .catch(e => {
            console.log(e);
        })
}

/*********************************************************************************************************
 * 【ワードウルフ】投票結果エンベッド返信用関数
 * @param {msg} エンベッドを返信するメッセージオブジェクト
 * @param {participants} ワードウルフに参加している人のリスト
 *   participants = {
 *       player:[{name:'ひとで', id:12345789, role:'Villager', finalVote:false},{name:'ゆいな', id:987654321, role:'Wolf', finalVote:false}],
 *       watcher:[{name:'まるば', id:456789231},{name:'のーや', id:654987321}]
 *   }
 * @aram {vote} 投票結果のリスト
 *      vote = [
 *          {name:'ひとで',voted:['ゆいな','まるば','のーや'], killed=true},
 *          {name:'まるば',voted:[], killed=false},
 *          {name:'のーや',voted:[], killed=false},
 *          {name:'ゆいな',voted:['ひとで'], killed=false},
 *      ]
 *      killedが全てfalseの場合は決選投票とする。
 **********************************************************************************************************/
function replyWordWolfVoteResultEmbed(msg, participants, vote) {
    let state = '';
    let isFinalVote = false;
    let killedName = '';
    if (participants.player.filter(e => e.finalVote === true).length !== 0) isFinalVote = true;

    //投票結果のトップが同数の場合、決選投票
    let max = Math.max(...vote.map(e => e.voted.length));
    if (vote.filter(e => e.voted.length === max).length >= 2) {

        if (isFinalVote) {
            //ただし既にこれが決選投票だった場合、2回の決選投票はしないので、ランダムで処刑者を決定
            killedName = vote.filter(e => e.voted.length === max)[getRandomInt(vote.filter(e => e.voted.length === max).length) - 1].name;
            vote.find(e => e.name === killedName).killed = true;
            //participantsのfinalVoteフラグを全てfalseに戻す
            participants.player.forEach((e, i) => {
                participants.player[i].finalVote = false;
            });

        } else {
            //決選投票の場合は、投票結果を表示してから、再度決選投票エンベッドも表示する。
            vote.filter(e => e.voted.length === max).forEach(e => {
                participants.player.find(p => p.name === e.name).finalVote = true;
            });
            msg.reply(getWordWolfVoteResultEmbed(participants, vote, 'continue'));
            replyWordWolfVoteEmbed(msg, participants);
            return;
        }

    } else {
        killedName = vote.find(e => e.voted.length === max).name;
        vote[vote.findIndex(e => e.name === killedName)].killed = true;
    }

    //処刑されたプレイヤーはwatcherに移動する。
    participants.watcher.push(vote.find(e => e.name === killedName));
    let index = participants.player.map(e => e.name).indexOf(killedName);
    participants.player = participants.player.slice(0, index).concat(participants.player.slice(index + 1));

    //ここで「継続」「市民勝利」「人狼勝利」を判定する。
    let villagerNum = participants.player.filter(e => e.role === 'Villager').length;
    let wolfNum = participants.player.filter(e => e.role === 'Wolf').length;
    if (wolfNum === 0) state = 'winVillager';
    else if (villagerNum === 0) state = 'winWolf';
    else state = 'continue';

    //投票結果エンベッドを返信
    msg.reply(getWordWolfVoteResultEmbed(participants, vote, state))
        .then(rep => {
            //詳細表示と、継続であれば次の投票リアクションを付与
            rep.react('📄');
            if (state === 'continue') rep.react('📮');
            const filter = (r, u) => ['📄', '📮'].includes(r.emoji.name) && participants.player.map(e => e.name).includes(u.tag.split('#')[0]);
            const collector = rep.createReactionCollector({ filter, time: 10 * 60 * 1000 });
            collector.on('collect', (reaction, user) => {

                //詳細表示リアクションが付いた場合
                if (reaction.emoji.name === '📄' && !user.bot) {
                    rep.edit(getWordWolfVoteResultEmbed(participants, vote, state, detail = true));
                    //リアクションを除去
                    try {
                        reaction.users.remove(user);
                    } catch (e) {
                        console.log('リアクション除去エラー（おそらくサイコロ君botに管理者権限が無い鯖での使用）');
                        console.log(e);
                    }
                }

                //次の投票リアクションが付いた場合
                if (state === 'continue' && reaction.emoji.name === '📮' && !user.bot) {
                    //リアクションを除去
                    try {
                        reaction.users.remove(user);
                    } catch (e) {
                        console.log('リアクション除去エラー（おそらくサイコロ君botに管理者権限が無い鯖での使用）');
                        console.log(e);
                    }
                    replyWordWolfVoteEmbed(rep, participants);
                }


            })
        })

}


//timeで与えられた秒数だけスリープする関数
function timer(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time * 1000)
    });
}

//
function getTimerEmbed(time) {
    let timerEmbed = new MessageEmbed();
    let min = Math.floor(time / 60);
    let sec = time % 60;
    timerEmbed.setTitle('タイマー');
    console.log(min);
    console.log(sec);
    timerEmbed.addField(name = `${min}分${sec}秒`, value = '\u200B', inline = false);
    return { embeds: [timerEmbed] };
}

//タイマーの再帰関数
function editTimerEmbed(msg, time) {
    timer(1)
        .then(() => {
            if (time <= 0) return;
            msg.edit(getTimerEmbed(time - 1));
            editTimerEmbed(msg, time - 1);
        })
}



//文字列の長さを、半角は1、全角は2として返す関数
function strLength(str) {
    let len = 0;

    for (let i = 0; i < str.length; i++) {
        (str[i].match(/[ -~]/)) ? len += 1: len += 2;
    }
    return len;
}

//文字列が指定された長さになるまで全角スペースを付与して返す関数（ディスコードでは半角スペースは削除されるため、全角スペースを付与している）
function getEqualLengthStr(str, len) {
    if (strLength(str) % 2 == 1) str += ' ';
    while (strLength(str) < len) {
        str += '　';
    }
    return str;
}

//与えられたユーザーが運営陣かどうか判定しtrue/falseを返す
function isFromUnei(user) {
    if (discordUneiID.map(e => e['ID']).includes(user.id)) return true;
    else if (discordUneiID.map(e => e['name']).includes(user.tag.split('#')[0])) return true;
    else return false;
}


function writeF(text) {
    let detectResult = jschardet.detect(text);
    let outText = Iconv.encode(text.replace('\n', '') + '\n', 'Shift_JIS');
    fs.appendFile(outFile, outText, charaset, (err, data) => {
        if (err) console.log(err);
    });
}

function zenkaku2Hankaku(str) {
    return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
}



//スプラトゥーンサブウェポン検索機能
//getWeaponByKey:メインの場合は getWeaponByMain
//getKeyListEmbed:メインの場合は getWeaponListEmbed
//getWeaponEmbedByKey:メインの場合は getWeaponEmbedByMain
//サブとスペシャル検索の場合、returnでメインのリストのEmbedが戻ってくるので、それにリアクションを付けて、リアクションの反応によって更にメインを表示
function splatoonSearch(msg, key, noSearchFlag, getWeaponByKey, getKeyListEmbed, getWeaponEmbedByKey) {
    return new Promise((resolve, reject) => {
        try {
            console.log(`splatoonSearch key[${key}]`);
            // let key = msg.content.replace('　', ' ').split(' ')[1];
            let searchResult = getWeaponByKey(key);
            let splatoonEmbed = new MessageEmbed();

            if (searchResult.length == 0) { //ヒットする武器がない場合
                resolve(msg.reply({ embeds: [getNoMatchesEmbed(key)] }));
            } else if (searchResult.length == 1 || noSearchFlag) { //ヒットする武器が一つだけの場合、そのまま武器を表示する。
                if (noSearchFlag) resolve(msg.reply({ embeds: [getWeaponEmbedByKey(key)] }));
                else resolve(msg.reply({ embeds: [getWeaponEmbedByKey(searchResult[0])] }));
            } else { //ヒットする武器が複数ある場合、リストを提示してリアクションで表示する武器を決める
                msg.reply({ embeds: [getKeyListEmbed(key, searchResult)] })
                    .then(rep => {
                        //リアクション付与
                        for (let i = 0; i < ((searchResult.length <= 19) ? searchResult.length : 19); i++) {
                            rep.react(iconsABC[i]);
                        };

                        //リアクション検知
                        const collector = rep.createReactionCollector({ time: 5 * 60 * 1000 });
                        collector.on('collect', (reaction, user) => {
                            if (iconsABC.indexOf(reaction.emoji.name) <= ((searchResult.length <= 19) ? searchResult.length : 19) && !user.bot) {
                                let index = iconsABC.indexOf(reaction.emoji.name);
                                resolve(rep.reply({ embeds: [getWeaponEmbedByKey(searchResult[index])] }));
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        } catch (e) {
            console.log(e);
            reject(e);


        }
    });
}

function spSearchM(msg, key) {
    return new Promise((resolve, reject) => {
        try {
            console.log(`M key[${key}]`);
            let weapons = getWeaponByMain(key);
            if (weapons.length == 0) resolve(msg.reply({ embeds: [getNoMatchesEmbed(key)] }));
            else if (weapons.length == 1) resolve(spDispM(msg, weapons[0]));
            else resolve(spSearchMbyM(msg, key))
        } catch (e) {
            reject(e);
        }
    });
}

function spSearchMbyM(msg, key) {
    return new Promise((resolve, reject) => {
        try {
            console.log(`MbyM key[${key}]`);
            let searchResult = getWeaponByMain(key);
            msg.reply({ embeds: [getWeaponListEmbed(key, searchResult)] })
                .then(rep => {
                    //リアクション付与
                    for (let i = 0; i < ((searchResult.length <= 19) ? searchResult.length : 19); i++) {
                        rep.react(iconsABC[i]);
                    };

                    //リアクション検知
                    const collector = rep.createReactionCollector({ time: 5 * 60 * 1000 });
                    collector.on('collect', (reaction, user) => {
                        if (iconsABC.indexOf(reaction.emoji.name) <= ((searchResult.length <= 19) ? searchResult.length : 19) && !user.bot) {
                            let index = iconsABC.indexOf(reaction.emoji.name);
                            resolve(spDispM(rep, searchResult[index]));
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
        } catch (e) {
            reject(e);
        }
    });
}

function spDispM(msg, key) {
    return new Promise((resolve, reject) => {
        try {
            console.log(`dispM key[${key}]`);
            msg.reply({ embeds: [getWeaponEmbedByMain(key)] })
                .then(rep => {
                    let sub = rep.embeds[0].fields[0].value;
                    let special = rep.embeds[0].fields[1].value;
                    // console.log(rep.embeds[0]);
                    // console.log(rep.embeds[0].fields[0]);
                    // console.log(rep.embeds[0].fields[0].value);
                    console.log(`sub:${sub},special:${special}`);
                    // console.log(weaponsLinst);
                    //リアクション付与
                    rep.react('🇸');
                    rep.react('🇵');

                    //リアクション検知
                    const collector = rep.createReactionCollector({ time: 5 * 60 * 1000 });
                    collector.on('collect', (reaction, user) => {
                        if (reaction.emoji.name === '🇸' && !user.bot) {
                            // let index = iconsABC.indexOf(reaction.emoji.name);
                            resolve(spSearchMbyS(rep, sub));
                        }
                        if (reaction.emoji.name === '🇵' && !user.bot) {
                            // let index = iconsABC.indexOf(reaction.emoji.name);
                            resolve(spSearchMbyP(rep, special));
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        } catch (e) {
            reject(e);
        }
    });
}

function spSearchS(msg, key) {
    return new Promise((resolve, reject) => {
        try {
            console.log(`S key[${key}]`);
            let howManyHit = howManyHitBySub(key);
            if (howManyHit == 0) resolve(msg.reply({ embeds: [getNoMatchesEmbed(key)] }));
            else if (howManyHit == 1) {
                key = getSubWeaponByName(key)[0];
                resolve(spSearchMbyS(msg, key));
            } else resolve(spSearchSbyS(msg, key))
        } catch (e) {
            reject(e);
        }
    });
}

function spSearchSbyS(msg, key) {
    return new Promise((resolve, reject) => {
        try {
            console.log(`SbyS key[${key}]`);
            let searchResult = getSubWeaponByName(key);
            msg.reply({ embeds: [getSubWeaponListEmbed(key, searchResult)] })
                .then(rep => {
                    //リアクション付与
                    for (let i = 0; i < ((searchResult.length <= 19) ? searchResult.length : 19); i++) {
                        rep.react(iconsABC[i]);
                    };

                    //リアクション検知
                    const collector = rep.createReactionCollector({ time: 5 * 60 * 1000 });
                    collector.on('collect', (reaction, user) => {
                        if (iconsABC.indexOf(reaction.emoji.name) <= ((searchResult.length <= 19) ? searchResult.length : 19) && !user.bot) {
                            let index = iconsABC.indexOf(reaction.emoji.name);
                            resolve(spSearchMbyS(rep, searchResult[index]));
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
        } catch (e) {
            reject(e);
        }
    });
}

function spSearchMbyS(msg, key) {
    return new Promise((resolve, reject) => {
        try {
            console.log(`MbyS key[${key}]`);
            let searchResult = getWeaponBySub(key);
            console.log(`searchResult---\n${searchResult}`);
            msg.reply({ embeds: [getWeaponListEmbedBySub(key, searchResult)] })
                .then(rep => {
                    //リアクション付与
                    for (let i = 0; i < ((searchResult.length <= 19) ? searchResult.length : 19); i++) {
                        rep.react(iconsABC[i]);
                    };

                    //リアクション検知
                    const collector = rep.createReactionCollector({ time: 5 * 60 * 1000 });
                    collector.on('collect', (reaction, user) => {
                        if (iconsABC.indexOf(reaction.emoji.name) <= ((searchResult.length <= 19) ? searchResult.length : 19) && !user.bot) {
                            let index = iconsABC.indexOf(reaction.emoji.name);
                            resolve(spDispM(rep, searchResult[index]));
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
        } catch (e) {
            reject(e);
        }
    });
}

function spSearchP(msg, key) {
    return new Promise((resolve, reject) => {
        try {
            console.log(`P key[${key}]`);
            let howManyHit = howManyHitBySpecial(key);
            if (howManyHit == 0) resolve(msg.reply({ embeds: [getNoMatchesEmbed(key)] }));
            else if (howManyHit == 1) {
                key = getSpecialByName(key)[0];
                resolve(spSearchMbyP(msg, key));
            } else resolve(spSearchPbyP(msg, key))
        } catch (e) {
            reject(e);
        }
    });
}

function spSearchPbyP(msg, key) {
    return new Promise((resolve, reject) => {
        try {
            console.log(`PbyP key[${key}]`);
            let searchResult = getSpecialByName(key);
            msg.reply({ embeds: [getSpecialListEmbed(key, searchResult)] })
                .then(rep => {
                    //リアクション付与
                    for (let i = 0; i < ((searchResult.length <= 19) ? searchResult.length : 19); i++) {
                        rep.react(iconsABC[i]);
                    };

                    //リアクション検知
                    const collector = rep.createReactionCollector({ time: 5 * 60 * 1000 });
                    collector.on('collect', (reaction, user) => {
                        if (iconsABC.indexOf(reaction.emoji.name) <= ((searchResult.length <= 19) ? searchResult.length : 19) && !user.bot) {
                            let index = iconsABC.indexOf(reaction.emoji.name);
                            resolve(spSearchMbyP(rep, searchResult[index]));
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
        } catch (e) {
            reject(e);
        }
    });
}

function spSearchMbyP(msg, key) {
    return new Promise((resolve, reject) => {
        try {
            console.log(`MbyP key[${key}]`);
            let searchResult = getWeaponBySpecial(key);
            console.log(`searchResult---\n${searchResult}`);
            msg.reply({ embeds: [getWeaponListEmbedBySpecial(key, searchResult)] })
                .then(rep => {
                    //リアクション付与
                    for (let i = 0; i < ((searchResult.length <= 19) ? searchResult.length : 19); i++) {
                        rep.react(iconsABC[i]);
                    };

                    //リアクション検知
                    const collector = rep.createReactionCollector({ time: 5 * 60 * 1000 });
                    collector.on('collect', (reaction, user) => {
                        if (iconsABC.indexOf(reaction.emoji.name) <= ((searchResult.length <= 19) ? searchResult.length : 19) && !user.bot) {
                            let index = iconsABC.indexOf(reaction.emoji.name);
                            resolve(spDispM(rep, searchResult[index]));
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
        } catch (e) {
            reject(e);
        }
    });
}



//クイズ機能で使用

//解答を表示
function quizCheckAnswer(msg, quiz, answers) {
    let nextQuizFlag = true;
    msg.reply({ embeds: [quiz.getAnswerEmbed(answers)] })
        .then(rep => {
            rep.react('▶️');
            rep.react('👋');
            const collector = rep.createReactionCollector({ time: 5 * 60 * 1000 });
            collector.on('collect', (reaction, user) => {
                if (reaction.emoji.name === '▶️' && !user.bot && nextQuizFlag) {
                    nextQuizFlag = false;
                    return quizNextQuestion(rep, quiz);
                }
                if (reaction.emoji.name === '👋' && !user.bot) {
                    quiz.endQuiz();
                    rep.reply('またきてね！');
                    // rep.reactions.removeAll();
                    // rep.react('👋');
                    return;
                }
            });

            collector.on('end', collected => {
                // rep.reactions.removeAll();
                // rep.react('👋');
                quiz.endQuiz();
                return;
            });

        })
        .catch(err => {
            console.log(err);
        });
}
//次のクイズを表示
function quizNextQuestion(msg, quiz) {
    let answers = {
        // iconsABC[0]: [],
        '🇦': [],
        '🇧': [],
        '🇨': [],
        '🇩': []
    };
    let answerFlag = false;
    let checkReactionFlag = false;
    msg.reply({ embeds: [quiz.getQuestionEmbed()] })
        .then(rep => {
            rep.react(iconsABC[0]);
            rep.react(iconsABC[1]);
            rep.react(iconsABC[2]);
            rep.react(iconsABC[3]);

            const collector = rep.createReactionCollector({ time: 5 * 60 * 1000 });
            collector.on('collect', (reaction, user) => {
                if (iconsABC.slice(0, 4).includes(reaction.emoji.name) && !user.bot) {
                    //既にリアクションが付いている場合があるので、回答配列から一旦名前を削除
                    for (let i = 0; i < 4; i++) {
                        answers[iconsABC[i]] = answers[iconsABC[i]].filter(name => name != user.tag.split('#')[0]);
                    }
                    answers[reaction.emoji.name].push(user.tag.split('#')[0]);
                    if (!checkReactionFlag) {
                        checkReactionFlag = true;
                        rep.react('☑️');
                    }
                }

                if (reaction.emoji.name === '☑️' && !user.bot && !answerFlag) {
                    answerFlag = true;
                    // rep.reactions.removeAll();
                    return quizCheckAnswer(rep, quiz, answers);
                }
            });

            collector.on('end', collected => {
                if (!answerFlag) {
                    // rep.reactions.removeAll();
                    return quizCheckAnswer(rep, quiz, answers);
                }

            });
        })
        .catch(err => {
            console.log(err);
        })
}
// getMachiateEmbed();

function quizNextBamboo(msg) {
    let waitPais;
    getMachiateEmbed(true)
        .then(([bambooEmbed, wp]) => {
            waitPais = wp;
            // console.log(bambooEmbed);
            console.log(waitPais);
            return msg.reply(bambooEmbed);
        })
        .then(rep => {
            const filter = m => (m.reference != null) && (m.reference.messageId == rep.id) && (!m.author.bot);
            const collector = rep.channel.createMessageCollector({ filter, time: 5 * 60 * 1000 })

            collector.on('collect', message => {
                // if ([...new Set(m.content.split(''))].join('') === waitPais) {
                if ([...new Set(message.content.split(''))].sort().join('') === waitPais) {
                    console.log('正解');
                    addSP(rep.author.tag.split('#')[0], 30);
                    rep.reply('正解！もう一問やる？')
                        .then(rep2 => {
                            // console.log(rep2);
                            rep2.react('🎍')
                            const collector2 = rep2.createReactionCollector({ time: 5 * 60 * 1000 });

                            collector2.on('collect', (reaction2, user2) => {
                                console.log(reaction2.emoji.name);
                                console.log(user2.bot);
                                if (reaction2.emoji.name === '🎍' && !user2.bot) {
                                    return quizNextBamboo(rep2);
                                }
                            });
                        })

                } else {
                    message.react('❌');
                    console.log('ちがうよ');
                }
            })
        })
        .catch(err => {
            console.log(err);
            // console.log(err.requestData.json.embeds);
        })
}

function quizNext1shanten(msg) {
    let answer;
    let answerPai;
    let answerText;
    let answerFlag = false;
    let checkReactionFlag = false;
    let answers = {
        '🇦': [],
        '🇧': [],
        '🇨': [],
        '🇩': []
    };
    get1shantenEmbed()
        .then(([shanten1embed, a, ap, at]) => {
            answer = a;
            answerPai = ap;
            answerText = at;
            return msg.reply(shanten1embed);
        })
        .then(rep => {
            rep.react(iconsABC[0]);
            rep.react(iconsABC[1]);
            rep.react(iconsABC[2]);
            rep.react(iconsABC[3]);
            const collector = rep.createReactionCollector({ time: 5 * 60 * 1000 });

            collector.on('collect', (reaction, user) => {

                if (iconsABC.slice(0, 4).includes(reaction.emoji.name) && !user.bot && !answerFlag) {
                    //既にリアクションが付いている場合があるので、回答配列から一旦名前を削除
                    for (let i = 0; i < 4; i++) {
                        answers[iconsABC[i]] = answers[iconsABC[i]].filter(name => name != user.tag.split('#')[0]);
                    }
                    answers[reaction.emoji.name].push(user.tag.split('#')[0]);
                    if (!checkReactionFlag) {
                        checkReactionFlag = true;
                        rep.react('☑️');
                    }
                }

                if (reaction.emoji.name === '☑️' && !user.bot && !answerFlag) {
                    answerFlag = true;
                    let shanten1Answerembed = new MessageEmbed();
                    shanten1Answerembed.setTitle('正解発表');
                    shanten1Answerembed.setColor('#87cefa');
                    shanten1Answerembed.setDescription(`正解者は、${answers[iconsABC[answer]].join(',')==''?'なし':answers[iconsABC[answer]].join(',')}！`);
                    shanten1Answerembed.addField(name = `正解：${answerPai}`, value = answerText, inline = false);
                    shanten1Answerembed.setFooter('もう一問やる？')

                    answers[iconsABC[answer]].forEach(e => {
                        addSP(e, 30);
                    })

                    rep.reply({ embeds: [shanten1Answerembed] })
                        .then(rep2 => {
                            // console.log('答え合わせ済み');
                            rep2.react('🀄');
                            answerFlag = false
                            const collector2 = rep2.createReactionCollector({ time: 5 * 60 * 1000 });
                            collector2.on('collect', (reaction2, user2) => {
                                if (reaction2.emoji.name == '🀄' && !user2.bot && !answerFlag) {
                                    answerFlag = true;
                                    return quizNext1shanten(rep2);
                                }
                            })
                        })
                }
            });
        })

        .catch(err => {
            console.log(err);
        })
}

const lunaMonth = {
    '1': '麻雀を打って',
    '2': '歩いただけで',
    '3': '絶対に',
    '4': '滑って転んで',
    '5': '信仰心で',
    '6': '雨が降るたび',
    '7': '本を読んだら',
    '8': '運動すると',
    '9': '女神を慕うと',
    '10': '締切に追われて',
    '11': '月を眺めて',
    '12': 'まぁまぁ'
}

const lunaDay = {
    '1': 'いっぱい褒められる',
    '2': '女神ルナに占われる',
    '3': '年末ジャンボ宝くじ券を披露',
    '4': '某魔女さんが通る',
    '5': '女神に酷使される',
    '6': 'カップ焼きそばの湯切りに失敗',
    '7': '助けられる',
    '8': '残業させられる',
    '9': '大金を拾う',
    '10': '某アイドルの総選挙に出馬',
    '11': '女神に刺される',
    '12': '女神にばぶばぶできる',
    '13': '毎日が誕生日',
    '14': '過去と決別する',
    '15': '卵の黄身が2つ入っている',
    '16': '自分を省みる',
    '17': '道に迷う',
    '18': 'Twitterが炎上する',
    '19': 'クロワッサンになる',
    '20': 'iPhone6sが使えなくなる',
    '21': '異臭が漂う',
    '22': '立ち止まる',
    '23': 'ポッキーを突っ込まれる',
    '24': '風邪をひく',
    '25': '何かに執着する',
    '26': '振られる',
    '27': '猫を拾う',
    '28': '大成功する',
    '29': '警察に捕まる',
    '30': '普段見れない役満が出る',
    '31': 'スムーズにことが運ぶ',
}



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



const outputHelp =
    `
【さいころ君のコマンド一覧】

- ${keyDiceRoll}
    クトゥルフ神話っぽいダイスロールを振るやで。
    例）!d 2d6
    例）!d CCB<=20 【酒値チェック】

- ${keyUranai}
    占いするやで。

- ${keyChusen}
    抽選するやで。
    さいころ君のリプに✋のリアクションした人の中から一人選ぶ。
    🔄押したら抽選開始。
    受付時間は5分。

- ${keySuimin}
    寝れるかどうか決めるやで。

- ${keyKishou}
    起きれるかどうか決めるやで。

- ${keyPokeFromName}
    ポケモンのタイプ情報をポケモンの名前から引っ張ってくるやで。
    例）!pn ピカチュウ

- ${keyPokeFromNameShousai}
    ポケモンのタイプ・特性・種族値情報をポケモンの名前から引っ張ってくるやで。
    例）!ps ピカチュウ

- ${keyPokeTokusei}
    ポケモンの特性情報を特性の名前から引っ張ってくるやで。
    例）!pt せいでんき

- ${keyPokeTypeCompatibilitiesFromAttack}
    タイプ相性を攻撃側のタイプから引っ張ってくるやで。
    例）!pca でんき

- ${keyPokeTypeCompatibilitiesFromDefence}
    タイプ相性を防御側のタイプから引っ張ってくるやで。
    複合タイプも可能
    例）!pcd みず　ひこう

- ${keyWeather}
    天気予報を流すやで。
    例）
    ${keyWeather}　　　　　　　　：東京の県庁所在地がある地方のその日の天気
    ${keyWeather}京都　　　　　　：京都の県庁所在地がある地方のその日の天気
    ${keyWeather}京都　週間　　　：京都の県庁所在地がある地方の一週間の天気
    ${keyWeather}京都　北部　　　：京都北部のその日の天気    
    ${keyWeather}京都　北部　週間：京都北部の一週間の天気


- ${keySplatoonWeapon}
    スプラトゥーンの武器を検索するやで
    例）!spw ヒッセン
        !spw スシコラ

- ${keySplatoonSub}
    スプラトゥーンのサブを検索するやで
    例）!sps キューバン

- ${keySplatoonSpecial}
    スプラトゥーンのスペシャルを検索するやで
    例）!spp チャクチ

- ${keySplatoon}
    スプラトゥーンのメイン・サブ・スペシャルをあいまいに検索できるやで。
    わいが適当に判断するわ。
    例）!sp ボム

- ${keyQuiz}
    クイズできるやで。

- ${keyQuizRanking}
    クイズの連続正解数ランキングが見れるやで。

- ${keyTenhou}
    天和チャレンジできるやで。

- ${keyDoubeRiichi}
    ダブリー一発ツモチャレンジができるやで。

- ${keyQuizBambooMachiate}
    バンブー麻雀の待ち宛クイズができるやで。

- ${keyQuiz1shanten}
    イーシャンテンから受け入れ枚数最大になる牌を当てる何切る問題ができるやで。

- ${keyWordWolf}
    ワードウルフできるやで。

- ${keyDM}
    DMでサイコロ君の機能が使えるようになるやで。
`;

// let tenhouTimer = new Date();


function getRandomInt(max) {
    return Math.ceil(Math.random() * max);
}

client.on('ready', () => {
    console.log(`${client.user.tag} でログインしています。`);
})




client.on('messageCreate', async msg => {
    const date1 = new Date();
    const date2 = date1.getFullYear() + "年" +
        (date1.getMonth() + 1) + "月" +
        date1.getDate() + "日" +
        date1.getHours() + "時" +
        date1.getMinutes() + "分" +
        date1.getSeconds() + "秒";
    const date3 = date1.getFullYear() + "-" +
        (date1.getMonth() + 1) + "-" +
        date1.getDate() + "_" +
        date1.getHours() + ":" +
        date1.getMinutes() + ":" +
        date1.getSeconds();
    const date4 = (date1.getMonth() + 1) + "月" +
        date1.getDate() + "日" +
        '(' + ["日", "月", "火", "水", "木", "金", "土"][date1.getDay()] + ')';


    if (msg.guild !== null && msg.channel !== null) {
        writeF([date2, msg.guild.name, msg.channel.name, msg.author.tag, msg.content.replace(/\n/g, ' ')].join(','));
    }
    if (msg.attachments.size && !msg.author.bot) {
        const files = msg.attachments.map(attachment => attachment.url);
        if (msg.guild !== null && msg.channel !== null) {
            writeF([date2, msg.guild.name, msg.channel.name, msg.author.tag, files].join(','));
        }

    }

    if (msg.author.bot && !msg.content.startsWith(keyChusenUketsuke) && !msg.content.includes('なまえ：') && !msg.embeds[0]) return;



    //ダイスロール機能
    try {
        if (msg.content.startsWith(keyDiceRoll)) {
            //msg.channel.send('accept!')
            msg.content = msg.content.replace('CCB', '1d100');
            msg.content = msg.content.replace('ccb', '1d100');
            msg.content = msg.content.replace(keyDiceRoll + ' ', '');

            let diceRollTimes = msg.content.match(/^(\d+)d(\d+)((<=|>=|<|>)\d+)?(.*)$/);
            let output = '';
            let isComparison = false;
            let isSuccess;
            let result = 0;
            let resultEach = new Array(diceRollTimes[1]);

            /*
            diceRollTimes[]
            [0]：入力文の全文
            [1]：1d100の1。振るダイスの個数。
            [2]：1d100の100。振るダイスの最大値。
            [3]：<=50。不等号＋判定基準の数値（不等号無しの場合はundefined）
            [4]：<=不等号（不等号無しの場合はundefined）
            [5]：1d100の後のテキスト。"【SAN値チェック】"など。
            */

            //比較フラグの設定          
            if (diceRollTimes[3] === undefined) {
                isComparison = false;
            } else {
                isComparison = true;
            }


            if (diceRollTimes[1] != undefined && diceRollTimes[2] != undefined) {

                //取得した際は文字列なので数値に変換。（でも暗黙的変換で無くても動くっぽい？）    
                diceRollTimes[1] = parseInt(diceRollTimes[1]);
                diceRollTimes[2] = parseInt(diceRollTimes[2]);

                //ダイスを振る。resultは合計値、resultEachには個々のダイスの値を入れる。
                for (let i = 0; i < diceRollTimes[1]; i++) {
                    resultEach[i] = getRandomInt(diceRollTimes[2]);
                    result += resultEach[i];
                }

                //ダイス目の結果を出力に追加する。複数ダイスの場合は各ダイス目の値も追加する。
                output += msg.content + ' ： ';
                if (diceRollTimes[1] === 1) {
                    output += '[' + result + ']';
                } else {
                    output += '[' + resultEach.join() + ']' + '=[' + result + ']';
                }

                //比較の場合は「成功」「失敗」などの文字列を追加する。
                if (isComparison) {
                    let border = diceRollTimes[3].replace(diceRollTimes[4], '');
                    // await msg.channel.send('比較モード');
                    if (diceRollTimes[4] === '<') {
                        if (result < border) isSuccess = true;
                        else isSuccess = false;
                    } else if (diceRollTimes[4] === '<=') {
                        if (result <= border) isSuccess = true;
                        else isSuccess = false;
                    } else if (diceRollTimes[4] === '>') {
                        if (result > border) isSuccess = true;
                        else isSuccess = false;
                    } else if (diceRollTimes[4] === '>=') {
                        if (result >= border) isSuccess = true;
                        else isSuccess = false;
                    }

                    if (isSuccess && result <= 5 && diceRollTimes[1] === 1 && diceRollTimes[2] === 100) {
                        output += ' ➔ クリティカル/成功';
                    } else if (isSuccess && result <= 10 && diceRollTimes[1] === 1 && diceRollTimes[2] === 100) {
                        output += ' ➔ スペシャル/成功';
                    } else if (!isSuccess && result >= 96 && diceRollTimes[1] === 1 && diceRollTimes[2] === 100) {
                        output += ' ➔ ファンブル/致命的失敗';
                    } else if (isSuccess) {
                        output += ' ➔ 成功';
                    } else if (!isSuccess) {
                        output += ' ➔ 失敗';
                    }

                }

                //結果に応じて異なる色で出力
                if (isComparison) {
                    if (isSuccess) await msg.reply('```md\n#' + output + '\n```');
                    else await msg.reply('```cs\n#' + output + '\n```');
                } else {
                    await msg.reply('```\n' + output + '\n```');
                }

            }

            //msg.channel.send('debug:' + diceRollTimes[1] +' ' + diceRollTimes[2] + ' ' + diceRollTimes[3]);
            //ログ
            console.log(date2 + '：' + output);
        }
    } catch (error) {
        //ログ
        console.log(date2 + '：エラー ：ダイスロール：[' + msg.content + ']');
        console.log(error);
        await msg.reply('```\n' + 'このダイスロールはエラーっぽいわ。 すまんな。[' + msg.content + ']\n```');
        client.login('OTAyMDYxNjQ2OTc1OTk1OTc0.YXY8YA.UuAwdSotOfR6Q7dMJR_QalLTidU');
    } finally {}

    //停止命令。ひとでの発言のみ有効。
    if (msg.content.startsWith(keyStop) && msg.author == '639094892051693594') {
        //ログ
        console.log(date2 + '：stop bot');
        await msg.channel.send('ばいばーい！');
        await client.destroy();
        return;
    }

    //ルナさんの誕生日占い機能
    if (msg.content.startsWith(keyLuna)) {
        // let input = msg.content.replace(keyLuna,'').replace('月','/').replace('日','');
        let month = '';
        let day = '';
        [month, day] = msg.content.replace(keyLuna, '').replace('月', '/').replace('日', '').replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        }).split('/');
        msg.reply('```\n' + lunaMonth[month] + ' ' + lunaDay[day] + '\n```');
    }


    //占い機能
    try {
        if (msg.content.startsWith(keyUranai)) {
            let fortune = getRandomInt(100);
            let output = '';
            let items = ['たけのこの里', 'ハンバーグ', '天一のラーメン', '陶器のコップ', '蜘蛛', '綾鷹', '昔のゲーム', 'サイコロ', '茶色いキーホルダー', 'モンスターボール',
                'おっぱい', '傘', '20円玉', '蚊取り線香', 'ポケットティッシュ配りお姉さん', '鳥居', '液晶画面', 'ソイラテ', '黒いお箸', 'チルタリス', '女神',
                'ひとで', '波の音', '剥げてるおじさん', '20cm以上の髪の毛', '呪いのお札', '丸めたアルミホイル', '優しい人の心臓', '臓器移植', 'undefined', '一筒',
                '黒マスク', '生爪', 'とかげの黒焼き', 'フォロー数＝フォロワー数の人', 'Gの右足', '原子力潜水艦', '映画の半券', '親への手紙', 'いちご系女子',
                'ディズニーアニメ', '雪の結晶', 'ワンセグ付きスマホ', 'うぃんがでぃあむ、れびおさーｗｗｗ', 'アルミ缶の上にある玉ねぎ', '傘の先端の部品', '駅員さんの笑顔', '髪以外の毛', '栗抜きモンブラン', 'チーズ抜きダブチー',
                '乾燥剤', 'ニワトリ以外の卵', '四角いペットボトル', 'うずくまる人', 'BIG ISSUE（雑誌）', 'でかいテレビ'
            ];

            //運勢
            if (fortune <= 5) output = ('今日の運勢は大大大吉クリティカル！これであなたも一発チルタリス！');
            else if (fortune <= 10) output = ('今日の運勢は、大大吉！カップラーメンが３０秒で出来上がる！');
            else if (fortune <= 20) output = ('今日の運勢は、大吉！シャーペンの芯が一回も折れない！');
            else if (fortune <= 30) output = ('今日の運勢は、中吉！Twitterでやべぇ発言しても一回くらい許されるよ。');
            else if (fortune <= 40) output = ('今日の運勢は、中吉！爪切ったら白い部分の幅が全て均等になるよ。');
            else if (fortune <= 50) output = ('今日の運勢は、吉！回転寿司行ったらサーモン10個くらい流れてくるよ。');
            else if (fortune <= 60) output = ('今日の運勢は、平！単眼猫に食われるよ。');
            else if (fortune <= 70) output = ('今日の運勢は、半吉！開かない方のドアの前で待ってそう。');
            else if (fortune <= 80) output = ('今日の運勢は、末吉！週末ならフィーバーしてもヨシ！');
            else if (fortune <= 90) output = ('今日の運勢は、凶！トイレットペーパーの予備を持ち歩こう。');
            else if (fortune <= 95) output = ('---error--- \nYour divination has been invalidated.');
            else output = ('今日の運勢は、大大大凶！布団の中にGが居ないかちゃんと確かめてね。');

            output += '\nラッキーアイテムは、' + items[getRandomInt(items.length - 1)] + '！';
            output += '\nラッキーポケモンは、' + getPokemonByRandom() + '！';

            await msg.reply('```\n' + output + '\n```');

            //ログ
            console.log(date2 + '：' + output);
        }
    } catch (error) {
        //ログ
        console.log(date2 + '：エラー ：占い：[' + msg.content + ']');
        console.log(error);
        await msg.reply('```\n' + '占いでエラーとか今日の運勢は相当やな。\n```');
        client.login('OTAyMDYxNjQ2OTc1OTk1OTc0.YXY8YA.UuAwdSotOfR6Q7dMJR_QalLTidU');
    } finally {}

    //抽選機能


    if (msg.content.startsWith(keyChusen)) {
        msg.channel.send('\n' + keyChusenUketsuke + '\nリアクションをした人の中から1名抽選します。\n✋：抽選に参加\n🔄：抽選開始\n※受付時間は5分間です。\n');
    }

    if (msg.content.startsWith(keyChusenUketsuke)) {
        msg.react('✋');
        msg.react('🔄');
        let users = [];
        let noLotted = true;

        //フィルター。リアクションが✋か🔄かつ、ボット以外のリアクションを受け付ける。
        const filter = (reaction, _user) => (reaction.emoji.name === '✋' || reaction.emoji.name === '🔄') && _user.id != msg.author.id;
        const collector = msg.createReactionCollector({ filter, time: 5 * 60 * 1000 });

        collector.on('collect', (reaction, user) => {
            if (reaction.emoji.name === '✋') {
                users.push(user.tag.slice(0, -5));
                users = [...new Set(users)];
            }
            if (reaction.emoji.name === '🔄') {
                if (users.length === 0) {
                    msg.channel.send('```\n全員の抽選が終わったよ！\n```');
                } else {
                    let i = getRandomInt(users.length - 1);
                    msg.channel.send('```\n抽選結果：' + users[i] + 'さん\n```');
                    users = users.slice(0, i).concat(users.slice(i + 1));
                }

                noLotted = false;
            }

        });

        collector.on('end', collected => {
            if (noLotted && users[0] != undefined) msg.channel.send('```\n抽選結果：' + users[getRandomInt(users.length - 1)] + 'さん\n```');
        });
    }

    //睡眠
    try {
        if (msg.content.startsWith(keySuimin)) {
            let border = getRandomInt(100);
            let point = getRandomInt(80);
            let output = '';
            if (point <= border) msg.reply('```md\nCCB<=' + border + ' ➔ [' + point + ']\n#睡眠成功！ﾈﾛ\n```');
            else msg.reply('```cs\nCCB<=' + border + ' ➔ [' + point + ']\n#睡眠失敗！夜は長いよ。\n```');
        }
    } catch (error) {
        //ログ
        console.log(date2 + '：エラー ：睡眠：[' + msg.content + ']');
        console.log(error);
        await msg.reply('```\n' + 'そもそもエラーやしこれは寝れんな。\n```');
        // client.login('OTAyMDYxNjQ2OTc1OTk1OTc0.YXY8YA.UuAwdSotOfR6Q7dMJR_QalLTidU');
    } finally {}


    //起床
    try {
        if (msg.content.startsWith(keyKishou)) {
            let border = getRandomInt(100);
            let point = getRandomInt(80);
            let output = '';
            if (point <= border) msg.reply('```md\nCCB<=' + border + ' ➔ [' + point + ']\n#起床成功！ｵﾊﾖ\n```');
            else msg.reply('```cs\nCCB<=' + border + ' ➔ [' + point + ']\n#起床失敗！おやすみﾉｼ\n```');
        }
    } catch (error) {
        //ログ
        console.log(date2 + '：エラー ：起床：[' + msg.content + ']');
        console.log(error);
        await msg.reply('```\n' + 'そもそもエラーやしこれはおやすみ。\n```');
        // client.login('OTAyMDYxNjQ2OTc1OTk1OTc0.YXY8YA.UuAwdSotOfR6Q7dMJR_QalLTidU');
    } finally {}

    //ポケモン（名前からタイプ引き）
    if (msg.content.startsWith(keyPokeFromName)) {
        let pokeName = msg.content.replace(keyPokeFromName, '');
        pokeName = pokeName.replace(' ', '');
        let poke = getPokemonByName(pokeName);
        let output = '';
        if (poke.length == 0) {
            console.log(date2 + '：このポケモンは見つかりません。[' + pokeName + ']');
            msg.reply('```\n' + pokeName + 'っていうポケモンは見つからんみたいや。\n```');
        } else if (poke.length <= 4 || pokeName == 'ロトム') {
            for (let i = 0; i < poke.length; i++) {
                output += 'なまえ：' + poke[i][1] + '\n';
                //タイプが一種類か二種類かで場合分け
                if (poke[i][3] === '') {
                    output += 'タイプ：' + poke[i][2] + '\n';
                } else {
                    output += 'タイプ：' + poke[i][2] + ',' + poke[i][3] + '\n';
                }
                msg.reply('```\n' + output + '\n```');
                console.log(output);
                output = '';
            }
        } else {
            msg.reply('```\nなんかいっぱい出たわ。\n```');
        }
    }

    //ポケモン（名前からタイプと特性と種族値引き）
    if (msg.content.startsWith(keyPokeFromNameShousai)) {
        let pokeName = msg.content.replace(keyPokeFromNameShousai, '').replace('　', ' ');
        pokeName = pokeName.replace(' ', '');
        let poke = getPokemonByName(pokeName);

        if (poke.length == 0) {
            let noEmbed = new MessageEmbed();
            noEmbed.setColor('#ff0000');
            noEmbed.setTitle('あかん');
            noEmbed.setDescription(pokeName + 'っていうポケモンはおらんみたいや');
            noEmbed.setThumbnail('https://cdn.discordapp.com/attachments/791331941524701199/908179452792565760/FALVzyoUcAYAztK.jpg');
            msg.reply({ embeds: [noEmbed] });
        } else if (poke.length <= 4 || pokeName == 'ロトム') {
            for (let i = 0; i < poke.length; i++) {

                msg.reply({ embeds: [getPokemonEmbed(poke[i][1])] })
                    .then(rep => {
                        rep.react('🎨');
                        const collector = rep.createReactionCollector({ time: 5 * 60 * 1000 });

                        collector.on('collect', (reaction, user) => {
                            //タイプ表示リアクション
                            if (reaction.emoji.name === '🎨' && !user.bot) msg.reply({ embeds: [getPCDEmbed(poke[i][1])] });
                        });

                    })
                    .catch(err => {
                        console.log(err);
                    })

            }
        } else {
            msg.reply('```\nなんかいっぱい出たわ。\n```');
        }
    }

    //ポケモン（特性を検索）
    if (msg.content.startsWith(keyPokeTokusei)) {
        let tokName = msg.content.replace(keyPokeTokusei, '');
        tokName = tokName.replace(' ', '');
        let tok = getTokusei(tokName);

        if (tok.length == 0) {
            console.log(date2 + '：この特性は見つかりません。[' + tokName + ']');
            msg.reply('```\n' + tokName + 'っていう特性は見つからんみたいや。\n```');
        } else {
            msg.reply('```\n' + tokName + '：' + tok + '\n```');
        }
    }


    //ポケモン（タイプ相性：攻撃タイプから検索）
    if (msg.content.startsWith(keyPokeTypeCompatibilitiesFromAttack)) {
        let type = msg.content.replace(keyPokeTypeCompatibilitiesFromAttack, '');
        type = type.replace('　', ' ');
        type = type.replace(' ', '');
        let output = type + 'わざで攻撃した場合\n';
        if (typeCompatibilities[types.indexOf(type)][0].length != 0) {
            output += '2倍：' + typeCompatibilities[types.indexOf(type)][0].join(',') + '\n';
        } else {
            output += '2倍：なし\n';
        }
        output += '0.5倍：' + typeCompatibilities[types.indexOf(type)][1].join(',');
        if (typeCompatibilities[types.indexOf(type)][2].length != 0) {
            output += '\n0倍：' + typeCompatibilities[types.indexOf(type)][2].join(',');
        } else {
            output += '\n0倍：なし\n';
        }

        msg.reply('```\n' + output + '```');
    }

    //ポケモン（タイプ相性：防御タイプから検索）
    if (msg.content.startsWith(keyPokeTypeCompatibilitiesFromDefence)) {
        // let inTypes = msg.content.split(/ |　|,/).slice(0,1);
        let outTypes = '';
        let type1 = '';
        let type2 = '';
        let output = '';

        if (msg.content.split(/ |　|,/).length >= 3 && types.includes(msg.content.split(/ |　|,/)[2])) {
            type1 = msg.content.split(/ |　|,/)[1];
            type2 = msg.content.split(/ |　|,/)[2];
            outTypes = getTypeCompatibilityD(type1, type2);
        } else {
            type1 = msg.content.split(/ |　|,/)[1];
            outTypes = getTypeCompatibilityS(type1);
        }

        output += ((type2 == '') ? type1 : [type1, type2].join(',')) + 'タイプのポケモンに対する攻撃タイプの倍率\n';
        output += '4倍   ：' + (outTypes[0].length != 0 ? outTypes[0].join(',') : 'なし') + '\n';
        output += '2倍   ：' + (outTypes[1].length != 0 ? outTypes[1].join(',') : 'なし') + '\n';
        output += '0.5倍 ：' + (outTypes[2].length != 0 ? outTypes[2].join(',') : 'なし') + '\n';
        output += '0.25倍：' + (outTypes[3].length != 0 ? outTypes[3].join(',') : 'なし') + '\n';
        output += '0倍   ：' + (outTypes[4].length != 0 ? outTypes[4].join(',') : 'なし');

        msg.reply('```\n' + output + '\n```');

    }

    if (msg.content.startsWith(keyHelp)) {
        msg.channel.send('```diff\n' + outputHelp + '\n```');
    }

    //お天気予報
    if (msg.content.startsWith(keyWeather)) {
        //都道府県名を取得。そこから県庁所在地があるエリアの番号と、XMLがあるURLを取得。
        /*予想される入力
        1.【天気】
        2.【天気】京都
        3.【天気】京都　北部
        4.【天気】京都　北部　週間
        5.【天気】京都　週間
        */
        let serchWords = msg.content.replace(keyWeather, '').replace(/　/g, ' ').split(' ');
        let isWeekly = false;
        let isDetail = false;
        let prefName = '';
        let regionName = '';
        let regionNo = 0;
        let weather = '';
        let weatherDetail = '';
        let max = 0;
        let min = 0;
        let rainyFallChances = [];
        let weatherEmbed = new MessageEmbed();
        let weeklyDates = getWeeklyDate(); //
        let prefNo = 0;

        if (serchWords[0] === '') {
            prefName = '東京';
        } else {
            prefName = serchWords[0];
        }

        if (serchWords.some(e => e === '週間')) isWeekly = true;
        if (serchWords.length == 3) {
            regionName = serchWords[1];
            isDetail = true;
        }
        if (serchWords.length == 2 && !isWeekly) {
            regionName = serchWords[1];
            isDetail = true;
        }

        //都道府県一覧に無い場所の場合は東京の天気
        if (!prefRegions.some((p) => p.pref.startsWith(prefName))) {
            prefName = '東京';
        }
        prefName = prefRegions.find((p) => p.pref.startsWith(prefName)).pref;
        prefNo = prefRegions.find(p => p.pref === prefName).no;
        //詳細をが指定されていない場合は、県庁所在地がある地方
        if (isDetail && prefRegions[prefNo].region.find(e => e.startsWith(regionName))) {
            regionNo = prefRegions[prefNo].region.indexOf(prefRegions[prefNo].region.find(e => e.startsWith(regionName)));
        } else {
            regionNo = prefRegions[prefNo].capital;
            regionName = prefRegions[prefNo].region[regionNo];
        }
        //URLを取得
        let url = getWeatherURL(prefName);

        //XMLがあるサイトにリクエストを送信。

        request(url, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                parseString(body, (err, result) => {
                    weatherEmbed.setColor('#4169e1');
                    weatherEmbed.setTitle(prefName + ' ' + regionName);

                    if (isWeekly) {
                        //ウィークリーの場合
                        weatherEmbed = getWeeklyEmbed(prefNo, regionNo, result);
                        msg.reply({ embeds: [weatherEmbed] })
                            .then(rep => {
                                if (weatherEmbed.title !== 'あかん') {
                                    for (let i = 0; i < 7; i++) rep.react(icons123[i]);
                                    for (let i = 0; i < (prefRegions[prefNo].region.length > 12 ? 12 : prefRegions[prefNo].region.length); i++) rep.react(iconsABC[i]);
                                }
                            })
                            .catch(err => {
                                console.log(err);
                            })

                    } else {
                        //デイリーの場合

                        //天気情報の更新が午前6時ごろのため、19時以降と次の日の6時までは、1日後の天気を表示
                        if (date1.getHours() <= 6 || 19 < date1.getHours()) weatherEmbed = getDailyEmbed(prefNo, regionNo, result, 1);
                        else weatherEmbed = getDailyEmbed(prefNo, regionNo, result);

                        msg.reply({ embeds: [weatherEmbed] })
                            .then(rep => {
                                //botの返信にリアクションを付けて、そのリアクションが反応された時に適切な処理
                                rep.react('🇼');
                                // for (let i = 0; i < prefRegions[prefNo].region.length; i++) rep.react(iconsABC[i]);
                                for (let i = 0; i < (prefRegions[prefNo].region.length); i++) rep.react(iconsABC[i]);
                            })
                            .catch(err => {
                                console.log(err);
                            })
                    }
                });
            } else {
                console.log(error + " : " + response);
            }

        });
    }


    if (msg.embeds[0] && msg.embeds[0].description && msg.embeds[0].description.slice(-2) === '天気') {
        let waitingIcons = [];
        let regions = [];
        let prefName = '';
        let regionName = '';
        let prefNo = 0;
        let regionNo = 0;

        [prefName, regionName] = msg.embeds[0].title.split(' ');
        prefNo = prefRegions.find(p => p.pref === prefName).no;
        regionNo = prefRegions[prefNo].region.indexOf(regionName);
        let url = getWeatherURL(prefName);

        request(url, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                parseString(body, (err, result) => {


                    const collector = msg.createReactionCollector({ time: 5 * 60 * 1000 });
                    collector.on('collect', (reaction, user) => {
                        //リアクションが付いた場合の処理

                        //フィールドの数でデイリーかウィークリーかを判別
                        if (msg.embeds[0].fields.length === 5) {
                            //デイリーの場合
                            //デイリーからウィークリーへ変更のリアクション
                            if (reaction.emoji.name === '🇼' && !user.bot) {
                                let weatherEmbed2 = getWeeklyEmbed(prefNo, regionNo, result);
                                msg.reply({ embeds: [weatherEmbed2] })
                                    .then(rep => {
                                        if (weatherEmbed2.title !== 'あかん') {
                                            for (let i = 0; i < 7; i++) rep.react(icons123[i]);
                                            for (let i = 0; i < (prefRegions[prefNo].region.length > 12 ? 12 : prefRegions[prefNo].region.length); i++) rep.react(iconsABC[i]);
                                        }
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })
                            }
                            //地域変更のリアクション
                            if (iconsABC.slice(0, msg.embeds[0].fields.find(e => e.name === 'その他').value.split('\n').length).includes(reaction.emoji.name) && !user.bot) {
                                let newRegionNo = iconsABC.slice(0, msg.embeds[0].fields.find(e => e.name === 'その他').value.split('\n').length).indexOf(reaction.emoji.name);
                                let weatherEmbed2 = getDailyEmbed(prefNo, newRegionNo, result);

                                msg.reply({ embeds: [weatherEmbed2] })
                                    .then(rep => {
                                        rep.react('🇼');
                                        // for (let i = 0; i < prefRegions[prefNo].region.length; i++) rep.react(iconsABC[i]);
                                        for (let i = 0; i < (prefRegions[prefNo].region.length); i++) rep.react(iconsABC[i]);
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })
                            }
                        } else {
                            //ウィークリーの場合
                            //ウィークリーからデイリーへの変更のリアクション（日付を指定）
                            if (icons123.slice(0, 7).includes(reaction.emoji.name) && !user.bot) {
                                let offset = icons123.slice(0, 7).indexOf(reaction.emoji.name);
                                let weatherEmbed2 = getDailyEmbed(prefNo, regionNo, result, offset);
                                msg.reply({ embeds: [weatherEmbed2] })
                                    .then(rep => {
                                        rep.react('🇼');
                                        // for (let i = 0; i < prefRegions[prefNo].region.length; i++) rep.react(iconsABC[i]);
                                        for (let i = 0; i < (prefRegions[prefNo].region.length); i++) rep.react(iconsABC[i]);
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })
                            }

                            //地域変更のリアクション
                            if (iconsABC.slice(0, msg.embeds[0].fields.find(e => e.name === 'その他').value.split('\n').length).includes(reaction.emoji.name) && !user.bot) {
                                let newRegionNo = iconsABC.slice(0, msg.embeds[0].fields.find(e => e.name === 'その他').value.split('\n').length).indexOf(reaction.emoji.name);
                                let weatherEmbed2 = getWeeklyEmbed(prefNo, newRegionNo, result);
                                msg.reply({ embeds: [weatherEmbed2] })
                                    .then(rep => {
                                        if (weatherEmbed2.title !== 'あかん') {
                                            for (let i = 0; i < 7; i++) rep.react(icons123[i]);
                                            for (let i = 0; i < (prefRegions[prefNo].region.length > 12 ? 12 : prefRegions[prefNo].region.length); i++) rep.react(iconsABC[i]);
                                        }
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })
                            }

                        }
                    });
                });
            } else {
                console.log(error + " : " + response);
            }

        });
    }

    if (msg.content.includes('【ファントム】')) {
        msg.reply('ファントムさん4周年おめでとう！！\nVtuberがんばってくださいころ！！！');
    }

    //スプラトゥーン武器検索機能
    if (msg.content.startsWith(keySplatoonWeapon)) {
        let key = msg.content.replace('　', ' ').split(' ')[1];
        spSearchM(msg, key);
    }
    //スプラトゥーンサブ検索機能
    if (msg.content.startsWith(keySplatoonSub)) {
        let key = msg.content.replace('　', ' ').split(' ')[1];
        spSearchS(msg, key);
    }
    //スプラトゥーンスペシャル検索機能
    if (msg.content.startsWith(keySplatoonSpecial)) {
        let key = msg.content.replace('　', ' ').split(' ')[1];
        spSearchP(msg, key);
    }
    //スプラトゥーンあいまい検索機能
    if (msg.content.replace('　', ' ').split(' ')[0] == keySplatoon) {
        let key = msg.content.replace('　', ' ').split(' ')[1];
        let isSearchFor = searchFor(key);
        console.log(`main[${isSearchFor.main}] sub[${isSearchFor.sub}] special[${isSearchFor.special}]`);
        if (isSearchFor.main) spSearchM(msg, key);
        if (isSearchFor.sub) spSearchS(msg, key);
        if (isSearchFor.special) spSearchP(msg, key);
        if (isSearchFor.main && isSearchFor.sub && isSearchFor.special) msg.reply({ embeds: [getNoMatchesEmbed(key)] });
    }


    //クイズ機能
    if (msg.content.startsWith(keyQuiz)) {
        let quizEmbed = new MessageEmbed();
        quizEmbed.setTitle('クイズ');
        quizEmbed.setDescription('色々なクイズが遊べます');
        quizEmbed.setColor('#8a2be2');

        quizEmbed.addField(name = '4️⃣' + '4択クイズ', value = '普通の4択クイズです。\n難易度はバラバラ。', inline = false);
        // quizEmbed.addField(name = '🀄' + '待ち当てクイズ(ノーマル)', value = 'テンパイした牌姿が出てくるので、その待ちを当てるクイズです。\n超初心者向け。', inline = false);
        // quizEmbed.addField(name = '待ち当てクイズ', value = 'テンパイした牌姿が出てくるので、その待ちを当てるクイズです。\n超初心者向け。', inline = false);
        quizEmbed.addField(name = '🎍' + 'バンブー麻雀待ち当てクイズ', value = 'テンパイしている索子のみの配牌が出てくるので、その待ちを答えてください。', inline = false);
        quizEmbed.addField(name = '🀄' + '1シャンテン何切る問題', value = '受け入れ枚数が最も多くなるように牌を切ってください', inline = false);

        msg.reply({ embeds: [quizEmbed] })
            .then((rep) => {
                rep.react('4️⃣');

                rep.react('🎍');
                rep.react('🀄');

                //リアクション検知
                const collector = rep.createReactionCollector({ time: 5 * 60 * 1000 });
                collector.on('collect', (reaction, user) => {

                    if (reaction.emoji.name == '4️⃣' && !user.bot) {
                        let quiz = new Quiz();
                        quizNextQuestion(msg, quiz);
                    }

                    // if (reaction.emoji.name == '🀄' && !user.bot) {
                    //     console.log('まーじゃんクイズ');
                    // }

                    if (reaction.emoji.name == '🎍' && !user.bot) {
                        quizNextBamboo(msg);
                    }

                    if (reaction.emoji.name == '🀄' && !user.bot) {
                        quizNext1shanten(msg);
                    }

                });

            })
            .catch(() => {

            })


    }



    if (msg.content.startsWith(keyQuizReset)) {
        let quiz = new Quiz();
        quiz.resetQuestions();
        quiz.endQuiz();
        msg.reply('クイズの出題カウントをリセットしました。');
    }

    if (msg.content.startsWith(keyQuizRanking)) {
        let quiz = new Quiz();
        msg.reply({ embeds: [quiz.getRankingEmbed()] })
            .then(rep => {
                quiz.endQuiz();
            })
            .catch(err => {
                console.log(err);
            })
    }

    if (msg.content.startsWith(keyTenhou)) {
        try {
            getTenhouEmbed()
                .then(tenhouEmbed => {
                    msg.reply(tenhouEmbed);
                    tenhouTimer = new Date();
                })
                .catch(e => {
                    msg.react('✋');
                })
        } catch (e) {
            console.log('天和チャレンジエラー');
            msg.react('✋');
        }
    }

    if (msg.content.startsWith(keyDoubeRiichi)) {
        try {
            getDoubleRiichiEmbed()
                .then(doubleRiichiEmbed => {
                    msg.reply(doubleRiichiEmbed);
                })
                .catch(e => {
                    msg.react('✋');
                })
        } catch (e) {
            console.log('ダブリーチャレンジエラー');
            msg.react('✋');
        }
    }

    if (msg.content.startsWith(keyQuizBambooMachiate)) {
        try {
            quizNextBamboo(msg);
        } catch (e) {
            consol.log(e);
        }
    }


    if (msg.content.startsWith(keyQuiz1shanten)) {
        try {
            quizNext1shanten(msg);
        } catch (e) {
            console.log(e);
        }
    }
    //getDoubleRiichiEmbed

    if (msg.content.startsWith(keySingleGacha)) {
        getGachaMessage(msg.author.tag.split('#')[0], 1)
            .then(message => {
                msg.reply(message);
            })
    }

    if (msg.content.startsWith(key10renGacha)) {
        getGachaMessage(msg.author.tag.split('#')[0], 10)
            .then(message => {
                msg.reply(message);
            })
    }

    if (msg.content.startsWith('【武器抽選】')) {
        let gearUsers = [];
        msg.reply('リアクションしてね')
            .then(rep => {
                rep.react('✋');
                rep.react('☑️');
                const collectorSP = rep.createReactionCollector({ time: 30 * 60 * 1000 });
                collectorSP.on('collect', (reactionSP, userSP) => {

                    if (reactionSP.emoji.name == '✋' && !userSP.bot) {
                        gearUsers.push((userSP.tag.split('#')[0] + '　　　　　　　　　　　　').slice(0, 10));
                    }



                    if (reactionSP.emoji.name == '☑️' && !userSP.bot) {
                        let bukis = [];
                        gearUsers.forEach(user => {
                            bukis.push(weapons[getRandomInt(weapons.length) - 1]);
                        });
                        let output = [];
                        for (let i = 0; i < gearUsers.length; i++) {
                            output.push(`${gearUsers[i]} : 【${bukis[i]}】`);
                        }

                        rep.reply(output.join('\n'));
                    }


                });

            })

    }

    if (msg.content.startsWith(keyDishGacha)) {
        let searchWord = msg.content.replace(keyDishGacha, '').replace(/s+/g, '');
        if (searchWord == '') searchWord = 'default';

        getDishEmbed(searchWord)
            .then(embed => {
                msg.reply({ embeds: [embed] });
            });
    }


    //忘年祭用スプラトゥーンフェスのタグ。
    //運営のメッセージしか反応しない。
    const themas = [{
        'A': 'リアル麻雀',
        'B': 'ネット麻雀'
    }, {
        'A': '犬',
        'B': '猫'
    }, {
        'A': '文系',
        'B': '理系'
    }];


    if (msg.content.startsWith(keyFesSplatoon) && isFromUnei(msg.author)) {
        let thema = themas[(parseInt(msg.content.replace(keyFesSplatoon, '').replace('１', '1').replace('２', '2').replace('３', '3').replace(/\s/g, ''), 10) - 1) % themas.length];
        let users = {
            'A': [],
            'B': [],
            'redA': [],
            'redB': []
        };
        msg.reply(getFesVoteEmbed(thema, users))
            // msg.reply('test')
            .then(rep => {
                rep.react(iconsABC[0]);
                rep.react(iconsABC[1]);
                rep.react(iconsRedAB[0]);
                rep.react(iconsRedAB[1]);
                // rep.react('❌');
                rep.react('☑️');

                const collector = rep.createReactionCollector({ time: 5 * 60 * 1000 });
                collector.on('collect', (reaction, user) => {

                    //リアクションがあったグループにその人の名前を追加。他のグループに既に追加されている場合はそれを削除。
                    if (reaction.emoji.name == iconsABC[0] && !user.bot) {
                        users['A'] = users['A'].includes(user.tag) ? users['A'].slice(0, users['A'].indexOf(user.tag)).concat(users['A'].slice(users['A'].indexOf(user.tag) + 1)) : users['A']
                        users['B'] = users['B'].includes(user.tag) ? users['B'].slice(0, users['B'].indexOf(user.tag)).concat(users['B'].slice(users['B'].indexOf(user.tag) + 1)) : users['B']
                        users['redA'] = users['redA'].includes(user.tag) ? users['redA'].slice(0, users['redA'].indexOf(user.tag)).concat(users['redA'].slice(users['redA'].indexOf(user.tag) + 1)) : users['redA']
                        users['redB'] = users['redB'].includes(user.tag) ? users['redB'].slice(0, users['redB'].indexOf(user.tag)).concat(users['redB'].slice(users['redB'].indexOf(user.tag) + 1)) : users['redB']
                        users['A'].push(user.tag);
                        // console.log(users);
                        rep.edit(getFesVoteEmbed(thema, users));
                    }
                    if (reaction.emoji.name == iconsABC[1] && !user.bot) {
                        users['A'] = users['A'].includes(user.tag) ? users['A'].slice(0, users['A'].indexOf(user.tag)).concat(users['A'].slice(users['A'].indexOf(user.tag) + 1)) : users['A']
                        users['B'] = users['B'].includes(user.tag) ? users['B'].slice(0, users['B'].indexOf(user.tag)).concat(users['B'].slice(users['B'].indexOf(user.tag) + 1)) : users['B']
                        users['redA'] = users['redA'].includes(user.tag) ? users['redA'].slice(0, users['redA'].indexOf(user.tag)).concat(users['redA'].slice(users['redA'].indexOf(user.tag) + 1)) : users['redA']
                        users['redB'] = users['redB'].includes(user.tag) ? users['redB'].slice(0, users['redB'].indexOf(user.tag)).concat(users['redB'].slice(users['redB'].indexOf(user.tag) + 1)) : users['redB']
                        users['B'].push(user.tag);
                        // console.log(users);
                        rep.edit(getFesVoteEmbed(thema, users));
                    }
                    if (reaction.emoji.name == iconsRedAB[0] && !user.bot) {
                        users['A'] = users['A'].includes(user.tag) ? users['A'].slice(0, users['A'].indexOf(user.tag)).concat(users['A'].slice(users['A'].indexOf(user.tag) + 1)) : users['A']
                        users['B'] = users['B'].includes(user.tag) ? users['B'].slice(0, users['B'].indexOf(user.tag)).concat(users['B'].slice(users['B'].indexOf(user.tag) + 1)) : users['B']
                        users['redA'] = users['redA'].includes(user.tag) ? users['redA'].slice(0, users['redA'].indexOf(user.tag)).concat(users['redA'].slice(users['redA'].indexOf(user.tag) + 1)) : users['redA']
                        users['redB'] = users['redB'].includes(user.tag) ? users['redB'].slice(0, users['redB'].indexOf(user.tag)).concat(users['redB'].slice(users['redB'].indexOf(user.tag) + 1)) : users['redB']
                        users['redA'].push(user.tag);
                        // console.log(users);
                        rep.edit(getFesVoteEmbed(thema, users));
                    }
                    if (reaction.emoji.name == iconsRedAB[1] && !user.bot) {
                        users['A'] = users['A'].includes(user.tag) ? users['A'].slice(0, users['A'].indexOf(user.tag)).concat(users['A'].slice(users['A'].indexOf(user.tag) + 1)) : users['A']
                        users['B'] = users['B'].includes(user.tag) ? users['B'].slice(0, users['B'].indexOf(user.tag)).concat(users['B'].slice(users['B'].indexOf(user.tag) + 1)) : users['B']
                        users['redA'] = users['redA'].includes(user.tag) ? users['redA'].slice(0, users['redA'].indexOf(user.tag)).concat(users['redA'].slice(users['redA'].indexOf(user.tag) + 1)) : users['redA']
                        users['redB'] = users['redB'].includes(user.tag) ? users['redB'].slice(0, users['redB'].indexOf(user.tag)).concat(users['redB'].slice(users['redB'].indexOf(user.tag) + 1)) : users['redB']
                        users['redB'].push(user.tag);
                        // console.log(users);
                        rep.edit(getFesVoteEmbed(thema, users));
                    }
                    // if (reaction.emoji.name == '❌' && !user.bot) {
                    //     users['A'] = users['A'].includes(user.tag) ? users['A'].slice(0, users['A'].indexOf(user.tag)).concat(users['A'].slice(users['A'].indexOf(user.tag) + 1)) : users['A']
                    //     users['B'] = users['B'].includes(user.tag) ? users['B'].slice(0, users['B'].indexOf(user.tag)).concat(users['B'].slice(users['B'].indexOf(user.tag) + 1)) : users['B']
                    //     users['redA'] = users['redA'].includes(user.tag) ? users['redA'].slice(0, users['redA'].indexOf(user.tag)).concat(users['redA'].slice(users['redA'].indexOf(user.tag) + 1)) : users['redA']
                    //     users['redB'] = users['redB'].includes(user.tag) ? users['redB'].slice(0, users['redB'].indexOf(user.tag)).concat(users['redB'].slice(users['redB'].indexOf(user.tag) + 1)) : users['redB']
                    //     reactions.forEach(e=>e.users.remove(user));
                    //     reactsion.users.remove(user);
                    //     console.log(users);
                    //     rep.edit(getFesVoteEmbed(thema, users));
                    // }

                    if (reaction.emoji.name == '☑️' && !user.bot && isFromUnei(user)) {
                        //テスト用
                        // console.log(users);
                        // users['A'].push('○○○1', '○○○2', '○○○3');
                        // users['B'].push('くへらまるば＠Youtuber', '○○○6', '○○○7');
                        // users['redA'].push('○○○9', '○○○10', '○○○11');
                        // users['redB'].push('○○○13', '○○○14', '○○○15');
                        let allUsers = users['A'].concat(users['B']).concat(users['redA']).concat(users['redB']);
                        allUsers = allUsers.map(e => strLength(e));
                        let maxLength = Math.max(...allUsers);



                        users['A'] = users['A'].map(e => getEqualLengthStr(e.split('#')[0], maxLength + 4));
                        users['B'] = users['B'].map(e => getEqualLengthStr(e.split('#')[0], maxLength + 4));
                        users['redA'] = users['redA'].map(e => getEqualLengthStr(e.split('#')[0], maxLength + 4));
                        users['redB'] = users['redB'].map(e => getEqualLengthStr(e.split('#')[0], maxLength + 4));
                        console.log(users);
                        // console.log(getFesKumiwakeEmbed(thema, users)['embeds']);
                        rep.reply(getFesKumiwakeEmbed(thema, users))
                            .then(rep2 => {
                                rep2.react('🔄');
                                const collector2 = rep2.createReactionCollector({ time: 5 * 60 * 1000 });
                                collector2.on('collect', (reaction2, user2) => {
                                    if (reaction2.emoji.name == '🔄' && !user2.bot && isFromUnei(user2)) {
                                        let temp = getRandomInt(weaponsInfo.filter(e => !e['メイン'].includes('ヒーロー')).length);
                                        let weaponName = weaponsInfo.filter(e => !e['メイン'].includes('ヒーロー'))[temp]['メイン'];
                                        let weaponClass = weaponsInfo.filter(e => !e['メイン'].includes('ヒーロー'))[temp]['ジャンル'];
                                        rep2.reply('```\n' + weaponClass + '(' + weaponName + ')' + '\n```');
                                    }
                                });
                            })
                            .catch(e => {
                                console.log(e);
                            })
                    }


                });

            })
            .catch(e => {
                console.log(e);
            })
    }

    /*
    users = {
        'A':['ひとで','まるば',''],
        'B':['ATS','のーや',''],
        'C':['ゆいな','ぞんび',''],
    }
    games = [
    {
        'A':'ひとで',
        'B':'ATS',
        'C':'ゆいな',
        'Adone':false,
        'Bdone':false,
        'Cdone':false
    },
    {
        'A':'まるば',
        'B':'のーや',
        'C':'ぞんび',
        'Adone':false,
        'Bdone':false,
        'Cdone':false
    },
    ]


    teams={
    'ひとで':'A',
    'ATS':'B',
    'ゆいな':'C',
    'まるば':'A',
    'のーや':'B'
    }
    */

    if (msg.content.startsWith(keyFesMahjong) && isFromUnei(msg.author)) {
        let users = { 'A': [], 'B': [], 'C': [] };
        // let users = { 'A': [], 'B': ['ATS', 'のーや'], 'C': ['ゆいな', 'まるば'] };
        let games = [];
        let teams = {};
        msg.reply(getMahjongFesEmbed(users, games))
            .then(rep => {


                rep.react(iconsABC[0]);
                rep.react(iconsABC[1]);
                rep.react(iconsABC[2]);
                rep.react('✅');
                rep.react('⛔');

                const filter = (r, u) => [iconsABC[0], iconsABC[1], iconsABC[2], '✅', '⛔', '⚠️'].includes(r.emoji.name);
                const collector = rep.createReactionCollector({ filter, time: 210 * 60 * 1000 });
                collector.on('collect', (reaction, user) => {
                    let userName = user.tag.split('#')[0];

                    //初めてリアクションした時、usersとteamsにその名前を追加する。

                    //Aのリアクション
                    if (reaction.emoji.name == iconsABC[0] && !user.bot) {
                        if (!teams[userName]) {
                            users['A'].push(userName);
                            teams[userName] = 'A';
                            rep.edit(getMahjongFesEmbed(users, games));
                        }
                    }
                    //Bのリアクション
                    if (reaction.emoji.name == iconsABC[1] && !user.bot) {
                        if (!teams[userName]) {
                            users['B'].push(userName);
                            teams[userName] = 'B';
                            rep.edit(getMahjongFesEmbed(users, games));
                        }

                    }
                    //Cのリアクション
                    if (reaction.emoji.name == iconsABC[2] && !user.bot) {
                        if (!teams[userName]) {
                            users['C'].push(userName);
                            teams[userName] = 'C';
                            rep.edit(getMahjongFesEmbed(users, games));
                        }
                    }

                    //試合終了＋続行
                    if (reaction.emoji.name == '✅' && !user.bot) {
                        try {
                            reaction.users.remove(user);
                            if (teams[userName]) {
                                if (!users[teams[userName]].includes(userName)) users[teams[userName]].push(userName);

                                if (games.filter(e => !e[teams[userName] + 'done'] && e[teams[userName]] === getEqualLengthStr(userName, 15)).length > 0) {
                                    games.filter(e => !e[teams[userName] + 'done'] && e[teams[userName]] === getEqualLengthStr(userName, 15))[0][teams[userName] + 'done'] = true;
                                }
                            }
                        } catch (e) {
                            console.log('gamesの履歴変更エラー：' + userName);
                            console.log(e);
                        }
                        rep.edit(getMahjongFesEmbed(users, games));

                    }

                    //試合終了　次は打たない
                    if (reaction.emoji.name == '⛔' && !user.bot) {
                        try {
                            reaction.users.remove(user);
                            if (teams[userName]) {
                                if (games.filter(e => !e[teams[userName] + 'done'] && e[teams[userName]] === getEqualLengthStr(userName, 15)).length > 0) {
                                    games.filter(e => !e[teams[userName] + 'done'] && e[teams[userName]] === getEqualLengthStr(userName, 15))[0][teams[userName] + 'done'] = true;
                                }
                            }
                        } catch (e) {
                            console.log('gamesの履歴変更エラー：' + userName);
                            console.log(e);
                        }
                        rep.edit(getMahjongFesEmbed(users, games));

                    }

                    if (reaction.emoji.name == '⚠️' && !user.bot) {
                        try {
                            reaction.users.remove(user);
                        } catch (e) {
                            console.log('リアクション除去エラー（おそらくサイコロ君botに管理者権限が無い鯖での使用）');
                            console.log(e);
                        }


                        if (users['A'].includes(userName)) users['A'] = users['A'].slice(0, users['A'].indexOf(userName)).concat(users['A'].slice(users['A'].indexOf(userName) + 1));
                        if (users['B'].includes(userName)) users['B'] = users['B'].slice(0, users['B'].indexOf(userName)).concat(users['B'].slice(users['B'].indexOf(userName) + 1));
                        if (users['C'].includes(userName)) users['C'] = users['C'].slice(0, users['C'].indexOf(userName)).concat(users['C'].slice(users['C'].indexOf(userName) + 1));
                        delete teams[userName];
                    }


                    if (users['A'].length > 0 && users['B'].length > 0 && users['C'].length > 0) {
                        games.push({
                            'A': getEqualLengthStr(users['A'].shift(), 15),
                            'B': getEqualLengthStr(users['B'].shift(), 15),
                            'C': getEqualLengthStr(users['C'].shift(), 15),
                            'Adone': false,
                            'Bdone': false,
                            'Cdone': false
                        });
                        console.log(`start  A[${games[games.length-1]['A'].replace(/\s/g,'')}] B[${games[games.length-1]['B'].replace(/\s/g,'')}] C[${games[games.length-1]['C'].replace(/\s/g,'')}] `);
                        rep.edit(getMahjongFesEmbed(users, games));
                    }

                });
            })
            .catch(e => {
                console.log(e);
            })
    }

    if (msg.content.startsWith('【テスト】') && isFromUnei(msg.author)) {
        let testEmbed = new MessageEmbed();
        testEmbed.setTitle('テスト');
        testEmbed.setDescription('これはテストです。\nめっちゃテストです。');
        testEmbed.addField(name = 'テスト１', value = 'テストvsテスト\nテスト2vsテスト3', inline = false);
        testEmbed.addField(name = 'テスト１', value = 'テストvsテスト\nテスト4vsテスト5', inline = false);
        testEmbed.addField(name = 'テスト１', value = 'テストvsテスト\nテスト6vsテスト7\nテトス6vsテスト7', inline = false);
        testEmbed.addField(name = 'テスト１', value = 'テストvsテスト\nテスト8vsテスト9\nテスト10(こいつはやばいテスト）vsテスト11（えぐち版テスト）', inline = false);
        testEmbed.setFooter('この中に一つテトスがあります。');
        msg.reply({ embeds: [testEmbed] });

    }

    /*
     participants = {
     player:[{name:'ひとで',id:12345789,role:'Villager',finalVote:false},{name:'ゆいな',id:987654321,role:'Wolf',finalVote:false}],
     watcher:[{name:'まるば',id:456789231},{name:'のーや',id:654987321}]
    */
    //ワードウルフ機能
    if (msg.content.startsWith(keyWordWolf)) {
        let participants = { player: [], watcher: [] };
        // let participants = { player: [{ name: 'ひとで', id: '639094892051693594', role: 'Villager', finalVote: false }, { name: 'ゆいな', id: '639094892051693594', role: 'Villager', finalVote: false }, { name: 'まるば', id: '639094892051693594', role: 'Villager', finalVote: false }, { name: 'のーや', id: '639094892051693594', role: 'Villager', finalVote: false }], watcher: [] };
        //ワードウルフ参加用エンベッドを返信
        msg.reply(getWordWolfEmbed(participants))
            .then(rep => {
                rep.react('🐺');
                rep.react('👀');
                rep.react('☑️');
                rep.react('❌');
                rep.react('💡');


                const filter = (r, u) => ['🐺', '👀', '☑️', '❌', '💡'].includes(r.emoji.name);
                const collector = rep.createReactionCollector({ filter, time: 210 * 60 * 1000 });
                collector.on('collect', (reaction, user) => {


                    //プレイヤーに追加
                    if (reaction.emoji.name === '🐺' && !user.bot) {
                        console.log(user.id);
                        //プレイヤーに居なければその人をプレイヤーに追加
                        if (!participants.player.map(e => e.name).includes(user.tag.split('#')[0])) {
                            participants.player.push({ name: user.tag.split('#')[0], id: user.id, role: 'Villager', finalVote: false });
                        }
                        //観戦者に居れば観戦者から削除
                        if (participants.watcher.map(e => e.name).includes(user.tag.split('#')[0])) {
                            let i = participants.watcher.map(e => e.name).indexOf(user.tag.split('#')[0]);
                            participants.watcher = participants.watcher.slice(0, i).concat(participants.watcher.slice(i + 1));
                        }
                        //エンベッドを更新
                        rep.edit(getWordWolfEmbed(participants));
                        try {
                            reaction.users.remove(user);
                        } catch (e) {
                            console.log('リアクション除去エラー（おそらくサイコロ君botに管理者権限が無い鯖での使用）');
                            console.log(e);
                        }


                    }

                    //観戦者に追加
                    if (reaction.emoji.name === '👀' && !user.bot) {
                        //観戦者に居なければその人を観戦者に追加
                        if (!participants.watcher.map(e => e.name).includes(user.tag.split('#')[0])) {
                            participants.watcher.push({ name: user.tag.split('#')[0], id: user.id });
                        }
                        //プレイヤーに居ればプレイヤーから削除
                        if (participants.player.map(e => e.name).includes(user.tag.split('#')[0])) {
                            let i = participants.player.map(e => e.name).indexOf(user.tag.split('#')[0]);
                            participants.player = participants.player.slice(0, i).concat(participants.watcher.slice(i + 1));
                        }
                        //エンベッドを更新
                        rep.edit(getWordWolfEmbed(participants));
                        try {
                            reaction.users.remove(user);
                        } catch (e) {
                            console.log('リアクション除去エラー（おそらくサイコロ君botに管理者権限が無い鯖での使用）');
                            console.log(e);
                        }


                    }

                    //ワードウルフ開始
                    if (reaction.emoji.name === '☑️' && !user.bot) {
                        //プレイヤーが3人未満の場合、フッターにメッセージを表示して何もしない。
                        if (participants.player.length <= 2) {
                            rep.edit(getWordWolfEmbed(participants, alert = true));
                        } else {
                            //プレイやーが三人以上いる場合はワードウルフ開始
                            console.log('ワードウルフ開始');
                            //狼の人数は、参加者の人数を3で割った数。participantsのplayerにロールを付与。
                            let wolfNum = Math.floor(participants.player.length / 3);
                            for (let i = 0; i < wolfNum; i++) {
                                participants.player.filter(e => e.role === 'Villager')[getRandomInt(participants.player.filter(e => e.role === 'Villager').length) - 1].role = 'Wolf';
                            }
                            //全員にDMでお題を伝える
                            let messageList = getWordWolfMessageList(participants);
                            messageList.forEach(e => {
                                sendDM(e.id, e.message);
                                // console.log(`${e.name}：${e.message}`);
                            });

                            //投票用エンベッドを返信
                            replyWordWolfVoteEmbed(rep, participants);

                        }

                        try {
                            reaction.users.remove(user);
                        } catch (e) {
                            console.log('リアクション除去エラー（おそらくサイコロ君botに管理者権限が無い鯖での使用）');
                            console.log(e);
                        }


                    }

                    //
                    if (reaction.emoji.name === '❌' && !user.bot) {
                        //プレイヤーに居ればプレイヤーから削除
                        if (participants.player.map(e => e.name).includes(user.tag.split('#')[0])) {
                            let i = participants.player.map(e => e.name).indexOf(user.tag.split('#')[0]);
                            participants.player = participants.player.slice(0, i).concat(participants.watcher.slice(i + 1));
                        }
                        //観戦者に居れば観戦者から削除
                        if (participants.watcher.map(e => e.name).includes(user.tag.split('#')[0])) {
                            let i = participants.watcher.map(e => e.name).indexOf(user.tag.split('#')[0]);
                            participants.watcher = participants.watcher.slice(0, i).concat(participants.watcher.slice(i + 1));
                        }
                        //エンベッドを更新
                        rep.edit(getWordWolfEmbed(participants));
                        try {
                            reaction.users.remove(user);
                        } catch (e) {
                            console.log('リアクション除去エラー（おそらくサイコロ君botに管理者権限が無い鯖での使用）');
                            console.log(e);
                        }
                    }

                    //ルール説明
                    if (reaction.emoji.name === '💡' && !user.bot) {
                        rep.reply(getWordWolfRuleEmbed());
                    }
                })
            })
            .catch(e => {
                console.log(e);
            })
    }

    if (msg.content.startsWith(keyDM)) {
        sendDM(msg.author.id, 'よろしゅう');
        try {
            msg.delete();
        } catch (e) {
            console.log('メッセージ削除エラー（おそらくサイコロ君botに管理者権限が無い鯖での使用）');
            console.log(e);
        }

    }


    if (msg.content.startsWith(keyTimer)) {
        let time = 3 * 60
        msg.reply(getTimerEmbed(time))
            .then(rep => {
                editTimerEmbed(rep, time);
            })
    }

    /*  sendDM('639094892051693594', 'test')
          .then(rep => {
              rep.react('❌');
              const collector = rep.createReactionCollector({ time: 10 * 60 * 1000 });
              collector.on('collect', (reaction, user) => {
                  if (reaction.emoji.name === '❌' && !user.bot) {
                      rep.reply('OK');
                  }
              })
          })*/



})


// client.on('messageUpdate', (oldMsg, newMsg) => {
//     const date1 = new Date();
//     const date2 = date1.getFullYear() + "年" +
//         (date1.getMonth() + 1) + "月" +
//         date1.getDate() + "日" +
//         date1.getHours() + "時" +
//         date1.getMinutes() + "分" +
//         date1.getSeconds() + "秒";
//     writeF([date2, newMsg.guild.name, newMsg.channel.name, newMsg.author.tag, newMsg.content.replace(/\n/g, ' ')].join(','));
// });

/*
msg.reply({ embeds: [getEmbed(key)] });
.then(rep => {
        rep.react(iconsABC[0]);

        const collector = rep.createReactionCollector({ time: 5 * 60 * 1000 });
        collector.on('collect', (reaction, user) => {
            if (reaction.emoji.name===iconsABC[0] && !user.bot) {
                console.log('OK');
                resolve();
            }
        });
    })
.catch(err => {
    console.log(err);
    reject(err);
})

*/

// client.login('OTAyNDU2NDg3NTM4OTk5MzI3.YXesGQ.Gj25Jqex4UuxNjIx0SXSaazDN9o');
client.login(token);