import { Injectable, OnModuleInit } from "@nestjs/common";

import { getObject } from "@steedos/objectql";

@Injectable()
export class DataService {
  constructor() {}

  async find(objectName, query, userId) {
    const obj = getObject(objectName);
    const userSession = null;
    return await obj.find(query, userSession);
  }

  async count(objectName, query, userId) {
    const obj = getObject(objectName);
    const userSession = null;
    return await obj.count(query, userSession);
  }

  async insert(objectName, doc, userId) {
    const obj = getObject(objectName);
    const userSession = null;
    return await obj.insert(doc, userSession);
  }

  async findOne(objectName, id, userId) {
    const obj = getObject(objectName);
    const userSession = null;
    return await obj.findOne(id, userSession);
  }

  async update(objectName, id, data, userId) {
    const obj = getObject(objectName);
    const userSession = null;
    return await obj.update(id, data, userSession);
  }

  async delete(objectName, id, userId) {
    const obj = getObject(objectName);
    const userSession = null;
    return await obj.update(id, userSession);
  }
}
