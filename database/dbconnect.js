var mysql = require('mysql');

module.exports = () => {
    
    // Create Database connection settings
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "charlie_bot",
        multipleStatements: true
    });
    
    // Connect to Database
    con.connect(function(err) {
        if (err) throw err;
    });

    return con
}