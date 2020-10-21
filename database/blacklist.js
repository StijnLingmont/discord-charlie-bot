const db = require('./dbconnect')()

class BlackList {
    storeBlackList(guild, word, callback) {
        db.query(`SELECT * FROM blacklist WHERE server_id = '${guild.id}' AND banned_word = '${word}' LIMIT 1`, function(err, result, fields) {
            if (err) throw err

            if(result.length == 0) {
                db.query(`INSERT INTO blacklist(server_id, banned_word) VALUES('${guild.id}', '${word}')`, function (err, result, fields) {
                    if (err) throw err
                    callback(true)
                });
            }
            else
                callback(false)
        })
    }

    getBlackList(guild, callback) {
        db.query(`SELECT * FROM blacklist WHERE server_id = ${guild.id}`, function (err, result, fields) {
            if (err) throw err

            callback(result)
        })
    }

    removeBlackList(guild, word, callback) {
        db.query(`DELETE FROM blacklist WHERE server_id = '${guild.id}' AND banned_word = '${word}' AND EXISTS(SELECT id FROM blacklist WHERE server_id = '${guild.id}' AND banned_word = '${word}' LIMIT 1)`, function (err, result, fields) {
            if (err) throw err

            console.log(result)

            callback(result.affectedRows)
        })
    }

    checkIfInBlackList(message, callback) {
        var hasBlockedWord = false
        var sentence = message.content

        this.getBlackList(message.guild, (words)=> {
            for(var { banned_word } of words) {
                if(sentence.toLowerCase().includes(banned_word.toLowerCase()))
                    hasBlockedWord = true
            }

            callback(hasBlockedWord)
        })
    }
}

module.exports = new BlackList()