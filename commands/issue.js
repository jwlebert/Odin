const package = require('../package.json')

module.exports = {
    name: 'issue',
    description: 'Posts a link to the bot\'s GitHub repository, where you can create an issue.',
    aliases: ['bug'],
    type: 'support',
    usage: false,
    cooldown: 30,
    permissions: false,
    execute(message, args) {
        message.channel.send('Here is a link to the bot\'s GitHub repository.\n' +
                            `https://github.com/XpertJosh/Odin/issues\n` +
                            'If you find a bug or issue, please create an issue and I will fix it at my earliest convenience.\n' +
                            'Thank you for your assistance.')
    }
}