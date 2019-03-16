const {Command, flags} = require('@oclif/command')
path = require("path")
fs = require("fs")
os = require("os")
const yaml = require('js-yaml');

class RunCommand extends Command {
  async run() {
    const {flags} = this.parse(RunCommand)
    if (flags.serverDir)
      process.env.SERVER_DIR = flags.serverDir; 
    if (flags.port)    
      process.env.PORT = flags.port
    if (flags.rootUrl)
      process.env.ROOT_URL = flags.rootUrl
    if (flags.mongoUrl)
      process.env.MONGO_URL = flags.mongoUrl

    var meteor = require('@steedos/meteor-bundle-runner');
    meteor.run();

  }
}

RunCommand.description = `Run steedos server
...
Extra documentation goes here
`

RunCommand.flags = {
    serverDir: flags.string({char: 's', description: 'Steedos Server Dir'}),
    port: flags.string({char: 'p', description: 'Steedos Server PORT', default:"3000", env: "PORT"}),
    rootUrl: flags.string({char: 'r', description: 'Steedos Server rootUrl', env: "ROOT_URL"}),
    mongoUrl: flags.string({char: 'm', description: 'MongoDB Server UrL', default:"mongodb://127.0.0.1/steedos", env: "MONGO_URL"}),
    verbose: flags.boolean({char: 'v', description: 'Show loggins', hidden: true})
}

module.exports = RunCommand
