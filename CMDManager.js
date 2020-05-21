'use strict'


const fs = require('fs')
const cmds = {}

let _prefix = '';


async function load (path)
{
	return fs.readdir(path, (err, files) =>
	{
		if (err) throw new Error(err)

		for (const file of files)
		{
			if (!file.endsWith('.js')) return

			const name = file.split('.js')[0]
			
			cmds[name] = require('./commands/' + name)
		}

		console.log(`Loaded ${ Object.keys(cmds).length } commands from '${ path }'`)
	})
}

const getPossibleMean = (text, list) =>
{
    const scores = [];

    for (let i = 0; i < list.length; i++)
    {
        const str = list[i];
        const len = Math.max(str.length, text.length);
        let unMatchedStreak = 0;
        
        scores[i] = -Math.abs(str.length - text.length);
        
        for (let c = 0; c < len; c++)
        {
            if (str[c - unMatchedStreak] === text[c])
            {
                unMatchedStreak = 0;
                scores[i]++;
            }
            else
            {
                unMatchedStreak++;
                scores[i]--;
            }
        }
    }

    const sorted = Array.from(scores).sort((a, b) => b - a);

    if (sorted[0] < -3 || sorted[0] === sorted[1]) return '';

    return list[scores.indexOf(sorted[0])];
}

module.exports = {

	listen (prefix, commandsFolderPath='./')
	{
		if (typeof prefix !== 'string') throw new TypeError('argument \'prefix\' should be a string')
		_prefix = prefix
		load(commandsFolderPath)
	},

	handleIt (msg)
	{
		if (!this.isCmd(msg)) return false

		const { cmd, args } = this.extract(msg)

		if (cmd in cmds)
		{
			cmds[cmd](msg, args)
			return
		}

		const possible = getPossibleMean(cmd, Object.keys(cmds))

		if (possible)
		{
			msg.channel.send(`I don't know what's \`${ cmd }\`. Perhaps you mean \`${ possible }\`?`)
			return
		}

        msg.channel.send(`What's that?`);
	},

	isCmd ({ content })
	{
		return (
			content.indexOf(_prefix) === 0 &&
			content[_prefix.length]  !== ' '
		)
	},

	extract ({ content })
	{
		const inputs = content
			.slice(_prefix.length)
			.replace(/\s\s+/g, ' ')
			.trim()
			.split(' ')

		const cmd = inputs.shift()
		const args = inputs

		return { cmd, args }
	}
}


const format = (str, ...args) =>
{
	while (str.includes('{}') && args.length) str.replace('{}', args.shift())
	return str
}

String.prototype.format = function (...args)
{
    while (this.includes('{}') && args.length)
        this[this.indexOf('{}')].replace('{}', args.shift())
    return this
}
