const db = require('./dbconnect')()

class AhProducts {
    getProducts(guild, callback) {
        db.query(`SELECT * FROM ah_products WHERE server_id = '${guild.id}'`, function(err, result, fields) {
            if (err) throw err

            callback(result)
        })
    }

    getProduct(guild, product, callback) {
        db.query(`SELECT * FROM ah_products WHERE server_id = '${guild.id}' AND name = '${product}' LIMIT 1`, function(err, result, fields) {
            if (err) throw err

            callback(result[0])
        })
    }

    storeProduct(guild, name, url) {
        this.getProduct(guild, name, (result) => {
            if(result != undefined) return

            db.query(`INSERT INTO ah_products(server_id, name, url) VALUES('${guild.id}', '${name}', '${url}')`, function(err, result, fields) {
                if (err) throw err
            })
        })
    }

    updateProduct(guild, name, url) {
        db.query(`UPDATE ah_products SET name = '${name}', url = '${url}' WHERE server_id = '${guild.id}' AND name = '${name}' AND EXISTS(SELECT id FROM ah_products WHERE server_id = '${guild.id}' AND name = '${name}' LIMIT 1)`, function(err, result, fields) {
            if (err) throw err
        })
    }

    deleteProduct(guild, name) {
        db.query(`DELETE FROM ah_products WHERE server_id = '${guild.id}' AND name = '${name}' AND EXISTS(SELECT id FROM ah_products WHERE server_id = '${guild.id}' AND name = '${name}' LIMIT 1)`, function(err, result, fields) {
            if (err) throw err
        })
    }
}

module.exports = new AhProducts()