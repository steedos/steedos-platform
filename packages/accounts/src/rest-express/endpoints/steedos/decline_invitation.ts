import * as express from 'express';
import { AccountsServer } from '../../../server';
import { sendError } from '../../utils/send-error';
import { db } from '../../../db';

export const DeclineInvitation = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    if ((req as any).user == null) {
        throw new Error("accounts.access_denied")
    }

    const {tenantId, email} = req.body;
    if (!tenantId)
        throw new Error("accounts.tenant_required")
    if (!email)
        throw new Error("accounts.email_required")

    const spaceUsers = await db.find('space_users', {
        filters: [["space", "=", tenantId], ["email", "=", email], ["user_accepted", "=", false], ["invite_state", "=", "pending"]]
    });

    if(spaceUsers && spaceUsers.length == 1){
        const spaceUser = spaceUsers[0];
        await db.update('space_users', spaceUser._id, {
            user_accepted: false,
            invite_state: 'refused'
        });
    }
    res.json({ok: 1});
  } catch (err) {
    console.log(err)
    sendError(res, err);
  }
};