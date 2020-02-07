module.exports = {
	name: 'welcomerole',
    description: 'Set a welcome role.',
	guildonly: `true`,
	usage: `welcomerole <set/disable> [role]`,
	example: `welcomerole members`,
	permission: `Administrator`,
	type: `Server`,
    category: `Administration`,
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
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`:lock: You are not authorized to use this command.`)
    var role = message.mentions.roles.first() || message.guild.roles.get(args[1]);
    if(args[0] == "set"){
        if(!role) return message.reply(`You need to mention a role for this command`)  
        con.query(`SELECT * FROM welcomerole WHERE guildid = ${message.guild.id}`,(err, rows) =>{
            if(err) throw err;
            if(rows.length < 1){
                con.query(`INSERT INTO welcomerole (guildid,rolename,roleid) VALUES ("${message.guild.id}","${role.name}","${role.id}")`);
                message.reply(`Set ${role.name} as welcomerole`)
            };
            if(rows.lengt > 0){
                con.query(`UPDATE welcomerole SET rolename = "${role.name}" WHERE guildid = "${message.guild.id}"`);
                con.query(`UPDATE welcomerole SET roleid = "${role.id}" WHERE guildid = "${message.guild.id}"`);
                message.reply(`Set ${role.name} as welcomerole`)
            };
        });
    }
    if(args[0] == "disable"){
        con.query(`DELETE FROM welcomerole WHERE guildid = ${message.guild.id}`,(err, rows) =>{
            if(err) throw err;
            if(rows.length < 1){
                return message.reply(`It is already disabled`)
            };
            message.reply(`I will stop with giving people the role now`)
        });
    };
    if(!args[0]){
        con.query(`SELECT * FROM welcomerole WHERE guildid = ${message.guild.id}`,(err, rows) =>{
            if(rows.length < 1){
                return message.reply(`I see you didn't setup any welcomerole yet. You can do it with ${config.prefix}welcomerole set <role>`)
            }
            if(rows.length > 0){
                var roledone = rows[0].rolename;
                message.reply(`Your welcomerole is ${roledone}`)
            }
        });
    }
    }
}