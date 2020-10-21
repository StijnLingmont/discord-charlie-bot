var mysql = require('mysql');

module.exports = () => {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "charlie_bot",
        multipleStatements: true
    });
    
    con.connect(function(err) {
        if (err) throw err;
    });

    return con
}