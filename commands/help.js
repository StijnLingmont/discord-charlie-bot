const Discord = require("discord.js")
const fs = require("fs")
const path = require("path")
const command = require("../command")
const { commandFile, prefix } = require("../config.json")

// Retrieve all commands with there name and description
const getAllCommands = dir => {
    const files = fs.readdirSync(path.join(__dirname, dir)) //Get all files in the directory
    var commandList = [];

    for(const file of files) {
        const stat = fs.lstatSync(path.join(__dirname, dir, file))
        if(stat.isDirectory())
            getAllCommands(path.join(dir, file))
        else if(file !== commandFile) {
            const option = require(path.join(__dirname, dir, file)) //Get options
            const { commands, name, description } = option //Retrieve needed options
            var commandBody = ""

            //Go trough all commands in the list and add them in the body text
            for(const command of commands) {
                commandBody += "``" + prefix + command + "`` "
            }

            //Add description in the body
            commandBody +=  "\n" + description

            //Push all info to the main list
            commandList.push({
                name: name,
                value: commandBody,
                inline: false
            })
        }
    }

    return commandList;
}

module.exports = {
    name: "Help",
    description: "Get a list of all the commands available in this bot.",
    commands: ['help', 'commands'],
    exceptedArgs: '',
    permisionError: '',
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments, text, client) => {
        var commands = getAllCommands('')

        const helperList = new Discord.MessageEmbed()
        .setTitle("List of all commands")
        .addFields(commands)

        message.channel.send(helperList)
    },
    permissions: [],
    requiredRoles: [],
}