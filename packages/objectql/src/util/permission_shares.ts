import { SteedosUserSession, getConfig } from '..';
const _ = require('underscore');


export function getUserObjectSharesFilters(object_name: string, userSession: SteedosUserSession){
    let sharesFilters = []
    if(userSession){
        _.each(_.filter(userSession.permission_shares, (permission_share)=>{return permission_share.object_name === object_name}), function(share){
            let shareDoc = getConfig('permission_shares', share._id);
            sharesFilters.push(`(${shareDoc.filters})`)
        })
    }
    return sharesFilters;
}