'use strict'


// Packages

const express = require('express')
const http = require('http')
const Discord = require('discord.js')
const CMDManager = require('./CMDManager')


// General

const localy = require('os').hostname() === 'RAUL'

const PREFIX = process.env.PREFIX || localy ? '--' : '++'
const PORT   = process.env.PORT   || 3000
const TOKEN  = process.env.TOKEN  || require('dotenv').config().parsed.TOKEN

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
	CMDManager.listen(PREFIX, './commands/')

	console.log(`Logged in as ${ bot.user.tag }!\nPrefix: ${ PREFIX }`)
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
