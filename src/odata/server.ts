import { getFromContainer } from "../container";
import { ODataManager } from "./ODataManager";

/**
 * Gets a ODataManager.
 */
export function getODataManager(): ODataManager {
   return getFromContainer(ODataManager);
}
