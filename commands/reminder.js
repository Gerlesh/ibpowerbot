const Discord = require('discord.js');

class Reminder {
	constructor(time,message) {
		this.reminder = message;
		this.expires = 0;

		const timeValues = time.split(/[a-zA-Z]/);
		timeValues.pop();
		const timeUnitsRaw = time.split(/[0-9]+/);
		timeUnitsRaw.shift();
		const timeUnits = timeUnitsRaw.map(x => x.toLowerCase());

		for (var i = timeUnits.length - 1; i >= 0; i--) {
			switch (timeUnits[i]) {
				case 'w':
				case 'wks':
				case 'weeks':
				case 'week':
					this.expires += parseFloat(timeValues[i])*604800000;
					break;

				case 'd':
				case 'days':
				case 'day':
					this.expires += parseFloat(timeValues[i])*86400000;
					break;

				case 'h':
				case 'hrs':
				case 'hr':
				case 'hours':
				case 'hour':
					this.expires += parseFloat(timeValues[i])*3600000;
					break;

				case 'm':
				case 'min':
				case 'minutes':
				case 'minute':
					this.expires += parseFloat(timeValues[i])*60000;
					break;

				case 's':
				case 'sec':
				case 'seconds':
				case 'second':
					this.expires += parseFloat(timeValues[i])*1000;
					break;
			};
		};

		const timeLeft = [Math.floor(this.expires/604800000) + " week(s)",Math.floor(this.expires%604800000/86400000) + " day(s)",Math.floor(this.expires%604800000%86400000/3600000) + " hour(s)",Math.floor(this.expires%604800000%86400000%3600000/60000) + " minute(s)",Math.floor(this.expires%604800000%86400000%3600000%60000/1000) + " second(s)"];

		for (var i = timeLeft.length - 1; i >= 0; i--) {
			if (parseFloat(timeLeft[i]) == 0) {
				timeLeft.splice(i,1);
			};
		};

		this.timeLeft = timeLeft.join(', ');
	};
};

module.exports = {
	name: 'reminder', //Name of command
	description: 'Reminds you after a set amount of time\nWARNING: If the bot dies for any period of time, the reminder will not be carried out.', //Description of Command
	args: true, //Arguments necessary? (true/false)
	usage: '<time until reply> <message>', //Optional/necessary arguments
	guildOnly: true, //Server only? (true/false)
	cooldown: 10, //Cooldown in seconds for command
	aliases: ['remind','r'], //Other possible ways to call command, written in '' marks and separated by ,
	execute(message, args) {
		const reminder = new Reminder(args[0],args.length > 1 ? message.content.slice(message.content.indexOf(args[1])) : '');
		if (reminder.timeLeft.length > 0) {
			if (reminder.reminder.length > 0){
				message.channel.send(`Reminder set for ${reminder.timeLeft} from now: ${reminder.reminder}`);
			} else {
				message.channel.send(`Reminder set for ${reminder.timeLeft} from now!`);
			};
			setTimeout(function() {message.reply(reminder.timeLeft + " ago: " + reminder.reminder + "\n\nhttps://discordapp.com/channels/" + message.guild.id + "/" + message.channel.id + "/" + message.id)},reminder.expires);

		} else {
			message.channel.send(`Please provide a valid time (with units, i.e. \`-reminder 5m wake up\`)`);
		};
	}
};
