module.exports = {
	name: 'meme',
	description: 'Give you a meme from the reddit',
	guildonly: `false`,
	usage: `meme`,
	example: `meme`,
	permission: `None`,
	type: `Server`,
    category: `fun`,
    cooldown: 3,
	execute(message, args, bot) {
    const discord = require("discord.js");
    const config = require("../config.json");
    const mysql = require(`mysql`);
    const database = require(`../database.json`)
    const randomPuppy = require('random-puppy');

    var con = mysql.createConnection({
        host: database.host,
        user: database.user,
        password: database.password,
        database: database.database
    });
    con.connect(err => {
        if(err) throw err;
    });
    let reddit = [
        "meme",
        "animemes",
        "MemesOfAnime",
        "animememes",
        "AnimeFunny",
        "dankmemes",
        "dankmeme",
        "wholesomememes",
        "MemeEconomy",
        "techsupportanimals",
        "meirl",
        "me_irl",
        "2meirl4meirl",
        "AdviceAnimals"
    ]
    let subreddit = reddit[Math.floor(Math.random() * reddit.length)];
    randomPuppy(subreddit).then(async url => {
        await message.channel.send({
            files: [{
                attachment: url,
                name: 'meme.png'
            }]
        }).catch(err => console.error(err));
    });
}
}