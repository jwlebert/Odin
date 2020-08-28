const Discord = require('discord.js');

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
        let res = new Discord.MessageEmbed(); // 'res' will be used to send response embeds. The description will be overwritten before every use.

        switch (args[0]) { // Argument handler
            case 'h':
            case 'help':
                message.delete();
                let tttArgs = [];
                addArgumentObjToArray(tttArgs, "Help", "Displays availible ttt arguments.", "h", "help");
                addArgumentObjToArray(tttArgs, "Challenge", "Challenges a user to a game of tic tac toe.", "c", "challenge <@user>");
                displayHelpEmbed(tttArgs);
                break;
            case 'c':
            case 'challenge':
                message.delete();
                startChallenge();
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

        function startChallenge() {
            if (!message.mentions.users.first()) {
                res.setDescription("You must specify a user to challenge.");
                message.channel.send(res);
            };

            let challenger = message.author;
            let challenged = message.mentions.users.first();

            res.setDescription(`${challenged.username}, you have been challenged to a game of Tic Tac Toe by ${challenger.username}.\n` +
                                    `Please type 'accept' or 'a' to accept the match, and 'decline' or 'd' to decline the match.\n` +
                                    `This challenge will expire in 30 seconds.`);
            message.channel.send(res);

            let filter = m => m.author === challenged &&
                        ['accept', 'a', 'decline', 'd'].some(c => c === m.content.toLowerCase())
            // ^ Checks if the message's author is the mentioned user, and if the content is one of the responses.
            let challengeResponse = message.channel.createMessageCollector(filter, { max: 1, time: 30000 });

            challengeResponse.on('collect', m => {
                let response = ['accept', 'a'].some(c => c === m.content) ? 'accept' : 'decline';
                // ^ response is equal to 'accept' if the m.content is 'a' or 'accept', otherwise it's equal to 'decline'.
                challengeResponse.stop(response); // Stops the collection with the response variable as the reason.
            });

            challengeResponse.on('end', (col, reason) => {
                switch (reason) { // A reason switch. This is used to determine outcomes of collectors.
                    case 'accept':
                        res.setDescription(`${challenged.username} has accepted the challenge. The match will begin shortly.`);
                        startMatch();
                        break;
                    case 'decline':
                        res.setDescription(`${challenged.username} has declined the challenge.`);
                        break;
                    case 'time': // The 'time' reason is emmited when the message collecter expires.
                        res.setDescription("The challenge has expired. If you still wish to play, please issue another challenge.");
                        break;
                };
                message.channel.send(res);
            });
        };
    }
};