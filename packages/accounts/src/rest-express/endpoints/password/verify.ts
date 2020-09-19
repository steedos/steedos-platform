import * as express from 'express';
import { AccountsServer } from '../../../server';
import { sendError } from '../../utils/send-error';

export const verify_email = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    if (!(req as any).userId) {
      res.status(401);
      res.json({ message: 'Unauthorized' });
      return;
    }
    const userId = (req as any).userId;
    const { email, code } = req.body;
    const valid = await accountsServer.db.checkVerificationCode({email: email}, code)
    if(valid){
      await accountsServer.db.setEmail(userId, email);
      await accountsServer.db.verifyEmail(userId, email);
      res.json({userId: userId, email_verified: true});
    }else{
      res.json({error: 'accounts.invalidCode'})
    }
  } catch (err) {
    sendError(res, err);
  }
};

export const verify_mobile = (accountsServer: AccountsServer) => async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      if (!(req as any).userId) {
        res.status(401);
        res.json({ message: 'Unauthorized' });
        return;
      }
      const userId = (req as any).userId;
      const { mobile, code } = req.body;
      const valid = await accountsServer.db.checkVerificationCode({mobile: mobile}, code);
      if(valid){
        await accountsServer.db.setMobile(userId, mobile);
        await accountsServer.db.verifyMobile(userId, mobile);
        res.json({userId: userId, mobile_verified: true});
      }else{
        res.json({error: 'accounts.invalidCode'})
      }
    } catch (err) {
      sendError(res, err);
    }
  };

