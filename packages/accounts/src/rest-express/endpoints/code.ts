import * as express from 'express';
import * as requestIp from 'request-ip';
import { AccountsServer, generateRandomToken } from '../../server';
import { sendError } from '../utils/send-error';
import { getSteedosConfig } from '@steedos/objectql';

export const applyCode = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
      let loginId = req.body.loginId;
      let spaceId = req.body.spaceId;

      
  } catch (err) {
      sendError(res, err);
  }
};