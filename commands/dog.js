module.exports = {
	name: 'dog',
	description: 'Give you a dog from the reddit',
	guildonly: `false`,
	usage: `dog`,
	example: `dog`,
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
        "dogs",
        "DOGS"
    ]

    let subreddit = reddit[Math.floor(Math.random() * reddit.length)];


    randomPuppy(subreddit).then(async url => {
            await message.channel.send({
                files: [{
                    attachment: url,
                    name: 'dog.png'
                }]
            })
    }).catch(err => console.error(err));
}
}