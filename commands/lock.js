module.exports = {
	name: 'lock',
    description: 'Lock a channel with reason',
	guildonly: `true`,
	usage: `lock <channel> [reason]`,
	example: `lock #general holidays`,
	permission: `Manage channels`,
	type: `Server`,
    category: `Utility`,
    cooldown: 3,
	execute(message, args, bot) {
    const discord = require("discord.js");
    const config = require("../config.json");
    const mysql = require(`mysql`);
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
    if(!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send(`:lock: You are not authorized to use this command.`)
    var channel = message.mentions.channels.first() || message.guild.channels.get(args[0])
    var reason = args.join(" ").slice(22)
    if(!channel) return message.reply(`Please provide me a channel`);
    if(!reason) reason = "Not provided"

    var modembed = new discord.RichEmbed()
    .setAuthor(`Lock`)
    .setColor(`#ff0000`)
    .addField(`Channel`,channel,true)
    .addField(`Moderator`,message.author,true)
    .addField(`Reason`,reason,true)
    .setTimestamp()
    .setFooter(`ID: ${channel.id}`);

    con.query(`SELECT * FROM modlog WHERE guildid = '${message.guild.id}'`, (err, rows) => {
        if(rows.length > 0){
            channel1 = rows[0].channelname;
            var channel = message.guild.channels.find(channel => channel.name == channel1)
            channel.send(modembed)
        }
    });
    message.delete();
    channel.overwritePermissions(message.guild.defaultRole, { SEND_MESSAGES: false },`lock. Reason: ${reason} by: ${message.author.tag}`).catch(err => {
        if(err) throw err;
    });
    channel.send(`Channel has been locked\nReason: ${reason}`)
    
}
}