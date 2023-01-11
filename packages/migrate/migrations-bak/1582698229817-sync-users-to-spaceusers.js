const db = require("../db");
const _ = require("underscore");

function getUserEmail(emails){
    if(_.isArray(emails)){
        let email = _.find(emails, function(email){
            return email && email.primary && email.verified;
        })
        if(!email){
            email = _.find(emails, function(email){
                return email && email.verified;
            })
        }
        if(!email){
            if(emails.length > 0){
                email = emails[0];
            }
        }
        return email;
    }
}

/** 
 * 同步users中的数据到space_users
 * 
*/
async function syncUserInfoToSpaceUserInfo(){
    let users = await db.find('users', {});
    let i = 1;
    for(let user of users){
        console.log(i, 'user._id', user._id);
        let spaceUserSet = {locale: 'zh-cn'}
        let email = getUserEmail(user.emails);
        if(email){
            spaceUserSet.email = email.address;
            spaceUserSet.email_verified = email.verified;
        }
        if(user.phone){
            if(user.phone.mobile){
                spaceUserSet.mobile = user.phone.mobile;
                spaceUserSet.mobile_verified = user.phone.verified;
            }
        }
        spaceUserSet.email_notification = user.email_notification || false;
        spaceUserSet.avatar = user.avatar;
        spaceUserSet.last_logon = user.last_logon;
        spaceUserSet.username = user.username;
        await db.updateMany('space_users', [['user', '=', user._id]], spaceUserSet);
        i++;
    }
}


/** 
 * 同步space_users中的数据到users
 * 
*/
async function upgradeUserInfo(){
    let users = await db.find('users', {});
    let i = 1;
    for(let user of users){
        console.log(i, 'user._id', user._id);
        let userSet = {};
        let email = getUserEmail(user.emails);
        if(email){
            userSet.email = email.address;
            userSet.email_verified = email.verified;
        }
        if(user.phone){
            if(user.phone.mobile){
                userSet.mobile = user.phone.mobile;
                userSet.mobile_verified = user.phone.verified;
            }
        }
        userSet.cms_notification = false;
        await db.updateMany('users', [['_id', '=', user._id]], userSet);
        i++;
    }
}

async function upgradeSpaceUserInfo(){
    let space_users = await db.find('space_users', {});
    let i = 1;
    for(let space_user of space_users){
        console.log(i, 'space_user._id', space_user._id);
        await db.updateOne('space_users', space_user._id, {owner: space_user.user})
        i++;
    }
}


module.exports.up = async function (next) {
    try {
        await upgradeUserInfo();
        await upgradeSpaceUserInfo();
        await syncUserInfoToSpaceUserInfo();    
    } catch (error) {
        console.log(error)
    }
    
}

module.exports.down = async function (next) {

}