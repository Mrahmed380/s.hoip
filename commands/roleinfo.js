module.exports = {
	name: 'roleinfo',
	description: 'Get information about a role',
	guildonly: `true`,
	usage: `roleinfo <role>`,
	example: `roleinfo Members`,
	permission: `None`,
	type: `Server`,
    category: `info`,
    cooldown: 3,
	execute(message, args, bot) {
    const discord = require("discord.js");
    const config = require("../config.json");

    let role = message.mentions.roles.first() || message.guild.roles.get(args[0]) || message.guild.roles.find(role => role.name == args.join(" "));
    if(!role) return message.reply(`Please provide me a role to this command.`)
    if(role.comparePositionTo(bot.user.highestRole > 0)){
        return message.reply(`I need a higher role higher then the role that you are checking`)
    }

    let inline = true
    var embed = new discord.RichEmbed()
    .setTitle(`Role: ${role.name}`)
    .setColor("#0000ff")
    .addField(`Role`,role,inline)
    .addField(`Role ID`,role.id,inline)
    .addField(`Role Guild`,role.guild,inline)
    .addField(`Role Hoist`,role.hoist,inline)
    .addField(`Role Mentionable`,role.mentionable,inline)
    .addField(`Role Hex`,role.hexColor,inline)
    .addField(`Role Members`,role.members.size,inline)

    message.channel.send(embed)
  
}
}