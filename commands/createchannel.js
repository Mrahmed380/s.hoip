module.exports = {
	name: 'createchannel',
	description: 'Create a channel',
	guildonly: `true`,
	usage: `createchannel <name>`,
	example: `createchannel general`,
	permission: `Manage Channels`,
	type: `Server`,
    category: `Utility`,
    cooldown: 3,
	execute(message, args, bot) {
    const discord = require("discord.js");
    const config = require("../config.json");
    if(!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send(`:lock: You are not authorized to use this command.`)
    if(!message.guild.me.hasPermission(`MANAGE_CHANNELS`)) return message.channel.send(`:lock: I am not authorized to use this command.`)

    const name = args.join(" ")
    if(name){
        const channeltest = message.guild.channels.find(channel => channel.name == name)
        if(channeltest) return message.reply(`There is already a channel with that name`)
        message.guild.createChannel(name, { type: 'text' }).then(channel => {
        message.reply(`Made a channel. ${channel}`)
        });

    }else{
        return message.reply(`Please give me a name for a channel`)
    }

}
}