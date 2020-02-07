module.exports = {
	name: 'about',
	description: 'Get information about the bot',
	guildonly: `false`,
	usage: `about`,
	example: `about`,
	permission: `None`,
	type: `DM And Server`,
    category: `info`,
    cooldown: 3,
	execute(message, args, bot) {
    const discord = require("discord.js");
    const config = require("../config.json");

    var embed = new discord.RichEmbed()
    .setTitle(`About`)
    .setURL(config.server)
    .setColor("#0000ff")
    .setDescription(`Moderation, info, permium commands and more incoming`)
    .addField(`Version`,config.version)
    .addField(`Creator`,`${bot.user.username} is made by Scraayp,\nDiscord: Scraayp#9050`)
    .addField(`Discord Server`,config.server)
    .addField(`Vote`,`Not ready yet`)
    .addField(`Patreon`,`Not ready yet`)
    .addField(`Libary`,`discord.js`,true)
    .addField(`Default Prefix`,config.prefix,true)

    message.channel.send(embed)
  
}
}