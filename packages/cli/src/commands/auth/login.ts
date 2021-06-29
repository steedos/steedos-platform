const loginOclif = require('@oclif/command')
const path = require('path');

import { doLogin } from '@steedos/metadata-core';

class LoginCommand extends loginOclif.Command {
    async run() {
        const { args, flags } = this.parse(LoginCommand);
        // console.log('flags', flags);
        // console.log('args', args);

        var username = flags.username
        var password = flags.password

        if(!username){
            return console.error('Error: user required, flag: -u');
        }
        if(!password){
            return console.error('Error: password required, flag: -p');
        }

        try{
            await doLogin(username, password);
        }catch(error){

            if(error.code == 'ECONNREFUSED'){
                console.error('Error: ' + error.message);
            }else{
                console.error('Error: invalid user or password');
            }
        }

    }
}

LoginCommand.flags = {
    username : loginOclif.flags.string({char: 'u', description: 'user'}),
    password : loginOclif.flags.string({char: 'p', description: 'password'}),
}

module.exports = LoginCommand