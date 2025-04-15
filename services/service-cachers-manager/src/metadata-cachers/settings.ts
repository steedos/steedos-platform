/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-04-16 09:12:58
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-04-23 11:34:54
 * @Description:
 */
import { MetadataCacherBase } from "./base";

const _ = require("lodash");

declare var broker;

const formatValue = (doc) => {
  if (_.isString(doc.value)) {
    try {
      doc.value = JSON.parse(doc.value);
    } catch (error) {
      console.log(error);
    }
  }
  return doc;
};

export class SettingsCacher extends MetadataCacherBase {
  constructor() {
    super("settings", true, { type: "space", key: { $exists: true } });
  }

  onAdded(doc: any): void {
    super.onAdded(doc);
    broker.broadcast(`@settings.updated.${doc.key}`, formatValue(doc));
  }

  onChanged(newDoc: any): void {
    super.onChanged(newDoc);
    broker.broadcast(`@settings.updated.${newDoc.key}`, formatValue(newDoc));
  }

  onRemoved(doc: any): void {
    super.onRemoved(doc);
  }
}
