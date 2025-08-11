import { addTabConfig, getObject, removeTab } from "@steedos/objectql";
import { BaseHandle } from "./base";
import { DB_SERVICE_PREFIX } from "../constants";

export class TabsHandle extends BaseHandle {
  constructor() {
    super("tabs");
  }

  async init() {
    const dbTabs = await getObject("tabs").directFind();

    for (const dbTab of dbTabs) {
      await this.inserted(dbTab);
    }
  }

  async inserted(data) {
    return addTabConfig(data, data.package_name || `${DB_SERVICE_PREFIX}-tabs`);
  }

  async updated(data) {
    return addTabConfig(data, data.package_name || `${DB_SERVICE_PREFIX}-tabs`);
  }

  async deleted(data) {
    return removeTab(data.name);
  }
}
