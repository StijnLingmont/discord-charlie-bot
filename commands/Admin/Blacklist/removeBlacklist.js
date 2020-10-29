const Discord = require("discord.js")

const Blacklist = require("../../../database/blacklist")

module.exports = {
    name: 'Remove Blacklist',
    description: 'Remove a blacklist word.',
    commands: ['removeBlacklist', 'rBlacklist'],
    expectedArgs: '<word>',
    permisionError: 'You need to be an administrator to do this!',
    minArgs: 1,
    maxArgs: 1,
    callback: (message, arguments, text, client) => {

        //Remove blacklist item
        Blacklist.removeBlackList(message.guild, arguments[0], (deleteStatus) => {
            if(deleteStatus > 0) {
                message.channel.send("Word is removed from blacklist!")
            } else {
                message.channel.send("That word is not in the blacklist. Please do ``!blacklist`` to get a list of all the blacklist words.")
            }
        })

    },
    permissions: ['ADMINISTRATOR'],
    requiredRoles: [],
}