module.exports = {
	name: 'pardon',
	description: 'Pardon a user. *Remove warning*',
	guildonly: `true`,
	usage: `pardon <member> [reason]`,
	example: `pardon @scraayp#9050 lmao`,
	permission: `Manage messages`,
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
    var user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]) || args[0]);
    if(!user) return message.reply(`:lock: Please provide a user to pardon`)
    var reason = args.join(" ").slice(22)
    if(!message.member.hasPermission("MANAGE_MESSAGES")) {
        return message.reply(`:lock: You are not allowed to use this command.`)
    };
    if(user == bot.user) return message.reply(`:lock: You can't pardon me`);
    if(user == message.guild.owner) return message.reply(`:lock: You can't pardon the server owner`)
    if(user == message.author) return message.channel.send(`:lock: You can't pardon yourself`)
    if(user.hasPermission("MANAGE_MESSAGES")){
        if(!message.member.hasPermission("ADMINISTRATOR")){
            return message.reply(`You can't pardon somebody that has the same perm that you.`)
        };
    }
    if(!reason) reason = "Not Provided"

    var modembed = new discord.RichEmbed()
    .setAuthor(`Pardon || Unwarn`)
    .setColor(`#e1ff00`)
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
    con.query(`SELECT * FROM warn WHERE guildid = '${message.guild.id}'`, (err, rows) => {
        if(err) throw err;
        con.query(`SELECT * FROM warn WHERE userid = '${user.id}'`, (err, rows) => {
            if(rows.length < 1){
                return message.reply(`This user hasn't been warned in this server.`)
            }
            if(rows.length > 0){
                if(rows[0].warns == "1"){
                        con.query(`DELETE FROM warn WHERE userid = "${user.id}" WHERE guildid = "${message.guild.id}"`,(err, rows) =>{
                            if(err) throw err;
                        });
                }
                let newWarns = parseInt(rows[0].warns) - 1

                con.query(`UPDATE warn SET warns = "${newWarns}" WHERE guildid = "${message.guild.id}"`);

            }
        });
    });
    message.reply(`Pardonned the user.`);
}
}