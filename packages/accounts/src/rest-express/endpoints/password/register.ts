import { pick } from 'lodash';
import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { sendError } from '../../utils/send-error';
import { errors } from '../../../password/errors';
import { canRegister } from '../../../core';

declare var Creator;

export const registerPassword = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    let spaceId = '';
    if(req.body.user && req.body.user.spaceId){
      spaceId = req.body.user.spaceId
    }

    if(!(await canRegister(spaceId))){
      throw new Error('accounts.unenableRegister');
    }
    
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
        return pick(user, ['name', 'email', 'password', 'locale', 'mobile']);
      };
    }
    const userId = await password.createUser(req.body.user);
    //工作区密码注册
    if(req.body.user.spaceId && req.body.user.password){
      Creator.addSpaceUsers(req.body.user.spaceId, userId, true)
    }
    res.json(accountsServer.options.ambiguousErrorMessages ? null : userId);
  } catch (err) {
    if(errors.emailAlreadyExists === err.message && req.body.user.spaceId){
      try {
        //如果用户已存在并且输入的密码正确的情况下，直接加入工作区
        const password: any = accountsServer.getServices().password;
        const user = req.body.user
        if(user.email && user.password){
          const foundUser = await password.verifyUserPasswordByEmail(user.email, user.password);
          if(foundUser && user.spaceId){
            Creator.addSpaceUsers(req.body.user.spaceId, foundUser.id, true)
            return res.json(accountsServer.options.ambiguousErrorMessages ? null : foundUser.id);
          }else{
            throw new Error(errors.emailAlreadyExists);
          }
        }
        return res.json({emailAlreadyExists: true});
      } catch (error) {
        return sendError(res, {message: errors.emailAlreadyExists});
      }
    }
    sendError(res, err);
  }
};
