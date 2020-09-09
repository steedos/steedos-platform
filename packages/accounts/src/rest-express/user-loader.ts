import * as express from 'express';
import { get, isEmpty, map } from 'lodash';
import { AccountsServer } from '../server';
import { db } from '../db';
import { getSteedosConfig } from '@steedos/objectql';
import { getSteedosService } from '../core'
const config = getSteedosConfig();

export const userLoader = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response,
  next: any
) => {
  let authToken =
    get(req.cookies, 'X-Auth-Token') ||
    get(req.headers, 'Authorization') ||
    get(req.headers, 'authorization');

  authToken = authToken && authToken.replace('Bearer ', '').replace('BEARER ', '');
  authToken = authToken && authToken.split(',').length >1?authToken.split(',')[0]:authToken;

  if (!isEmpty(authToken)) {
    try {
      (req as any).authToken = authToken;
      const user: any = await accountsServer.resumeSession(authToken);
      user.id = user._id;
      user.userId = user._id;
      if(user.emails && user.emails.length > 0){
        user.email = user.emails[0].address;
      }
      (req as any).user = user;
      (req as any).userId = user.id;
      const spaces = [];

      const userSpaces = await db.find("space_users", {
        filters: [["user", "=", user.id],["user_accepted", "=", true]],
        fields: ["space"],

      });

      let steedosService = getSteedosService();

      if(userSpaces && userSpaces.length > 0){
        const dbSpaces = await db.find('spaces', {
          filters: [['_id', 'in', map(userSpaces, 'space')]],
          fields: ["_id", "name", "avatar", "avatar_dark"]
        });

        for (let space of dbSpaces) {
          let logo_url = '';
          if(steedosService){
            if (space.avatar_dark) {
              logo_url = steedosService + "api/files/avatars/" + space.avatar_dark
            } else if (space.avatar) {
              logo_url = steedosService + "api/files/avatars/" + space.avatar
            }
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
