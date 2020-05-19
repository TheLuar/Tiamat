'use strict'


if (!process.env.TOKEN) process.env.TOKEN = require('dotenv').config().parsed.TOKEN


const config = require('./config.json')

const Discord = require('discord.js')

const CMDManager = require('./CMDManager')

const client = new Discord.Client()


client.on('ready', () =>
{
	client.user.setPresence({
		activity: {
			type: 'WATCHING',
			name: 'Peaky Blinders',
			url: 'https://discordapp.com/',
		},
		status: 'online'
	});
	
	client.user.setUsername('Tiamat');

	CMDManager.listen(config.PREFIX, './commands/')

	console.log(`Logged in as ${ client.user.tag }!`)
})

client.on('message', msg =>
{
	if (msg.author.bot) return

	if (CMDManager.handleIt(msg)) return

	// if (msg.type === 'PINS_ADD')
	// {
	// 	msg.channel.messages.fetch(msg.reference.messageID).then(pinnedMsg =>
	// 	{
	// 		// do whatever with pinnedMsg
	// 	})
	// 	.catch(console.log)
	// }

	/* do something else if it's not a command? */
})

client.login(process.env.TOKEN);
