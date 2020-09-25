import { getFromContainer } from "../container";
import { ODataManager } from "./ODataManager";
import { getSteedosSchema } from "@steedos/objectql";
import { oDataExpressMiddleware } from "./ODataExpressMiddleware";
import { meteorODataExpressMiddleware } from './MeteorODataExpressMiddleware';

/**
 * Gets a ODataManager.
 */
export function getODataManager(): ODataManager {
   return getFromContainer(ODataManager);
}

export async function getObjectList(req, res) {
   if (_isMeteorDriver(req)) {
      return await meteorODataExpressMiddleware.getObjectList(req, res);
   }
   else {
      return await oDataExpressMiddleware.getObjectList(req, res);
   }
}
export async function getObjectRecent(req, res) {
   if (_isMeteorDriver(req)) {
      return await meteorODataExpressMiddleware.getObjectRecent(req, res);
   }
   else {
      return await oDataExpressMiddleware.getObjectRecent(req, res);
   }
}
export async function createObjectData(req, res) {
   if (_isMeteorDriver(req)) {
      return await meteorODataExpressMiddleware.createObjectData(req, res);
   }
   else {
      return await oDataExpressMiddleware.createObjectData(req, res);
   }
}
export async function getObjectData(req, res) {
   if (_isMeteorDriver(req)) {
      return await meteorODataExpressMiddleware.getObjectData(req, res);
   }
   else {
      return await oDataExpressMiddleware.getObjectData(req, res);
   }
}
export async function updateObjectData(req, res) {
   if (_isMeteorDriver(req)) {
      return await meteorODataExpressMiddleware.updateObjectData(req, res);
   }
   else {
      return await oDataExpressMiddleware.updateObjectData(req, res);
   }
}
export async function deleteObjectData(req, res) {
   if (_isMeteorDriver(req)) {
      return await meteorODataExpressMiddleware.deleteObjectData(req, res);
   }
   else {
      return await oDataExpressMiddleware.deleteObjectData(req, res);
   }
}
export async function excuteObjectMethod(req, res) {
   return await meteorODataExpressMiddleware.excuteObjectMethod(req, res);
}

function _isMeteorDriver(req) {
   let urlParams = req.params;
   let key = urlParams.objectName;
   let collection = getSteedosSchema().getObject(key);
   return collection.datasource.enable_space;
}