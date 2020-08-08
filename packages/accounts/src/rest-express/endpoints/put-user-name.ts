import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { db } from '../../db';
import { sendError } from '../utils/send-error';

export const changeUserFullname = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
    try {
        if ((req as any).user == null) {
            throw new Error("accounts.access_denied")
        }
    
        const userId = (req as any).user._id

        if (!userId) {
            throw new Error("accounts.access_denied")
        }
        const fullname = req.body.fullname;
        
        await db.updateOne('users', userId, {name: fullname})
        await db.updateMany('space_users', [['user', '=', userId]], {name: fullname})
        res.json({});
      } catch (err) {
        sendError(res, err);
      }
};
