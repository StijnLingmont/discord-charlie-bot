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
        var name = arguments[0] // Product name
        var url = arguments[1] // Product url

        //Full check which statement is used
        if(arguments.length == 2) {
            if(arguments[1] == "-remove") {
                //Remove the item from the list
                AhProducts.deleteProduct(message.guild, name)
                message.channel.send("Product removed from the list!")
            } else {
                //Store the item in the list
                AhProducts.storeProduct(message.guild, name, url)
                message.channel.send("Product added to the list!")
            }

        } else {
            if(arguments[2] == "-update") {
                //Update the item in the list
                AhProducts.updateProduct(message.guild, name, url)
                message.channel.send("Product updated from the list!")
            }
        }
    },
    permissions: ['ADMINISTRATOR'],
    requiredRoles: [],
}