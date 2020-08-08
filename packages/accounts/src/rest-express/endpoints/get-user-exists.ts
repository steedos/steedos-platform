import * as express from 'express';
import { sendError } from '../utils/send-error';
import { db } from '../../db';
import { trim } from 'lodash';

export const userExists = () => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    let id = req.query.id;
    let spaceId = req.query.spaceId;
    if(!id){
        throw new Error("邮箱或手机号不能为空")
    }

    let filters = [];

    if(id.indexOf("@") > 0){
      filters.push(['email', '=', id.trim().toLowerCase()])
    }else{
      filters.push(['mobile', '=', id])
    }

    const count = await db.count('users', {filters: filters});
    let su_exists = false
    if(spaceId && count > 0){
      filters.push(['space', '=', spaceId])
      const suCount = await db.count('spaces_users', {filters: filters});
      if(suCount > 0){
        su_exists = true;
      }
    }

    if(count > 0){
        return res.send({
            exists: true,
            su_exists
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