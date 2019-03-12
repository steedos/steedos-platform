import "reflect-metadata";
export { Connection, getConnection, createConnection } from "typeorm";
export { ConnectionManager, getConnectionManager } from "typeorm";

import { getFromContainer } from "./container";
import { ObjectSchemaManager } from "./object/ObjectSchemaManager";
import { CreatorManager } from "./creator/CreatorManager";

export { ObjectSchema } from './object/ObjectSchema';
export { ObjectSchemaManager } from './object/ObjectSchemaManager';
export { ObjectSchemaOptions } from './object/ObjectSchemaOptions';

export { Apps, AppManager } from './app';
export { Reports, ReportManager } from './report';
export { Triggers, TriggerManager } from './trigger';
export { Validators, ValidatorManager } from './validator';

require('./validator').ValidatorManager.loadCoreValidators();

require('./odata/server');


/**
 * Gets a ObjectSchemaManager which creates object schema.
 */
export function getObjectSchemaManager(): ObjectSchemaManager {
    return getFromContainer(ObjectSchemaManager);
}

/**
 * Gets a ObjectSchemaManager which creates object schema.
 */
export function getCreator(): CreatorManager{
    return getFromContainer(CreatorManager);
}

export { Module } from "./module";