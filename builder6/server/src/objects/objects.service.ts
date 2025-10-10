import { Injectable } from "@nestjs/common";
import { getObject } from "@steedos/objectql";

@Injectable()
export class ObjectsService {
  constructor() {}

  async getObjectConfig(objectApiName: string) {
    const obj = getObject(objectApiName);
    if (!obj) {
      throw new Error(`Object ${objectApiName} not found`);
    }
    return obj.getConfig();
  }

  async runFunction(
    objectApiName: string,
    functionApiName: string,
    params: any,
    userSession?: any,
  ) {
    const obj = getObject(objectApiName);
    return await obj.runFunction(functionApiName, params, userSession);
  }
}
