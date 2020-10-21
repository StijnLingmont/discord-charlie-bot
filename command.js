const { prefix } = require("./config.json")

class Commands {
    constructor(client) {
        this.client = client
    }

    checkCommand(aliases, callback) {
        if(typeof(aliases) === 'string')
            aliases = [aliases]
  
        this.client.on('message', message => {
            const { content } = message

            if(this.checkCommandStatement(content)) {
                aliases.forEach(alias => {
                    const command = `${prefix}${alias}`
    
                    if(content.startsWith(`${command} `) || content === command) {
                        console.log(`Running the command ${command}`)
                        callback(message)
                    }
                })
            }
        })
    }

    checkCommandStatement(content) {
        if(content === null) return false;

        if(content.startsWith(`${prefix}`))
            return true
        else
            return false
    }
}

module.exports = {
    Commands: Commands
}