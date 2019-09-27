const Discord = require('discord.js')

module.exports = {
	name: 'resources', //Name of command
	description: 'Provides links for useful IB Resources.', //Description of command
	args: false, //Arguments necessary? (true/false)
	usage: '', //Optional/necessary arguments
	guildOnly: false, //Server only? (true/false)
	cooldown: 3, //Cooldown in seconds for command
	aliases: ['rs', 'documents', 'docs'], //Other possible ways to call command, written in '' marks and separated by ,
  deleteMessage: false,
	execute(message, args) {
		const resourcesList = new Discord.RichEmbed().setTitle('**Resources**').setDescription('The following links contain useful IB Resources').setColor('#62D0F6')	//Create embed template
			.addField('IB Documents (default)','https://www.ib.redditor.website/')																						// |
			.addField('IBO Discord','https://discord.gg/ibo')																											// |
			.addField('IB Resource Resource Repository','https://www.ibdocuments.com/ResourcesRepository.html')															// | Add fields for each link
			.addField('MPSJ IB Google Drive','https://drive.google.com/drive/folders/1FaU2rxN9Jf2BJOe3Ft673mQjKGy2znQu?usp=sharing')									// |
			.addField('IBO Subreddit','https://www.reddit.com/r/IBO/');																									// |
		message.channel.send(resourcesList); //Send embed
	}
};