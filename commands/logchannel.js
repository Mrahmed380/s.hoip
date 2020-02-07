module.exports = {
	name: 'logchannel',
    description: 'Add,remove,create log channel. **When create. It will make a channel with name logs**',
	guildonly: `true`,
	usage: `logchannel <set/remove/create/channel> [channel]`,
	example: `logchannel set #logs`,
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
        con.query(`SELECT * FROM logchannel WHERE guildid = ${message.guild.id}`,(err, rows) =>{
            if(rows.length < 1){
                con.query(`INSERT INTO logchannel (guildid,channel,channelname) VALUES ("${message.guild.id}","${channel}","${channel.name}")`);
                message.reply(`Set log channel to ${channel}`)
            }
            if(rows.length > 0){
                con.query(`UPDATE logchannel SET channel = "${channel}" WHERE guildid = "${message.guild.id}"`);
                con.query(`UPDATE logchannel SET channelname = "${channel.name}" WHERE guildid = "${message.guild.id}"`);
                message.reply(`Changed the logchannel to ${channel}`)
            };
        });
    }
    if(args[0] == "remove"){
        con.query(`DELETE FROM logchannel WHERE guildid = ${message.guild.id}`,(err, rows) =>{
            if(err) throw err;
            message.reply(`Removed the logchannel from the database. *None logs will be logged now*`)
            if(rows.length < 1){
                message.reply(`It looks like you didn't make a logchannel already`)
            }
        });
    };
    if(args[0] == "create"){
        var name = "logs"
        const ch5 = message.guild.channels.find(channel => channel.name == name)
        if(modlogch5) {
            return message.channel.send(`There is already a channel with the name: ${name} | ${ch5}`)
        }
        message.guild.createChannel('logs', { type: 'text' }).then(createdch => {
        createdch.overwritePermissions(message.guild.roles.find(r => r.name ==  "@everyone"), { "READ_MESSAGES": false });    
        createdch.overwritePermissions(message.author, { "READ_MESSAGES": true });
        con.query(`SELECT * FROM logchannel WHERE guildid = ${message.guild.id}`,(err, rows) =>{
            if(rows.length < 1){
            con.query(`INSERT INTO logchannel (guildid,channel,channelname) VALUES ("${message.guild.id}","${createdch}","${createdch.name}")`);
            };
            if(rows.length > 0){
                con.query(`UPDATE logchannel SET channel = "${createdch}" WHERE guildid = "${message.guild.id}"`);
                con.query(`UPDATE logchannel SET channelname = "${createdch.name}" WHERE guildid = "${message.guild.id}"`);
            };
        });
    message.reply(`Created the log channel. ${createdch}`)
    })
    }
    if(args[0] == "channel"){
        con.query(`SELECT * FROM logchannel WHERE guildid = ${message.guild.id}`,(err, rows) =>{
        if(err) throw err;
        if(rows.length > 0){
            message.reply(`Your logchannel channel: ${rows[0].channel}`)
        }else{
            message.reply(`It looks like you didn't setup a logchannel.`)
        };
    })
};
}
}