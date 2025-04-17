import { addTabConfig, getObject, removeTab } from "@steedos/objectql";
import { BaseHandle } from "./base";
import { DB_OBJECT_SERVICE_NAME } from "../constants";

export class TabsHandle extends BaseHandle {
  constructor() {
    super("tabs");
  }

  async init() {
    const dbApps = await getObject("tabs").directFind();
    for (const dbApp of dbApps) {
      await this.inserted(dbApp);
    }
  }

  async inserted(data) {
    return addTabConfig(data, DB_OBJECT_SERVICE_NAME);
  }

  async updated(data) {
    return addTabConfig(data, DB_OBJECT_SERVICE_NAME);
  }

  async deleted(data) {
    return removeTab(data.name);
  }
}
