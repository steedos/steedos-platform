import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { getSteedosConfig } from '@steedos/objectql'
import { db } from '../../../db';

const config = getSteedosConfig();

export const getSettings = (accountsServer: AccountsServer) => async (
    req: express.Request,
    res: express.Response
  ) => {
  let spaceDoc = config.tenant?config.tenant:{};
  if (config.tenant && config.tenant._id) {
    spaceDoc = await db.findOne("spaces", config.tenant._id, {fields: ["name", "avatar", "avatar_dark", "background", "enable_register", "enable_forget_password", "enable_create_tenant"]})

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
  }
  res.json({
    tenant: spaceDoc,
    password: config.password?config.password:{},
  })
}