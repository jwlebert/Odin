const Discord = require('discord.js');
const prefix = process.env.prefix

module.exports = {
    name: 'ttt',
    description: 'A game of tic tac toe.',
    aliases: ['tictactoe'],
    type: 'misc',
    usage: '<argument or help>',
    args: true,
    cooldown: 10, // make 5-10 when done testing
    permissions: false,
    execute(message, args) {
        const tripleTick = "\`\`\`";
        let cmdName = this.name;
        let commands = [];
        instantiateCommandObject(commands, 'help', 'Displays a list of availible arguments for the tts command.',
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
                str += `**${capitalizeFirstLetter(x.name)} argument**:\n**Name**: ${x.name}\n**Description:** ${x.description}\n**Usage:** ${x.usage}\n\n`;
            };
            embed.setDescription(str);

            message.channel.send(embed);
        };

        function startChallenge(msg) {
            if (!msg.mentions.members.first()) { // Tell the user to mention a user if they didn't
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

            let filter = m => m.author === challenged &&
                         ['accept', 'a', 'decline', 'd'].some(c => c === m.content.toLowerCase());
            let challengeResponse = msg.channel.createMessageCollector(filter, { time: 30000 });
            
            challengeResponse.on('collect', m => {
                let answer = m.content.toLowerCase();

                switch (answer.toLowerCase()) {
                    case 'a': // Shorthand response for 'accept', will run the next case if true (accecpt case)
                    case 'accept':
                        challengeResponse.stop('accept');
                        break;
                    case 'd': // 
                    case 'decline':
                        challengeResponse.stop('decline');
                        break;
                };
            });

            challengeResponse.on('end', (col, reason) => {
                let embed = new Discord.MessageEmbed();
                switch (reason) {
                    case "accept":
                        embed.setDescription(`${challenged.username} has accepted the challenge. The match will begin shortly.`);
                        msg.channel.send(embed);
                        startMatch(msg, [challenger, challenged]);
                        break;
                    case "decline":
                        embed.setDescription(`${challenged.username} has declined the challenge.`);
                        msg.channel.send(embed);
                        break;
                    case "limit":
                        embed.setDescription('Time has expired. If you still wish to play, please issue another challenge.');
                        msg.channel.send(embed);
                        break;
                }
            });


        };
        // Use discords code brackets to make this work (```), it will display like a text editor
        function startMatch(msg, players) {
            let board = {
                A1: " ",
                A2: " ",
                A3: " ",
                B1: " ",
                B2: " ",
                B3: " ",
                C1: " ",
                C2: " ",
                C3: " ",
                print() {
                    message.channel.send(
                        `${tripleTick}Current board:\n` +
                        " " + this.A1 + " | " + this.A2 + " | " + this.A3 + " A\n" +
                        "-----------\n" +
                        " " + this.B1 + " | " + this.B2 + " | " + this.B3 + " B\n" +
                        "-----------\n" +
                        " " + this.C1 + " | " + this.C2 + " | " + this.C3 + " C\n" +
                        " 1   2   3 " + tripleTick
                    );
                }
            }
            let game = {
                inProgress: true,
                turn: true, // Turn refers to which players turn it is. A true value is the challenger, and a false value the challenged.
                challenger: players[0],
                challenged: players[1],
                winner: "",
                board: board,
                update(msg) {
                    this.board.print(); // Prints the board
                    let curPlayer = this.turn ? this.challenger : this.challenged; // 
                    let r = new Discord.MessageEmbed().setDescription(`${curPlayer}`);
                    msg.channel.send(r);
                    let filter = m => m.author === curPlayer &&
                                 ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3', 'test'].some(c => c === m.content.toLowerCase());
                    let collector = msg.channel.createMessageCollector( filter, { limit: 1 });

                    collector.on('collect', m => {
                        if (m.content.toLowerCase() === "exit") {
                            collector.stop('exit');
                        // } else if (!Object.values(this.board).includes(" ")) { // Checks if none of the positions are empty
                        //     collector.stop('full board');
                        } else if (this.board[m.content.toUpperCase()] !== " ") {
                            // ^ Checks if the desired position has a value other than " " (it's been taken)
                            collector.stop('occupied')
                        } else {                            
                            this.board[m.content.toUpperCase()] = this.turn ? "x" : "o";
                            // ^ sets the value of the specified position with a 'x' or 'o' depending on the turn variable
                            this.turn = this.turn ? false : true;

                            this.checkWinConditions(collector);
                            if (!Object.values(this.board).includes(" ")) { // Checks if none of the positions are empty
                                collector.stop('full board');
                            };
                            if (this.inProgress) {
                                collector.stop('turn end'); // ends the turn and repeats the .update() function.
                            };
                        }
                    });

                    collector.on('end', (col, reason) => {
                        let res;
                        switch (reason) {
                            case "exit":
                                res = new Discord.MessageEmbed().setDescription("The game has ended by player request.");
                                msg.channel.send(res);
                                break;
                            case "turn end":
                                this.update(msg);
                                break;
                            case "occupied":
                                res = new Discord.MessageEmbed().setDescription("That position is occupied. Please select a different position.");
                                message.channel.send(res);
                                this.update(msg);
                                break;
                            case "full board":
                                this.board.print();
                                res = new Discord.MessageEmbed().setDescription("The board is full, and the game has reached a stalemate. Ending match.");
                                message.channel.send(res)
                                break;
                            case "win":
                                this.board.print();
                                res = new Discord.MessageEmbed().setDescription(`${this.winner.username} has won the match.`);
                                message.channel.send(res);
                        }
                    });
                },
                checkWinConditions(collector) {
                    let alphaPos = ["A", "B", "C"];
                    let numPos = [1, 2, 3];

                    for (x of alphaPos) {
                        if ( // Checks if a whole row if full.
                            ['x', 'o'].some(c => c === this.board[x + "1"]) && 
                            ['x', 'o'].some(c => c === this.board[x + "2"]) &&
                            ['x', 'o'].some(c => c === this.board[x + "3"])) {
                            this.winner = this.board[x + "1"] === this.board[x + "2"] === this.board[x + "3"] === 'x' ? this.challenger : "";
                            this.winner = this.board[x + "1"] === this.board[x + "2"] === this.board[x + "3"] === 'o' ? this.challenged : "";
                            break;
                        };
                    };
                    for (x of numPos) {
                        if ( // Checks if a whole column if full.
                            ['x', 'o'].some(c => c === this.board["A" + x]) && 
                            ['x', 'o'].some(c => c === this.board["B" + x]) &&
                            ['x', 'o'].some(c => c === this.board["C" + x])) {
                            this.winner = this.board["A" + x] === this.board["B" + x] === this.board["C" + x] === 'x' ? this.challenger : "";
                            this.winner = this.board["A" + x] === this.board["B" + x] === this.board["C" + x] === 'o' ? this.challenged : "";
                            break;
                        };
                    };



                    if ( // Checks if a whole column if full.
                        ['x', 'o'].some(c => c === this.board["A1"]) && 
                        ['x', 'o'].some(c => c === this.board["B2"]) &&
                        ['x', 'o'].some(c => c === this.board["C3"])) {
                        this.winner = this.board["A1"] === this.board["B2"] === this.board["C3"] === 'x' ? this.challenger : "";
                        this.winner = this.board["A1"] === this.board["B2"] === this.board["C3"] === 'o' ? this.challenged : "";
                    }
                    if ( // Checks if a whole column if full.
                        ['x', 'o'].some(c => c === this.board["A3"]) && 
                        ['x', 'o'].some(c => c === this.board["B2"]) &&
                        ['x', 'o'].some(c => c === this.board["C1"])) {
                        this.winner = this.board["A3"] === this.board["B2"] === this.board["C1"] === 'x' ? this.challenger : "";
                        this.winner = this.board["A3"] === this.board["B2"] === this.board["C1"] === 'o' ? this.challenged : "";
                    }
                    if (this.winner !== "") {
                        collector.stop('win');
                    }
                }
            }
            game.update(msg);
        };

        let choice = args[0];
        switch (choice) { // A switch for the first argument which can run functions to accomplish the request.
            case "h":
            case "help":
                sendHelpEmbed(message, commands);
                break;
            case "c":
            case "challenge":
                startChallenge(message, args);
                break;
            default: // If it's not a valid choice, tell the user.
                message.channel.send('That is not a valid argument. Please use the \'help\' argument to see other availible arguments.');
                break;
        }
    }
}