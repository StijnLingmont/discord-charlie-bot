module.exports = getDir()

function getDir() {
    var path = require('path')
    return path.resolve(__dirname)
}
