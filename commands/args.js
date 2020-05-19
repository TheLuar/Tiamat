'use strict'

module.exports = (msg, args) =>
{
	msg.channel.send('Arguments: ' + args.join(', '))
}
