const Discord = require("discord.js")
const AhProducts = require('../../database/ahProducts')

module.exports = {
    name: "Add/Update/Remove Albert Heijn Product",
    description: "Add/Update/Remove a product for the Albert Heijn Catalogus.",
    commands: ['ahCms', 'albertheijnCms'],
    expectedArgs: '<product> <url> (-update, -remove)',
    permisionError: '',
    minArgs: 2,
    maxArgs: 3,
    callback: (message, arguments, text, client) => {
        var name = arguments[0]
        var url = arguments[1]

        //Full check which statement is used
        if(arguments.length == 2) {
            if(arguments[1] == "-remove") {
                AhProducts.deleteProduct(message.guild, name)
                message.channel.send("Product removed from the list!")
            } else {
                AhProducts.storeProduct(message.guild, name, url)
                message.channel.send("Product added to the list!")
            }

        } else {
            if(arguments[2] == "-update") {
                AhProducts.updateProduct(message.guild, name, url)
                message.channel.send("Product updated from the list!")
            }
        }
    },
    permissions: ['ADMINISTRATOR'],
    requiredRoles: [],
}