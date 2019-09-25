import * as express from 'express';
import { get, isEmpty } from 'lodash';
import { AccountsServer } from '@accounts/server';
import { db } from '../db';

export const userLoader = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response,
  next: any
) => {
  let accessToken =
    get(req.cookies, 'X-Access-Token') ||
    get(req.headers, 'Authorization') ||
    get(req.headers, 'authorization') ||
    get(req.body, 'accessToken', undefined);
  accessToken = accessToken && accessToken.replace('Bearer ', '');
  if (!isEmpty(accessToken)) {
    try {
      (req as any).authToken = accessToken;
      const user: any = await accountsServer.resumeSession(accessToken);
      user.id = user._id;
      user.userId = user._id;
      if(user.emails && user.emails.length > 0){
        user.email = user.emails[0].address;
      }
      (req as any).user = user;
      (req as any).userId = user.id;
      const spaces = [];

      const dbspaces = await db.find("space_users", {
        filters: [["user", "=", user.id]],
        fields: ["space"]
      });

      for (let space of dbspaces) {
        spaces.push({_id: space.space})
      }

      (req as any).user.spaces = spaces;

    } catch (e) {
      // Do nothing
    }
  }
  return next();
};
