'use strict'


const config = require('./config.json')

// Packages

const express = require('express')
const http = require('http')
const Discord = require('discord.js')
const CMDManager = require('./CMDManager')


// Consts

const PORT  = process.env.PORT  || 3000
const TOKEN = process.env.TOKEN || require('dotenv').config().parsed.TOKEN

const app = express()
const server = http.createServer(app)
const bot = new Discord.Client()


// Bot listeners

bot.on('ready', () =>
{
	bot.user.setPresence({
		status: 'online',
		activity: {
			type: 'WATCHING',
			name: 'Peaky Blinders',
			url: 'https://discordapp.com/',
		}
	});
	
	bot.user.setUsername('Tiamat');
	CMDManager.listen(config.PREFIX, './commands/')

	console.log(`Logged in as ${ bot.user.tag }!`)
})

bot.on('message', msg =>
{
	if (msg.author.bot) return
	if (CMDManager.handleIt(msg)) return
})


// Serve

app.use(express.static('public'))
server.listen(PORT)
bot.login(TOKEN);
