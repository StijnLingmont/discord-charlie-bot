const Discord = require("discord.js")

module.exports = {
    name: 'Bannen',
    description: 'Unban a player that is banned',
    commands: ['unban'],
    expectedArgs: '<userID>',
    permisionError: 'You need to be an administrator to do this!',
    minArgs: 1,
    maxArgs: 1,
    callback: (message, arguments, text, client) => {

        //Check if argument is an Integer
        if(!isNaN(parseInt(arguments[0]))) {
            var userId = arguments[0]
            
            //Unban user
            message.guild.members.unban(userId)
            
            message.channel.send(`${userId} is unbanned!`)
        }
    },
    permissions: ['ADMINISTRATOR', 'BAN_MEMBERS'],
    requiredRoles: [],
}