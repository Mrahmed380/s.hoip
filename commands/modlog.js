module.exports = {
	name: 'modlog',
    description: 'Add,remove,create modlog channel. **When create. It will make a channel with name modlogs**',
	guildonly: `true`,
	usage: `modlog <set/remove/create/channel> [channel]`,
	example: `modlog set #modlogs`,
	permission: `Administrator`,
	type: `Server`,
    category: `Administration`,
    cooldown: 3,
	execute(message, args, bot) {
    const discord = require("discord.js");
    const config = require("../config.json");
    const mysql = require(`mysql`);
    const database = require(`../database.json`)
    var channel = message.mentions.channels.first() || message.guild.channels.get(args[1]);
    var a = args[0];

    var con = mysql.createConnection({
        host: database.host,
        user: database.user,
        password: database.password,
        database: database.database
    });
    con.connect(err => {
        if(err) throw err;
    });
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`:lock: You are not authorized to use this command.`)

    if(args[0] == "set"){
        if(!channel) return message.reply(`You need to provide a channel for this command`)
        con.query(`SELECT * FROM modlog WHERE guildid = ${message.guild.id}`,(err, rows) =>{
            if(rows.length < 1){
                con.query(`INSERT INTO modlog (guildid,channel,channelname,channelid,addedby) VALUES ("${message.guild.id}","${channel}","${channel.name}","${channel.id}","${message.author.tag}")`);
                message.reply(`Set modlog channel to ${channel}`)
            }
            if(rows.length > 0){
                con.query(`UPDATE modlog SET channel = "${channel}" WHERE guildid = "${message.guild.id}"`);
                con.query(`UPDATE modlog SET channelid = "${channel.id}" WHERE guildid = "${message.guild.id}"`);
                con.query(`UPDATE modlog SET addedby = "${message.author.tag}" WHERE guildid = "${message.guild.id}"`);
                con.query(`UPDATE modlog SET channelname = "${channel.name}" WHERE guildid = "${message.guild.id}"`);
                message.reply(`Changed the modlog channel to ${channel}`)
            };
        });
    }
    if(args[0] == "remove"){
        con.query(`DELETE FROM modlog WHERE guildid = ${message.guild.id}`,(err, rows) =>{
            if(err) throw err;
            message.reply(`Removed the modlog channel from the database. *None logs about moderation will be sent from now.*`)
            if(rows.length < 1){
                message.reply(`It looks like you didn't make a modlog channel already`)
            }
        });
    };
    if(args[0] == "create"){
        var name = "modlogs"
        const modlogch5 = message.guild.channels.find(channel => channel.name == name)
        if(modlogch5) {
            return message.channel.send(`There is already a channel with the name: ${name} | ${modlogch5}`)
        }
        message.guild.createChannel('modlogs', { type: 'text' }).then(createdch => {
        createdch.overwritePermissions(message.guild.roles.find(r => r.name ==  "@everyone"), { "READ_MESSAGES": false });    
        createdch.overwritePermissions(message.author, { "READ_MESSAGES": true });
        con.query(`SELECT * FROM modlog WHERE guildid = ${message.guild.id}`,(err, rows) =>{
            if(rows.length < 1){
            con.query(`INSERT INTO modlog (guildid,channel,channelname,channelid,addedby) VALUES ("${message.guild.id}","${createdch}","${createdch.name}","${createdch.id}","${message.author.tag}")`);
            };
            if(rows.length > 0){
                con.query(`UPDATE modlog SET channel = "${createdch}" WHERE guildid = "${message.guild.id}"`);
                con.query(`UPDATE modlog SET channelid = "${createdch.id}" WHERE guildid = "${message.guild.id}"`);
                con.query(`UPDATE modlog SET channelname = "${createdch.name}" WHERE guildid = "${message.guild.id}"`);
                con.query(`UPDATE modlog SET addedby = "${message.author.tag}" WHERE guildid = "${message.guild.id}"`);
            };
        });
    })
    message.reply(`Created a modlog channel.`)
    }
    if(args[0] == "channel"){
        con.query(`SELECT * FROM modlog WHERE guildid = ${message.guild.id}`,(err, rows) =>{
        if(err) throw err;
        if(rows.length > 0){
            message.reply(`Your modlog channel: ${rows[0].channel}`)
        }else{
            message.reply(`It looks like you didn't setup a modlog channel.`)
        };
    })
};
}
}