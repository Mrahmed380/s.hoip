module.exports = {
	name: 'avatar',
	description: 'Avatar command',
	guildonly: `true`,
	usage: `avatar [user]`,
	example: `avatar @scraayp#9050`,
	permission: `None`,
	type: `Server`,
	category: `Info`,
	cooldown: 3,
	execute(message, args, bot) {
	const discord = require("discord.js");
	const config = require("../config.json");
	var user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]) || message.author);
    
    let embed = new discord.RichEmbed()
	.setImage(user.user.avatarURL)
	message.channel.send(embed)

    }
};