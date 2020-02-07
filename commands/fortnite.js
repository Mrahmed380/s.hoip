module.exports = {
	name: 'fortnite',
	description: 'Get stats of a user on fortnite.',
	guildonly: `false`,
	usage: `fortnite {nickname} [pc/ps4/xbox/mobile]`,
	example: `fortnite Scraayp pc`,
	permission: `None`,
	type: `DM And Server`,
    category: `utility`,
    cooldown: 3,
	async execute(message, args, bot) {
        const Client = require('simple-fortnite-api');
        const discord = require("discord.js")
        const config = require('../config.json')
        const fortnite = new Client(config.fortnitetoken);     
        let username1 = args[0]
        let platform = args[1] || "pc"
        let gamemode = "lifetime"
        if(!username1) return message.reply(`You need to provide me a epic username for this command.`)
        let data = await fortnite.find(args[0])
        if(data && data.code === 404) return message.channel.send("Unable to find that stats of that person");
        const {image, url, username} = data;
        const {scorePerMin, winRatio, kills, score, wins, kd, matches} = data[gamemode]
        const options = new discord.RichEmbed()
                .setColor("#32CD32")
                .setAuthor(`Epic Games (Fortnite) | ${username}` , image)
                .setTitle("Fortnite Stats")
                .setThumbnail(image)
                .setDescription(`**Gamemode:** ${gamemode.slice(0, 1).toUpperCase() + gamemode.slice(1)}
                **Kills:** ${kills || 0}
                **Score:** ${score ||0}
                **Score Per Min:** ${scorePerMin || 0}
                **Wins:** ${wins || 0}
                **Win Ratio:** ${winRatio || "0%"}
                **KD:** ${kd || 0}
                **Matches Played:** ${matches || 0}
                **Link:** [Link To Profile](${url})`)

            message.channel.send(options)
    }
}

