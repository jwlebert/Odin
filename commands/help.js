const Discord = require('discord.js');
const prefix = process.env.prefix
const color = process.env.prefix

module.exports = {
    name: 'help',
    description: 'Lists all availible commands.\nIf a command is specified, additional details will be listed.',
    aliases: ['list', 'commands'],
    type: "support",
    usage: "<command or list number>",
    args: "optional",
    cooldown: 3,
    permissions: false,
    execute(message, args) {
        const { commands } = message.client;

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function isRequestingList(args) {
            if (!args.length) {
                return true;
            } else if (Number.isInteger(parseInt(args[0]))) {
                return true;
            } else {
                return false;
            }
        }

        function isRequestingSpecification(args, commands) {
            if (commands.some(command => { return command.name === args[0] }) ||
                commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]))) { 
                return true;
            } else {
                let response = new Discord.MessageEmbed().setDescription('That is not a valid command. Please specifiy a valid command.');
                message.channel.send(response);
                return false;
            }
        }

        function filterList(commands, filter) {
            let list = commands.filter(command => {
                return command.type === filter;
            });
            return list;
            // This will sort through the commands and return all
            // commands with the type equal to 'filter'.
        }

        function sortListsByOrder(lists) {
            let information = [];
            for (let i = 1; i <= 4; i++) {
                let currentList = lists.filter(list => {
                    return list.position === i;
                });
                let mapped = currentList.map(cur => `List ${cur.position}: ${cur.type} commands.`);
                information.push(mapped[0]);
            };
            return information;        
        }

        function constructEmbedList(list, lists) {
            let items = list.items.map(item => item.name).join('\n');
            // Joins all of the names of the items in the list
            // with a new line between them.
            items.slice(items.length - 2, items.length);
            // Removes the final \n, so it doesn't look weird.
            
            // I know this is a horrible variable name, couldn't think of anything better.

            const embed = new Discord.MessageEmbed()
            .setColor(color || "#0000FF")
            .setTitle(`Command List (${list.position}/${lists.length})`)
            .setAuthor("Odin")
            .setDescription(`The following is a list of ${list.type} commands.\n` +
                            `To receive more information about a specific command, ` +
                            `please type ${prefix}list <command>.\n` +
                            `In order to execute a command, please use the '${prefix}' prefix.`)
            .addField("**Commands:**", items || "empty or error.")
            .addField("**Lists**", sortListsByOrder(lists))
            .setFooter("Odin")
            .setTimestamp();
            return embed;

        }

        function constructEmbedSpecification(args, commands) {
            let command = commands.get(args[0]) ||
                        commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));
            
            let details = [];

            details.push(`**Command name:** ${command.name}`);
            details.push(`**Command aliases:** ${command.aliases.join(', ')}`);
            details.push(`**Command description:** ${command.description}`);
            details.push(`**Command usage:** ${prefix}${command.name} ${command.usage}`);
            details.push(`**Command permissions:** ${command.permissions}`);
            details.push(`**Command cooldown:** ${command.cooldown || 3} seconds.`);

            let information = details.join('\n');
            information.slice(information.length - 2, information.length);
            
            const embed = new Discord.MessageEmbed()
            .setColor(color || "#0000FF")
            .setTitle(`${capitalizeFirstLetter(command.name)} Command Details:`)
            .setAuthor("Odin")
            .setDescription(`Here are some details about the ${command.name} command.`)
            .addField("Information:", information)
            .setFooter("Odin")
            .setTimestamp();

            return embed;
        }

        if (isRequestingList(args)) {
            // Constructing the lists
            let lists = [];

            let completeList = {
                items: commands,
                type: "all",
                position: 1
            }
            lists.push(completeList);

            let supportList = {
                items: filterList(commands, "support"),
                type: "support",
                position: 2
            };
            lists.push(supportList);

            let miscList = {
                items: filterList(commands, "misc"),
                type: "miscellaneous",
                position: 3
            };
            lists.push(miscList);

            let modList = {
                items: filterList(commands, "moderation"),
                type: "moderation",
                position: 4
            };
            lists.push(modList);
            // This sorts through all of the commands, and sorts them
            // into three lists, depending on their "type" attribute.
            message.delete();
            switch (parseInt(args[0])) {
                case 1:
                    message.channel.send(constructEmbedList(completeList, lists));
                case 2:
                    message.channel.send(constructEmbedList(supportList, lists));
                    break;
                case 3:
                    message.channel.send(constructEmbedList(miscList, lists));
                    break;
                case 4:
                    message.channel.send(constructEmbedList(modList, lists));
                    break;
                default:
                    message.channel.send(constructEmbedList(completeList, lists));
                    break;
            }; // Sends the desired list
        } else if (isRequestingSpecification(args, commands)) {
            message.delete();
            message.channel.send(constructEmbedSpecification(args, commands));
        }
    }
}