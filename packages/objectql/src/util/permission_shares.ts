import { SteedosUserSession, getConfig } from '..';
const _ = require('underscore');


export function getUserObjectSharesFilters(object_name: string, userSession: SteedosUserSession){
    let sharesFilters = []
    if(userSession){
        _.each(_.filter(userSession.permission_shares, (permission_share)=>{
            let shareObjectName =  permission_share.object_name;
            if(_.isString(shareObjectName)){
                return shareObjectName === object_name
            }
            if(_.isArray(shareObjectName)){
                return _.contains(shareObjectName, object_name);
            }
            return false
        }), function(share){
            let shareDoc = getConfig('permission_shares', share._id);
            if(!_.isEmpty(shareDoc.filters)){
                sharesFilters.push(`(${shareDoc.filters})`)
            }
        })
    }
    return sharesFilters;
}