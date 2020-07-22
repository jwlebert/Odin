const Discord = require('discord.js');
const { prefix, color } = require('../config.json');
const meta = require('../metadata.json');

module.exports = {
    name: 'setup',
    description: 'Can be used to create roles and channels required for the bot.\n' +
                 `Type '${prefix}setup help' to recieve more information`,
    aliases: ['install'],
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

        function createChannels() {

        }
        
        switch (args[0]) {
            case 'help':
                message.channel.send(generateHelpEmbed(arguments));
                break;
            case 'roles':
                createRoles(message, meta);
                break;
            case 'channels':

                break;
            default:
                message.channel.send(`This is an invalid argument.\nPlease type '${prefix}setup help' for more information.`)
                break;
        }
    }
}