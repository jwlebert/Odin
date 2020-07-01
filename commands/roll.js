module.exports = {
    name: 'roll',
    description: 'Generates a number between two specified numbers.',
    aliases: ['rng', 'dice'],
    type: 'misc',
    usage: '<min> <max>',
    args: 'optional',
    cooldown: 3,
    permissions: false,
    execute(message, args) {
        function generateRandomInteger(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
        
        var min = 1;
        var max = 5;
        // sets default values
        if (args[0]) {min = parseInt(args[0])};
        if (args[1]) {max = parseInt(args[1])};
        // overrides them if values are specified.
        
        // function test(rand) {
        //     console.log(`${min}, ${max}, ${rand}`);
        //     console.log(Math.round(rand * (max)));
        //     console.log(Math.round(rand * (max - min)));
        //     console.log(Math.floor(rand * (max - min)) + min);
        //     console.log(Math.round(rand * (200 - 100)) + 100);
        // }
        // test(0.12);
        // test(0.50);
        // test(0.78);
        // test(0.97);
        // test(0.37);

        message.channel.send(`The result is ${generateRandomInteger(min, max)}.`);
        // generates and sends a random integer, using the generateRandomInteger function
    }
}