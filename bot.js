const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client;

const prefix = process.env.prefix;

const metadata = require('./metadata.json');

client.commands = new Discord.Collection(); // The container for all commands
const cooldowns = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
// reads the file 'commands', then syncs it to 'commandFiles' constant

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
} // adds all command files from the files folder into the commands collection



client.on("ready", () => {
    console.log("Odin is operational.");
});

client.on("message", message => {

    function isValidCommand(message) {
        return (message.content.toLowerCase().startsWith(prefix) && !message.author.bot);
    } // returns whether or not the message is a valid command
    
    if (!isValidCommand(message)) { return; }
    // exits if the message is not a valid command
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    // const command = client.commands.get(commandName)
	// 	|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    // if (!command) return;
    const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;


    if ((command.args === true || !typeof command === "string") && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}.`;
        if (command.usage) {
            reply += `\nThe proper usage would be:\n${prefix}${command.name} ${command.usage}`;

            return message.channel.send(reply);
        }
    }

    function checkRole(message, perm) {
        if (command.permissions === false) { return; };
        if (message.author.id === message.guild.ownerID) { return; };
        let truth = (command.permissions.toLowerCase() === perm.name.toLowerCase()
                    && !message.member.roles.cache.some(role => role.name.toLowerCase() === perm.name.toLowerCase()));
        if (truth) {
            var reply = `You don't have permissions to use this command, ${message.author}.\n` +
                        `In order to use this command, you must have the ${perm.name} role.`;
            message.channel.send(reply);
        }
        return truth;
    }

    if (checkRole(message, metadata.roles.staff)) { return; }
    if (checkRole(message, metadata.roles.admin)) { return; }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now(); // var with current time
    const timestamps = cooldowns.get(command.name); // var that gets the Collection for triggered command
    const cooldownAmount = (command.cooldown || 3) * 1000; // 3s is default, convers to milliseconds

    if (timestamps.has(message.author.id)) { // cooldowns
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args); // Tries to run the command
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    } // If an error occours, log it and tell the user.


});




client.login(process.env.token);