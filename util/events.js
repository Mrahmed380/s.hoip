// Member Join
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
// Channel Create
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
// Channel Remove
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
  