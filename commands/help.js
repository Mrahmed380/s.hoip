module.exports = {
	name: 'help',
	description: 'Help command',
	guildonly: `false`,
	usage: `help [command/category]`,
	example: `help moderation`,
	permission: `None`,
	type: `DM And Server`,
	category: `Info`,
	cooldown: 3,
	execute(message, args, bot) {
	const discord = require("discord.js");
	const config = require("../config.json");
		
	if(!args[0]){
		var embed = new discord.RichEmbed()
		.setTitle(`Help`)
		.setURL(config.server)
		.setColor(`#0000ff`)
		.setDescription(`- If anything confuses you ask your question in the ${bot.user.username} server\n- Some of these commands won't work in a DM-Channel\n- NSFW commands will only work in NSFW marked channels, this is not the same as naming the channel nsfw\n- We have ${bot.commands.size} commands`)
		.addField(`Prefix`,`${config.prefix}`)
		.addField(`Syntax`,`\`<argument>\` = Necessary argument\n\`[argument]\` = Unnecessary argument\nDont forget to leave away the <>[] when typing a command, these characters are only used in the help!`)
		.addField(`Categories`,`${config.prefix}help info\n${config.prefix}help moderation\n${config.prefix}help utility\n${config.prefix}help administration\n${config.prefix}help developer\n${config.prefix}help fun\n${config.prefix}help music`)
		return message.channel.send(embed);
	};	
	if(args[0] == "info"){
		var embed = new discord.RichEmbed()
		.setTitle(`Help`)
		.setURL(config.server)
		.setColor(`#0000ff`)
		.setDescription(`**Category: Info**`)
		.addField(`About:`,`${config.prefix}help about`)
		.addField(`Userinfo:`,`${config.prefix}help userinfo`)
		.addField(`Guildinfo:`,`${config.prefix}help guildinfo`)
		.addField(`Roleinfo:`,`${config.prefix}help roleinfo`)
		.addField(`Avatar:`,`${config.prefix}help avatar`)
		.addField(`Invite:`,`${config.prefix}help invite`)
		.addField(`Server:`,`${config.prefix}help server`)
		return message.channel.send(embed)
	}else if(args[0] == "fun"){
		var embed = new discord.RichEmbed()
		.setTitle(`Help`)
		.setURL(config.server)
		.setColor(`#0000ff`)
		.setDescription(`**Category: Fun**`)
		.addField(`Meme:`,`${config.prefix}help meme`)
		.addField(`Cat:`,`${config.prefix}help cat`)
		.addField(`Dog:`,`${config.prefix}help dog`)
		message.channel.send(embed)
	}else if(args[0] == "moderation"){
		var embed = new discord.RichEmbed()
		.setTitle(`Help`)
		.setURL(config.server)
		.setColor(`#0000ff`)
		.setDescription(`**Category: Moderation**`)
		.addField(`Ban:`,`${config.prefix}help ban`)
		.addField(`Kick:`,`${config.prefix}help kick`)
		.addField(`Warn:`,`${config.prefix}help warn`)
		.addField(`Pardon:`,`${config.prefix}help pardon`)
		.addField(`Rename:`,`${config.prefix}help rename`)
		.addField(`Report:`,`${config.prefix}help report`)
		.addField(`Unban:`,`${config.prefix}help unban`)
		.addField(`Purge:`,`${config.prefix}help purge`)
		.addField(`Mute:`,`${config.prefix}help mute`)
		.addField(`Unmute:`,`${config.prefix}help unmute`)
		return message.channel.send(embed)
	}else if(args[0] == "utility"){
		var embed = new discord.RichEmbed()
		.setTitle(`Help`)
		.setURL(config.server)
		.setColor(`#0000ff`)
		.setDescription(`**Category: Utility**`)
		.addField(`Lock:`,`${config.prefix}help lock`)
		.addField(`Unlock:`,`${config.prefix}help unlock`)
		.addField(`Createchannel:`,`${config.prefix}help createchannel`)
		.addField(`Removechannel:`,`${config.prefix}help removechannel`)
		.addField(`Createrole:`,`${config.prefix}help createrole`)
		.addField(`Removerole:`,`${config.prefix}help removerole`)
		.addField(`Announcement:`,`${config.prefix}help announcement`)
		.addField(`8ball:`,`${config.prefix}help 8ball`)
		.addField(`Fortnite:`,`${config.prefix}help fortnite`)
		return message.channel.send(embed);
	}else if(args[0] == "developer"){
		var embed = new discord.RichEmbed()
		.setTitle(`Help`)
		.setURL(config.server)
		.setColor(`#0000ff`)
		.setDescription(`**Category: Developer**`)
		.addField(`Restart:`,`${config.prefix}help restart`)
		.addField(`Test:`,`${config.prefix}help test`)
		.addField(`Eval:`,`${config.prefix}help eval`)
		.addField(`BotNick:`,`${config.prefix}help botnick`)
		return message.channel.send(embed)
	}else if(args[0] == "administration"){
		var embed = new discord.RichEmbed()
		.setTitle(`Help`)
		.setURL(config.server)
		.setColor(`#0000ff`)
		.setDescription(`**Category: Administration**`)
		.addField(`Modlog:`,`${config.prefix}help modlog`)
		.addField(`Welcomerole:`,`${config.prefix}help welcomerole`)
		.addField(`Reportchannel:`,`${config.prefix}help reportchannel`)
		.addField(`Muterole:`,`${config.prefix}help muterole`)
		.addField(`Logchannel:`,`${config.prefix}help logchannel`)
		return message.channel.send(embed)
	}else if(args[0] == "music"){
		var embed = new discord.RichEmbed()
		.setTitle(`Help`)
		.setURL(config.server)
		.setColor(`#0000ff`)
		.setDescription(`**Category: Music**`)
		.addField(`Play:`,`${config.prefix}help play`)
		.addField(`Leave:`,`${config.prefix}help leave`)
		return message.channel.send(embed)
	}else if(bot.commands.has(args[0])){
		var usability = "I couldn't get the usability"
		if(bot.commands.get(args[0]).guildonly == "true") usability = "Guild Only"
		if(bot.commands.get(args[0]).guildonly == "false") usability = "Guild and DM"
		var embedcmd = new discord.RichEmbed()
		embedcmd.setTitle(`Help`)
		embedcmd.setURL(config.server)
		embedcmd.setColor(`#0000ff`)
		embedcmd.setDescription(`**Command: ${bot.commands.get(args[0]).name}**`)
		embedcmd.addField(`Category:`,bot.commands.get(args[0]).category,true)
		embedcmd.addField(`Usability:`,usability,true)
		embedcmd.addField(`Permission:`,bot.commands.get(args[0]).permission,true)
		embedcmd.addField(`Description:`,bot.commands.get(args[0]).description,true)
		embedcmd.addField(`Usage:`,`${config.prefix}` + bot.commands.get(args[0]).usage)
		embedcmd.addField(`Example:`,`${config.prefix}` + bot.commands.get(args[0]).example)
		message.channel.send(embedcmd)
	}else if(args[0]){
		if(!bot.commands.has(args[0])){
			message.channel.send(`Sorry but this is not a valid category or command`);
		}
	}
}
};