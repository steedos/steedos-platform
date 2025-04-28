import { getObject } from "@steedos/objectql";
import * as _ from "lodash";
import { MetadataRegister } from "@steedos/metadata-registrar";
import { DB_OBJECT_SERVICE_NAME } from "../constants";
import { BaseHandle } from "./base";

export class ObjectsHandle extends BaseHandle {
  constructor() {
    super("objects");
  }

  async init() {
    const dbObjects = await getObject("objects").directFind({
      fields: ["name"],
    });
    for (const dbObject of dbObjects) {
      await this.handle(dbObject.name);
    }
  }

  async inserted(data) {
    return this.handle(data.name);
  }

  async updated(data) {
    return this.handle(data.name);
  }

  async deleted(data) {
    broker.call("objects.removeConfig", {
      objectName: data.name,
    });
  }

  async handle(objectName) {
    try {
      const records = await getObject("objects").directFind({
        filters: ["name", "=", objectName],
      });
      if (!records || records.length === 0) {
        return null;
      }

      const record = records[0];

      // 查询字段
      const fieldRecords = await getObject("object_fields").directFind({
        filters: ["object", "=", objectName],
      });
      const fields = {};
      _.map(fieldRecords, (field) => {
        fields[field.name] = field;
      });

      // 查询按钮
      const btnRecords = await getObject("object_actions").directFind({
        filters: ["object", "=", objectName],
      });

      const actions = {};
      _.map(btnRecords, (action) => {
        actions[action.name] = action;
      });

      // 查询列表视图
      const lvRecords = await getObject("object_listviews").directFind({
        filters: ["object_name", "=", objectName],
      });

      const list_views = {};
      _.map(lvRecords, (listview) => {
        list_views[listview.name] = listview;
      });

      // console.log(
      //   `addObjectConfig record`,
      //   JSON.stringify(
      //     Object.assign({}, record, {
      //       isMain: true,
      //       fields,
      //       actions,
      //       list_views,
      //     }),
      //   ),
      // );
      await MetadataRegister.addObjectConfig(
        DB_OBJECT_SERVICE_NAME,
        Object.assign({}, record, {
          isMain: true,
          fields,
          actions,
          list_views,
        }),
      );
      broker.broadcast("$packages.statisticsActivatedPackages", {});
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
