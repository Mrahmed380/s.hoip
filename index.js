const discord = require("discord.js");
const fs = require("fs");
const bot = new discord.Client();
bot.commands = new discord.Collection();
const cooldowns = new discord.Collection();
const config = require("./config.json");
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const active = new Map();
var options = {
  active: active
}
var prefix = config.prefix;
bot.on('ready', () => {
    console.log('Bot ready.');
});

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);


	bot.commands.set(command.name, command);
}

bot.on('message', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = bot.commands.get(commandName)
	if (!command) return;
  if(bot.commands.get(commandName).guildonly == "true") return message.channel.send(`I can't execute that command inside DMs!`)
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
      return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
    }
  }  
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount); 
	try {
	command.execute(message, args, bot, options, active, cooldowns, config, fs, discord, command, commandName, config);
  }catch (error) {
    console.log(error)
  };
});

bot.login(config.token)