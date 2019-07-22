import "reflect-metadata";

import { getFromContainer } from "./container";
import { CreatorManager } from "./creator/CreatorManager";


/**
 * Gets a ObjectSchemaManager which creates object schema.
 */
export function getCreator(): CreatorManager{
    return getFromContainer(CreatorManager);
}

export { default as ODataRouter } from './odata/ODataRouter'
export { default as MeteorODataRouter } from './odata/MeteorODataRouter'
import { loadJWTSSOAPI } from "./sso/jwt";
export {init} from './init'
loadJWTSSOAPI();