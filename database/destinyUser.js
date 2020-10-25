const db = require('./dbconnect')()

class DestinyUser {
    storeBaseUser(member) {
        db.query(`INSERT INTO destiny_user(id, username) VALUES('${member.membershipId}', '${member.displayName}') ON DUPLICATE KEY UPDATE username = '${member.displayName}'`, function (err, result, fields) {
            if (err) throw err;
        });
    }

    storeToken(member) {

    }
}

module.exports = new DestinyUser()