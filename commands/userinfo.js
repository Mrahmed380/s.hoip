module.exports = {
	name: 'userinfo',
	description: 'Get information about a user',
	guildonly: `true`,
	usage: `userinfo [user mention/id]`,
	example: `userinfo 496564180816625676`,
	permission: `None`,
	type: `Server`,
	category: `Utility`,
	cooldown: 3,
	execute(message, args, bot) {
	const discord = require("discord.js");
    const fs = require("fs");
    const config = require("../config.json");

    var user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]) || message.author)

    var nickname = user.nickname
    if (!nickname) nickname = "None"

    if(user.status == "offline") {
        game = "Offline"
    }
    if(user.status != "offline") {
        if(user.presence.game === null){
            game = "Offline"
        }else{
            game = user.presence.game.name
        }
    }
    if(!user.presence.game) game = "Nothing"
    if(user.user.bot){
        bot = "Yes"
    }else{
        bot = "No"
    };
    status =  user.presence.status
    lastmessage = user.lastMessage
    if(!user.lastMessage) lastmessage = "None"

    var embed = new discord.RichEmbed()
    .setAuthor(user.user.tag,user.user.avatarURL)
    .setColor("#0000ff")
    .addField(`User Nickname:`,nickname,true)
    .addField(`User Tag:`,user.user.tag,true)
    .addField(`User Mention:`,user,true)
    .addField(`User ID:`,user.id,true)
    .addField(`Game:`,game,true)
    .addField(`Bot:`,bot,true)
    .addField(`Status:`,status,true)
    .addField(`Last Message:`,lastmessage,true)
    .addField(`User Highest Role:`,user.highestRole,true)
    .addField(`User Joined At:`,user.joinedAt,true)
    .addField("Roles:", `${user.roles.filter(r => r.id !== message.guild.id).map(roles => `- ${roles}`).join("\n") || "No Roles"}`,)
    .setFooter(`Born: ${user.user.createdAt}`)
    message.channel.send(embed)
	}
};