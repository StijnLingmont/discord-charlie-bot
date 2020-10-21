const Discord = require("discord.js")
const client = new Discord.Client();
const fs = require("fs")
const path = require("path")

//#region All instances for this project
const CommandClass = require('./command');
const Command = new CommandClass.Commands(client)
const Scoreboard = require("./database/scoreboard")
const User = require('./database/user')
const Server = require('./database/server')
//#endregion

//#region JSON files
const { commandFile, token } = require("./config.json")
//#endregion

client.on('ready', () => {

    console.log('The client is ready!')

    const commandBase = require(`./commands/${commandFile}`)

    const readCommands = dir => {
        const files = fs.readdirSync(path.join(__dirname, dir)) //Get all files in the directory

        for(const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if(stat.isDirectory())
                readCommands(path.join(dir, file))
            else if(file !== commandFile) {
                const option = require(path.join(__dirname, dir, file))
                commandBase(client, option)
            }
        }
    }

    readCommands('commands');

    // When joining a server
    client.on("guildCreate", guild => {
        console.log("Joined a new guild: " + guild.name);

        Server.storeServer(guild)
    })

    client.on('guildMemberAdd', member => {
        User.createUser(member.user, member.guild.id, (userData) => {})
    });

    //XP System
    client.on("message", message => {
        const { content } = message

        if (message.author.bot) return; //Check if user is bot

        if(Command.checkCommandStatement(content)) return; //Check is message is command

        Scoreboard.giveXp(message)
    });
})

client.login(token)