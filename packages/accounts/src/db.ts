import { getSteedosConfig, getConnection } from '@steedos/objectql';

let url = process.env.MONGO_URL;
if (!url)
    url = getSteedosConfig().datasources.default.connection.url;

 // @ts-ignore _adapter is private
export const db = getConnection()._adapter; 

