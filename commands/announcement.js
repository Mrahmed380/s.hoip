module.exports = {
	name: 'announcement',
	description: 'Announce something in a specefic channel. *Role none means none ping*',
	guildonly: `true`,
	usage: `announcement <channel> | <role name> | <message>`,
	example: `announcement #announcements | announcements | Hello boys and girls`,
	permission: `MANAGE_ROLES and MANAGE_CHANNELS`,
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
    if(!message.guild.me.hasPermission(["MANAGE_ROLES","MANAGE_CHANNELS"])) return message.channel.send(`:lock: I am not authorized to use this command.`)
    if(!message.member.hasPermission(["MANAGE_ROLES","MANAGE_CHANNELS"])) {
        return message.reply(`:lock: You are not allowed to use this command.`)
    };
    var role = message.mentions.roles.first() || message.guild.roles.get(args[0]) || message.guild.roles.find(role => role.name == args[0]);
    var channel = message.mentions.channels.first() || message.guild.channels.get(args[1]);
    var announce = args.slice(2).join(" ");

    if(!role) return message.channel.send(`Give me a role to ping with the announcement`)
    if(!channel) return message.channel.send(`Give me a channel where to announce`)
    if(!message) return message.channel.send(`Give me a message to announce`)
    var announceembed = new discord.RichEmbed()
    .setTitle(`Announcement`)
    .setColor(`#ff0000`)
    .setDescription(announce)
    .setTimestamp()
    .setFooter(`Announced by: ${message.author.name}`)
    if(role.mentionable == true){
        channel.send(role)
    };
    if(role.mentionable == false){
        role.setMentionable(true, 'Role needs to be pinged')
        .catch(console.error);
    }
    channel.send(announceembed)
    if(role.mentionable == false){
        role.setMentionable(true, 'Role needs to be pinged')
        .then(updated => channel.send(`${updated}`))
        .catch(console.error);
    }
    if(role.mentionable == true){
        role.setMentionable(false, "Announcement ping").catch(err => {
            if(err) throw err;
        });
    };
    message.channel.send(`Announced!`)
    
}
}