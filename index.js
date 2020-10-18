const Discord = require("discord.js")
const client = new Discord.Client();
const fs = require("fs")

//#region JSON files
const config = require("./config.json")
const commandList = require("./commands.json")
const levelList = require("./levels.json")
//#endregion

const command = require('./command');
const { formatWithOptions } = require("util");

const talkedRecently = {};

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

    command(client, commandList["scoreboard"].commands, message => {
        var scorelist = ""
        var scorePlace = 1
        var scoreboard = levelList[message.guild.id] //Make replica of score list

        //TODO: make database to store playerInfo and retrieve scoreboard from there

        //Go trough list of scoreboard
        for(var key in scoreboard) {
            var user = client.users.cache.find(user => user.id === key);

            scorelist += `${scorePlace}# - ${user.username} - Level ${levelList[message.guild.id][key].level} - ${levelList[message.guild.id][key].xp} xp \n`
            scorePlace++
        }

        const helperList = new Discord.MessageEmbed()
        .setTitle("Scoreboard")
        .setDescription(scorelist)

        message.channel.send(helperList)
    })

    //XP System
    client.on("message", message => {
        if (message.author.bot) return;

        //TODO: Check if the message is an command

        giveXp(message)
    });
})

client.login(config.token)

//#region level system
function giveXp(message) {
    spamCheck(message, () => {
        //Check if server already exist in list. If not then add.
        if(levelList[message.guild.id] == undefined)
            levelList[message.guild.id] = {};

        //Check if user already exist in list. If not then add.
        if(levelList[message.guild.id][message.author.id] == undefined) {
            levelList[message.guild.id][message.author.id] = {
                xp: 0,
                level: 0,
            }
        }

        levelList[message.guild.id][message.author.id].xp += getXp()

        checkLevel(message, (level) => {
            if(level > levelList[message.guild.id][message.author.id].level)
                message.reply(`Level up! You are now level ${level}`)
            
            levelList[message.guild.id][message.author.id].level = level
        })

        fs.writeFile('./levels.json', JSON.stringify(levelList), function (err) {
            if (err) return console.log(err);
        });
    })
}

function checkLevel(message, callback) {
    var xpForNextLevel = 5000 * (Math.pow(2, levelList[message.guild.id][message.author.id].level) - 1);

    if(xpForNextLevel < levelList[message.guild.id][message.author.id].xp)
        callback(levelList[message.guild.id][message.author.id].level + 1)
    callback(levelList[message.guild.id][message.author.id].level)
}

function getXp() {
    return Math.floor(Math.random() * 100);
}
//#endregion

function spamCheck(message, callback) {
    //Check if the server is on the list otherwise create it
    if(talkedRecently[message.guild.id] === undefined)
        talkedRecently[message.guild.id] = []

    // If it is a new (not spam) message give player xp
    if (!talkedRecently[message.guild.id].includes(message.author.id)) {
        talkedRecently[message.guild.id].push(message.author.id)

        console.log(talkedRecently)

        setTimeout(() => {
            const index = talkedRecently[message.guild.id].indexOf(message.author.id);
            if (index > -1) {
                talkedRecently[message.guild.id].splice(index, 1);
            }
        }, 10000);

        callback()
    }
}