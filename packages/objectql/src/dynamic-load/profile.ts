import { SteedosProfileTypeConfig } from '../ts-types';
import { addConfig, getConfig, getConfigs } from '../types';
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
    admin: {_id: 'admin', name: 'admin',label: 'admin', license: 'platform', ...DEFAULTRECORD, ...BASERECORD},
    user: {_id: 'user', name: 'user',label: 'user', license: 'platform', ...DEFAULTRECORD, ...BASERECORD},
    supplier: {_id: 'supplier', name: 'supplier',label: 'supplier', license: 'community', ...DEFAULTRECORD, ...BASERECORD},
    customer: {_id: 'customer', name: 'customer', label: 'customer', license: 'community', ...DEFAULTRECORD, ...BASERECORD}
}

const PROFILES_KEY = 'STANDARD_PROFILES';

const getStandardProfile = function(name){
    return getStandardProfiles()[name];
}

const getStandardProfiles = function(){
    return clone(STANDARD_PROFILES);
}

const addProfile = function(json: SteedosProfileTypeConfig){
    if(!json.name){
        throw new Error('missing attribute name');
    }
    if(_.include(_.keys(STANDARD_PROFILES), json.name)){
        addConfig(PROFILES_KEY, Object.assign({}, getStandardProfile(json.name), json, clone(BASERECORD)));
    }else{
        addConfig(PROFILES_KEY, Object.assign({}, clone(DEFAULTRECORD), json, clone(BASERECORD)));
    }
}

export const loadStandardProfiles = function(){
    _.each(STANDARD_PROFILES, function(standardProfile: SteedosProfileTypeConfig){
        addConfig(PROFILES_KEY, standardProfile);
    })
}
    

export const loadSourceProfiles = function (filePath: string){
    let profiles = util.loadProfiles(filePath)
    _.each(profiles, (json: SteedosProfileTypeConfig) => {
        addProfile(json);
    })
}

export const getSourceProfile = function(name){
    return getConfig(PROFILES_KEY, name);
}

export const getSourceProfilesKeys = function(){
    return _.pluck(getSourceProfiles(), 'name');
}

export const getSourceProfiles = function(){
    return getConfigs(PROFILES_KEY) || [];
}