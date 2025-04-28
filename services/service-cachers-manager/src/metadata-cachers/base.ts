/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-03-22 09:49:22
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-03-16 17:57:59
 * @Description:
 */
const cachers = require("@steedos/cachers");
const { metadataDriver } = require("@steedos/utils");
const { getDataSource } = require("@steedos/objectql");

export class MetadataCacherBase {
  supportSpace = true;
  cacher;
  metadataName;
  collectionName;
  observeHandle;
  cacherName;
  query;

  async getCollection(name) {
    const adapter = getDataSource("default").adapter;
    await adapter.connect();
    return adapter.collection(name);
  }

  async init() {
    const coll = await this.getCollection(this.collectionName);
    const records = await coll.find(this.query).toArray();
    for (const record of records) {
      await this.onAdded(record);
    }
  }

  async handleAction(
    action: "inserted" | "updated" | "deleted",
    data: unknown,
  ) {
    switch (action) {
      case "inserted":
        await this.onAdded(data);
        break;
      case "updated":
        await this.onChanged(data);
        break;
      case "deleted":
        await this.onRemoved(data);
        break;
      default:
        console.warn(`未知的操作类型: ${action}`);
    }
  }

  constructor(collectionName, supportSpace, query = null) {
    this.collectionName = collectionName;
    this.supportSpace = supportSpace;
    this.cacherName = `metadata.${collectionName}`;
    this.cacher = cachers.getCacher(this.cacherName);
    this.query = query;
  }
  onAdded(doc) {
    this.set(doc._id, doc);
  }

  onChanged(newDoc) {
    this.set(newDoc._id, newDoc);
  }

  onRemoved(doc) {
    this.delete(doc._id);
  }

  set(_id, value) {
    if (!_id) {
      throw new Error("key is null");
    }
    return this.cacher.set(_id, value);
  }

  delete(_id) {
    return this.cacher.delete(_id);
  }

  get(_id) {
    return this.cacher.get(_id);
  }

  find(filters, spaceId?) {
    const records = this.cacher.values();
    if (this.supportSpace) {
      filters = [filters, ["space", "=", spaceId]];
      return metadataDriver.find(records, { filters }, spaceId);
    }
    return metadataDriver.find(records, { filters });
  }

  // 销毁
  destroy() {
    if (this.observeHandle) {
      this.observeHandle.close();
      // this.observeHandle.stop();
      this.cacher.clearCacher(this.cacherName);
    }
  }
}
