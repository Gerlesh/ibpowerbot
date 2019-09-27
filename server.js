// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.on('ready', () => {
	console.log('Ready!'); //When the client is ready, log "Ready!" in console
  client.user.setPresence({ game: { name: `${config.prefix}help`}})
});

client.on('message', message => { //Client receives message
  if (message.channel.id == '541084422808797184' && !config.mods.includes(message.author.id)) {
    message.delete();
  }
  
	if (!message.content.startsWith(config.prefix) || message.author.bot || config.blocked.includes(message.author.id)) return; //If the received message doesn't start with the prefix or was sent by a bot, don't do anything with the message

	const args = message.content.slice(config.prefix.length).split(/ +/); //Arguments are separated by one or more spaces
	const commandName = args.shift().toLowerCase(); //The command is the first argument in lowercase and the arguments are all the other arguments
	
	//Set "aliases: ['<alias1>', '<alias2>']" in command file to enable aliases
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)); //Retrieve command file based on received command compared to command names and aliases in files

	if (!command) return; //If the received message isn't a command, don't do anything with the message

	console.log(`Command received from ${message.author.tag}: ${command.name}`); //Log command sender in console

	//Set "guildOnly: true" in command file to block use outside of DMs
	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!'); //If the channel is not a Server text channel and the command is server only, indicate this to command sender
	};

	//Set "args: true" in command file to require arguments
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}.`; //If arguments are required and none are given, indicate this to command sender (written to reply message)

		//Provide a "usage: <usage>" in command file to explain command usage
		if (command.usage) {
			reply += `\nThe proper usage would be: \`${config.prefix}${command.name} ${command.usage}\``; //If there is a command usage available for the command, indicate to the command sender (added to reply message)
		};

		return message.channel.send(reply); //Send reply message
	};
  
  if (command.deleteMessage) {
    message.delete();
  }

	//Set "cooldown: <value (s)>" in command file to add a cooldown to a command (default: 3)
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection()); //If cooldowns collection doesn't have the command, add it
	};

	const now = Date.now(); //Create timestamp 
	const timestamps = cooldowns.get(command.name); //Retrieves author cooldown
	const cooldownAmount = (command.cooldown || 3) * 1000; //Retrieve command cooldown or default to 3 seconds

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount; //When cooldown finishes

		if (now < expirationTime) { //If cooldown hasn't finished yet
			const timeLeft = (expirationTime - now) / 1000; //Calculates remaining cooldown
			return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`); //Indicates cooldown not over yet
		};
	};
	
	timestamps.set(message.author.id, now); //Sets the timestamp on the author to "now"
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args); //tries to execute command file
	} catch (error) {
		console.error(error); //logs error in console
		message.channel.send('There was an error trying to execute that command.'); //Indicates to command sender that there has been an error
	};
});

client.on('error',console.error);

client.login(process.env.SECRET); //Login token to access client