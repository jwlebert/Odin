const Discord = require('discord.js');
const { prefix, color } = require('../config.json')

module.exports = {
    name: 'help',
    description: 'Lists all availible commands.\nIf a command is specified, additional details will be listed.',
    aliases: ['list', 'commands'],
    type: "support",
    usage: "<command or 'desc'>",
    args: "optional",
    cooldown: 3,
    permissions: false,
    execute(message, args) {
        const { commands } = message.client;

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
            if (commands.contains(args[0])) { // I need this return return T/F if the array 'commands' has the value of 'args[0]'.
                return true;
            } else {
                return false;
            }
        }

        function filterList(commands, filter) {
            var list = commands.filter(command => {
                return command.type === filter;
            });
            return list;
            // This will sort through the commands and return all
            // commands with the type equal to 'filter'.
        }

        function constructEmbedList(list, lists) {
            let items = list.items.map(item => item.name).join('\n');
            // Joins all of the names of the items in the list
            // with a new line between them.
            items.slice(items.length - 2, items.length);
            // Removes the final \n, so it doesn't look weird.

            const embed = new Discord.MessageEmbed()
            .setColor(color || "#0000FF")
            .setTitle(`Command List (${list.position}/${lists.length})`)
            .setAuthor("Odin")
            .setDescription(`The following is a list of ${list.type} commands.\n` +
                            `To receive more information about a specific command, ` +
                            `please type ${prefix}list <command>.\n` +
                            `In order to execute a command, please use the '${prefix}' prefix.`)
            .addField("**Commands:**", items || "empty or error.")
            .setFooter("Odin")
            .setTimestamp();
            return embed;

        }

        if (isRequestingList(args)) {
            // Constructing the lists
            let lists = [];
            let supportList = {
                items: filterList(commands, "support"),
                type: "support",
                position: 1
            };
            lists.push(supportList);

            let miscList = {
                items: filterList(commands, "misc"),
                type: "miscellaneous",
                position: 2
            };
            lists.push(miscList);

            let modList = {
                items: filterList(commands, "moderation"),
                type: "moderation",
                position: 3
            };
            lists.push(modList);
            // This sorts through all of the commands, and sorts them
            // into three lists, depending on their "type" attribute.
            message.delete();
            switch (parseInt(args[0])) {
                case 1:
                    message.channel.send(constructEmbedList(supportList, lists));
                    break;
                case 2:
                    message.channel.send(constructEmbedList(miscList, lists));
                    break;
                case 3:
                    message.channel.send(constructEmbedList(modList, lists));
                    break;
                default:
                    message.channel.send(constructEmbedList(supportList, lists));
                    break;
            }; // Sends the desired list
        }

        if (isRequestingSpecification(args, commands)) {
            console.log("yoooooo dude")
        }
    }
}