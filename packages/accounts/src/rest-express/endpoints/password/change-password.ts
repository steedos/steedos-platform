import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { sendError } from '../../utils/send-error';
import { getSteedosConfig } from '@steedos/objectql'
import { hashPassword } from '../../../password/utils';

const config = getSteedosConfig();
declare var Creator;

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

    let passworPolicy = ((config as any).password || {}).policy

    if(passworPolicy){
      if(!(new RegExp(passworPolicy)).test(newPassword || '')){
          sendError(res, new Error((config as any).password.policyError));
          return;
      }
    }
    
    const password: any = accountsServer.getServices().password;

    await password.changePassword((req as any).userId, oldPassword, hashPassword(newPassword, password.options.passwordHashAlgorithm));
    password.db.collection.updateOne({_id: (req as any).userId}, {$set: {password_expired: false}})
    try {
      Creator.getCollection('space_users').update({user: (req as any).userId}, {$set: {password_expired: false}}, {
        multi: true
      })
    } catch (error) {
      console.log('error', error);
    }
    res.json(null);
  } catch (err) {
    sendError(res, err);
  }
};
