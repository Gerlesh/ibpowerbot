const Discord = require('discord.js');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const _ = require('lodash');

const adapter = new FileSync('hw.json');
const hw = low(adapter);

hw.defaults({  })
	.write();

module.exports = {
	name: 'homework', //Name of command
	description: 'Set and view homework for a teacher. Use `set` to provide homework for a teacher and `clear` to clear all the teacher\'s homework', //Description of command
	args: false, //Arguments necessary? (true/false)
	usage: '<teacher\'s last name> <optional clear/set/add> <if set or add, add homework here>', //Optional/necessary arguments
	guildOnly: false, //Server only? (true/false)
	cooldown: 3, //Cooldown in seconds for command
	aliases: ['hw','assignments','work'], //Other possible ways to call command, written in '' marks and separated by ,
  deleteMessage: false,
	execute(message, args) {
		if (args.length < 1) {
			const teachers = _.keys(hw.__wrapped__);

			const teacherNames = teachers.map(x => x.replace(/^\w/, c => c.toUpperCase()));

			const embed = new Discord.RichEmbed().setTitle('Teachers with homework:').setDescription(teacherNames.join(", ")).setColor('#62D0F6');

			if (teachers) {
				return message.channel.send(embed);
			} else {
				return message.channel.send("There are no teachers with homework right now.");
			};
		} else {
			const teacher = args.shift().toLowerCase(); //teacher (in lowercase) is the first argument; remove it from the arguments list
			const teacherName = teacher.replace(/^\w/, c => c.toUpperCase()); //teacherName is teacher with a capital first letter

			function sendHomeworkEmbed(msg) {
				const homeworkDb = hw.get(teacher); //homeworkDb is the homework set for the teacher in the database

				const embed = new Discord.RichEmbed().setTitle(`Homework for ${teacherName}:`).setDescription(homeworkDb).setColor('#62D0F6'); //Create embed with teacher's homework
				message.channel.send(msg,embed); //Send embed
			};

			switch (args[0]) {
				case 'set': //If subcommand is 'set'
					if (args.length < 2) {
						message.channel.send(`Please provide homework to set for ${teacherName}.`); //If no homework provided, ask for it from command sender

						break;
					};

					const homeworkSet = message.content.substring(message.content.indexOf('set') + 4); //homework is everything starting from the

					hw.set(teacher,homeworkSet).write(); //Add teacher with homework to hw database

          		console.log(`Homework for ${teacherName} set to:\n${hw.get(teacher)}`);
					sendHomeworkEmbed(`Homework for ${teacherName} set!`);

					break;

				case 'add': //If subcommand is 'add'
					if (args.length < 2) {
						message.channel.send(`Please provide homework to add for ${teacherName}.`); //If no homework provided, ask for it from command sender

						break;
					};
					const homeworkAdd = message.content.substring(message.content.indexOf('add') + 4);
					if (_.keys(hw.__wrapped__).includes(teacher)) {
						hw.update(teacher,homework => homework.concat('\n',homeworkAdd)).write();
					} else {
						hw.set(teacher,homeworkAdd).write();
					};

          		console.log(`Homework for ${teacherName} set to:\n${hw.get(teacher)}`);
					sendHomeworkEmbed(`Homework for ${teacherName} updated!`);

					break;

				case 'clear': //If subcommand is 'clear'
					hw.unset(teacher).write();

          		console.log(`Homework for ${teacherName} cleared`);
					message.channel.send(`Homework for ${teacherName} cleared`);

					break;

				default: //If there is no subcommand
					const teachers = _.keys(hw.__wrapped__)

					if (teachers.includes(teacher)) {
						sendHomeworkEmbed();
					} else {
						const teacherNames = teachers.map(x => x.replace(/^\w/, c => c.toUpperCase()));

						const embed = new Discord.RichEmbed().setTitle('Teachers with homework:').setDescription(teacherNames.join(", ")).setColor('#62D0F6');

						return message.channel.send(embed);
					};
			};
		}
	}
};
