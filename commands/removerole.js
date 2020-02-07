module.exports = {
	name: 'removerole',
	description: 'Delete/Remove a role',
	guildonly: `true`,
	usage: `removerole <role>`,
	example: `removerole @scraayp`,
	permission: `Manage Roles`,
	type: `Server`,
    category: `Utility`,
    cooldown: 3,
	execute(message, args, bot) {
    const discord = require("discord.js");
    const config = require("../config.json");
    if(!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send(`:lock: You are not authorized to use this command.`)
    if(!message.guild.me.hasPermission(`MANAGE_ROLES`)) return message.channel.send(`:lock: I am not authorized to use this command.`)

    const role = message.mentions.roles.first() || message.guild.roles.get(args.join(" ")) || message.guild.roles.find(role => role.name == args.join(" "));
    if(role){
        role.delete();
        message.reply(`${role.name} has been succesfully deleted`)
    }else{
        return message.reply(`Couldn't find that role`)
    }

}
}