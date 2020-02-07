module.exports = {
	name: 'rename',
	description: 'Rename a user',
	guildonly: `true`,
	usage: `rename <member> [newname]`,
	example: `rename @scraayp#9050 lmao`,
	permission: `Manage Nicknames`,
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
    var newname = args.join(" ").slice(22);
    if(!message.guild.me.hasPermission(`MANAGE_NICKNAMES`)) return message.channel.send(`:lock: I am not authorized to use this command.`)
    if(!message.member.hasPermission("MANAGE_NICKNAMES")) {
        return message.reply(`:lock: You are not allowed to use this command.`)
    };
    if(user.hasPermission("MANAGE_NICKNAMES")){
        if(!message.member.hasPermission("ADMINISTRATOR")){
            return message.reply(`You can't rename somebody that has the same perm that you.`)
        };
    }
    if(user == message.guild.owner) return message.reply(`:lock: You can't rename the server owner`)
    if(!newname) return message.reply(`Please give me a new name`)

    var modembed = new discord.RichEmbed()
    .setAuthor(`Rename`)
    .setColor(`#46FF5B`)
    .addField(`User`,`${user.user.tag}`,true)
    .addField(`Moderator`,message.author,true)
    .addField(`New Name`,newname,true)
    .setTimestamp()
    .setFooter(`ID: ${user.id}`);

    message.guild.member(user).setNickname(`Rename. Reason: ${reason} by: ${message.author.tag}`).catch(err => {
        console.log(err);
        return message.reply(`Something went wrong with renaming this user.`)
    })
    con.query(`SELECT * FROM modlog WHERE guildid = '${message.guild.id}'`, (err, rows) => {
    if(rows.length > 0){
        channel1 = rows[0].channelname;
        var channel = message.guild.channels.find(channel => channel.name == channel1)
        channel.send(modembed)
    }
    });
    message.delete();
    message.reply(`Renamed the user`);
}
}