module.exports = {
    name: 'purge',
    description: 'Deletes the specified amount of messages from the channel the command is sent in.',
    aliases: ['prune'],
    type: 'moderation',
    usage: '<amount of messsages>',
    args: true,
    cooldown: 10,
    permissions: 'Staff',
    execute(message, args) {
        message.channel.bulkDelete(args[0])
    }
}