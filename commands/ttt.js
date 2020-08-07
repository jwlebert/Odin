const Discord = require('discord.js');
const prefix = process.env.prefix

module.exports = {
    name: 'ttt',
    description: 'A game of tic tac toe.',
    aliases: ['tictactoe'],
    type: 'misc',
    usage: '<argument or help>',
    args: true,
    cooldown: 10,
    permissions: false,
    execute(message, args) {
        let cmdName = this.name;
        let commands = [];
        instantiateCommandObject(commands, 'help', 'Displays a list of availible decisive arguments for the tts command.',
                                `help`);
        instantiateCommandObject(commands, 'challenge', 'Creates a challenge against a mentioned player. If accepted, creates a match.',
                                `challenge <@user>`);

        function instantiateCommandObject(cmds, name, description, usage) {
            let obj = {
                name: name,
                description: description,
                usage: `${prefix}${cmdName} ${usage}`
            };

            cmds.push(obj);
        }

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
          }

        function sendHelpEmbed(message) {
            let embed = new Discord.MessageEmbed;
            embed.setTitle('Tic tac toe: Command List');
            let str = '';
            for (x of commands) {
                str += `**${capitalizeFirstLetter(x.name)} Command**:\n**Name**: ${x.name}\n**Description:** ${x.description}\n**Usage:** ${x.usage}\n\n`;
            };
            embed.setDescription(str);

            message.channel.send(embed);
        }

        let choice = args[0];
        switch (choice) {
            case "help":
                sendHelpEmbed(message, commands);
                break;
            case "challenge":

                break;
            default:
                message.channel.send('That is not a valid argument. Please use the \'help\' argument to see other availible arguments.');
                break;
        }
    }
}