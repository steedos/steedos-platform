import * as express from 'express';

import { get, isEmpty, map } from 'lodash';
import { AccountsServer } from '../../server';
import { sendError } from '../utils/send-error';

export const getMySpaces = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  const user = (req as any).user
  if (!user){
    res.json({message: 'accounts.userNotFound'});
    return;
  }

  const spaces = await accountsServer.db.getMySpaces(user.id);

  res.json(spaces);
};
