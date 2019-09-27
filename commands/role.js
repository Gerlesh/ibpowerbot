const Discord = require('discord.js');

module.exports = {
	name: 'role', //Name of command
	description: 'Gives/removes specified role if allowed', //Description of Command
	args: true, //Arguments necessary? (true/false)
	usage: '<role>', //Optional/necessary arguments
	guildOnly: true, //Server only? (true/false)
	cooldown: 3, //Cooldown in seconds for command
	aliases: ['r'], //Other possible ways to call command, written in '' marks and separated by ,
  deleteMessage: false,
	execute(message, args) {
		const roleQuery = args.join(' ');
		const role = message.guild.roles.find(x => x.name.toLowerCase() == roleQuery.toLowerCase());

		if (role) {
			if (role.editable) {
				if (role.hexColor == '#000000') {
					if (message.member.roles.has(role.id)) {
						message.member.removeRole(role);
		
            console.log(`Role "${role.name}" given to ${message.author.tag}.`);
            
						if (message.channel.id != "541084422808797184") {
              message.channel.send("Role removed");
            };
					} else {
						message.member.addRole(role);
							
            console.log(`Role "${role.name}" taken away from ${message.author.tag}.`);
            
						if (message.channel.id != "541084422808797184") {
              message.channel.send("Role added");
            };
					};
				} else {
					message.channel.send("You can't give yourself that role!");
				};
			} else {
				message.channel.send("You can't give yourself that role!");
			};
		} else {
			message.channel.send("That isn't a valid role!");
		};
	},
};