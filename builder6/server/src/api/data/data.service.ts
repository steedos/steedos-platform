import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectBroker } from "@builder6/moleculer";

import { ServiceBroker } from "moleculer";

const objectql = require("@steedos/objectql");
const { getObject } = objectql;

const _ = require("lodash");

@Injectable()
export class DataService {
  constructor() {}

  async find(objectName, query, userId) {
    const obj = getObject(objectName);
    const userSession = null;
    return await obj.find(query, userSession);
  }
}
