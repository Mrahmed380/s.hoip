module.exports = {
	name: 'server',
	description: 'Get a link to the support server',
	guildonly: `false`,
	usage: `server`,
	example: `server`,
	permission: `None`,
	type: `DM And Server`,
    category: `info`,
    cooldown: 3,
	async execute(message, args, bot) {
        const discord = require("discord.js")
        const config = require('../config.json')
        const embed = new discord.RichEmbed()
        embed.setTitle(`Support server.`)
        embed.setDescription(config.server)
        message.channel.send(embed)
    }
}

