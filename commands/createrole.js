module.exports = {
	name: 'createrole',
	description: 'Create a role',
	guildonly: `true`,
	usage: `createrole <name without spaces> [color in hex]`,
	example: `createrole scraayp #ff0000`,
	permission: `Manage Roles`,
	type: `Server`,
    category: `Utility`,
    cooldown: 3,
	execute(message, args, bot) {
    const discord = require("discord.js");
    const config = require("../config.json");
    if(!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send(`:lock: You are not authorized to use this command.`)
    if(!message.guild.me.hasPermission(`MANAGE_ROLES`)) return message.channel.send(`:lock: I am not authorized to use this command.`)

    var role = args[0]
    var color = args[1]
    if(!role) return message.reply(`Please provide me a role name.`)
    message.guild.createRole({name: role,color: color}).then((newrole) => {
        newrole.setMentionable(true).then((updaterole) => {
            message.reply(`Made the role. ${updaterole}`)
        })
        newrole.setMentionable(false)
    });
}
}