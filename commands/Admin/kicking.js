const Discord = require("discord.js")

module.exports = {
    name: 'Kicking',
    description: 'Kick a player from the server',
    commands: ['kick', 'kickhammer'],
    expectedArgs: '<user> <reason>',
    permisionError: 'You need to be an administrator to do this!',
    minArgs: 1,
    maxArgs: null,
    callback: (message, arguments, text, client) => {

        //Check if a user is mentioned
        if(message.mentions.users.length < 1) {
            message.reply('Please mention the user you want to kick. TIP! Use @ and search then for the users name')
            return
        }

        var userMention = message.mentions.users.first()
        var user = message.guild.members.cache.get(userMention.id)
        var reason = ""

        //Remove the user from the reason
        arguments.shift()

        //Check if user is kicked with reason or not
        if(arguments.length > 0)
            reason = `${message.author.tag} - ${arguments.join(' ')}` //Create reason as text
        else
            reason = `${message.author.tag} - No reason given` //Create reason as text

        //Kick the user
        user.kick({reason: reason})

        message.channel.send(`User has been kicked by ${message.author.toString()}! Reason: ${reason}`)
    },
    permissions: ['ADMINISTRATOR', 'BAN_MEMBERS'],
    requiredRoles: [],
}