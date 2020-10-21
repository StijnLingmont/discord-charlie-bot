const Discord = require("discord.js")
const client = new Discord.Client();
const fs = require("fs")
const path = require("path")
const command = require("../command")
const { commandFile, prefix } = require("../config.json")

var commandList = [];

// Retrieve all commands with there name and description
const getAllCommands = (dir, message) => {
    const files = fs.readdirSync(path.join(__dirname, dir)) //Get all files in the directory
    const user = message.guild.members.cache.get(message.author.id)

    for(const file of files) {
        const stat = fs.lstatSync(path.join(__dirname, dir, file))
        if(stat.isDirectory())
            getAllCommands(path.join(dir, file), message)
        else if(file !== commandFile) {
            const option = require(path.join(__dirname, dir, file)) //Get options

            const { commands, name, description, permissions } = option //Retrieve needed options
            var commandBody = ""
            
            //Check if user has the perms for the command
            var runPerms = false
            if(permissions.length > 0) {
                for(var permission of permissions) {
                    if(user.hasPermission(permission)) {
                        runPerms = true
                    }
                }
            } else {
                runPerms = true
            }

            //If the user can run the perms then show them
            if(runPerms) {
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
    }

    return commandList;
}

module.exports = {
    name: "Help",
    description: "Get a list of all the commands available in this bot.",
    commands: ['help', 'commands'],
    expectedArgs: '',
    permisionError: '',
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments, text, client) => {
        commandList = [];
        var commands = getAllCommands('', message)

        const helperList = new Discord.MessageEmbed()
        .setTitle("List of all commands")
        .addFields(commands)

        message.channel.send(helperList)
    },
    permissions: [],
    requiredRoles: [],
}