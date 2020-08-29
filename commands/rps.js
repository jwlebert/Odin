const Discord = require('discord.js');

module.exports = {
    name: "rps",
    description: "Play a game of Rock, Paper, Scissors! against AI.\n" +
                "Please specify either Rock, Paper, or Scissors for the input.",
    aliases: false,
    type: "misc",
    usage: "<input>",
    args: true,
    cooldown: 5,
    permissions: false,
    execute(message, args) {
        let response = new Discord.MessageEmbed();
        if (!checkArgumentValidity(args[0].toLowerCase())) {
            response.setDescription("Please enter a valid argument. These include: 'rock', 'r', 'paper', 'p', 'scissors', or 's'.");
            return message.channel.send(response);
        };

        let arguments = ["rock", "paper", "scissors"];
        let userChoice = arguments[convertArgumentToNumber(args[0].toLowerCase())];
        let botChoice = arguments[generateRandomNumber(0, 2)];

        let result = evalutateResponse(userChoice, botChoice);

        response.setDescription(
            `${result === 'draw' ? "The match is a draw." : `You ${result} the match.`}\n` +
            `You chose ${userChoice} and the bot chose ${botChoice}.`
            );

        message.delete();
        message.channel.send(response);

        function checkArgumentValidity(argument) {
            return ['rock', 'r', 'paper', 'p', 'scissors', 's'].some(c => c === argument) ? true : false;
        };  // Checks if the passed in argument is a valid argument or argument shorthand (e.g 'rock', 'r', etc)
            // Returns true if valid, otherwise returns false.

        function generateRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        };  // Generates a random number between the min and max variable.

        function convertArgumentToNumber(argument) {
            // Rock = 0, Paper = 1, Scissors = 2.
            switch (argument) {
                case 'r':
                case 'rock':
                    return 0;
                    break;
                case 'p':
                case 'paper':
                    return 1;
                    break;
                case 's':
                case 'scissors':
                    return 2;
                    break;
            };
        };  // Converts an argument to it's respective number.

        function evalutateResponse(userRes, botRes) {
            if (userRes === botRes) { return 'draw' }; // If values are equal, return 'draw'.
            switch (userRes) {
                case 'rock':
                    return botRes === 'scissors' ? 'won' : 'lost';
                case 'paper':
                    return botRes === 'rock' ? 'won' : 'lost';
                case 'scissors':
                    return botRes === 'paper' ? 'won' : 'lost';
            };  // ^ Checks for each value, then uses a ternary operator to return 'won' or 'loss'
                // depending on if the bot has a winning or losing value.

        };  // Returns 'loss', 'win', or 'draw' depending on the user's choice, and the bot's choice.
            // The returned values represent the user (e.g if 'win' is returned, the player won.)
    }
};