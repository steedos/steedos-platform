import { getCookie } from '../utils';

export const getUserId = ()=>{
    if(window.Meteor){
        return window.Meteor.userId()
    }
    return getCookie("X-User-Id");
}

export const getAuthToken = ()=>{
    if(window.Meteor){
        return window.Accounts._storedLoginToken();
    }
    return getCookie("X-Auth-Token");
}

export const getSpaceId = ()=>{
    if(window.Meteor){
        return window.Steedos.spaceId();
    }
    return getCookie("X-Space-Id");
}