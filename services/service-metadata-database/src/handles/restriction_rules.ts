import { registerRestrictionRules, getObject } from "@steedos/objectql";
import { BaseHandle } from "./base";
import { DB_OBJECT_SERVICE_NAME, DB_SERVICE_PREFIX } from "../constants";

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
      data.package_name || `${DB_SERVICE_PREFIX}-restriction_rules`,
      data,
    );
  }

  async updated(data) {
    return registerRestrictionRules.register(
      broker,
      data.package_name || `${DB_SERVICE_PREFIX}-restriction_rules`,
      data,
    );
  }

  async deleted(data) {
    return registerRestrictionRules.remove(
      broker,
      data.package_name || DB_OBJECT_SERVICE_NAME,
      data,
    );
  }
}
