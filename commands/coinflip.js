const Discord = require('discord.js');

module.exports = {
    name: 'coinflip',
    description: "Flips a coin, returning either heads or tails.",
    aliases: ['cf'],
    type: 'misc',
    usage: false,
    args: false,
    cooldown: 3,
    permissions: false,
    execute(message, args) {
        let num = generateRandomNumber(1, 2);
        let response = new Discord.MessageEmbed().setDescription(`The coin has landed on ${num === 1 ? 'heads' : 'tails'}.`);
        message.delete();
        message.channel.send(response);

        function generateRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        };
    }
};