'use strict'


const getBuffer = require('bent')('buffer')

const Jimp = require('jimp')

const { MessageAttachment } = require('discord.js');

const txt2bin = str => str.split('').map(c => c.charCodeAt(0).toString(2)).join(' ')


module.exports = (msg, args=[]) =>
{
	if (!msg.attachments || !args.length) return

	const msgBin = txt2bin(args.join(' '))

	const attachment = msg.attachments.array()[0]

	getBuffer(attachment.proxyURL).then(buffer =>
	{
		Jimp.read(buffer).then(img =>
		{
			let x = 0;
			let y = 0;

			for (let i = 0; i < msgBin.length; i++)
			{
				const rgba = []
				
				let dec = img.getPixelColor(x, y).toString(16)

				while (dec.length)
				{
					rgba.push(dec.substring(0, 2))
				}

				let r = parseInt(dec.substring(0, 2), 16)
				let g = parseInt(dec.substring(2, 4), 16)
				let b = parseInt(dec.substring(4, 6), 16)
				let a = parseInt(dec.substring(6, 8), 16)

				if (msgBin[i] === '1')
				{
					r = 255
					g = 0
					b = 0
				}
				if (msgBin[i] === '0')
				{
					r = 0
					g = 255
					b = 0
				}
				if (msgBin[i] === '2')
				{
					r = 0
					g = 0
					b = 255
				}
	
				const hex = [r, g, b, a].map(c =>
				{
					const h = c.toString(16)
					return h.length === 1 ? '0' + h : h
				})
	
				const newDec = Number('0x' + hex.join(''))
	
				img.setPixelColor(newDec, x, y)

				x++

				if (x === img.bitmap.width)
				{
					x = 0
					y++

					if (y === img.bitmap.height) break
				}
			}

			img.getBufferAsync('image/png')
				.then(buffer => msg.channel.send('', { files: [new MessageAttachment(buffer)] }))
				.catch(() => msg.channel.send('Failed to write the image'))
		})
		.catch(() => msg.channel.send('Failed to read the image'));
	})
	.catch(() => msg.channel.send('Failed to load the image'))
}



getBuffer('https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-11/256/crayon.png').then(buffer =>
{
	Jimp.read(buffer).then(img =>
	{
		let x = 10;
		let y = 10;

		const dec = img.getPixelColor(x, y).toString(16)

		let r = parseInt(dec.substring(0, 2), 16)
		let g = parseInt(dec.substring(2, 4), 16)
		let b = parseInt(dec.substring(4, 6), 16)
		let a = parseInt(dec.substring(6, 8), 16)


		// code to edit the pixel goes here
		r = 0
		g = 255
		b = 0


		const hex = [r, g, b, a].map(c =>
		{
			const h = c.toString(16)
			return h.length === 1 ? '0' + h : h
		})

		const newDec = Number('0x' + hex.join(''))

		img.setPixelColor(newDec, x, y)
		

		// img.getBufferAsync('image/png')
		// 	.then(buffer => msg.channel.send('', { files: [new MessageAttachment(buffer)] }))
		// 	.catch(() => msg.channel.send('Failed to write the image'))
	})
})	