/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2021-06-05 22:05:29
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-08 18:26:51
 * @Description: 
 */
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
   const isMeteorDriver = await _isMeteorDriver(req);
   if (isMeteorDriver) {
      return await meteorODataExpressMiddleware.getObjectList(req, res);
   }
   else {
      return await oDataExpressMiddleware.getObjectList(req, res);
   }
}
export async function getObjectRecent(req, res) {
   const isMeteorDriver = await _isMeteorDriver(req);
   if (isMeteorDriver) {
      return await meteorODataExpressMiddleware.getObjectRecent(req, res);
   }
   else {
      return await oDataExpressMiddleware.getObjectRecent(req, res);
   }
}
export async function createObjectData(req, res) {
   const isMeteorDriver = await _isMeteorDriver(req);
   if (isMeteorDriver) {
      return await meteorODataExpressMiddleware.createObjectData(req, res);
   }
   else {
      return await oDataExpressMiddleware.createObjectData(req, res);
   }
}
export async function getObjectData(req, res) {
   const isMeteorDriver = await _isMeteorDriver(req);
   if (isMeteorDriver) {
      return await meteorODataExpressMiddleware.getObjectData(req, res);
   }
   else {
      return await oDataExpressMiddleware.getObjectData(req, res);
   }
}
export async function updateObjectData(req, res) {
   const isMeteorDriver = await _isMeteorDriver(req);
   if (isMeteorDriver) {
      return await meteorODataExpressMiddleware.updateObjectData(req, res);
   }
   else {
      return await oDataExpressMiddleware.updateObjectData(req, res);
   }
}
export async function deleteObjectData(req, res) {
   const isMeteorDriver = await _isMeteorDriver(req);
   if (isMeteorDriver) {
      return await meteorODataExpressMiddleware.deleteObjectData(req, res);
   }
   else {
      return await oDataExpressMiddleware.deleteObjectData(req, res);
   }
}
export async function excuteObjectMethod(req, res, next) {
   return await meteorODataExpressMiddleware.excuteObjectMethod(req, res, next);
}

async function _isMeteorDriver(req) {
   let urlParams = req.params;
   let key = urlParams.objectName;
   let objectConfig = await getSteedosSchema().getObject(key).toConfig();
   return objectConfig.datasource === 'meteor';
   // return collection != null;
}