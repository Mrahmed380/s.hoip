module.exports = {
	name: 'removechannel',
	description: 'Delete/Remove a channel',
	guildonly: `true`,
	usage: `removechannel <chanenl>`,
	example: `removechannel #general`,
	permission: `Manage Channels`,
	type: `Server`,
    category: `Utility`,
    cooldown: 3,
	execute(message, args, bot) {
    const discord = require("discord.js");
    const config = require("../config.json");
    if(!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send(`:lock: You are not authorized to use this command.`)
    if(!message.guild.me.hasPermission(`MANAGE_CHANNELS`)) return message.channel.send(`:lock: I am not authorized to use this command.`)

    const channel = message.mentions.channels.first() || message.guild.channels.get(args.join(" ")) || message.guild.channels.find(channel => channel.name == args.join(" "));
    if(channel){
        channel.delete();
        message.reply(`${channel.name} has been succesfully deleted`)
    }else{
        return message.reply(`Couldn't find that channel`)
    }

}
}