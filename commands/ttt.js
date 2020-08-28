const Discord = require('discord.js');
const prefix = process.env.prefix

module.exports = {
    name: 'ttt',
    description: 'A game of tic tac toe.',
    aliases: ['tictactoe'],
    type: 'misc',
    usage: '<argument or help>',
    args: true,
    cooldown: 2, // When done testing make it longer
    permissions: false,
    execute(message, args) {
        switch (args[0]) { // Argument handler
            case 'h':
            case 'help':
                message.delete();
                let tttArgs = [];
                addArgumentObjToArray(tttArgs, "Help", "Displays availible ttt arguments.", "h", "help");
                addArgumentObjToArray(tttArgs, "Challenge", "Challenges a user to a game of tic tac toe.", "c", "challenge <@user>");
                displayHelpEmbed(tttArgs);
                break;
            case 'challenge':
                break;
        };

        function addArgumentObjToArray(arr, name, desc, short, usage) {
            let argObj = {
                name: name,
                desc: desc,
                short: short,
                usage: `odin ttt ${usage}`
            }; // Creates an object with all desired arguments

            arr.push(argObj);
        };  // Takes an array and a list of attributes. Creates an object
            // with these attributes and adds the object to the array.

        function displayHelpEmbed(tttArgs) {
            // tttArgs should be an array containing objects representing a argument.
            // Each object should have a property for: name, description, shorthand, and usage.

            let embed = new Discord.MessageEmbed()
            .setTitle("Tic Tac Toe Arguments")
            .setDescription("A list of arguments that can be used with the tic tac toe command.")
            .setFooter("Odin");

            for (x of tttArgs) {
                embed.addField(
                    `**${x.name}**`,
                    `**Description:** ${x.desc}\n**Shorthand:** ${x.short ? x.short : 'none'}\n**Usage:** ${x.usage}`
                    );
            }

            message.channel.send(embed);
        };  // Creates and sends a embed containing a list of ttt arguments

    }
}