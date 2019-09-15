import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { sendError } from '../../utils/send-error';
import { db } from '../../../db';

export const createTenant = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    if ((req as any).user == null) {
        throw new Error("accounts.access_denied")
    }

    const userId = (req as any).user._id
    const userDoc = (req as any).user
    const spaceName = req.body.name;
    if (!spaceName)
        throw new Error("accounts.tenant_name_required")
    
    const spaceDoc = await db.insert("spaces", {name: spaceName, owner: userId, admins: [userId]})
    const orgDoc = await db.insert("organizations", {space: spaceDoc._id, name: spaceDoc.name, fullname: spaceDoc.name, is_company: true, users: [userId]})
    await db.insert("space_users", {user: userDoc._id, space: spaceDoc._id, username: userDoc.username, name: userDoc.name, user_accepted: true, organizations: [orgDoc._id], organizations_parents: [orgDoc._id]})    

    res.json(spaceDoc);
  } catch (err) {
    sendError(res, err);
  }
};
