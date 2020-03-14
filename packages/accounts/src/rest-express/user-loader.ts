import * as express from 'express';
import { get, isEmpty, map } from 'lodash';
import { AccountsServer } from '@accounts/server';
import { db } from '../db';
import { getSteedosConfig } from '@steedos/objectql'
const config = getSteedosConfig();

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

      const userSpaces = await db.find("space_users", {
        filters: [["user", "=", user.id]],
        fields: ["space"]
      });

      if(userSpaces && userSpaces.length > 0){
        const dbSpaces = await db.find('spaces', {
          filters: [['_id', 'in', map(userSpaces, 'space')]],
          fields: ["_id", "name", "avatar", "avatar_dark"]
        });

        for (let space of dbSpaces) {
          let logo_url = '';
          if (space.avatar_dark) {
            logo_url = config.webservices.steedos + "api/files/avatars/" + space.avatar_dark
          } else if (space.avatar) {
            logo_url = config.webservices.steedos + "api/files/avatars/" + space.avatar
          } 
          spaces.push({
            _id: space._id,
            name: space.name,
            logo_url
          })
        }
      }
      (req as any).user.spaces = spaces
    } catch (e) {
      console.log(e);
    }
  }
  return next();
};
