const confOclif = require('@oclif/command')

const rl = require('readline-sync');
const chalk = require('chalk');

import { saveSourceConfig, getLocalEnvPath, getRootUrl } from '@steedos/metadata-core'

class ConfigCommand extends confOclif.Command {
    async run() {
        const { args, flags } = this.parse(ConfigCommand);
        // console.log('flags', flags);
        // console.log('args', args);

        var rooturl = getRootUrl();
        if(!rooturl){
            rooturl = process.env.ROOT_URL
        }
        if(!rooturl){
            rooturl = 'http://localhost:5000'
        }
        var server = rl.question(`metadata server:(${rooturl})`);
        var apikey = rl.question('metadata api key:');
        
        if(server == ''){
            server = rooturl
        }

        if(!server.startsWith('http')){
            server = `http://${server}`
        }
        if(server.endsWith('/')){
            server = server.substring(0, server.length-1);
        }

        var localEnvPath = getLocalEnvPath()
        console.log(chalk.yellow('About to write to ' + localEnvPath) + ':');
        console.log('METADATA_SERVER='+server);
        console.log('METADATA_APIKEY='+apikey);
        var isOK = rl.question('Is this OK? [y/n]:(y)');
        
        if(isOK == '' || isOK.toLowerCase() == 'y'){
            
            try{
                var config = {server, apikey}
                saveSourceConfig(config);
            }catch(error){
                console.error('Error: '+error.message);
            }
        }

    }
}

module.exports = ConfigCommand
