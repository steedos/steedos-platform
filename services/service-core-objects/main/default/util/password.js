const crypto = require('crypto');
const objectql = require('@steedos/objectql');
const config = objectql.getSteedosConfig();

const bcrypt = require('bcryptjs');

bcryptPassword = function(password){
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

hashPassword = function(password, algorithm){
    if (typeof password === 'string') {
        const hash = crypto.createHash(algorithm);
        hash.update(password);
        return hash.digest('hex');
    }

    return password.digest;
};


exports.parsePassword = function(newPassword, options){

    const passwordHashAlgorithm = "sha256"
    let passwordPolicy = (config.password || {}).policy
    if(passwordPolicy){
        if(!(new RegExp(passwordPolicy)).test(newPassword || '')){
            let err = new Error(config.password.policyError);
            throw new Meteor.Error(400, { 
                message: err.message,
                loginInfo: err.loginInfo,
                errorCode: err.errorCode,
            } );
        }
    }
    const formattedPassword = hashPassword(newPassword, passwordHashAlgorithm )
    const bcrypt = bcryptPassword(formattedPassword)
    if(!options.services){
        options.services = {}
    }
    if (!options.services.password) {
        options.services.password = {};
    }
    options.services.password.bcrypt = bcrypt;
    options.password_expired = false;
}