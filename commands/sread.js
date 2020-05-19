'use strict'


const getBuffer = require('bent')('buffer')

const Jimp = require('jimp')

const bin2txt = bin => bin.match(/\d{7}/g).map(b => String.fromCharCode(parseInt(b, 2))).join('')

module.exports = (msg, args=[]) =>
{
	if (!msg.attachments) return

	const attachment = msg.attachments.array()[0]

	let bin = ''

	getBuffer(attachment.proxyURL).then(buffer =>
	{
		Jimp.read(buffer).then(img =>
		{
			let x = 0;
			let y = 0;

			while (y < img.bitmap.height)
			{
				const dec = img.getPixelColor(x, y).toString(16)

				let r = parseInt(dec.substring(0, 2), 16)
				let b = parseInt(dec.substring(2, 4), 16)
				let g = parseInt(dec.substring(4, 6), 16)
				let a = parseInt(dec.substring(6, 8), 16)

				if (r === 255) bin += '1'
				if (g === 255) bin += '0'
				if (b === 255) bin += ' '

				// if      (r === 255 && g === 0 && b === 0) bin += '1'
				// else if (r === 0 && g === 255 && b === 0) bin += '0'
				// else
				// {
				// 	const text = bin2txt(bin)
				// 	msg.channel.send(text)
				// 	break
				// }

				x++

				if (x === img.bitmap.width)
				{
					x = 0
					y++
				}
			}

			console.log('bin', bin2txt(bin))
			msg.channel.send(bin)
		})
		.catch(() => msg.channel.send('Failed to read the image'));
	})
	.catch(() => msg.channel.send('Failed to load the image'))
}
