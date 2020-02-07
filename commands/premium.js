module.exports = {
	name: 'premium',
	description: 'Add,Remove and get a list from premium users',
	guildonly: `false`,
	usage: `premium <add/remove/list>`,
	example: `premium add @scraayp#9050`,
	permission: `Bot Developer`,
	type: `DM And Server`,
    category: `developer`,
    cooldown: 3,
	execute(message, args, bot) {
    const discord = require("discord.js");
    const config = require("../config.json");
    const mysql = require(`mysql`);
    const database = require(`../database.json`)
    var user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]));
    var a = args[0];
    var addedby = message.author.tag

    var con = mysql.createConnection({
        host: database.host,
        user: database.user,
        password: database.password,
        database: database.database
    });
    con.connect(err => {
        if(err) console.log(err)
    });
    con.query(`SELECT * FROM developers WHERE userid = '${message.author.id}'`, (err, rows) => {
        if (err) {
           message.reply('Something went wrong while checking if you have permission to developer.')
           throw new Error(err)
           return
       }
       if (rows.length < 1) return message.reply(`Only developers can run this command`);
        if(!a) return message.reply(`You did forget about a. add/remove/list`);

        if(a == "add"){
        if(!user) return message.reply(`You need to provide a user to this command`);
        con.query(`SELECT * FROM premium WHERE userid = ${user.id}`,(err, rows) =>{
            if(err) throw err;
            if(rows.length < 1){
                con.query(`INSERT INTO premium (userid,user) VALUES ("${user.id}","${user.user.tag}")`);
                message.reply(`added ${user.user.tag} to the database`)
            } else {
                message.reply(`It looks like this user is already in our database`)
            };
        })
    }
    if(a == "remove"){
        if(!user) return message.reply(`You need to provide a user to this command`);
        con.query(`DELETE FROM premium WHERE userid = ${user.id}`,(err, rows) =>{
            if(err) throw err;
            if(rows.length < 1){
                message.reply(`It looks like this user isn't in our database`)
            }
            message.reply(`Removed ${user.user.tag} from the database`)
        })
    };
    if(a == "list"){
        con.query(`SELECT * FROM premium`,(err, rows) => {
            if(err) throw err;
            if(rows.length > 0){
                const embed = new discord.RichEmbed()
                embed.setTitle('List Developers')
                for (i=0; i < rows.length; i++) {
                var user = rows[i].user;
                var id = rows[i].id;
                embed.addField(`[${id}] ${user}`, `Has premium`)
                }
                embed.setTimestamp()
                embed.setColor(`#0000ff`)
                message.channel.send(embed)
            }else {
               message.reply(`I found nobody in that database`)
            }
        })
    }
   })
}
}