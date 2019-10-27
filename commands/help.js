const { prefix } = require('../config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'help', //Name of command
	description: 'Provides help on the various commands. Specify a command to receive more detailed help.', //Description of command
	args: false, //Arguments necessary? (true/false)
	usage: '<optional command>', //Optional/necessary arguments
	guildOnly: true, //Server only? (true/false)
	cooldown: 3, //Cooldown in seconds for command
	aliases: ['commands','q'], //Other possible ways to call command, written in '' marks and separated by ,
	execute(message, args) {
		const { commands } = message.client; //Obtain command list from main bot file

		if (!args.length) { //If no command is specified
			const generalHelp = new Discord.RichEmbed().setTitle("**Commands**").setDescription("**Use -help [command] to get help on specific commands!**").setColor('#62D0F6'); //Create general embed
			commands.forEach(function addCommandsToEmbed(command) {
				generalHelp.addField(`-${command.name} ${command.usage}`,command.description); //Add a field for each command file containing its name and usage as the field name and its description as the field value
			});
			return message.channel.send(generalHelp); //Send embed
		};

		const name = args[0].toLowerCase(); //Requested command name
		const command = commands.get(name) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(name)); //Retrieve information from requested command file and check command file for matching aliases

		if (!command) {
		return message.reply('That\'s not a valid command.'); //If the requested command doesn't exist indicate to command sender that it is invalid
		};

		const specificHelp = new Discord.RichEmbed().setTitle(`**Command: ${command.name}**`).setColor('#62D0F6'); //Create embed for the command
		if (command.description.length > 0) {specificHelp.setDescription(command.description)}; //If the command has a description add it to the embed description
		if (command.usage.length > 0) {specificHelp.addField(`Usage:`,`-${command.name} ${command.usage}`)}; //If the command has a usage add a field to the embed showing it
		if (command.aliases.length > 0) {specificHelp.addField(`Aliases:`,`-${command.aliases.join(`, -`)}`)}; //If the command has aliases add a field to the embed showing them

		message.channel.send(specificHelp); //Send the embed
	}
};
