import { addAppConfig, getObject, removeApp } from "@steedos/objectql";
import { BaseHandle } from "./base";
import { DB_OBJECT_SERVICE_NAME } from "../constants";

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
    return addAppConfig(data, DB_OBJECT_SERVICE_NAME);
  }

  async updated(data) {
    return addAppConfig(data, DB_OBJECT_SERVICE_NAME);
  }

  async deleted(data) {
    return removeApp(data._id);
  }
}
