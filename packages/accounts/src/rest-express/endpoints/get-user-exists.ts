import * as express from 'express';
import { sendError } from '../utils/send-error';
import { db } from '../../db';

export const userExists = () => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    let id = req.query.id;
    if(!id){
        throw new Error("邮箱或手机号不能为空")
    }
    let filters = [];

    if(id.indexOf("@") > 0){
      filters.push(['email', '=', id])
    }else{
      filters.push(['mobile', '=', id])
    }

    const count = await db.count('users', {filters: filters})
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