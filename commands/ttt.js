const Discord = require('discord.js');
const prefix = process.env.prefix

module.exports = {
    name: 'tts',
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
        instantiateCommandObject(commands, 'help', 'Displays a list of availible decisive arguments for the tts command.'
                                `${prefix}${cmdName} help`);
        instantiateCommandObject(commands, 'challenge', 'Creates a challenge against a mentioned player. If accepted, creates a match.');

        function instantiateCommandObject(cmds, name, description, usage) {
            let obj = {
                name: name,
                description: description
            };

            cmds.push(obj);
        }

        function sendHelpEmbed(message) {
            let embed = new Discord.MessageEmbed;

        }

        let choice = args[0];
        switch (choice) {
            case "help":
                
                break;
            case "challenge":

                break;
            default:
                message.channel.send('That is not a valid argument. Please use the \'help\' argument to see other availible arguments.');
                break;
        }
    }
}