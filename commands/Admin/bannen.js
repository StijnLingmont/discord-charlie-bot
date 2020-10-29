const Discord = require("discord.js")

module.exports = {
    name: 'Bannen',
    description: 'Ban a player from the server',
    commands: ['ban', 'banhammer'],
    expectedArgs: '<user> <reason>',
    permisionError: 'You need to be an administrator to do this!',
    minArgs: 1,
    maxArgs: null,
    callback: (message, arguments, text, client) => {

        //Check if a user is mentioned
        if(message.mentions.users.length < 1) {
            message.reply('Please mention the user you want to ban. TIP! Use @ and search then for the users name')
            return
        }

        var userMention = message.mentions.users.first()
        var user = message.guild.members.cache.get(userMention.id)
        var reason = ""

        //Remove the user from the reason
        arguments.shift()

        //Check if user is banned with reason or not
        if(arguments.length > 0)
            reason = `${message.author.tag} - ${arguments.join(' ')}` //Create reason as text
        else
            reason = `${message.author.tag} - No reason given` //Create reason as text

        //Ban user
        user.ban({reason: reason})

        //Send acceptance message
        message.channel.send(`User has been banned by ${message.author.toString()}! Reason: ${arguments.join(' ')}`)
    },
    permissions: ['ADMINISTRATOR', 'BAN_MEMBERS'],
    requiredRoles: [],
}