const Discord = require("discord.js")
const client = new Discord.Client();
const config = require("./config.json")
const commandList = require("./commands.json")

const command = require('./command')

client.on('ready', () => {
    console.log('The client is ready!')

    command(client, commandList["serverList"].commands, message => {
        client.guilds.cache.forEach(guild => {
            message.channel.send(`${guild.name} has a total of ${guild.memberCount} members`)
        })
    })

    command(client, commandList["help"].commands, message => {
        var commands = [];
        console.log(commandList)
        for(var key in commandList) {
            var command = commandList[key]
            commands.push({
                name: command.name,
                value: command.commands,
                inline: false
            })
        }

        const helperList = new Discord.MessageEmbed()
        .setTitle("List of all commands")
        .addFields(commands)

        message.channel.send(helperList)
    })
})

client.login(config.token)