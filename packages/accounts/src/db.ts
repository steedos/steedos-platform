import { getSteedosConfig, SteedosMongoDriver } from '@steedos/objectql';

export const mongoUrl = getSteedosConfig().datasources.default.connection.url;

export const db = new SteedosMongoDriver({ url: mongoUrl });
