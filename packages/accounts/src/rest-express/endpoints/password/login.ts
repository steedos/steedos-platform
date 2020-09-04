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

  if (!username || !password) {
    res.status(401);
    res.json({ message: 'Unauthorized.' });
    return;
  }

  const users = await db.find('users', {
    filters: [['email','=', username]],
    fields: ['services']
  });

  console.log(users);

  if (!users || users.length == 0) {
    res.status(401);
    res.json({ message: 'User not found.' });
    return;
  }


  const user = users[0];


  if (!user.services || !user.services.password || !user.services.password.bcrypt) {
    res.status(401);
    res.json({ message: 'User has no password set' });
    return;
  }

  const pass: any = hashPassword(password, 'sha256');
  const isPasswordValid = await verifyPassword(pass, user.services.password.bcrypt);
  
  res.json({ message: isPasswordValid });
  return;
}