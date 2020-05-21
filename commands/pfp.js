'use strict'

const matchUser = /<@!(\d{18})>/

module.exports = (msg, args) =>
{
	for (const arg of args)
	{
		if (matchUser.test(arg))
		{
			const id = arg.match(matchUser)[1]

			msg.client.users.fetch(id).then(user =>
			{
				msg.channel.send('yoink ' + user.displayAvatarURL())
			})

			return
		}
	}
	
	msg.channel.send('yoink ' + msg.author.displayAvatarURL())
}
