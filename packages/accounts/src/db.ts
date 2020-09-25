import { getSteedosConfig, SteedosMongoDriver } from '@steedos/objectql';

let url = process.env.MONGO_URL;
if (!url)
    url = getSteedosConfig().datasources.default.connection.url;

export const db = new SteedosMongoDriver({ url: url });

export const mongoUrl = url