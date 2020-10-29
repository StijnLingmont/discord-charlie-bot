var path = require('path')

//Get the main directory
function getDir() {
    return path.resolve(__dirname)
}

module.exports = getDir()
