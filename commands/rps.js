module.exports = {
    name: "rps",
    description: "Play a game of Rock, Paper, Scissors! against AI.\n" +
                "Please specify either Rock, Paper, or Scissors for the input.",
    aliases: false,
    type: "misc",
    usage: "<input>",
    args: true,
    cooldown: 5,
    permissions: 'false',
    execute(message, args) {
        var acceptedArguments = ["rock", "paper", "scissors"];
        var partialArguments = ["r", "p", "s"];
        function generateRandomInteger(min, max) { // generates a random integer between defined values
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min;
        }
        function checkPartialArguments(input) {
            var value;
            if (partialArguments.includes(input)) {
                switch (input) {
                    case "r":
                        value = "rock";
                        break;
                    case "p":
                        value = "paper";
                        break;
                    case "s":
                        value = "scissors";
                        break;
                }
                return value;
            }
            return (partialArguments.includes(input));
            // checks if the input is a partial value;
            // if FALSE: then return false
            // if TRUE: return the value associated with the partial response (e.g r -> rock).
        }
        function isValidInput(inputArg) { // checks the validity of an answer
            let input = inputArg.toLowerCase();
            // if they enter abbreviated version, convert to full (e.g r -> rock)

            if (acceptedArguments.includes(input)) {
                return true;
            }
        }
        function convertIntToArgument(input) { // turns the rps argument into an interger, for comparing.
            var value;
            switch (input) {
                case 1:
                    value = "rock";
                    break;
                case 2:
                    value = "paper";
                    break;
                case 3:
                    value = "scissors";
                    break;
            }
            return value;
        }
        function decideResult(userArg, botArg) {
            var result;
            if (userArg === botArg) {
                result = "draw";
                return result;
            } else {
                result = "win";
                switch (userArg) {
                    case "rock":
                        if (botArg === "paper") {result = "lose"};
                        break;
                    case "paper":
                        if (botArg === "scissors") {result = "lose"};
                        break;
                    case "scissors":
                        if (botArg === "rock") {result = "lose"};
                }
                return result;
            }
        }
        function constructReply(result) {
            var reply;
            switch (result) {
                case "draw":
                    reply = "The match is a draw.\n";
                    break;
                case "win":
                    reply = "You won the match.\n";
                    break;
                case "lose":
                    reply = "You lost the match.\n";
                    break;
            }
            reply += `You chose ${userArg}, and the bot chose ${botArg}.`;
            return reply;
        }

        var input = args[0];

        if (!checkPartialArguments(input) === false) {
            input = checkPartialArguments(input);
        } // converts 

        if (!isValidInput(input)) { // exits the command if argument is invalid
            return message.channel.send("This argument is invalid.\n" +
             "Please use one of the accepted arguments: rock, paper, scissors.");
        }
        var userArg = input;
        var botArg = convertIntToArgument(generateRandomInteger(1, 3));

        var result = decideResult(userArg, botArg);
        message.channel.send(constructReply(result));   
    }
}