module.exports = {
	name: 'leave',
	description: 'Leave voice command',
	guildonly: `true`,
	usage: `leave`,
	example: `leave`,
	permission: `Premium Users`,
	type: `DM And Server`,
	category: `Music`,
	cooldown: 3,
	execute(message, args, bot) {
        return message.reply(`Command has been disabled due a bug.`)
	const discord = require("discord.js");
    const config = require("../config.json");
    const ytdl = require("ytdl-core");
    const mysql = require(`mysql`);
    const database = require(`../database.json`)
    var con = mysql.createConnection({
        host: database.host,
        user: database.user,
        password: database.password,
        database: database.database
    });
    con.connect(err => {
        if(err) console.log(err)
    });
    con.query(`SELECT * FROM premium WHERE userid = '${message.author.id}'`, (err, rows) => {
        if (err) {
           message.reply('Something went wrong while checking if you have permission to premium commands.')
           throw new Error(err)
           return
       }
       if (!message.member.voiceChannel) return message.channel.send("Please join first a voice channel");
 
        if (!message.guild.me.voiceChannel) return message.channel.send("I am not in any voice channel");
 
        if (message.guild.me.voiceChannelID != message.member.voiceChannelID) return message.channel.send("Sorry you are not in the same voice channel");
 
        message.guild.me.voiceChannel.leave();
 
        message.channel.send("I have left the channel");   
    });
		
    }
};