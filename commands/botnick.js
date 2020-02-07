module.exports = {
    name: 'botnick',
    description: 'Change the nick of the bot',
    guildonly: `false`,
    usage: `botnick <nickname>`,
    example: `botnick S.Hoip`,
    permission: `Developers`,
    type: `DM And Server`,
    category: `Developer`,
    cooldown: 7,
    async execute(message, args, bot, async) {
        const discord = require("discord.js");
        const config = require("../config.json");
        const mysql = require(`mysql`);
        const database = require(`../database.json`)
        var user = message.author;

        var con = mysql.createConnection({
            host: database.host,
            user: database.user,
            password: database.password,
            database: database.database
        });
        con.connect(err => {
            if(err) throw err;
        });
        con.query(`SELECT * FROM developers WHERE userid = '${message.author.id}'`, (err, rows) => {
             if (err) {
                message.reply('Something went wrong while checking if you have permission to restart.')
                throw new Error(err)
                return
            }
            if (rows.length < 1) return message.reply(`Only developers can run this command`)  
            bot.user.setUsername(args.join(' ')).catch(erro => {
                if(erro) throw erro
                message.channel.send(`Something went wrong with changing bot's nickname`)
            })
            message.channel.send(`Change bot's nick to ${args.join(' ')}`)
        });
    } 
}