module.exports = {
	name: 'muterole',
    description: 'Add,remove,create mute role. **When create. It will make a role with name muted**',
	guildonly: `true`,
	usage: `muterole <set/remove/create/role> [role]`,
	example: `muterole set @muted`,
	permission: `Administrator`,
	type: `Server`,
    category: `Administration`,
    cooldown: 3,
	execute(message, args, bot) {
    const discord = require("discord.js");
    const config = require("../config.json");
    const mysql = require(`mysql`);
    const database = require(`../database.json`)
    var role = message.mentions.roles.first() || message.guild.roles.get(args[1]);

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
    if(!message.guild.me.hasPermission("ADMINISTRATOR")) return message.channel.send(`:lock: I am not authorized to use this command.`)

    if(args[0] == "set"){
        if(!role) return message.reply(`You need to provide a role for this command`)
        con.query(`SELECT * FROM muterole WHERE guildid = ${message.guild.id}`,(err, rows) =>{
            if(rows.length < 1){
                con.query(`INSERT INTO muterole (guildid,role,roleid,rolename) VALUES ("${message.guild.id}","${role}","${role.id}","${role.name}")`);
                message.reply(`Set mute role to ${role}`)
            }
            if(rows.length > 0){
                con.query(`UPDATE muterole SET role = "${role}" WHERE guildid = "${message.guild.id}"`);
                con.query(`UPDATE muterole SET roleid = "${role.id}" WHERE guildid = "${message.guild.id}"`);
                con.query(`UPDATE muterole SET rolename = "${role.name}" WHERE guildid = "${message.guild.id}"`);
                message.reply(`Changed the muterole to ${role}`)
            };
        });
    }
    if(args[0] == "remove"){
        con.query(`DELETE FROM muterole WHERE guildid = ${message.guild.id}`,(err, rows) =>{
            if(err) throw err;
            message.reply(`Removed the muterole from the database.`)
            if(rows.length < 1){
                message.reply(`It looks like you didn't make a mute role yet`)
            }
        });
    };
    if(args[0] == "create"){
        var name = "Muted"
        const role5 = message.guild.roles.find(role => role.name == name)
        if(role5) {
            return message.channel.send(`There is already a role with the name Muted`)
        }
        message.guild.createRole({
            name: "Muted",
            color: "#808080",
        },"Muted role create").then(createdrole => {
        con.query(`SELECT * FROM muterole WHERE guildid = ${message.guild.id}`,(err, rows) =>{
            if(rows.length < 1){
            con.query(`INSERT INTO muterole (guildid,role,roleid,rolename) VALUES ("${message.guild.id}","${createdrole}","${createdrole.id}","${createdrole.name}")`);
            };
            if(rows.length > 0){
                con.query(`UPDATE muterole SET role = "${createdrole}" WHERE guildid = "${message.guild.id}"`);
                con.query(`UPDATE muterole SET roleid = "${createdrole.id}" WHERE guildid = "${message.guild.id}"`);
                con.query(`UPDATE muterole SET rolename = "${createdrole.name}" WHERE guildid = "${message.guild.id}"`);
            };
        });
    })
    message.reply(`Created a mute role.`)
    }
    if(args[0] == "role"){
        con.query(`SELECT * FROM muterole WHERE guildid = ${message.guild.id}`,(err, rows) =>{
        if(err) throw err;
        if(rows.length > 0){
            message.reply(`Your mute role: ${rows[0].role}`)
        }else{
            message.reply(`It looks like you didn't setup a mute role`)
        };
    })
};
}
}