import * as express from 'express';
import * as _ from 'lodash';
import { AccountsServer } from '@accounts/server';
import { getSteedosConfig } from '@steedos/objectql'
import { db } from '../../../db';

const config = getSteedosConfig();

export const getSettings = (accountsServer: AccountsServer) => async (
    req: express.Request,
    res: express.Response
  ) => {
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
  res.json({
    tenant: tenant,
    password: config.password?config.password:{},
    root_url: process.env.ROOT_URL
  })
}