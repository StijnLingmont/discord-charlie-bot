const Discord = require("discord.js")
const Axios = require("axios")
const { destiny } = require("../../config.json")

// Create a card for the user with the info
function MakeUserCard(member, message) {
    var infoFields;

    infoFields = [];

    for(var profile of member.profiles) {
        var value = `
        Username: ${profile.displayName}
        Last played: ${profile.dateLastPlayed}
        `
        infoFields.push({
            'name': GetMembershipType(profile.membershipType),
            'value': value,
        })
        console.log(profile)
    }

    const memberInfo = new Discord.MessageEmbed()
    .setTitle(`${member.bungieName}`)
    .addFields(infoFields)
    .setThumbnail(`https://www.bungie.net${member.profilePicturePath}`)

    message.channel.send(memberInfo)
}

// Get the membership type from the Destiny 2 API
function GetMembershipType(membershipType) {
    var type = null;
    switch(membershipType) {
        case 1:
            type = "Xbox"
            break;
        case 2:
            type = "Psn"
            break;
        case 3:
            type = "Steam"
            break;
        case 4:
            type = "Blizzard"
            break;
        case 5:
            type = "Stadia"
            break;
        case 10:
            type = "Demon"
            break;
        default: 
            type = null
            break;
    }

    return type
}

// Save the profiles in the member info
function SaveProfiles(member, profiles, message) {
    var userInfo = {
        bungieName: member.displayName,
        profilePicturePath: member.profilePicturePath
    }
    userInfo.profiles = []

    for(var profile of profiles) {
        userInfo.profiles.push(profile)
    }

    MakeUserCard(userInfo, message)
}

// Get the profiles from the Bungie account
function GetProfiles(member, message) {
    Axios.get(`https://www.bungie.net/Platform/Destiny2/254/Profile/${member.membershipId}/LinkedProfiles/`, {
        headers: {
          'X-API-Key': destiny.ApiKey
        }
    })
    .then((response) => {
        SaveProfiles(member, response.data.Response.profiles, message)
    })
    .catch((error) => {
        console.log(error)
    })
}

module.exports = {
    name: "Destiny - Search User",
    description: "Search for Bungie users",
    commands: ['searchDestiny', 'searchdes', 'sDestiny', 'searchd'],
    expectedArgs: '<bungie username>',
    permisionError: '',
    minArgs: 1,
    maxArgs: 1,
    callback: (message, arguments, text, client) => {

        //Get the base info from the bungie acount
        Axios.get(`https://www.bungie.net/Platform/User/SearchUsers?q=${arguments[0]}`, {
            headers: {
              'X-API-Key': destiny.ApiKey
            }
        })
        .then((response) => {
            var member = response.data.Response[0] //Base info from bungie account
            GetProfiles(member, message)
        })
        .catch((error) => {
            console.log(error)
        })
    },
    permissions: [],
    requiredRoles: [],
}