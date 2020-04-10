import { getSteedosConfig } from '@steedos/objectql'
import { db } from '../db';
import * as _ from 'lodash';

const config = getSteedosConfig();

export const getSettings = async ()=>{
    let tenant = {
        name: "Steedos",
        logo_url: undefined,
        background_url: undefined,
        enable_create_tenant: true,
        enable_register: true,
        enable_forget_password: true
      }
      if (config.tenant && config.tenant._id) {
        let spaceDoc = await db.findOne("spaces", config.tenant._id, {fields: ["name", "avatar", "avatar_dark", "background", "enable_register", "enable_forget_password", "enable_create_tenant"]})
    
        if (config.webservices && config.webservices.steedos) {
          if (!config.webservices.steedos.endsWith("/"))
            config.webservices.steedos += "/"
          
            _.assignIn(tenant, spaceDoc);
          if (spaceDoc.avatar_dark) {
            tenant.logo_url = config.webservices.steedos + "api/files/avatars/" + spaceDoc.avatar_dark
          } else if (spaceDoc.avatar) {
            tenant.logo_url = config.webservices.steedos + "api/files/avatars/" + spaceDoc.avatar
          } 
          if (spaceDoc.background) {
            tenant.background_url = config.webservices.steedos + "api/files/avatars/" + spaceDoc.background
          }
        }
      } else if (config.tenant) {
          _.assignIn(tenant, config.tenant)
      }

      return {
        tenant: tenant,
        password: config.password?config.password:{},
        root_url: process.env.ROOT_URL
      }
}

export const getTenant = async (spaceId)=>{
    if (!spaceId){
        return {};
    }
    
    const spaceDoc = await db.findOne("spaces", spaceId, {fields: ["name", "avatar", "avatar_dark", "background", "enable_register", "enable_forget_password", "enable_create_tenant"]})

    if(!spaceDoc){
      return {}
    }

    if (config.webservices && config.webservices.steedos) {
      if (!config.webservices.steedos.endsWith("/"))
        config.webservices.steedos += "/"
      if (spaceDoc.avatar_dark) {
        spaceDoc.logo_url = config.webservices.steedos + "api/files/avatars/" + spaceDoc.avatar_dark
      } else if (spaceDoc.avatar) {
        spaceDoc.logo_url = config.webservices.steedos + "api/files/avatars/" + spaceDoc.avatar
      } 
      if (spaceDoc.background) {
        spaceDoc.background_url = config.webservices.steedos + "api/files/avatars/" + spaceDoc.background
      }
    }

    return spaceDoc;
}

export const spaceExists = async(spaceId)=>{
  const spaceDoc = await db.findOne("spaces", spaceId, {fields: ["name", "avatar", "avatar_dark", "background", "enable_register", "enable_forget_password", "enable_create_tenant"]})
  if(spaceDoc){
    return true;
  }
  return false;
}

export const getMergedTenant = async (spaceId?)=>{
    const settings: any = await getSettings();
    const tenant: any = await getTenant(spaceId);
    return Object.assign({}, settings.tenant, tenant);
}

export const canRegister = async (spaceId, action)=>{
    const tenant: any = await getMergedTenant(spaceId);
    if(action === 'emailSignupAccount' && tenant.disable_email_register){
      return false
    }
    return tenant.enable_register;
}