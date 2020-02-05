import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { sendError } from '../../utils/send-error';

export const registerPassword = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const password: any = accountsServer.getServices().password;
    if(!password.options.validateNewUser){
      password.options.validateNewUser = function(user: any) {
        return user;
      };
    }
    const userId = await password.createUser(req.body.user);
    res.json(accountsServer.options.ambiguousErrorMessages ? null : userId);
  } catch (err) {
    sendError(res, err);
  }
};
