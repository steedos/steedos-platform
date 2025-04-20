import { registerShareRules, getObject } from "@steedos/objectql";
import { BaseHandle } from "./base";
import { DB_OBJECT_SERVICE_NAME } from "../constants";

export class ShareRulesHandle extends BaseHandle {
  constructor() {
    super("share_rules");
  }

  async init() {
    const dbRecords = await getObject("share_rules").directFind();
    for (const dbRecord of dbRecords) {
      await this.inserted(dbRecord);
    }
  }

  async inserted(data) {
    return registerShareRules.register(broker, DB_OBJECT_SERVICE_NAME, data);
  }

  async updated(data) {
    return registerShareRules.register(broker, DB_OBJECT_SERVICE_NAME, data);
  }

  async deleted(data) {
    return registerShareRules.remove(broker, DB_OBJECT_SERVICE_NAME, data);
  }
}
