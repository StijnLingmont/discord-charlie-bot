const Discord = require("discord.js")
const Axios = require("axios")
const open = require('open')
const DestinyUser = require("../../database/destinyUser")
const { destiny } = require("../../config.json")
const { response } = require("express")

class AuthToken {
    static createFormParams(params) {
        return Object.keys(params)
            .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&')
    }
}

function CheckUser(member, message) {
    const filter = (reaction, user) => ["✅", "❌"].includes(reaction.emoji.name) && user.id === message.author.id

    infoFields = [
        {
            'name': "Username",
            'value': member.displayName
        },
        {
            'name': "First access:",
            'value': member.firstAccess
        },
    ];

    if(member.steamDisplayName != undefined) {
        infoFields.push(        
            {
            'name': "Steam Display Name",
            'value': member.steamDisplayName,
            'inline': true
            }
        )
    }

    if(member.twitchDisplayName != undefined) {
        infoFields.push(        
            {
            'name': "Twitch Display Name",
            'value': member.twitchDisplayName,
            'inline': true
            }
        )
    }

    const memberInfo = new Discord.MessageEmbed()
    .setTitle("Player response")
    .setDescription("Is this your account?")
    .addFields(infoFields)
    .setThumbnail(`https://www.bungie.net${member.profilePicturePath}`)

    message.channel.send(memberInfo).then(async msg => {

        //Give standard reactions
        await msg.react("✅")
        await msg.react("❌")

        msg.awaitReactions(filter, {
            max: 1,
            time: 30000,
            errors: ['time']
        }).then(collected => {
            const reaction = collected.first().emoji.name
            
            //Check if the result is right or not
            if(reaction === "✅") {
                DestinyUser.storeBaseUser(member) //Store the base info of a user

                //Redirect to authentication
                message.channel.send("You will be redirected...")
                open(`https://www.bungie.net/en/OAuth/Authorize?client_id=${ destiny.user_id }&response_type=code`)

            } else if(reaction === "❌") {
                message.channel.send("Check if you're username is right and try again!")
            }
        })
    })
}

module.exports = {
    name: "Destiny Authentication",
    description: "Authenticate for the Destiny 2 bot",
    commands: ['destinyauth', 'dstauth', 'dsauth'],
    expectedArgs: '<bungie username>',
    permisionError: '',
    minArgs: 1,
    maxArgs: 1,
    callback: (message, arguments, text, client) => {
        Axios.get(`https://www.bungie.net/Platform/User/SearchUsers?q=${arguments[0]}`, {
            headers: {
              'X-API-Key': destiny.ApiKey
            }
        })
        .then((response) => {
            var member = response.data.Response[0]

            CheckUser(member, message)
        })
        .catch((error) => {
            console.log(error)
        })

        // var isAuth = true
        // if(!isAuth) {
        //     (async () => {
        //         // Opens the image in the default image viewer and waits for the opened app to quit.
        //         await open(`https://www.bungie.net/en/OAuth/Authorize?client_id=${ destiny.user_id }&response_type=code`, (response) => {
        //             console.log(response)
        //         })
        //         console.log('The image viewer app quit');
        //     })();
        // }
        // else {
        //     var X = Buffer.from(destiny.user_id + ":" + destiny.client_secret).toString('base64');

        //     var token = "a9d8b67c62f8e72a11525910a89bee13"
        //     var userId = destiny.user_id;
        //     Axios.post('https://www.bungie.net/Platform/App/OAuth/Token/', `client_id=${userId}&grant_type=authorization_code&code=${token}`, 
        //     {
        //         headers: {
        //             'X-API-KEY': destiny.ApiKey,
        //             'content-type': 'application/x-www-form-urlencoded',
        //             'Authorization': 'Basic ' + X
        //         }
        //     })
        //     .then(function (response) {
        //         // handle success
        //         console.log(response.data);
        //       })
        //       .catch(function (error) {
        //         // handle error
        //         console.log(error);
        //     });

        //     message.channel.send("You will be redirected...")
        // }
    },
    permissions: [],
    requiredRoles: [],
}