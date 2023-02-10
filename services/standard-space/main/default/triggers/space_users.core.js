/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2021-05-24 12:32:57
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-07 19:49:48
 * @Description: 
 */
const _ = require('underscore');
const NEEDSYNCATTRIBUTES = ['name', 'username', 'email', 'email_verified', 'mobile', 
'mobile_verified', 'locale', 'avatar', 'last_logon', 'email_notification', 'sms_notification', 'password_expired'];
const { Binary } = require('mongodb');
const { getObject } = require('@steedos/objectql');

getNeedSyncSet = function(doc, modifierSet){
    let syncSet = {};
    _.each(NEEDSYNCATTRIBUTES, function(key){
        if(_.has(modifierSet, key) && doc[key] != modifierSet[key]){
            syncSet[key] = modifierSet[key]
        }
    })
    return syncSet;
}


//当space_users的特定属性[:NEEDSYNCATTRIBUTES]变化时，同步到users、非当前space_users
exports.syncUserInfo = async function (doc, modifierSet) {
    const userObj = getObject('users')
    const suObj = getObject('space_users')
    let needSyncProp = getNeedSyncSet(doc, modifierSet);
    if(!_.isEmpty(needSyncProp)){
        let userProp = {};
        
        if(needSyncProp.email){
			needSyncProp.email_verified = false
        }

		if(needSyncProp.mobile){
			needSyncProp.mobile_verified = false
        }

        if(_.has(needSyncProp, 'email') && !needSyncProp.email){
            needSyncProp.email_verified = false
        }
        
        if(needSyncProp.email){
            userProp = Object.assign({steedos_id: needSyncProp.email, emails: [{
                address: needSyncProp.email,
                verified: false
            }]}, needSyncProp)
        }else{
            userProp = needSyncProp
        }

        // 由于matb33_collection_hooks调用了EJSON.clone丢失了加密字段类型Binary，故这里还原回来
        function _conertToBinary(doc) {
            for (const key in doc) {
                if (Object.hasOwnProperty.call(doc, key)) {
                    const element = doc[key];
                    if (typeof element == 'object') {
                        if (element && element.sub_type
                            && element.buffer
                            && element.position) {
                            doc[key] =  new Binary(Buffer.from(element.buffer), element.sub_type);
                        }
                    }
                }
            }
        }
        _conertToBinary(userProp);
        _conertToBinary(needSyncProp);

        await userObj.directUpdate(doc.user, userProp)
        await suObj.updateMany([
            ['_id', '!=', doc._id],
            ['user', '=', doc.user]
        ], needSyncProp)
    }
}

exports.pickNeedSyncProp = function(doc){
    return _.pick(doc, NEEDSYNCATTRIBUTES);
}