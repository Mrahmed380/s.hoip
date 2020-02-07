module.exports = {
	name: 'purge',
	description: 'Clear amount of messages in this channel',
	guildonly: `true`,
	usage: `purge <amount>`,
	example: `purge 50`,
	permission: `MANAGE_MESSAGES`,
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
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(`You are not allowed to purge messages here`)
    const deleteCount = args[0]
    
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    message.channel.bulkDelete(deleteCount)
      .catch(error => {
          message.reply(`Couldn't delete messages because of a error.\n\nCheck if the messages are not over 14 days.`)
            console.log(`Error: ${error}`);
            var errembed = new discord.RichEmbed()
            .setTitle(`ERR Message`)
            .setDescription(`\`\`\`\n${error}\n\`\`\``)
            .setTimestamp()
            bot.channels.get(`658353419165368341`).send(errembed).catch(err => console.log(err));
      });
    
}
}