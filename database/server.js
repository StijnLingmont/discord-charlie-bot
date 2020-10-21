const db = require('./dbconnect')()

class Server {
    storeServer(guild) {
        console.log(guild)
        db.query(`SELECT * FROM servers WHERE id = ${guild.id}`, function (err, result, fields) {
            if (err) throw err;

            //Check if user is already in the db or not
            if(result.length < 1) {
                //Create new user
                db.query(`INSERT INTO servers (id, name) VALUES (${guild.id}, '${guild.name}')`, function (err, result, fields) {
                    if (err) throw err;
                })
            }
        });
    }
}

module.exports = new Server()