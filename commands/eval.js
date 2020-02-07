module.exports = {
    name: 'eval',
    description: 'Eval a code. Like bot.guilds.size',
    guildonly: `false`,
    usage: `eval <code>`,
    example: `eval bot.guilds.size`,
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

            const clean = text => {
                if (typeof(text) === "string")
                  return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
                else
                    return text;
              }
                try {
                const code = args.join(" ");
                let evaled = eval(code);
           
                if (typeof evaled !== "string")
                  evaled = require("util").inspect(evaled);
           
                message.channel.send(clean(evaled), {code:"xl"});
              } catch (err) {
                message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
              }
        });
    } 
}