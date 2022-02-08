const mysql = require('mysql2');
const knexLib = require('knex');
const icons = {
    'star': '[🌟]',
    'face': '[🤪]',
    'fire': '[🔥]',
    'dango': '[🍡]',
    'crab': '[🦀]',
    'money': '[💰]',
    'skull': '[💀]'
}

// knexで生成するDB情報保存用ファイルのインポート
const knexfile = require('./knexfile')['development'];
const knex = knexLib({
    client: knexfile.client,
    connection: knexfile.connection
});
/*const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'meishinn',
    database: 'test'
});*/
// connection.connect((err) => {
//     if (err) {
//         console.log('error connecting: ' + err.stack);
//         return
//     }
//     console.log('success');
// });


function getRandomInt(max) {
    return Math.ceil(Math.random() * max);
}

function getRandomIcons() {
    let temp = Math.random() * 100;
    if (temp <= 50) return 'star';
    if (temp <= 70) return 'face';
    if (temp <= 90) return 'fire';
    if (temp <= 95) return 'dango';
    if (temp <= 99) return 'crab';
    if (temp <= 99.9) return 'money';
    if (temp <= 100) return 'skull';
}

async function getSingleGacha(userName) {
    let gacha = [getRandomIcons(), getRandomIcons(), getRandomIcons()];
    let changeSP = 0;
    let oldSP;
    let res = 'ハズレ';
    await knex('gacha')
        .select('sp')
        .where('name', userName)
        .then(result => {
            oldSP = result[0].sp;
        })
        .catch(err => {
            console.log(err);
        });

    if (gacha[0] === gacha[1] && gacha[1] === gacha[2]) {
        changeSP = getSP(gacha[0]);
        res = '当たり'
    }
    changeSP += gacha.filter(e => e === 'money').length * 50
    if (gacha.includes('skull')) changeSP += oldSP * (-1) / 2;

    // console.log(`oldSP=${oldSP}, changeSP=${changeSP}`);
    await knex('gacha')
        .update('sp', oldSP + changeSP - 10)
        .where('name', userName)
    gacha = gacha.map(e => icons[e]);
    // console.log('update');
    return [gacha, `${res}(${changeSP})`];
}

function getSP(name) {
    if (name === 'star') return 100;
    if (name === 'face') return 200;
    if (name === 'fire') return -200;
    if (name === 'dango') return getRandomInt(10) * 300;
    if (name === 'crab') return getRandomInt(10) * 1000;
    if (name === 'money') return 10000;
    if (name === 'skull') return -10000;

}




async function getGachaMessage(userName, count) {
    let newSP;
    let name;
    let message = [];
    let result;
    console.log(`${userName} ${count}回ガチャ`);
    // let message = '';

    //初めてガチャする人はデータベースにデータを追加
    await knex('gacha')
        .select('*')
        .where('name', userName)
        .then(res => {
            result = res;
        })


    if (result.length === 0) {
        await knex('gacha').insert({
            name: userName,
            sp: 100,
            star: 0,
            face: 0,
            fire: 0,
            dango: 0,
            crab: 0
        });
    } else if (result[0].sp < 10 * count) {
        return `さいころポイントが足りないよ！(必要sp:${10*count})`;
    }

    for (let i = 0; i < count; i++) {
        let [gacha, res] = await getSingleGacha(userName);
        message.push(`${gacha.join('')}    ${res}`);
    }



    await knex('gacha')
        .select('*')
        .where('name', userName)
        .then(result => {
            name = result[0].name;
            newSP = result[0].sp;
        })
        .catch(err => {
            console.log(err);
        });

    message.push(`\n残りspは${newSP}です。`);
    // console.log(`message[${message}]`);
    return message.join('\n');

    // console.log(message);

}

async function addSP(userName, addPoint) {
    let oldSP;
    let newSP;
    let result;

    //初めてガチャする人はデータベースにデータを追加
    await knex('gacha')
        .select('*')
        .where('name', userName)
        .then(res => {
            result = res;
        })
        .catch(err=>{
            console.log(err);
        })


    if (result.length === 0) {
        await knex('gacha').insert({
            name: userName,
            sp: 100,
            star: 0,
            face: 0,
            fire: 0,
            dango: 0,
            crab: 0
        });
    }


    await knex('gacha')
        .select('sp')
        .where('name', userName)
        .then(res => {
            oldSP = res[0].sp;
        })
        .catch(err=>{
            console.log(err);
        });

    await knex('gacha')
        .update('sp', oldSP + addPoint)
        .where('name', userName)
        .catch(err=>{
            console.log(err);
        });

    return oldSP + addPoint;
}

// getGachaMessage('test');

// main();


// knex.destroy();

module.exports = { getGachaMessage, addSP };