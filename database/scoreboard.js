const db = require('./dbconnect')()
const User = require('./user')
const { maxLevel, maxXp } = require("../config.json")

class Scoreboard {
    constructor() {
        this.talkedRecently = {}
    }

    //Get full scoreboard
    async getScoreboard(guild, callback) {
        db.query(`SELECT * FROM scoreboard WHERE server_id = ${guild.id} ORDER BY xp DESC`, function (err, result, fields) {
            if (err) throw err;

            callback(result)
        });
    }

    //Store Specefic User his XP and Level
    storeUserExperience(userData) {
        db.query(`UPDATE scoreboard SET level = ${userData.level}, xp = ${userData.xp} WHERE user_id = ${userData['user_id']}`, function (err, result, fields) {
            if (err) throw err;
        });
    }

    //Give XP to user
    giveXp(message) {
        //Do a spam check
        var main = this

        this.spamCheck(message, () => {
            //TODO: Efficient way to check if the server is still added
    
            //Check if user already exist in list. If not then add. 
            User.createUser(message.author, message.guild.id, (userData) => {
                if(userData === null) return;

                //Check if the data given is still in array. If so split it from the array
                if(userData[0] !== undefined)
                    userData = userData[0]

                userData['xp'] = main.getXp(userData['xp']) //Give random xp
    
                main.checkLevel(userData, (level) => {
                    //Check if the user is leveled up
                    if(level > userData['level'])
                        message.reply(`Level up! You are now level ${level}`)

                    userData['level'] = level

                    main.storeUserExperience(userData)
                })
            })
        })
    }
    
    //Check which level the user is
    checkLevel(userData, callback) {
        var level = Math.floor(((userData['xp'] - 500) / 400) + 1)
        if(level === 0)
            level = 1

        if(level > maxLevel)
            level = maxLevel

        callback(level)
    }
    
    //Give the new xp for the user
    getXp(xp) {
        var newXp = xp + Math.floor(Math.random() * 10)
        if(newXp > maxXp)
            newXp = maxXp
        return newXp
    }
    
    //Do spam check to see if the user is not spamming his chat comments
    spamCheck(message, callback) {
        //Check if the server is on the list otherwise create it
        if(this.talkedRecently[message.guild.id] === undefined)
            this.talkedRecently[message.guild.id] = []
    
        // If it is a new (not spam) message give player xp
        if (!this.talkedRecently[message.guild.id].includes(message.author.id)) {
            this.talkedRecently[message.guild.id].push(message.author.id)
    
            setTimeout(() => {
                const index = this.talkedRecently[message.guild.id].indexOf(message.author.id);
                if (index > -1) {
                    this.talkedRecently[message.guild.id].splice(index, 1);
                }
            }, 10000);
    
            callback()
        }
    }
}

module.exports = new Scoreboard()