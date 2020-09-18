import * as express from 'express';
import { AccountsServer } from '../../../server';
import { sendError } from '../../utils/send-error';

export const verify_email = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email, code } = req.body;
    const valid = await accountsServer.db.checkVerificationCode({email: email}, code)
    if(valid){

      


      res.json({});
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
        const { mobile, code } = req.body;
        const valid = await accountsServer.db.checkVerificationCode({mobile: mobile}, code);
        if(valid){
          res.json({});
        }else{
          res.json({error: 'accounts.invalidCode'})
        }
    } catch (err) {
      sendError(res, err);
    }
  };

