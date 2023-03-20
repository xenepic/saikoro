/*************************************************************************************************************
* Discord bot 「さいころ君」                                                                                      *
* 開発者：星野ひとで（https://twitter.com/hitode_mogu）                                                         *
* 概要：さいころ君は星野ひとでが個人で開発しているディスコードの多機能ボットです。                                                *
* 機能追加の要望があれば、上記TwitterのDMまでご連絡下さい。                                                           *
* またさいころ君を自分の鯖に追加したい場合も、Twitterまでご連絡下さい。                                                      *
* このソースコードは自由に使用して頂いて構いませんが、それにより生じた不具合や損害に関しては、一切の責任を負いかねますのでご了承下さい。    *
*                                                                                                           *
*                                                                                                           *
*************************************************************************************************************/

require('dotenv').config();
const { Client, Events, GatewayIntentBits, Partials } = require('discord.js');
const { DiscordClient } = require('./src/DiscordClient');

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// discordBot開始
new DiscordClient(client);
