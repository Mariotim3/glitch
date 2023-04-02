require("dotenv/config");




const { REST, Routes } = require("discord.js");

const commands = [
    {
        name: "ping",
        description: "returns the current ping of glitch!"
    },
    {
        name: "train",
        description: "train the bot by giving it an input, and an output.",
        options: [
            {
                name: "input",
                description: "give the bot something to recieve!",
                type: 3,
                required: true
            },
            {
                name: "output",
                description: "give the bot something to output!",
                type: 3,
                required: true
            }
    ]
    },
    {
        name: "chat",
        description: "Talk with Glitch!",
        options: [{
            name: "message",
            description: "What do you want to tell Glitch!?",
            type: 3,
            required: true
        }]
    },
];

const rest = new REST({
    version: 10, 
}).setToken(process.env.TOKEN);

(async () => {
    try {

        console.log("Registering slash commands!");

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        {body: commands}
        );

        console.log("Slash commands successfully registered!");
    } catch (error) {
        console.warn(`There was an error! ${error}`);
    }
})();