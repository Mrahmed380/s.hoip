module.exports = {
	name: 'test',
	description: 'test command',
	guildonly: `false`,
	usage: `test`,
	example: `test`,
	permission: `Developer`,
	type: `DM And Server`,
	category: `Developer`,
	cooldown: 2,
	execute(message, args, bot) {
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
            message.reply(`Test`)   
        })
    }
}; 