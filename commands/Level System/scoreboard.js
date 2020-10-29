const Discord = require("discord.js")

const Scoreboard = require("../../database/scoreboard")

//Create string for the scoreboard embed
async function getScoreboardString(scoreboardItems, client, callback) {
    var scorelist = "" //String for the scoreboard embed
    var scorePlace = 1 //Place of the user in the list

    //Go trough all users of the list
    for (const scoreboardItem of scoreboardItems) {

        //Fetch a user from the discord server
        await client.users.fetch(scoreboardItem['user_id'])
        .then(user => {
            //Fill the string list for the embed
            if(user !== undefined) {
                scorelist += `${scorePlace}# - ${user.username} - Level ${scoreboardItem['level']} - ${scoreboardItem['xp']} xp \n`
                scorePlace++
            }

        })
        .catch((error) => {
            console.log(error)
        })
    }

    callback(scorelist)
  }

module.exports = {
    name: "Scoreboard",
    description: "Get the scoreboard with top active members.",
    commands: ["scoreboard", "sb", "levels"],
    expectedArgs: '',
    permisionError: '',
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments, text, client) => {
        
        //Get all scoreboard players
        Scoreboard.getScoreboard(message.guild, (scoreboardItems) => {

            getScoreboardString(scoreboardItems, client, (scorelist) => {

                const helperList = new Discord.MessageEmbed()
                .setTitle("Scoreboard")
                .setDescription(scorelist)
        
                message.channel.send(helperList)
            })
        })
    },
    permissions: [],
    requiredRoles: [],
}