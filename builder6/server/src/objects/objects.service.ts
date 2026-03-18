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

  async getObjectSimplified(objectApiName: string) {
    const obj = getObject(objectApiName);
    if (!obj) {
      throw new Error(`Object ${objectApiName} not found`);
    }
    const config = obj.getConfig();
    // 提取 `fields` 下的核心字段
    const simplifiedFields = {};
    for (const [key, value] of Object.entries(config.fields)) {
      const field = value as any;
      if (!field.hidden) {
        simplifiedFields[key] = {
          label: field.label,
          type: field.type,
          name: field.name,
        };
      }
    }

    return {
      name: config.name,
      label: config.label,
      fields: simplifiedFields,
    };
  }

  async runFunction(
    objectApiName: string,
    functionApiName: string,
    params: any,
    userSession?: any,
  ) {
    const obj = getObject(objectApiName);
    const _t0 = Date.now();
    console.log(`[PerfLog] [ObjectsService.runFunction] start | object=${objectApiName} | function=${functionApiName}`);
    const _result = await obj.runFunction(functionApiName, params, userSession);
    console.log(`[PerfLog] [ObjectsService.runFunction] done | object=${objectApiName} | function=${functionApiName} | cost=${Date.now() - _t0}ms`);
    return _result;
  }
}
