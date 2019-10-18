const Discord = require('discord.js');
const urban = require('urban');

module.exports = {
	name: 'urban', //Name of command
	description: 'Search Urban Dictionary for a term.', //Description of Command
	args: false, //Arguments necessary? (true/false)
	usage: '<search term>', //Optional/necessary arguments
	guildOnly: false, //Server only? (true/false)
	cooldown: 5, //Cooldown in seconds for command
	aliases: ['u','define','dictionary','ud'], //Other possible ways to call command, written in '' marks and separated by ,
	execute(message, args) {
		if (args.length > 0) {
			urban(args.join(' ')).first(function(json) {
        if (json) {
          const definition = new Discord.RichEmbed()
            .setTitle(json.word)
            .setDescription(json.definition.replace(/\[\]/g,''))
            .addField('Example:',json.example.replace(/\[\]/g,''))
            .setTimestamp(json.written_on.substring(0,json.written_on.indexOf('T')-1).replace(/-/gi,' '))
            .setColor('#1C2337')
            .setURL(json.permalink)
            .setFooter(json.author)
            .setThumbnail('https://allstaractivist.files.wordpress.com/2015/02/urban_dict.png?w=627&h=214')
            .addField('👍 Likes',json.thumbs_up,true)
            .addField('👎 Dislikes',json.thumbs_down,true);

          message.channel.send(definition);
        } else {
          message.channel.send(`There is no entry for ${args.join(' ')}`);
        };
			});
		} else {
			urban.random().first(function(json) {
				const definition = new Discord.RichEmbed()
					.setTitle(json.word)
					.setDescription(json.definition.replace(/\[\]/g,''))
					.addField('Example:',json.example.replace(/\[\]/g,''))
					.setTimestamp(json.written_on.substring(0,json.written_on.indexOf('T')-1).replace(/-/gi,' '))
					.setColor('#1C2337')
					.setURL(json.permalink)
					.setFooter(json.author)
					.setThumbnail('https://allstaractivist.files.wordpress.com/2015/02/urban_dict.png?w=627&h=214')
					.addField('👍 Likes',json.thumbs_up,true)
					.addField('👎 Dislikes',json.thumbs_down,true);

				message.channel.send(definition);
			});
		};
	},
};
