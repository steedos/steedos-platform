import * as express from 'express';
import { get, isEmpty } from 'lodash';
import { AccountsServer } from '@accounts/server';

export const userLoader = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response,
  next: any
) => {
  console.log("userLoader start")
  let accessToken =
    get(req.cookies, 'X-Access-Token') ||
    get(req.headers, 'Authorization') ||
    get(req.headers, 'authorization') ||
    get(req.body, 'accessToken', undefined);
  accessToken = accessToken && accessToken.replace('Bearer ', '');
  if (!isEmpty(accessToken)) {
    try {
      (req as any).authToken = accessToken;
      const user = await accountsServer.resumeSession(accessToken);
      (user as any).id = (user as any)._id;
      (user as any).userId = (user as any)._id;
      (user as any).email = user.emails[0].address;
      (req as any).user = user;
      (req as any).userId = user.id;
    } catch (e) {
      // Do nothing
    }
  }
  console.log("userLoader end")
  return next();
};
