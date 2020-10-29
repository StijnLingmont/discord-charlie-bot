const Discord = require("discord.js")

const Scoreboard = require("../../database/scoreboard")

module.exports = {
    name: "Scoreboard",
    description: "Get the scoreboard with top active members.",
    commands: ["scoreboard", "sb", "levels"],
    expectedArgs: '',
    permisionError: '',
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments, text, client) => {
        var scorelist = ""
        var scorePlace = 1
        
        //Get all scoreboard players
        Scoreboard.getScoreboard(message.guild, (scoreboardItems) => {

            //Go trough all players from scoreboard
            scoreboardItems.forEach((scoreboardItem) => {
                var guild = message.guild
                var user = client.users.cache.get(scoreboardItem['user_id']);

                //Fill the string list for the embed
                scorelist += `${scorePlace}# - ${user.username} - Level ${scoreboardItem['level']} - ${scoreboardItem['xp']} xp \n`
                scorePlace++
            })

            const helperList = new Discord.MessageEmbed()
            .setTitle("Scoreboard")
            .setDescription(scorelist)
    
            message.channel.send(helperList)
        })
    },
    permissions: [],
    requiredRoles: [],
}