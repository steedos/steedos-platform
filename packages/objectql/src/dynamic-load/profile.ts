import { SteedosProfileTypeConfig } from '../ts-types';
import { getSteedosSchema } from '../types/schema';
var util = require('../util');
var clone = require('clone');
var _ = require('underscore');
const PERMISSIONS = {
  allowEdit: false,
  allowDelete: false,
  allowRead: true,
};

const BASERECORD = {
  is_system: true,
  type: "profile",
  record_permissions: PERMISSIONS
};

const DEFAULTRECORD = {
    password_history: "3",
    max_login_attempts: "10",
    lockout_interval: "15",
}

const STANDARD_PROFILES = {
    admin: {_id: 'admin', name: 'admin',label: 'admin', ...DEFAULTRECORD, ...BASERECORD},
    user: {_id: 'user', name: 'user',label: 'user', ...DEFAULTRECORD, ...BASERECORD},
    supplier: {_id: 'supplier', name: 'supplier',label: 'supplier', ...DEFAULTRECORD, ...BASERECORD},
    customer: {_id: 'customer', name: 'customer', label: 'customer', ...DEFAULTRECORD, ...BASERECORD}
}

// const PROFILES_KEY = 'STANDARD_PROFILES';

const getStandardProfile = function(name){
    return getStandardProfiles()[name];
}

const getStandardProfiles = function(){
    return clone(STANDARD_PROFILES);
}

const addProfile = async function(json: SteedosProfileTypeConfig, serviceName: string){
    if(!json.name){
        throw new Error('missing attribute name: ' + (json as any)?.__filename)
    }

    let profileConfig = null;

    if(_.include(_.keys(STANDARD_PROFILES), json.name)){
        profileConfig = Object.assign({}, getStandardProfile(json.name), json, clone(BASERECORD))
        // addConfig(PROFILES_KEY, Object.assign({}, getStandardProfile(json.name), json, clone(BASERECORD)));
    }else{
        profileConfig = Object.assign({}, clone(DEFAULTRECORD), json, clone(BASERECORD))
        // addConfig(PROFILES_KEY, Object.assign({}, clone(DEFAULTRECORD), json, clone(BASERECORD)));
    }
    const schema = getSteedosSchema();
    await schema.metadataRegister?.addProfile(serviceName, profileConfig);
}

export const loadStandardProfiles = async function(serviceName: string){
    const schema = getSteedosSchema();
    const keys = _.keys(STANDARD_PROFILES);
    for (const key of keys) {
        const standardProfile = STANDARD_PROFILES[key];
        await schema.metadataRegister.addProfile(serviceName, standardProfile);
    }
}

export const loadSourceProfiles = async function (filePath: string, serviceName: string){
    let profiles = util.loadProfiles(filePath)
    for (const profile of profiles) {
       await addProfile(profile, serviceName);
    }
}

export const getSourceProfile = async function(name){
    const schema = getSteedosSchema();
    const profile = await schema.metadataRegister.getProfile(name);
    return profile?.metadata
}

export const getSourceProfilesKeys = async function(){
    const profiles = await getSourceProfiles();
    return _.pluck(profiles, 'name');
}

export const getSourceProfiles = async function(){
    const schema = getSteedosSchema();
    const profiles = await schema.metadataRegister.getProfiles();
    return  profiles ? _.pluck(profiles, 'metadata') : [];
}