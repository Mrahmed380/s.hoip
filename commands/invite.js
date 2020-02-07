module.exports = {
	name: 'invite',
	description: 'Get a link to invite the bot',
	guildonly: `false`,
	usage: `invite`,
	example: `invite`,
	permission: `None`,
	type: `DM And Server`,
    category: `info`,
    cooldown: 3,
	execute(message, args, bot) {
    const discord = require("discord.js");
    const config = require("../config.json");

    var embed = new discord.RichEmbed()
    .setTitle(`Invite`)
    .setURL(config.server)
    .setColor("#0000ff")
    .setDescription(`Link: \nhttps://discordapp.com/api/oauth2/authorize?client_id=652556436827799562&permissions=8&scope=bot`)

    message.channel.send(embed)
  
}
}