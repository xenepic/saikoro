const { MessageEmbed } = require('discord.js');
const iconsABC = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const themes = [
    ['冬休み', '春休み'],
    ['副業', 'アルバイト'],
    ['風呂掃除', '食器洗い'],
    ['twitter', 'Line'],
    ['水族館', '動物園'],
    ['ドラえもん', 'ドラミちゃん'],
    ['ファミレス', 'カフェ'],
    ['アルバイト面接', '就活'],
    ['お年玉', '誕生日プレゼント'],
    ['ガラケー', '固定電話'],
    ['太陽', '月'],
    ['マフラー', '手袋'],
    ['エレベーター', 'エスカレーター'],
    ['コンビニ', 'スーパー'],
    ['海', 'プール'],
    ['年末', '年始'],
    ['コンタクトレンズ', 'メガネ'],
    ['セロテープ', 'ガムテープ'],
    ['東京タワー', 'スカイツリー'],
    ['コップ', 'グラス'],
    ['カブトムシ', 'クワガタ'],
    ['飛行機', '新幹線'],
    ['カレー', 'シチュー'],
    ['はさみ', 'カッター'],
    ['テニス', '卓球'],
    ['スケート', 'スキー'],
    ['りす', 'ハムスター'],
    ['ぞう', 'きりん'],
    ['タクシー', 'バス'],
    ['セミ', '鈴虫'],
    ['扇風機', 'クーラー'],
    ['ディズニーランド', 'ＵＳＪ'],
    ['浮き輪', '水中メガネ'],
    ['洗濯機', '食洗機'],
    ['ブランコ', 'シーソー'],
    ['水中メガネ', '浮き輪'],
    ['目玉焼き', 'スクランブルエッグ'],
    ['鍋料理', 'おでん'],
    ['チョコレート', 'キャラメル'],
    ['コーヒー', '紅茶'],
    ['日本酒', 'ウィスキー'],
    ['にんにく', 'しょうが'],
    ['白菜', 'キャベツ'],
    ['ゆで卵', '生卵'],
    ['かき氷', 'アイスクリーム'],
    ['スイカ', 'メロン'],
    ['お茶漬け', 'ふりかけ'],
    ['塩', '砂糖'],
    ['りんご', 'なし'],
    ['うどん', 'そうめん'],
    ['Google', 'Yahoo'],
    ['マクドナルド', 'モスバーガー'],
    ['ロッテリア', 'モスバーガー'],
    ['ガスト', 'サイゼリア'],
    ['吉野家', 'すきや'],
    ['docomo', 'softbank'],
    ['スタバ', 'ドトール'],
    ['セブンイレブン', 'ファミマ'],
    ['ローソン', 'ファミマ'],
    ['楽天市場', 'amazon'],
    ['任天堂', 'ソニー'],
    ['キリン', 'アサヒ'],
    ['TOYOTA', 'NISSAN'],
    ['ポッキー', 'トッポ'],
    ['アンパン', 'あんまん'],
    ['幼稚園', '保育園'],
    ['ボールペン', 'シャープペン'],
    ['ファミチキ', 'からあげくん'],
    ['青', '水色'],
    ['ポイントカード', 'クレジットカード'],
    ['色鉛筆', 'クレヨン'],
    ['不倫', '浮気'],
    ['トマトパスタ', 'クリームパスタ'],
    ['餃子', 'シューマイ'],
    ['友達', '親友'],
    ['パチンコ', 'スロット'],
    ['石鹸', 'ハンドソープ'],
    ['レモン', 'グレープフルーツ'],
    ['スキー', 'スノボー'],
    ['コカコーラ', 'ペプシ'],
    ['野球', 'ソフトボール'],
    ['肉まん', 'ピザまん'],
    ['ポカリスエット', 'アクエリアス'],
    ['片思い', '失恋'],
    ['ファーストキス', '初デート'],
    ['LINEで告白', '手紙で告白'],
    ['束縛系', 'ストーカー'],
    ['筋肉フェチ', '手フェチ'],
    ['声フェチ', '匂いフェチ'],
    ['高収入の異性', '高身長の異性'],
    ['誠実な恋人', '優しい恋人'],
    ['好みの顔の異性', '好みの体系の異性'],
    ['金銭感覚が合う', '趣味が合う'],
    ['笑顔が素敵な異性', 'ユーモアがある異性'],
    ['肉食男子', '草食男子'],
    ['水族館デート', '動物園デート'],
    ['カラオケデート', '映画館デート'],
    ['花畑デート', '牧場デート'],
    ['浮気', '性格の不一致'],
    ['結婚', '同棲'],
    ['約束を破る恋人', '悪口を言う恋人'],
    ['煙草をたくさん吸う異性', 'お酒をたくさん飲む異性'],
    ['浪費癖がある恋人', 'スマホ中毒の恋人'],
    ['社内恋愛', '校内恋愛'],
    ['話しが合う異性', 'ユーモアがある異性'],
    ['制服デート', '浴衣デート'],
    ['誕生日プレゼント', 'サプライズプレゼント'],
    ['かわいい系', 'キレイ系'],
    ['ツンデレ', 'ヤンデレ'],
    ['母乳', '牛乳'],
    ['パンツ', '財布'],
    ['初めてのおつかい', '初めてのキス'],
    ['盆踊り', 'ラジオ体操'],
    ['痴漢', '鬼ごっこ'],
    ['トランクス', 'ブリーフ'],
    ['おなら', 'しゃっくり'],
    ['1億円貰ったら', '10万円貰ったら'],
    ['絵本', 'エロ本'],
    ['同人誌', 'コミケ'],
    ['野球', '卓球'],
    ['鮭', '鯛'],
    ['コンタクト', 'サングラス'],
    ['仏像', '銅像'],
    ['泥棒', 'スパイ'],
    ['いたずら', '喧嘩'],
    ['日本語', '漢字'],
    ['漬物', '白菜'],
    ['シャンプ', '洗剤'],
    ['しおり', 'アルバム'],
    ['ヘリコプタ', '軽トラック'],
    ['市役所', '郵便局'],
    ['ヨット', 'パラシュ'],
    ['下水道', 'トイレ'],
    ['懐中電灯', '豆電球'],
    ['一発ギャグ', '一発屋'],
    ['100万円', '1億円'],
    ['メイド', 'コスプレ'],
    ['サボテン', 'サソリ'],
    ['太陽', 'ハゲ頭'],
    ['4', '6'],
    ['2000円札', '小判'],
    ['炎', '赤'],
    ['迷惑メール', 'チラシ'],
    ['耳かき', 'すきバサミ'],
    ['好きな人', 'アイドル'],
    ['告白', '暴露'],
    ['プロポーズ', 'サプライズ'],
    ['恋愛', '憧れ'],
    ['オフ会', '出会い'],
    ['サボり', '休み'],
    ['試験', 'オーディション'],
    ['一人暮らし', 'ひとりぼっち'],
    ['アルバイト', 'おつかい'],
    ['おつまみ', 'おかず'],
    ['素人', '未成年'],
    ['初心者', '未成年'],
    ['英語', '勉強'],
    ['禁酒', 'ダイエット'],
    ['性欲', 'ストレス'],
    ['エロ漫画', 'Web漫画'],
    ['Tバック', 'まわし'],
    ['メイド喫茶', 'ガールズバー'],
    ['趣味', 'オ○ニー'],
    ['緊急地震速報', 'Jアラート'],
    ['刑務所', '防空壕'],
    ['哲学者', '博士'],
    ['参考書', '百科事典'],
    ['戦争', '暴動'],
    ['ガスマスク', '兜']
];



/**************************************************************************************
 * ワードウルフ参加受付エンベッドを返す。参加者・観戦者はリアルタイムで更新するようにする。
 *
 * @param participants 
 *   participants = {
 *       player:[{name:'ひとで',id:12345789,role:'Villager',finalVote:false},{name:'ゆいな',id:987654321,role:'Wolf',finalVote:false}],
 *       watcher:[{name:'まるば',id:456789231},{name:'のーや',id:654987321}]
 *   } 
 ***************************************************************************************/
function getWordWolfEmbed(participants, alert = false) {
    let wordWolfEmbed = new MessageEmbed();
    wordWolfEmbed.setTitle('ワードウルフ');
    wordWolfEmbed.setDescription('リアクションで参加受付\nお題は個別メッセージに送信されます\n🐺：参加\n👀：観戦\n☑️：開始\n❌：参加キャンセル\n💡：ルール説明\n\n');
    wordWolfEmbed.addField(name = '参加者', value = participants.player.length === 0 ? 'なし' : participants.player.map(e => e.name).join('、'), inline = false);
    wordWolfEmbed.addField(name = '観戦者', value = participants.watcher.length === 0 ? 'なし' : participants.watcher.map(e => e.name).join('、'), inline = false);
    wordWolfEmbed.setColor('#696969');
    if (alert) wordWolfEmbed.setFooter('※開始にはプレイヤーが三人以上必要です');
    return { embeds: [wordWolfEmbed] };
}


/**
 * @param participants 内容は上と同じ
 messageList =  [
 {name:'ひとで',id:12345789,message:'あなたのお題は「A」です'},
 {name:'ゆいな',id:12345789,message:'あなたのお題は「B」です'},
 {name:'まるば',id:12345789,message:'村人はひとで、のーやでお題は「A」、人狼はゆいなでお題は「B」'}]
 *
 */

function getWordWolfMessageList(participants) {
    let messageList = [];
    let theme = themes[getRandomInt(themes.length)];
    // let wolf = getRandomInt(participants.player.length);

    //お題をシャッフル
    if (getRandomInt(1))[theme[0], theme[1]] = [theme[1], theme[0]];

    //プレイヤーのメッセージを追加
    participants.player.forEach((e, i) => {
        if (e.role === 'Wolf') messageList.push({ name: e.name, id: e.id, message: `あなたのお題は「${theme[1]}」です。` });
        else messageList.push({ name: e.name, id: e.id, message: `あなたのお題は「${theme[0]}」です。` });
    });

    //観戦者のメッセージを追加
    participants.watcher.forEach(e => {
        messageList.push({ name: e.name, id: e.id, message: `村人は${participants.player.filter(e=>e.role==='Villager').map(e=>e.name).join('、')}でお題は「${theme[0]}」、\n人狼は${participants.player.filter(e=>e.role==='Wolf').map(e=>e.name).join('、')}でお題は「${theme[1]}」です` });
    });
    return messageList;
}

/**************************************************************************************
 * 投票用エンベッドを返す関数。
 *
 * @param participants 
 *   participants = {
 *       player:[{name:'ひとで',id:12345789},{name:'ゆいな',id:987654321}],
 *       watcher:[{name:'まるば',id:456789231},{name:'のーや',id:654987321}]
 *   } 
 ***************************************************************************************/
function getWordWolfVoteEmbed(participants) {
    let wordWolfVoteEmbed = new MessageEmbed();
    let isFinalVote = false;
    if (participants.player.filter(e => e.finalVote === true).length !== 0) isFinalVote = true;
    wordWolfVoteEmbed.setTitle(isFinalVote ? '決選投票' : '投票');
    wordWolfVoteEmbed.setDescription('人狼だと思う人に投票して下さい');
    wordWolfVoteEmbed.setColor('#696969');
    let text = [];
    //決選投票の場合はfinalVote==trueの人のみ
    (isFinalVote ? participants.player.filter(e => e.finalVote === true) : participants.player).forEach((p, i) => {
        text.push(`${iconsABC[i]}：${p.name}`);
    });
    wordWolfVoteEmbed.addField(name = '選択肢', value = text.join('\n'), inline = false);
    wordWolfVoteEmbed.setFooter('参加者全員の投票が終わると、自動で結果が表示されます。');
    return { embeds: [wordWolfVoteEmbed] };
}


/**


*/

/**************************************************************************************
 * 投票結果エンベッドを返す関数。
 *
 * @param participants 
 *   participants = {
 *       player:[{name:'ひとで',id:12345789},{name:'ゆいな',id:987654321}],
 *       watcher:[{name:'まるば',id:456789231},{name:'のーや',id:654987321}]
 *   } 
 * @param vote 投票内容
 *   vote = [
 *       {name:'ひとで',voted:['ゆいな','まるば','のーや'], killed:true},
 *       {name:'まるば',voted:[], killed:false},
 *       {name:'のーや',voted:[], killed:false},
 *       {name:'ゆいな',voted:['ひとで'], killed:false},
 *   ]
 * @param state 投票結果に応じたゲーム状況
 *      continue:継続
 *      winVillager:市民側勝利
 *      winWolf:人狼側勝利
 *
 *
 *
 ***************************************************************************************/
function getWordWolfVoteResultEmbed(participants, vote, state = 'continue', detail = false) {
    let wordWolfVoteResultEmbed = new MessageEmbed();
    wordWolfVoteResultEmbed.setTitle('投票結果');
    // wordWolfVoteResultEmbed.setDescription('');
    wordWolfVoteResultEmbed.setColor('#696969');
    let text = [];
    //voteを降順にソート
    vote.sort((a, b) => b.voted.length - a.voted.length);
    vote.forEach(e => {
        text.push(`${e.name}：${e.voted.length}票${detail ? `(${ e.voted.join('、') })` : ''}`);
    });
    wordWolfVoteResultEmbed.addField(name = '投票結果は以下のとおりです', value = text.join('\n'), inline = false);

    if (vote.filter(e => e.killed === true).length === 0) {
        //決選投票の場合
        wordWolfVoteResultEmbed.addField(name = '同数のため、決選投票を行います。', value = '\u200B', inline = false);
    } else {
        wordWolfVoteResultEmbed.addField(name = `投票の結果、${vote.find(e=>e.killed===true).name}さんが処刑されました。`, value = '\u200B', inline = false);
        if (state === 'continue') {
            wordWolfVoteResultEmbed.addField(name = '継続', value = '📄：詳細表示\n📮：次の投票', inline = false);
        } else if (state === 'winVillager') {
            wordWolfVoteResultEmbed.addField(name = '市民の勝利！', value = '📄：詳細表示', inline = false);
        } else if (state === 'winWolf') {
            wordWolfVoteResultEmbed.addField(name = '人狼の勝利！', value = '📄：詳細表示', inline = false);
        }
        let killed
    }

    return { embeds: [wordWolfVoteResultEmbed] };
}


function getWordWolfRuleEmbed() {
    let wordWolfRuleEmbed = new MessageEmbed();
    let gaiyou = [
        'ワードウルフとは、みんなで「あるお題」について話し合う中で、',
        'みんなとは違う少数派のお題について話す人（＝人狼）を探し出すゲームです。'
    ];
    let susumekata = [
        '①まず最初に、参加者全員にとあるお題が配られます。',
        'この時点で自分が市民なのか人狼なのかは分かりません。',
        '',
        '②次に全員でフリートークの時間があります。',
        'ここで話し合ったり質問したりして、少数派のお題をもらった人を探し出します。',
        '',
        '③いい頃合いになったら、投票タイムです。',
        '話し合いの中で怪しいと感じた人に投票して下さい。',
        '',
        '④投票で最も多くの票を集めた人が処刑されます。',
        '最多票者が複数居た場合は決選投票を行い、それでも同数の場合はランダムで処刑されます。',
        '',
        '⑤人狼を全て処刑できれば市民の勝利、',
        '逆に市民を全て処刑できれば人狼の勝利です。'
    ];
    let tokushurule = [
        '人狼は、人狼側が全て処刑されても、市民側のお題を当てれば逆転勝利にするというルールもあります。',
        '開始前に特殊ルールを採用するかは決めておくと良いでしょう。'
    ]
    wordWolfRuleEmbed.setColor('#696969');
    wordWolfRuleEmbed.setTitle('ルール説明');
    wordWolfRuleEmbed.setDescription('ワードウルフのルールを簡単に説明します。');
    wordWolfRuleEmbed.addField(name = '概要', value = gaiyou.join('\n'), inline = false);
    wordWolfRuleEmbed.addField(name = '進め方', value = susumekata.join('\n'), inline = false);
    wordWolfRuleEmbed.addField(name = '特殊ルール', value = tokushurule.join('\n'), inline = false);

    return { embeds: [wordWolfRuleEmbed] };
}


module.exports = { getWordWolfEmbed, getWordWolfMessageList, getWordWolfVoteEmbed, getWordWolfVoteResultEmbed, getWordWolfRuleEmbed };