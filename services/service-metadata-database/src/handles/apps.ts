import { addAppConfig, getObject, removeApp } from "@steedos/objectql";
import { BaseHandle } from "./base";
import { DB_SERVICE_PREFIX } from "../constants";

export class AppsHandle extends BaseHandle {
  constructor() {
    super("apps");
  }

  async init() {
    const dbApps = await getObject("apps").directFind();
    for (const dbApp of dbApps) {
      await this.inserted(dbApp);
    }
  }

  async inserted(data) {
    return addAppConfig(data, data.package_name || `${DB_SERVICE_PREFIX}-apps`);
  }

  async updated(data) {
    return addAppConfig(data, data.package_name || `${DB_SERVICE_PREFIX}-apps`);
  }

  async deleted(data) {
    return removeApp(data._id);
  }
}
