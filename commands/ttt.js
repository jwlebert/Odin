const Discord = require('discord.js');
const prefix = process.env.prefix

module.exports = {
    name: 'ttt',
    description: 'A game of tic tac toe.',
    aliases: ['tictactoe'],
    type: 'misc',
    usage: '<argument or help>',
    args: true,
    cooldown: 2, // make 5-10 when done testing
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
        };

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };

        function sendHelpEmbed(message) {
            let embed = new Discord.MessageEmbed;
            embed.setTitle('Tic tac toe: Command List');
            let str = '';
            for (x of commands) {
                str += `**${capitalizeFirstLetter(x.name)} Command**:\n**Name**: ${x.name}\n**Description:** ${x.description}\n**Usage:** ${x.usage}\n\n`;
            };
            embed.setDescription(str);

            message.channel.send(embed);
        };

        function startChallenge(msg) {
            if (!msg.mentions.members.first()) {
                message.channel.send('Please mention the user you would like to challenge.');
            }
            let challenger = msg.author;
            let challenged = msg.mentions.users.first();

            let embed = new Discord.MessageEmbed(); // This embed is just changed to contain what it needs to be before each message.
            // create a collector for the challenged user
            embed.setDescription(`${challenged.username}, you have been challenged to a match of Tic-Tac-Toe by ${challenger.username}.\n` +
            `To accept, type 'accept'. to decline, type 'decline'.\n` +
            `This challenge will expire in 30 seconds.`);

            msg.channel.send(embed);

            let filter = m => m.author === challenged;
            let challengeResponse = msg.channel.createMessageCollector(filter, { time: 30000 });

            let receivedResponse = false;
            
            challengeResponse.on('collect', m => {

                let answer = m.content.toLowerCase();

                if (!answer === 'accept' || !answer === 'decline') {
                    return;
                };

                switch (answer.toLowerCase()) {
                    case 'accept':
                        receivedResponse = true;
                        embed.setDescription(`${challenged.username} has accepted the challenge. The match will begin shortly.`);
                        msg.channel.send(embed);
                        startMatch();
                        challengeResponse.stop('Answer collected.');
                        break;
                    case 'decline':
                        receivedResponse = true;
                        embed.setDescription(`${challenged.username} has decline the challenge.`);
                        msg.channel.send(embed);
                        challengeResponse.stop('Answer collected.');
                        break;
                };
            });

            challengeResponse.on('end', () => {
                if (receivedResponse === false) {
                    embed.setDescription(`The challenge has expired. If you wish to play a match, please challenge again.`);
                    msg.channel.send(embed);
                };
            });


        };

        function startMatch() {

        };

        let choice = args[0];
        switch (choice) {
            case "help":
                sendHelpEmbed(message, commands);
                break;
            case "challenge":
            startChallenge(message, args);
                break;
            default:
                message.channel.send('That is not a valid argument. Please use the \'help\' argument to see other availible arguments.');
                break;
        }
    }
}