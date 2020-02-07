module.exports = {
	name: 'softban',
	description: `Ban someone and then inmiddelty unban the user to delete his all messages`,
	guildonly: `true`,
	usage: `softban <member> [reason]`,
	example: `softban @scraayp#9050`,
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
    var user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!user) return message.reply(`Please provide me a user. Not user id`)
    var reason = args.join(" ").slice(22);
    if(!message.guild.me.hasPermission(`BAN_MEMBERS`)) return message.channel.send(`:lock: I am not authorized to use this command.`)
    if(!message.member.hasPermission("BAN_MEMBERS")) {
        return message.reply(`:lock: You are not allowed to use this command.`)
    };
    if(user.hasPermission("BAN_MEMBERS")){
        if(!message.member.hasPermission("ADMINISTRATOR")){
            return message.reply(`You can't softban somebody that has the same perm that you.`)
        };
    }
    if(user == bot.user) return message.reply(`:lock: You can't softban me`);
    if(user == message.guild.owner) return message.reply(`:lock: You can't softban the server owner`)
    if(user == message.author) return message.channel.send(`:lock: You can't softban yourself`)
    if(!reason) reason = "Not Provided"

    var modembed = new discord.RichEmbed()
    .setAuthor(`Softban`)
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
    message.guild.member(user).ban({reason: `Softban. Reason: ${reason} by: ${message.author.tag}`, days: 7}).catch(err => {
        console.log(err)
        return message.reply(`Something went wrong with banning that user`)
    });
    message.guild.member(user).unban(`Softban. Reason: ${reason} by: ${message.author.tag}`).catch(err => {
        console.log(err)
        return message.reply(`Something went wrong with unbanning that user`)
    });
    message.reply(`Softbanned the user`);
}
}