'use strict'

module.exports = (msg, args) =>
{
	const { member, channel } = msg

	const authorElegible = member.permissions.has('ADMINISTRATOR') || member.permissions.has('MANAGE_MESSAGES')

	if (!authorElegible)
	{
		msg.react('❌')
		return
	}

	msg.delete()

	const limit = Math.min(100, Math.max(1, Math.round(Number(args[0])) || 1))
	const keepPins = !args.includes('-p')

	channel.messages.fetch({ limit }).then(async msgsToDel =>
	{
		if (keepPins)
		{
			const pinnedMsgs = await channel.messages.fetchPinned()
			msgsToDel.sweep(a => pinnedMsgs.find(b => a.id === b.id))
		}
		channel.bulkDelete(msgsToDel)
	})
}
