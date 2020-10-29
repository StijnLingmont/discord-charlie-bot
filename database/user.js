const db = require('./dbconnect')()

class User {

    constructor(client) {
        this.client = client
    }

    //Store User
    createUser(user, serverId, callback) {
        const main = this;

        //Retrieve user
        db.query(`SELECT * FROM users JOIN scoreboard ON scoreboard.user_id = users.id WHERE users.id = '${user.id}'`, function (err, result, fields) {
            if (err) {
                callback(null)
                throw err
            }

            //Check if user is already in the db or not
            if(result.length < 1) {
                //Create new user
                db.query(`INSERT INTO users(id, name) VALUES ('${user.id}', '${user.username}'); INSERT INTO scoreboard(server_id, user_id, level, xp) VALUES('${serverId}', '${user.id}', 0, 0); SELECT * FROM scoreboard JOIN users ON users.id = scoreboard.user_id WHERE user_id = '${user.id}'`, function (err, userData, fields) {
                    if (err) {
                        callback(null)
                        throw err
                    }
                    callback(userData[2])
                })
            } else {
                callback(result[0])
            }
        });
    }
}

module.exports = new User()