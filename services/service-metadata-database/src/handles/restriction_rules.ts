import { registerRestrictionRules, getObject } from "@steedos/objectql";
import { BaseHandle } from "./base";
import { DB_OBJECT_SERVICE_NAME } from "../constants";

export class RestrictionRulesHandle extends BaseHandle {
  constructor() {
    super("restriction_rules");
  }

  async init() {
    const dbRecords = await getObject("restriction_rules").directFind();
    for (const dbRecord of dbRecords) {
      await this.inserted(dbRecord);
    }
  }

  async inserted(data) {
    return registerRestrictionRules.register(
      broker,
      DB_OBJECT_SERVICE_NAME,
      data,
    );
  }

  async updated(data) {
    return registerRestrictionRules.register(
      broker,
      DB_OBJECT_SERVICE_NAME,
      data,
    );
  }

  async deleted(data) {
    return registerRestrictionRules.remove(
      broker,
      DB_OBJECT_SERVICE_NAME,
      data,
    );
  }
}
