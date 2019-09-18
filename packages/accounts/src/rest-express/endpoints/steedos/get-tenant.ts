import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { sendError } from '../../utils/send-error';
import { db } from '../../../db';

export const getTenant = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {

    const spaceId = req.query.tenant;
    if (!spaceId)
        throw new Error("accounts.tenant_id_required")
    
    const now = new Date();
    const spaceDoc = await db.findOne("spaces", spaceId, {fields: ["name"]})
    
    res.json(spaceDoc);
  } catch (err) {
    sendError(res, err);
  }
};
