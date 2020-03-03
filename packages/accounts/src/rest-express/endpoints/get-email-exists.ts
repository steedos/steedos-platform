import * as express from 'express';
import { sendError } from '../utils/send-error';
import { db } from '../../db';

export const emailExists = () => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    let email = req.query.email;
    if(!email){
        throw new Error("邮箱不能为空")
    }
    const count = await db.count('users', {filters: [['email', '=', email]]})
    if(count > 0){
        return res.send({
            exists: true
        });
    }else{
        return res.send({
            exists: false
        });
    }
  } catch (err) {
    sendError(res, err);
  }
};