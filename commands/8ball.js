module.exports = {
	name: '8ball',
	description: 'Ask a question to the bot',
	guildonly: `false`,
	usage: `8ball <question>`,
	example: `8ball Is scraayp your owner? {It's yes}`,
	permission: `None`,
	type: `DM And Server`,
    category: `Utility`,
    cooldown: 3,
	execute(message, args, bot) {
    const discord = require("discord.js");
    const config = require("../config.json");
    let replies = ["Yes", "No", "I don't know", "Ask again later!", "Cyka", "I am not sure!", "Pls No", "You tell me", "Without a doubt", "Cannot predict now", "None one knows it", "Are you serious?","Pretty sure it is. yes"];
    let result = Math.floor((Math.random() * replies.length));
    let question = args.join(" ");
    let ballembed = new discord.RichEmbed()
    .setAuthor(message.author.username)
    .setColor("#00ff00")
    .addField("Answer", replies[result]);

    message.channel.send(ballembed)
    }}