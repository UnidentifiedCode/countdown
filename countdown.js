const { Client, RichEmbed } = require("discord.js");
const { prefix, token } = require("./data/config.json");
const mongoose = require("mongoose");
const client = new Client({disableEveryone: true});

//mongoose.connect("mongodb+srv://<user>:<password>@unidentified-7y9m6.mongodb.net/Countdown?retryWrites=true&w=majority", {
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const Counters = require("./models/Counter.js");

client.on("ready", () => {
  client.user.setActivity(`.time of ${client.users.size} users`, { type: "WATCHING" });
  client.user.setStatus("dnd");
  console.log("[SYSTEM] The bot is online.");
});

client.on("message", async message => {
  
  if(message.author.bot) return;
  if(message.content.indexOf(prefix) !== 0) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  if(command === "countdown" || command === "time" || command === "timeleft" || command === "tl" || command === "cd" ) {

	let countdowntime = Math.floor(Math.random() * 2175984000) + 31536000;;
	
	const countdownEmbed = new RichEmbed()
		.setAuthor(client.user.username, client.user.avatarURL)
		.setDescription("Death? There's a app for that!")
		.setColor("#000000")
		.setThumbnail(message.author.avatarURL)
		.setTimestamp()
		.setFooter(`${client.user.username} v0.0.3`, client.user.avatarURL);
	
	Counters.findOne({
		userID: message.author.id
	}, (err, res) => {
		if(err) console.log(err);
		
		if(!res) {
			const newDoc = new Counters({
				userID: message.author.id,
				username: message.author.username,
				time: countdowntime
			})
			newDoc.save().catch(err => console.log(err));
			cd = Number(countdowntime);
			let y = Math.floor(cd / 31536000);
			let m = Math.floor((cd % 31536000) / 2628000);
			let day = Math.floor(((cd % 31536000) % 2628000) / 86400);
			let hour = Math.floor((((cd % 31536000) % 2628000) % 86400) / 3600);
			let min = Math.floor(((((cd % 31536000) % 2628000) % 86400) % 3600) / 60);
			let sec = Math.floor((((((cd % 31536000) % 2628000) % 86400) % 3600) % 60) % 60);
			countdownEmbed.addField(`\u200b`, `**${y}** Years **${m}** Months **${day}** Days \n**${hour}** Hours **${min}** Minutes **${sec}** Seconds`, true)
			message.channel.send(countdownEmbed);
			//message.reply(`Years: ${y} | Months: ${m} | Days: ${day} | Hours: ${hour} | Minutes: ${min} | Seconds: ${sec}`);
        } else {
			cd = Number(res.time);
			let y = Math.floor(cd / 31536000);
			let m = Math.floor((cd % 31536000) / 2628000);
			let day = Math.floor(((cd % 31536000) % 2628000) / 86400);
			let hour = Math.floor((((cd % 31536000) % 2628000) % 86400) / 3600);
			let min = Math.floor(((((cd % 31536000) % 2628000) % 86400) % 3600) / 60);
			let sec = Math.floor((((((cd % 31536000) % 2628000) % 86400) % 3600) % 60) % 60);
			countdownEmbed.addField(`\u200b`, `**${y}** Years **${m}** Months **${day}** Days \n**${hour}** Hours **${min}** Minutes **${sec}** Seconds`, true)
			message.channel.send(countdownEmbed);
			//message.reply(`Years: ${y} | Months: ${m} | Days: ${day} | Hours: ${hour} | Minutes: ${min} | Seconds: ${sec}`);
        }
      })
  }
  
  if(command === "botinfo" || command === "info" || command === "dev" || command === "support"){
    const botInfo = new RichEmbed()
	.setAuthor(client.user.username + "info", client.user.avatarURL)
	.setColor("#000000")
	.setThumbnail(client.user.displayAvatarURL)
	.addField("👑 Developer", `HaZZe#1337`, true)
	.addField("💎 Support Server", `Soon.../*http://hazze.cf/hut*/`, true)
	.addField("📤 Invite", `Soon.../*[Invite me](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=379904*/)`, true)
	.addField('👤 Total Users', `${client.users.size}`, true)
	.addField('📁 Total Channels:', `${client.channels.size}`, true)
	.addField('🛡 Total Servers', Math.ceil(client.guilds.size), true)
	.addField('\u200b', `Built with discord.js`)
	.setTimestamp()
	.setFooter(`${client.user.username} v0.0.3`, client.user.avatarURL);
    message.channel.send(botInfo);
  }
  if(command === "help") {
    const botInfo = new RichEmbed()
	.setAuthor(client.user.username + " commands", client.user.avatarURL)
	.setColor("#000000")
	.setThumbnail(client.user.displayAvatarURL)
	.addField(`**${prefix}countdown**`, `**Description:** Death? There's an app for that./n**Alias:** time, timeleft, tl, cd`)
        .addField(`**${prefix}botinfo**`, `**Description:** Show bot informations./n**Alias:** info, dev, support`)
	.setTimestamp()
	.setFooter(`Bot prefix is ${prefix}`, client.user.avatarURL);
    message.channel.send(botInfo);
  }
});

//client.login(token);
client.login(process.env.BOT_TOKEN)
