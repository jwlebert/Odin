const Discord = require('discord.js');
const prefix = process.env.prefix;
const color = process.env.prefix;
const meta = require('../metadata.json');

module.exports = {
    name: 'setup',
    description: 'Can be used to create roles and channels required for the bot.\n' +
                 `Type '${prefix}setup help' to recieve more information`,
    aliases: ['install', 'init'],
    type: 'support',
    usage: '<help or argument>',
    args: true,
    cooldown: 5,
    permissions: 'Admin',
    execute(message, args) {
        let arguments = [];
        let help = {
            name: 'Help',
            description: 'Lists all available arguments for the setup command.'
        };
        arguments.push(help);
        let roles = {
            name: 'Roles',
            description: 'Generates roles any roles required for the bot\'s functionality.'
        };
        arguments.push(roles);      
        let channels = {
            name: 'Channels',
            description: 'Can be used to create channels and categories.'
        };
        arguments.push(channels);

        let channelPresets = [];
        channelPresets.push({
            name: 'important',
            channels: ['Information', 'rules', 'announcements', 'welcome', 'roles']
        });
        channelPresets.push({
            name: 'community',
            channels: ['Community', 'general', 'memes', 'roles']
        });


        function generateHelpEmbed(arguments) {

            embed = new Discord.MessageEmbed()
            .setColor(color || "#0000FF")
            .setTitle(`Availible arguments for setup command`)
            .setAuthor('Odin')
            .setDescription(`This is a list of available arguments for the setup command.`)
            .setFooter('Odin')
            .setTimestamp();

            for (let i = 0; i < arguments.length; i++) {
                embed.addField(`${arguments[i].name}`, arguments[i].description);
            }

            return embed;
        }

        function createRoles(metadata) {
            let init = new Discord.MessageEmbed().setDescription('Initiating role creation.');
            message.channel.send(init);
            
            for (i in metadata.roles) {
                if (message.guild.roles.cache.some(role => role.name.toLowerCase() === metadata.roles[i].name.toLowerCase())) { return; };
                message.guild.roles.create({
                    data: {
                        name: metadata.roles[i].name
                    },
                    reason: metadata.roles[i].reason,
                }).then(role => {
                    console.log(`Role >${role.name}< created.`)
                    let embed = new Discord.MessageEmbed().setDescription(`${role.name} role was created.`);
                    message.channel.send(embed)
                }).catch(error => {
                    console.log(error);
                });
            }
        }

        // function fetchChannelByName(message, name) {
        //     return message.guild.channels.cache.filter(channels => {
        //         return channels.name === name;
        //     });
        // }

        function createChannels(message, choice) {
            let preset = channelPresets.filter(presets => {
                return presets.name === choice.toLowerCase();
            });
            let collectorFilter = msg => msg.author === message.author;
            let declare = new Discord.MessageEmbed().setDescription(`You are initializing the creation of the ${choice} preset.`)
                                                                    // 'Please respond to the following messages with \'yes\' or \'no\' to choose which channels to create.')
            message.channel.send(declare);

            for (x in preset.channels) {

            }
        }
        
        switch (args[0]) {
            case 'help':
                message.channel.send(generateHelpEmbed(arguments));
                break;
            case 'roles':
                createRoles(message, meta);
                break;
            case 'channels':
                if (!args[1]) {
                    embed = new Discord.MessageEmbed()
                    .setDescription(`Please specify which channels you would like to create.`)
                    .addFields(
                        {name: "Information", value:"Creates the following essential channels:\n" +
                                                    "Information => A category that all of the other channels are placed in.\n" +
                                                    "rules => A channel that contains the rules of the server.\n" +
                                                    "announcements => A channel where announcements can be posted by admins.\n" +
                                                    "welcome => A channel where welcome messages are sent.\n" +
                                                    "roles => A channel where you can set up reaction roles."},
                        {name: "Community", value:  "Creates the following channels:\n" +
                                                    "Community => A category that all the other channels are placed in.\n" +
                                                    "general => A channel for users to talk about anything in.\n" +
                                                    "memes => A channel where users can post memes.\n" +
                                                    "bot-commands => A channel where users can post commands for the bot."}
                        );
                }
                if (args[1]) {
                    createChannels(message, args[1]);
                }
                break;
            default:
                message.channel.send(`This is an invalid argument.\nPlease type '${prefix}setup help' for more information.`)
                break;
        }
    }
}