//#region Variable Initialisation
const Discord = require("discord.js")
const client = new Discord.Client();
const fs = require("fs")
const path = require("path")
//#endregion

//#region All instances for this project
const CommandClass = require('./command');
const Command = new CommandClass.Commands(client)
const Scoreboard = require("./database/scoreboard")
const User = require('./database/user')
const Server = require('./database/server')
const Blacklist = require('./database/blacklist')
//#endregion

//#region JSON files
const { commandFile, token } = require("./config.json")
//#endregion

//Event when discord bot is ready
client.on('ready', () => {
    //Get main base message for when the discord bot is ready
    console.log('The client is ready!')

    //Base file for functionality commands
    const commandBase = require(`./commands/${commandFile}`)

    //Read all command files in folder
    const readCommands = dir => {
        //Get list of all files in the directory
        const files = fs.readdirSync(path.join(__dirname, dir)) //Get all files in the directory

        //Go trough all the files
        for(const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file)) //Get main data of file

            //Check if the file is a folder or the base command file
            if(stat.isDirectory())
                //Go in the folder and scan files there
                readCommands(path.join(dir, file))
            else if(file !== commandFile) {
                //Get options of command and load in base functionality for the command
                const option = require(path.join(__dirname, dir, file))
                commandBase(client, option)
            }
        }
    }

    //Read all commands added to the bot
    readCommands('commands');

    // When joining a server store it in database
    client.on("guildCreate", guild => {
        Server.storeServer(guild)
    })

    //Create user when joining
    client.on('guildMemberAdd', member => {
        User.createUser(member.user, member.guild.id, (userData) => {})
    });

    //XP System
    client.on("message", message => {
        const { content } = message

        if (message.author.bot) return //Check if user is bot

        if (message.guild === null) return //Check if message is an dm

        if(Command.checkCommandStatement(content)) return //Check is message is command

        //Remove message when it has blacked word
        Blacklist.checkIfInBlackList(message, (blockedWord) => {
            if(blockedWord) {
                message.delete()
                message.reply('You have used a word that is on the blacklist. Please be aware of the words you use!')
                return
            }
        })

        //Give XP to user
        Scoreboard.giveXp(message)
    });
})

//Login to the discord server
client.login(token)