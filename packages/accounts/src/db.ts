import { getSteedosConfig, getConnection } from '@steedos/objectql';

 // @ts-ignore _adapter is private
export const db = getConnection()._adapter; 

