module.exports = {
	name: 'guildinfo',
	description: 'Get information about the server/guild',
	guildonly: `true`,
	usage: `guildinfo`,
	example: `guildinfo`,
	permission: `None`,
	type: `Server`,
	category: `Utility`,
	cooldown: 5,
	execute(message, args, bot) {
	const discord = require("discord.js");
    const fs = require("fs");
    const config = require("../config.json");
    const hastebin = require('hastebin-gen');

    var guild = message.guild;
    var membercount = guild.members.size;
    var serverowner = guild.owner;
    var serverid = guild.id
    var servername = guild.name
    var roles = guild.roles.filter(r => r.id !== message.guild.id).map(roles => roles).join("\n") || "No Roles"
    let verifLevels = ["None", "Low", "Medium", "(╯°□°）╯︵  ┻━┻", "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"];
    let haste = roles  

    hastebin(haste).then(r => {
    var embed = new discord.RichEmbed()
    .setAuthor(message.guild.name, message.guild.iconURL)
    .setColor("#0000ff")
    .setFooter(`Guild id: ${serverid}`)
    .addField(`Owner`,serverowner,true)
    .addField("Verification Level", verifLevels[message.guild.verificationLevel], true)
    .addField("Region", message.guild.region, true)
    .addField(`Channels`,message.guild.channels.size,true)
    .addField(`Roles`,message.guild.roles.size,true)
    .addField(`Member Count`,membercount,true)
    .addField(`Roles`,roles)
    message.channel.send(embed)

    }).catch(console.error);
	}
};