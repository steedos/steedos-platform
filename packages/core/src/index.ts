import "reflect-metadata";

import { getFromContainer } from "./container";
import { CreatorManager } from "./creator/CreatorManager";

export {default as Object, default as ObjectSchema} from './object/ObjectSchema';
export {default as ObjectSchemaManager, getObjectSchemaManager} from './object/ObjectSchemaManager';
export {default as ObjectSchemaOptions} from './object/ObjectSchemaOptions';

export { Apps, AppManager } from './app';
export { Reports, ReportManager } from './report';
export { Trigger } from './trigger/Trigger';
export { default as TriggerManager } from './trigger/TriggerManager'
export { Validators, ValidatorManager } from './validator';

export { default as Project } from './project/Project';

require('./validator').ValidatorManager.loadCoreValidators();

/**
 * Gets a ObjectSchemaManager which creates object schema.
 */
export function getCreator(): CreatorManager{
    return getFromContainer(CreatorManager);
}

export { Module } from "./module";
export { default as ODataRouter } from './odata/ODataRouter'