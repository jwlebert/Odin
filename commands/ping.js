module.exports = {
    name: 'ping',
    description: 'Pong.',
    aliases: false,
    type: 'misc',
    usage: false,
    args: false,
    cooldown: 3,
    permissions: false,
    execute(message, args) {
        message.channel.send('Pong.')
    }
}