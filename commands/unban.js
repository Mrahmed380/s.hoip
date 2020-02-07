module.exports = {
	name: 'unban',
	description: 'Unban a user',
	guildonly: `true`,
	usage: `unban <member> [reason]`,
	example: `unban @scraayp#9050 lmao`,
	permission: `Ban Members`,
	type: `Server`,
    category: `Moderation`,
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
    let BannedUser = bot.fetchUser(args[0])
    if(!BannedUser) return message.reply(`Give me a user id to unban.\n\nTutorial how to: <https://support.discordapp.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID->`)
    var reason = args.join(" ").slice(22);
    if(!message.guild.me.hasPermission(`BAN_MEMBERS`)) return message.channel.send(`:lock: I am not authorized to use this command.`)
    if(!message.member.hasPermission("BAN_MEMBERS")) {
        return message.reply(`:lock: You are not allowed to use this command.`)
    };
    if(user == bot.user) return message.reply(`:lock: You can't unban me`);
    if(user == message.guild.owner) return message.reply(`:lock: You can't unban the server owner`)
    if(user == message.author) return message.channel.send(`:lock: You can't unban yourself`)
    if(!reason) reason = "Not Provided"

    var modembed = new discord.RichEmbed()
    .setAuthor(`Unban`)
    .setColor(`#ff0000`)
    .addField(`User`,`${user.user.tag}`,true)
    .addField(`Moderator`,message.author,true)
    .addField(`Reason`,reason,true)
    .setTimestamp()
    .setFooter(`ID: ${user.id}`);

    con.query(`SELECT * FROM modlog WHERE guildid = '${message.guild.id}'`, (err, rows) => {
    if(rows.length > 0){
        channel1 = rows[0].channelname;
        var channel = message.guild.channels.find(channel => channel.name == channel1)
        channel.send(modembed)
    }
    });
    message.delete();
    message.guild.unban(args[0], {reason: `Unban. Reason: ${reason} by: ${message.author.tag}`})
    message.reply(`Unbanned the user`);
}
}