import { pick } from 'lodash';
import * as express from 'express';
import { AccountsServer } from '../../../server';
import { sendError } from '../../utils/send-error';
import { errors } from '../../../password/errors';
import { canRegister, loginWithCode } from '../../../core';
import { setAuthCookies } from '../../utils/steedos-auth';
import { db } from '../../../db';
declare var Creator;

export const registerPassword = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    let spaceId = '';
    if(req.body.spaceId){
      spaceId = req.body.spaceId
    }

    // if( req.body.user && req.body.user.password){
    //   throw new Error('禁止密码注册');
    // }

    if(!(await canRegister(spaceId, 'signupAccount'))){
      throw new Error('accounts.unenableRegister');
    }

    let codeRequired = await loginWithCode(spaceId);
    if(codeRequired && !req.body.verifyCode){
      throw new Error('accounts.codeRequired');
    }
    
    const password: any = accountsServer.getServices().password;
    // if(!password.options.validateNewUser){
    //   password.options.validateNewUser = function(user: any) {
    //     // 不需要校验邮件必填及邮件格式，因为邮件必填及格式内核已经校验过了
    //     // if (!user.name) {
    //     //   throw new Error('accounts.name');
    //     // }
    //     // if (!user.password) {
    //     //   throw new Error('accounts.passwordRequired');
    //     // }
    //     return pick(req.body, ['name', 'email', 'password', 'locale', 'mobile']);
    //   };
    // }
    let inviteInfo = null;
    if(req.body.invite_token){
      inviteInfo = await password.getInviteInfo(req.body.invite_token);
      if(!inviteInfo || !inviteInfo.valid){
        throw new Error('accounts.invalid_invite');
      }

      if(!(await canRegister(inviteInfo.space, 'inviteSpaceUser'))){
        throw new Error('accounts.unenableRegister');
      }
    }

    const space = await db.findOne("spaces", req.body.spaceId, {fields: ["name"]});

    const userId = await password.createUser(req.body);
    
    if(inviteInfo && inviteInfo.space){
      Creator.addSpaceUsers(inviteInfo.space, userId, true)
    }else if(req.body.spaceId && space){
      Creator.addSpaceUsers(req.body.spaceId, userId, true)
    }

    const foundedUser = await password.findUserById(userId);
    const result: any = await accountsServer.loginWithUser(foundedUser, {});

    setAuthCookies(req, res, result.user._id, result.token, result.tokens.accessToken);
    let enable_MFA = false;
    // 获取用户简档
    const userProfile = await password.getUserProfile(result.user._id);
    if(userProfile){
      enable_MFA = userProfile.enable_MFA || false
    }
    //启用了多重验证
    if(enable_MFA){
      //不是验证码注册
      if(!req.body.verifyCode){
        result._next = 'TO_VERIFY_MOBILE';
      }
    }

    res.json(result)

    // res.json(accountsServer.options.ambiguousErrorMessages ? null : userId);
  } catch (err) {
    // if(errors.emailAlreadyExists === err.message){
    //   try {
    //     const password: any = accountsServer.getServices().password;
    //     const user = req.body
    //     if(user.email && user.password){
    //       const foundUser = await password.verifyUserPasswordByEmail(user.email, user.password);
    //       //如果用户已存在并且输入的密码正确的情况下，直接加入工作区
    //       if(foundUser){
    //         if(user.spaceId){
    //           Creator.addSpaceUsers(user.spaceId, foundUser.id, true)
    //         }
    //         return res.json(accountsServer.options.ambiguousErrorMessages ? null : foundUser.id);
    //       }else{
    //         throw new Error(errors.emailAlreadyExists);
    //       }
    //     }
    //     return res.json({emailAlreadyExists: true});
    //   } catch (error) {
    //     return sendError(res, {message: errors.emailAlreadyExists});
    //   }
    // }
    sendError(res, err);
  }
};
