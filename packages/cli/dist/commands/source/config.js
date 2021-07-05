"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const confOclif = require('@oclif/command');
const rl = require('readline-sync');
const chalk = require('chalk');
const metadata_core_1 = require("@steedos/metadata-core");
class ConfigCommand extends confOclif.Command {
    async run() {
        const { args, flags } = this.parse(ConfigCommand);
        // console.log('flags', flags);
        // console.log('args', args);
        var rooturl = metadata_core_1.getRootUrl();
        if (!rooturl) {
            rooturl = process.env.ROOT_URL;
        }
        if (!rooturl) {
            rooturl = 'http://localhost:5000';
        }
        var server = rl.question(`metadata server:(${rooturl})`);
        var apikey = rl.question('metadata api key:');
        if (server == '') {
            server = rooturl;
        }
        if (!server.startsWith('http')) {
            server = `http://${server}`;
        }
        if (server.endsWith('/')) {
            server = server.substring(0, server.length - 1);
        }
        var localEnvPath = metadata_core_1.getLocalEnvPath();
        console.log(chalk.yellow('About to write to ' + localEnvPath) + ':');
        console.log('METADATA_SERVER=' + server);
        console.log('METADATA_APIKEY=' + apikey);
        var isOK = rl.question('Is this OK? [y/n]:(y)');
        if (isOK == '' || isOK.toLowerCase() == 'y') {
            try {
                var config = { server, apikey };
                metadata_core_1.saveSourceConfig(config);
            }
            catch (error) {
                console.error('Error: ' + error.message);
            }
        }
    }
}
module.exports = ConfigCommand;
//# sourceMappingURL=config.js.map