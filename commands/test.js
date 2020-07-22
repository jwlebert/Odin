module.exports = {
    name: 'test',
    execute(message, args) {
        let channelName = args[0];
        let channels = message.guild.channels.cache;
        let channel = channels.filter(channels => {
            return channel.name === channelName;
        });
        console.log(channel);
    }
}