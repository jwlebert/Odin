module.exports = {
    name: 'purge',
    description: 'Deletes the specified amount of messages (max 100) from the channel the command is sent in.',
    aliases: ['prune'],
    type: 'moderation',
    usage: '<amount of messsages>',
    args: true,
    cooldown: 10,
    permissions: 'Staff',
    execute(message, args) {
        let amount = args[0] > 100 ? 100 : args[0];
        message.channel.bulkDelete(amount);
    }
}