import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { sendError } from '../../utils/send-error';
import SteedosConfig from '../../../config'

import { hashPassword } from '@accounts/password/lib/utils'

export const changePassword = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    if (!(req as any).userId) {
      res.status(401);
      res.json({ message: 'Unauthorized' });
      return;
    }
    const { oldPassword, newPassword } = req.body;

    let passworPolicy = (SteedosConfig as any).public.accounts.password.policy

    if(passworPolicy.reg){
      if(!(new RegExp(passworPolicy.reg)).test(newPassword || '')){
          sendError(res, new Error(passworPolicy.regErrorMessage));
          return;
      }
    }
    
    const password: any = accountsServer.getServices().password;

    await password.changePassword((req as any).userId, oldPassword, hashPassword(newPassword, password.options.passwordHashAlgorithm));
    password.db.collection.updateOne({_id: (req as any).userId}, {$set: {password_expired: false}})
    res.json(null);
  } catch (err) {
    sendError(res, err);
  }
};
