import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { db } from '../../../db';
import { verifyPassword, hashPassword } from '../../../password/utils';

export const login = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {

  const username = req.body.username;
  const password = req.body.password;

  console.log(req);
  
  if (!username || !password) {
    res.status(401);
    res.json({ message: 'Unauthorized.' });
    return;
  }

  const user = await db.findOne('users', '', {
    filters: [['username','=', username]],
    fields: ['services.password.bcrypt']
  });

  if (!user) {
    res.status(401);
    res.json({ message: 'User not found.' });
    return;
  }

  console.log(user);

  const hash = user.name;

  const pass: any = hashPassword(password, 'sha256');
  const isPasswordValid = await verifyPassword(pass, hash);
  
}