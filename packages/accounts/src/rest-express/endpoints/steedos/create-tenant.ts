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
    
    const now = new Date();
    const spaceDoc = await db.insert("spaces", {
      name: spaceName, 
      admins: [userId],
      owner: userId, 
      created_by: userId,
      created: now,
      modified_by: userId,
      modified: now
    })
    await db.updateOne("spaces", spaceDoc._id, {
      space: spaceDoc._id
    }).catch((ex) => {
      console.error(ex);
      return {};
    });
    const companyDoc = await db.insert("company", { 
      name: spaceDoc.name, 
      space: spaceDoc._id, 
      owner: userId,
      created_by: userId,
      created: now,
      modified_by: userId,
      modified: now
    })
    const orgDoc = await db.insert("organizations", {
      _id: companyDoc._id,
      name: spaceDoc.name, 
      fullname: spaceDoc.name, 
      is_company: true, 
      users: [userId],
      company_id: companyDoc._id,
      space: spaceDoc._id, 
      owner: userId,
      created_by: userId,
      created: now,
      modified_by: userId,
      modified: now
    })
    await db.updateOne("company", companyDoc._id, {
      organization: companyDoc._id,
      company_id: companyDoc._id
    }).catch((ex) => {
      console.error(ex);
      return {};
    });
    await db.insert("space_users", {
      user: userDoc._id, 
      username: userDoc.username, 
      name: userDoc.name, 
      email: userDoc.email, 
      user_accepted: true, 
      organization: orgDoc._id, 
      organizations: [orgDoc._id], 
      organizations_parents: [orgDoc._id],
      company_id: companyDoc._id,
      company_ids: [companyDoc._id],
      space: spaceDoc._id,
      owner: userId,
      created_by: userId,
      created: now,
      modified_by: userId,
      modified: now
    })

    res.json(spaceDoc);
  } catch (err) {
    sendError(res, err);
  }
};
