module.exports = {
	name: 'mute',
	description: 'Mute a user',
	guildonly: `true`,
	usage: `mute <member> [reason]`,
	example: `mute @scraayp#9050`,
	permission: `Kick Members`,
	type: `Server`,
    category: `moderation`,
    cooldown: 3,
	async execute(message, args, bot) {
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
    if(!message.guild.me.hasPermission([`MANAGE_ROLES`,`MANAGE_CHANNELS`])) return message.channel.send(`:lock: I am not authorized to use this command.`)
    if(!message.member.hasPermission("KICK_MEMBERS")) {
        return message.reply(`:lock: You are not allowed to use this command.`)
    };
    if(user.hasPermission("KICK_MEMBERS")){
        if(!message.member.hasPermission("ADMINISTRATOR")){
            return message.reply(`You can't mute somebody that has the same perm that you.`)
        };
    }
    if(user == bot.user) return message.reply(`:lock: You can't mute me`);
    if(user == message.guild.owner) return message.reply(`:lock: You can't mute the server owner`)
    if(user == message.author) return message.channel.send(`:lock: You can't mute yourself`)
    if(!reason) reason = "Not Provided"

    var modembed = new discord.RichEmbed()
    .setAuthor(`Mute`)
    .setColor(`#ff0000`)
    .addField(`User`,`${user.user.tag}`,true)
    .addField(`Moderator`,message.author,true)
    .addField(`Reason`,reason,true)
    .setTimestamp()
    .setFooter(`ID: ${user.id}`);
    con.query(`SELECT * FROM muterole WHERE guildid = '${message.guild.id}'`, (err, rows) => {
        if(rows.length > 0){
            role1 = rows[0].rolename;
            const role = message.guild.roles.find(role => role.name == role1)
            if(user.roles.has(role.id)) return message.reply(`This user is already muted`)
            user.addRole(role.id,reason).catch(err1 => {
                return message.reply(`I couldn't add this role to this user`)
            })
            if(err) throw err;
        }
        if(rows.length < 1){
            message.reply(`First a administrator need to setup a muterole. ${config.prefix}help muterole`)
        }
        })
    con.query(`SELECT * FROM modlog WHERE guildid = '${message.guild.id}'`, (err, rows) => {
    if(rows.length > 0){
        channel1 = rows[0].channelname;
        var channel = message.guild.channels.find(channel => channel.name == channel1)
        channel.send(modembed)
    }
    });
    message.delete();
    message.reply(`Muted the user`);
}
}