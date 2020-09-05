import * as express from 'express';
import { AccountsServer } from '../../../server';
import { sendError } from '../../utils/send-error';
import { getSteedosConfig } from '@steedos/objectql'
import { db } from '../../../db';
import {getSteedosService } from '../../../core'

const config = getSteedosConfig();

export const getTenant = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {

    const spaceId = req.params.id;
    if (!spaceId)
      throw new Error("accounts.tenant_id_required")
    
    const spaceDoc = await db.findOne("spaces", spaceId, {fields: ["name", "avatar", "avatar_dark", "background", "enable_register", "account_logo"]})

    if(!spaceDoc){
      return res.send({
          exists: false
      });
    }
    
    let steedosService = getSteedosService();

    if (steedosService) {
      if (spaceDoc.account_logo) {
        spaceDoc.logo_url = steedosService + "api/files/avatars/" + spaceDoc.account_logo
      } else if (spaceDoc.avatar_dark) {
        spaceDoc.logo_url = steedosService + "api/files/avatars/" + spaceDoc.avatar_dark
      } else if (spaceDoc.avatar) {
        spaceDoc.logo_url = steedosService + "api/files/avatars/" + spaceDoc.avatar
      } 
      if (spaceDoc.background) {
        spaceDoc.background_url = steedosService + "api/files/avatars/" + spaceDoc.background
      }
    }
    res.json(spaceDoc);
  } catch (err) {
    sendError(res, err);
  }
};
