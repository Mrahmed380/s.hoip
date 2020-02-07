module.exports = {
	name: 'report',
	description: 'Report someone',
	guildonly: `true`,
	usage: `report <user> <reason>`,
	example: `report @scraayp#9050 Spamming in #general`,
	permission: `None`,
	type: `Server`,
    category: `Moderation`,
    cooldown: 3,
	execute(message, args, bot) {
    const discord = require("discord.js");
    const config = require("../config.json");
    const mysql = require("mysql")
    const database = require(`../database.json`)
    var con = mysql.createConnection({
        host: database.host,
        user: database.user,
        password: database.password,
        database: database.database
    });
    con.connect(err => {
        if(err) throw err;
    });

    var user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!user) return message.reply(`Please provide me a user.`)
    var reason = args.join(" ").slice(22);
    if(!reason) return message.reply(`Please provide me a reason`)
    var embed = new discord.RichEmbed()
    .setTitle(`Report`)
    .setColor("#C08AFF")
    .addField(`Author`,message.author,true)
    .addField(`User`,user,true)
    .addField(`Reason`,reason)

    con.query(`SELECT * FROM reportchannel WHERE guildid = '${message.guild.id}'`, (err, rows) => {
        if(rows.length > 0){
            channel1 = rows[0].channelname;
            var channel = message.guild.channels.find(channel => channel.name == channel1)
            channel.send(embed)
        }
        if(rows.length < 1){
            return message.reply(`Sorry but the administration of this guild didn't setup any report channel`)
        }
    });
    message.delete()
    message.reply(`Sent the report to the staff team.`);
  
}
}