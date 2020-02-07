// Getters
const discord = require("discord.js");
const fs = require("fs");
const bot = new discord.Client();
bot.commands = new discord.Collection();
const cooldowns = new discord.Collection();
const config = require("./config.json")
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const active = new Map();
const options = {
  active: active
}
const ops = {
  active: active
}
const mysql = require(`mysql`);
const database = require(`./database.json`)
const prefix = config.prefix;
const con = mysql.createConnection({
  host: database.host,
  user: database.user,
  password: database.password,
  database: database.database
});
con.connect(err => {
  if(err) throw err;
});
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
}
// Important events
bot.on('ready', () => {
  console.log(`Bot ready.\nCommands Loaded: ${bot.commands.size}`);
});
bot.on('message', async message => {
    if(message.content.startsWith(bot.user)) return message.reply(`My prefix is: ${prefix}`)
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = bot.commands.get(commandName)
	  if (!command) return;
    if(message.channel.type !== 'text'){
      if(bot.commands.get(commandName).guildonly == "true") return message.channel.send(`I can't execute that command inside DMs!`)
    }
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new discord.Collection());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the command.`);
      }
    }  
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount); 
	  try {
	    command.execute(message, args, bot, options, active, cooldowns, config, fs, discord, command, commandName, config, prefix, options, ops);
    }catch (error) {
      console.log(error)
    };
});
// Events
bot.on(`error`, (error) => {
  if(error) throw error;
  bot.channels.get(`658353419165368341`).send(`Error in the console\n\n${error}`);
});
bot.on(`warn`, (info) => {
  if(info) throw info;
  bot.channels.get(`658353419165368341`).send(`Warn in the console\n\n${info}`);
});
bot.on('disconnect', (event) => {
  if(event) throw event
  bot.channels.get(`658353419165368341`).send(`Disconnecting\n\n${event}`);
});
bot.on('reconnecting', () => {
  bot.channels.get(`658353419165368341`).send(`Reconnecting`);
});

//Loggings
bot.on(`guildMemberAdd`, (member) => {
  con.query(`SELECT * FROM welcomerole WHERE guildid = ${member.guild.id}`,(err, rows) =>{
    if(err) throw err;
    if(rows.length > 0){
      var role = rows[0].rolename;
      var roleadd = member.guild.roles.find(r => r.name ==  role)
      member.addRole(roleadd,"Welcome role")
      if(err) throw err;
    };
  });
  con.query(`SELECT * FROM logchannel WHERE guildid = ${member.guild.id}`,(err, rows) =>{
    if(err) throw err;
    if(rows.length > 0){
      var logembed = new discord.RichEmbed()
      .setTitle(`Channel Create`)
      .addField(`Channel`,channel)
      .setTimestamp()
      var logchanneldoc = rows[0].channelname;
      var logchannel = channel.guild.channels.find(c => c.name == logchanneldoc)
      logchannel.send(logembed)
      if(err) throw err;
    };
  });
});
bot.on(`channelCreate`, (channel) => {
  con.query(`SELECT * FROM logchannel WHERE guildid = ${channel.guild.id}`,(err, rows) =>{
    if(err) throw err;
    if(rows.length > 0){
      var logembed = new discord.RichEmbed()
      .setTitle(`Channel Create`)
      .addField(`Channel`,channel)
      .setTimestamp()
      var logchanneldoc = rows[0].channelname;
      var logchannel = channel.guild.channels.find(c => c.name == logchanneldoc)
      logchannel.send(logembed)
      if(err) throw err;
    };
  });
});
bot.on(`channelDelete`, (channel) => {
  con.query(`SELECT * FROM logchannel WHERE guildid = ${channel.guild.id}`,(err, rows) =>{
    if(err) throw err;
    if(rows.length > 0){
      var logembed = new discord.RichEmbed()
      .setTitle(`Channel Delete`)
      .addField(`Channel`,channel.name)
      .setTimestamp()
      var logchanneldoc = rows[0].channelname;
      var logchannel = channel.guild.channels.find(c => c.name == logchanneldoc)
      logchannel.send(logembed)
      if(err) throw err;
    };
  });
});
bot.on(`emojiCreate`, (emoij) => {
  con.query(`SELECT * FROM logchannel WHERE guildid = ${emoij.guild.id}`,(err, rows) =>{
    if(err) throw err;
    if(rows.length > 0){
      var logembed = new discord.RichEmbed()
      .setTitle(`Emoji Create`)
      .addField(`Emoij`,emoij)
      .addField(`Emoij Name`,emoij.name)
      .setTimestamp()
      var logchanneldoc = rows[0].channelname;
      var logchannel = emoij.guild.channels.find(c => c.name == logchanneldoc)
      logchannel.send(logembed)
      if(err) throw err;
    };
  });
});
bot.on(`emojiDelete`, (emoij) => {
  con.query(`SELECT * FROM logchannel WHERE guildid = ${emoij.guild.id}`,(err, rows) =>{
    if(err) throw err;
    if(rows.length > 0){
      var logembed = new discord.RichEmbed()
      .setTitle(`Emoji Delete`)
      .addField(`Emoij`,emoij)
      .addField(`Emoij Name`,emoij.name)
      .setTimestamp()
      var logchanneldoc = rows[0].channelname;
      var logchannel = emoij.guild.channels.find(c => c.name == logchanneldoc)
      logchannel.send(logembed)
      if(err) throw err;
    };
  });
});
bot.on(`guildBanAdd`, (guild,user) => {
  con.query(`SELECT * FROM logchannel WHERE guildid = ${guild.id}`,(err, rows) =>{
    if(err) throw err;
    if(rows.length > 0){
      var logembed = new discord.RichEmbed()
      .setTitle(`User Banned`)
      .addField(`User`,user.tag)
      .setTimestamp()
      var logchanneldoc = rows[0].channelname;
      var logchannel = guild.channels.find(c => c.name == logchanneldoc)
      logchannel.send(logembed)
      if(err) throw err;
    };
  });
});
bot.on(`guildBanRemove`, (guild,user) => {
  con.query(`SELECT * FROM logchannel WHERE guildid = ${guild.id}`,(err, rows) =>{
    if(err) throw err;
    if(rows.length > 0){
      var logembed = new discord.RichEmbed()
      .setTitle(`User Unbanned`)
      .addField(`User`,user.tag)
      .setTimestamp()
      var logchanneldoc = rows[0].channelname;
      var logchannel = guild.channels.find(c => c.name == logchanneldoc)
      logchannel.send(logembed)
      if(err) throw err;
    };
  });
});
bot.on(`guildMemberRemove`, (member) => {
  con.query(`SELECT * FROM logchannel WHERE guildid = ${member.guild.id}`,(err, rows) =>{
    if(err) throw err;
    if(rows.length > 0){
      var logembed = new discord.RichEmbed()
      .setTitle(`User Kicked/Left`)
      .addField(`User`,user.tag)
      .setTimestamp()
      var logchanneldoc = rows[0].channelname;
      var logchannel = member.guild.channels.find(c => c.name == logchanneldoc)
      logchannel.send(logembed)
      if(err) throw err;
    };
  });
});
bot.on(`messageDelete`, (message) => {
  con.query(`SELECT * FROM logchannel WHERE guildid = ${message.guild.id}`,(err, rows) =>{
    if(err) throw err;
    if(rows.length > 0){
      var logembed = new discord.RichEmbed()
      .setTitle(`Message Deleted`)
      .addField(`Message`,message.content)
      .addField(`Channel`,message.channel)
      .setTimestamp()
      var logchanneldoc = rows[0].channelname;
      var logchannel = message.guild.channels.find(c => c.name == logchanneldoc)
      logchannel.send(logembed)
      if(err) throw err;
    };
  });
});
bot.on(`messageReactionAdd`, (messagereaction,user) => {
  con.query(`SELECT * FROM logchannel WHERE guildid = ${user.guild.id}`,(err, rows) =>{
    if(err) throw err;
    if(rows.length > 0){
      var logembed = new discord.RichEmbed()
      .setTitle(`Reaction Added`)
      .addField(`Message`,message.content)
      .addField(`Channel`,message.channel)
      .addField(`Reaction`,messagereaction.emoij)
      .setTimestamp()
      var logchanneldoc = rows[0].channelname;
      var logchannel = user.guild.channels.find(c => c.name == logchanneldoc)
      logchannel.send(logembed)
      if(err) throw err;
    };
  });
});
bot.on(`messageReactionRemove`, (messagereaction,user) => {
  con.query(`SELECT * FROM logchannel WHERE guildid = ${user.guild.id}`,(err, rows) =>{
    if(err) throw err;
    if(rows.length > 0){
      var logembed = new discord.RichEmbed()
      .setTitle(`ReactionRemoved`)
      .addField(`Message`,message.content)
      .addField(`Channel`,message.channel)
      .addField(`Reaction`,messagereaction.emoij)
      .setTimestamp()
      var logchanneldoc = rows[0].channelname;
      var logchannel = user.guild.channels.find(c => c.name == logchanneldoc)
      logchannel.send(logembed)
      if(err) throw err;
    };
  });
});
bot.on(`roleCreate`, (role) => {
  con.query(`SELECT * FROM logchannel WHERE guildid = ${role.guild.id}`,(err, rows) =>{
    if(err) throw err;
    if(rows.length > 0){
      var logembed = new discord.RichEmbed()
      .setTitle(`Role Create`)
      .addField(`Role`,role)
      .setTimestamp()
      var logchanneldoc = rows[0].channelname;
      var logchannel = role.guild.channels.find(c => c.name == logchanneldoc)
      logchannel.send(logembed)
      if(err) throw err;
    };
  });
});
bot.on(`roleDelete`, (role) => {
  con.query(`SELECT * FROM logchannel WHERE guildid = ${role.guild.id}`,(err, rows) =>{
    if(err) throw err;
    if(rows.length > 0){
      var logembed = new discord.RichEmbed()
      .setTitle(`Role Delete`)
      .addField(`Role`,role.name)
      .setTimestamp()
      var logchanneldoc = rows[0].channelname;
      var logchannel = role.guild.channels.find(c => c.name == logchanneldoc)
      logchannel.send(logembed)
      if(err) throw err;
    };
  });
});
bot.on(`webhookUpdate`, (channel) => {
  con.query(`SELECT * FROM logchannel WHERE guildid = ${channel.guild.id}`,(err, rows) =>{
    if(err) throw err;
    if(rows.length > 0){
      var logembed = new discord.RichEmbed()
      .setTitle(`Webhook Update`)
      .addField(`Channel`,channel)
      .setTimestamp()
      var logchanneldoc = rows[0].channelname;
      var logchannel = role.guild.channels.find(c => c.name == logchanneldoc)
      logchannel.send(logembed)
      if(err) throw err;
    };
  });
});

// login
bot.login(config.token)