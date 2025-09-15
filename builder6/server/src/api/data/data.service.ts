import { Injectable, OnModuleInit } from "@nestjs/common";

import { getObject } from "@steedos/objectql";
import { getUserSession } from "@steedos/auth";

@Injectable()
export class DataService {
  constructor() {}

  async find(objectName, query, userSession) {
    const obj = getObject(objectName);
    return await obj.find(query, userSession);
  }

  async count(objectName, query, userSession) {
    const obj = getObject(objectName);
    return await obj.count(query, userSession);
  }

  async insert(objectName, doc, userSession) {
    const obj = getObject(objectName);
    return await obj.insert(doc, userSession);
  }

  async findOne(objectName, id, userSession) {
    const obj = getObject(objectName);
    return await obj.findOne(id, userSession);
  }

  async update(objectName, id, data, userSession) {
    const obj = getObject(objectName);
    return await obj.update(id, data, userSession);
  }

  async delete(objectName, id, userSession) {
    const obj = getObject(objectName);
    return await obj.update(id, userSession);
  }
}
