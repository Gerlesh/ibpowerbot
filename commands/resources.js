const Discord = require('discord.js');
const resources = require('../resources.json');

module.exports = {
	name: 'resources', //Name of command
	description: 'Provides links for useful Resources.', //Description of command
	args: false, //Arguments necessary? (true/false)
	usage: '', //Optional/necessary arguments
	guildOnly: false, //Server only? (true/false)
	cooldown: 3, //Cooldown in seconds for command
	aliases: ['rs', 'documents', 'docs'], //Other possible ways to call command, written in '' marks and separated by ,
	deleteMessage: false,
	execute(message, args) {
		const resourcesList = new Discord.RichEmbed().setTitle('**Resources**').setDescription('The following links contain useful IB Resources').setColor('#62D0F6')	//Create embed template
		for (let [name,link] of Object.entries(resources)) {
			resourcesList.addField(name,link);
		};
		message.channel.send(resourcesList); //Send embed
	}
};
