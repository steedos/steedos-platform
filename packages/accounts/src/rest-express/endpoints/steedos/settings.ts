import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { getSteedosConfig } from '@steedos/objectql'

const config = getSteedosConfig();

export const getSettings = (accountsServer: AccountsServer) => async (
    req: express.Request,
    res: express.Response
  ) => {
    res.json({
      space: config.accounts?config.space:{},
      accounts: config.accounts?config.accounts:{}
    })
}