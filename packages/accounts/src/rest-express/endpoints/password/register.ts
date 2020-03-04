import { pick } from 'lodash';
import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { sendError } from '../../utils/send-error';

declare var Creator;

export const registerPassword = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const password: any = accountsServer.getServices().password;
    if(!password.options.validateNewUser){
      password.options.validateNewUser = function(user: any) {
        // 不需要校验邮件必填及邮件格式，因为邮件必填及格式内核已经校验过了
        if (!user.name) {
          throw new Error('accounts.name');
        }
        // if (!user.password) {
        //   throw new Error('accounts.passwordRequired');
        // }
        return pick(user, ['name', 'email', 'password', 'locale']);
      };
    }
    const userId = await password.createUser(req.body.user);
    if(req.body.user.space){
      Creator.addSpaceUsers(req.body.user.space, userId, true)
    }
    res.json(accountsServer.options.ambiguousErrorMessages ? null : userId);
  } catch (err) {
    sendError(res, err);
  }
};
