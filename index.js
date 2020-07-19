require('dotenv').config();
const Telegraf = require('telegraf');
const api = require('covid19-api');
const Markup = require('telegraf/markup');
const COUNTRIES_LIST = require('./countries.js');

 
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply(
`Welcome ${ctx.message.from.first_name}!
Here you can find stats about COVID-19
Type name of the country and you will get all necessary information!
See the entire list of countries using the command /help
`, Markup.keyboard([
	['Poland','Ukraine'],
	])
	.resize()
	.extra()
));

bot.help((ctx) => ctx.reply(COUNTRIES_LIST));

bot.on('text', async (ctx) => {
	let data = {};
	try {
	data = await api.getReportsByCountries(ctx.message.text);
	const formatData = ` 
Country: ${data[0][0].country}
Cases: ${data[0][0].cases}
Deaths: ${data[0][0].deaths}
Recovered: ${data[0][0].recovered}
	 `;
	ctx.reply(formatData);
	} catch {
		//console.log('Error');
		ctx.reply('Wrong name! Use /help to see proper names of countries');
	}
});

bot.launch();