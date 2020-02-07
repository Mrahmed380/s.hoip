module.exports = {
	name: 'play',
	description: 'Music play command',
	guildonly: `true`,
	usage: `play 7 years`,
	example: `play <youtube search>`,
	permission: `Premium Users`,
	type: `DM And Server`,
	category: `Music`,
	cooldown: 3,
	execute(message, args, bot, options, ops) {
    return message.reply(`Command has been disabled due a bug.`)
        const discord = require("discord.js");
    const config = require("../config.json");
    const ytdl = require("ytdl-core");
    const mysql = require(`mysql`);
    const database = require(`../database.json`)
    const search = require('yt-search');
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
    if (!message.member.voiceChannel) return message.channel.send("Connect first with a voice channel");
    if (!args[0]) return message.channel.send("Sorry please provide me a song");
    var validate =  ytdl.validateURL(args[0]);
    if (!validate){
        search(args.join(' '), function (err, res) {
            if (err) return message.channel.send("Something went wrong");
        var videos = res.videos.slice(0, 10);
        var response = '';
        for (var i in videos) {
            response += `**[${parseInt(i) + 1}]:** ${videos[i].title} \r\n`;
        }
 
        response += `Choose a nummer 1-${videos.length}.`;
        message.channel.send(response);
        const filter = music => !isNaN(music.content) && music.content < videos.length + 1 && music.content > 0;
        const collection = message.channel.createMessageCollector(filter);
        collection.videos = videos;
        collection.once('collect', function (music) {
            var commandFile = require('./play.js');
            commandFile.run(bot, message, [this.videos[parseInt(music.content) - 1].url], ops);
        });
    });
}
    var info =  ytdl.getInfo(args[0]);
    var data = ops.active.get(message.guild.id) || {};
    if (!data.connection) data.connection =  message.member.voiceChannel.join();
    if (!data.queue) data.queue = [];
    data.guildID = message.guild.id;
    data.queue.push({
        songTitle: info.title,
        requester: message.author.tag,
        url: args[0],
        announceChannel: message.channel.id
    });
    if (!data.dispatcher) {
        Play(bot, ops, data);
    } else {
        message.channel.send(`Song: ${info.title} | Requested by: ${message.author.tag}`);
    }
    ops.active.set(message.guild.id, data);
    })
/**
 * @param {*} bot
 * @param {*} ops
 * @param {*} data
 */
async function Play(bot, ops, data) {
    bot.channels.get(data.queue[0].announceChannel).send(`Now Playing: ${data.queue[0].songTitle} - Requested By: ${data.queue[0].requester}`);
    var options = { seek: 2, volume: 1, bitrate: 128000 };
    data.dispatcher =  data.connection.playStream(ytdl(data.queue[0].url, { filter: "audioonly" }), options);
    data.dispatcher.guildID = data.guildID;
    data.dispatcher.once('end', function () {
        Finish(bot, ops, this);
    });
}
/**
 * @param {*} bot
 * @param {*} ops 
 * @param {*} dispatcher
 */
function Finish(bot, ops, dispatcher) {
    var fetchedData = ops.active.get(dispatcher.guildID);
    fetchedData.queue.shift();
    if (fetchedData.queue.length > 0) {
        ops.active.set(dispatcher.guildID, fetchedData);
        Play(bot, ops, fetchedData);
    } else {
        ops.active.delete(dispatcher.guildID);
        var voiceChannel = bot.guilds.get(dispatcher.guildID).me.voiceChannel;
        if (voiceChannel) voiceChannel.leave();
    }
    }}
};