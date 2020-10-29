const Discord = require("discord.js")
const fs = require('fs');
const {spawn} = require('child_process');
const mainDir = require('../../mainPath')
const path = require('path')
const AhProducts = require('../../database/ahProducts')

// Create Embed card for the product
function createProductCard(product) {
    return new Discord.MessageEmbed()
    .setTitle("AH Product")
    .setThumbnail(product.image_url)
    .setURL(product.url)
    .addFields(
        { name: 'Brand', value: product.brand, inline: true },
        { name: 'Category', value: product.category, inline: false },
        { name: 'Description', value: product.description, inline: false },
        { name: 'Price', value: product.price_current, inline: true },
        { name: 'Discount', value: product.is_discounted, inline: true },
	)
}

// Get a product
function getSpeceficProduct(message, productName) {
    AhProducts.getProduct(message.guild, productName, (product) => {
        //Check if there is a product find
        if(product === undefined) {
            message.channel.send("This product is not in the list. Do ``!ah`` to see the list of all available products.")
            return
        }

        const { url } = product //Get the url of the product
        var productInfo; //The product Info gethered from the API
        var pythonFile = path.join(mainDir, 'ahApi.py') //The directory for the python script
    
        // spawn new child process to call the python script
        const python = spawn('python', [pythonFile, message.author.id, message.guild.id, url]);

        // collect data from script
        python.stdout.on('data', function (data) {
            productInfo = data.toString();
        });

        // Error of the python script if is one
        python.stderr.on('data', (data) => {
            console.error(`child stderr:\n${data}`);
        });
    
        // in close event we are sure that stream from child process is closed
        python.on('close', (code) => {   
            console.log(`child process close all stdio with code ${code}`)
            var filePath = productInfo.split('\r')[0]

            if(filePath === 'False') {
                message.channel.send("Something went wrong with this product. Please try again later!")
                return
            }

            var filePathConverted = filePath.replace(/[\'&]+/g, '')
            var product = require(`../../ah-product/${filePathConverted}`)
    
            var ahProductCard = createProductCard(product)
            message.channel.send(ahProductCard)
        })
    })
}

// Get list of all available products
function getAllProducts(message) {
    var productList = ""
    AhProducts.getProducts(message.guild, (products) => {
        for(var { name } of products) {
            productList += `+ ${name} \n`
        }

        const productListEmbed = new Discord.MessageEmbed()
        .setTitle("List of all Albert Heijn products searchable")
        .setDescription(productList)

        message.channel.send(productListEmbed)
    })
}

module.exports = {
    name: "Albert Heijn API",
    description: "Get info about one specefic item from the list or get the full list of searchable items.",
    commands: ['ah', 'albertheijn'],
    expectedArgs: '<product>',
    permisionError: '',
    minArgs: 0,
    maxArgs: null,
    callback: (message, arguments, text, client) => {

        //Check if player wants the full list or a specefic product
        if(arguments.length > 0) {
            getSpeceficProduct(message, text)
        }
        else {
            getAllProducts(message)
        }
    },
    permissions: [],
    requiredRoles: [],
}