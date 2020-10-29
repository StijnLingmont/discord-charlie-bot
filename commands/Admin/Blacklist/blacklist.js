const Discord = require("discord.js")

const Blacklist = require("../../../database/blacklist")

module.exports = {
    name: 'Blacklist',
    description: 'Adding a word or getting the list of all blacklisted words.',
    commands: ['blacklist'],
    expectedArgs: '<word>',
    permisionError: 'You need to be an administrator to do this!',
    minArgs: 0,
    maxArgs: 1,
    callback: (message, arguments, text, client) => {
        //Check if user wants to add blacklist item or get list
        if(arguments.length > 0) {

            //Add word to blacklist
            Blacklist.storeBlackList(message.guild, arguments[0], (storeStatus) => {

                if(storeStatus) {
                    message.channel.send('Word added to the blacklist!')
                } else {
                    message.channel.send('Your word is already in the blaclist. Use ``!blacklist`` to see all the words!')
                }
            })
        } else {
            
            //Get all blacklist words
            var listWords = ""
            
            Blacklist.getBlackList(message.guild, (words) => {
                for(let { banned_word } of words) {
                    listWords += `- ${banned_word} \n`
                }

                const bannedWords = new Discord.MessageEmbed()
                .setTitle("List of all commands")
                .setDescription(listWords)
        
                message.author.send(bannedWords)
            })
        }

    },
    permissions: ['ADMINISTRATOR'],
    requiredRoles: [],
}