/* eslint-disable @typescript-eslint/no-explicit-any */
import { SteedosMongoDriver } from ".";
import {
  SteedosIDType,
  SteedosQueryOptions,
  getAllObject,
  getAppConfigs,
} from "../types";
import { SteedosDriverConfig } from "./driver";
import mingo = require("mingo");
import clone = require("clone");
import _ = require("underscore");
import { Dictionary } from "@salesforce/ts-types";
import { translationApps, translationObject } from "@steedos/i18n";
import { getMD5 } from "../util";
import {
  getAllActionFieldUpdates,
  getAllWorkflowNotifications,
  getAllWorkflowRules,
  getWorkflowOutboundMessages,
  registerImport,
} from "@steedos/metadata-registrar";

const PERMISSIONS = {
  allowEdit: false,
  allowDelete: false,
  allowRead: true,
};

const BASERECORD = {
  is_system: true,
  record_permissions: PERMISSIONS,
};

const isAPIName = function (apiName) {
  const reg = new RegExp("^[a-z]([a-z0-9]|_(?!_))*[a-z0-9]$");
  if (!reg.test(apiName.replace("__c", ""))) {
    throw new Error(
      "API 名称只能包含小写字母、数字，必须以字母开头，不能以下划线字符结尾或包含两个连续的下划线字符." +
        apiName,
    );
  }
  if (apiName.length > 50) {
    throw new Error("名称长度不能大于50个字符");
  }
  return true;
};

export class MetadataDriver extends SteedosMongoDriver {
  databaseVersion?: string;
  config?: SteedosDriverConfig;

  cacher: {
    objects: any;
  };

  constructor(config?: SteedosDriverConfig) {
    super(config);
    this.cacher = {
      objects: {},
    };
  }

  getAllObjects = async (skipDBObjects = false) => {
    // console.log('getAllObjects===>', this.cacher.objects?.time , new Date().getTime());
    if (
      this.cacher.objects &&
      this.cacher.objects.time > new Date().getTime()
    ) {
      // console.log('from cacher...');
      return skipDBObjects
        ? this.cacher.objects.noDBData
        : this.cacher.objects.data;
    }
    // console.log('from getAllObject...');
    const objects = await getAllObject();
    // const s = new Date().getTime();
    const md5 = getMD5(JSON.stringify(objects));
    // console.log(`getMD5:`, new Date().getTime() - s)
    if (this.cacher.objects.id === md5) {
      this.cacher.objects.time = new Date().getTime() + 1000;
      return skipDBObjects
        ? this.cacher.objects.noDBData
        : this.cacher.objects.data;
    }
    const result = _.compact(
      _.map(objects, (metadataObject: any) => {
        const metadata = this.translationObjectMetadata(
          metadataObject.metadata,
        );
        const obj = {
          __id: metadata._id,
          _id: metadata.name,
          ...metadata,
        };
        delete obj.__filename;
        delete obj.__timestamp;
        return obj;
      }),
    );
    this.cacher.objects = {
      id: md5,
      data: result,
      noDBData: _.filter(result, function (item) {
        return !item.__id;
      }),
      time: new Date().getTime() + 1000,
    };
    return result;
  };

  addDefaultProps(records) {
    if (!records) {
      return records;
    }
    const results = records.map((obj) => ({
      ...obj,
      ...BASERECORD,
    }));
    return results;
  }

  queryMetadata(collection, queryOptions, spaceId) {
    const mongoFilters = this.getMongoFilters(queryOptions.filters);
    if (!spaceId) {
      // 如果没有传spaceId，从filters中获取
      const str = JSON.stringify(mongoFilters);
      const regex = /"space":"([^"]+)"/;
      const match = regex.exec(str);
      const space = match ? match[1] : null;
      if (space) {
        spaceId = space;
      }
    }
    _.each(collection, function (item) {
      try {
        if (!item.space && spaceId) {
          item.space = spaceId;
        }
      } catch (error) {
        console.error(
          `metadata driver queryMetadata: ${item} is not json data`,
          error,
        );
      }
    });
    const mongoOptions = this.getMongoOptions(queryOptions);
    const query = new mingo.Query(mongoFilters);
    const projection = queryOptions.projection
      ? Object.assign({}, queryOptions.projection, {
          record_permissions: 1,
          is_system: 1,
        })
      : null;
    const cursor = query.find(collection, projection);
    if (mongoOptions.sort) {
      cursor.sort(mongoOptions.sort as any);
    }
    // if(mongoOptions.skip){
    //     cursor.skip(mongoOptions.skip)
    // }
    // if(mongoOptions.limit){
    //     cursor.limit(mongoOptions.limit)
    // }
    return cursor;
  }

  translationObjectMetadata(objectConfig, lng?) {
    if (!lng) {
      lng = process.env.STEEDOS_DEFAULT_LANGUAGE
        ? process.env.STEEDOS_DEFAULT_LANGUAGE
        : "zh-CN";
    }
    const metadata = clone(objectConfig, false);
    translationObject(lng, metadata.name, metadata, true);
    return metadata;
  }

  async getCachedSources(tableName: string) {
    // const s = new Date().getTime();
    switch (tableName) {
      case "objects": {
        return await this.getAllObjects(true);
      }
      case "object_fields": {
        const objects2 = await this.getAllObjects();
        // console.log('getCachedSources s1', new Date().getTime() - s);
        const fields = [];
        _.each(objects2, (metadata: any) => {
          _.each(metadata.fields, (field) => {
            if (field.hidden == true || field._id) {
              return;
            }
            fields.push({
              _id: `${metadata.name}.${field.name}`,
              object: metadata.name,
              ...field,
            });
          });
        });
        // console.log('getCachedSources s2', new Date().getTime() - s);
        return fields;
      }
      case "object_actions": {
        const objects3 = await this.getAllObjects();
        const actions = [];
        _.each(objects3, (metadata: any) => {
          _.each(metadata.actions, (field) => {
            if (field._id) {
              return;
            }
            actions.push({
              _id: `${metadata.name}.${field.name}`,
              object: metadata.name,
              ...field,
            });
          });
        });
        return actions;
      }
      case "object_listviews": {
        const objects3 = await this.getAllObjects();
        const list_views = [];
        _.each(objects3, (metadata: any) => {
          _.each(metadata.list_views, (list_view) => {
            if (list_view._id) {
              return;
            }
            list_views.push({
              _id: `${metadata.name}.${list_view.name}`,
              object_name: metadata.name,
              ...list_view,
            });
          });
        });
        return list_views;
      }
      case "apps": {
        const allApps = clone(await getAppConfigs());
        const apps = [];
        _.each(allApps, function (app) {
          if (app.is_creator || app.mobile) {
            apps.push(app);
          }
        });
        translationApps("zh-CN", apps);
        return apps;
      }
      case "action_field_updates": {
        return getAllActionFieldUpdates();
      }
      case "workflow_notifications": {
        return getAllWorkflowNotifications();
      }
      case "workflow_outbound_messages": {
        return getWorkflowOutboundMessages();
      }
      case "workflow_rule": {
        return getAllWorkflowRules();
      }
      case "queue_import": {
        const configs = await registerImport.getAll(broker);
        const dataList = _.pluck(configs, "metadata");

        _.each(dataList, function (item) {
          if (!item._id) {
            item._id = `${item.name}`;
          }
        });
        return dataList;
      }
      default:
        break;
    }
  }

  async mixinSources(metaName, dbSources = [], codeSources = []) {
    const key = metaName === "apps" ? "_id" : "name";
    const dbMap = new Map(dbSources.map((item) => [item[key], item]));
    codeSources.forEach((item) => {
      if (!item._id) {
        console.error("error: item._id is null");
      }
      if (!dbMap.has(item._id)) {
        dbMap.set(item._id, item);
      }
    });
    return Array.from(dbMap.values());
  }

  async find(tableName: string, query: SteedosQueryOptions) {
    // console.log(
    //   `MetadataDriver find tableName: ${tableName}, query: ${JSON.stringify(query)}`,
    // );
    // const s = new Date().getTime();
    delete query.fields;
    const result = await super.find(tableName, query);
    // console.log(`s1: `, new Date().getTime() - s);
    const spaceId = result.length > 0 ? result[0].space || null : null;
    const cachedSources = await this.getCachedSources(tableName);
    // console.log(`s2: `, new Date().getTime() - s);
    // console.log(`cachedSources`, cachedSources.length);
    const sources = await this.mixinSources(
      tableName,
      result,
      this.addDefaultProps(cachedSources),
    );
    // console.log(`s3: `, new Date().getTime() - s);
    const data = this.queryMetadata(sources, query, spaceId).all();
    // console.log(`s4: `, new Date().getTime() - s);
    // console.log('find', tableName, data.length)
    return data;
  }

  async directFind(tableName: string, query: SteedosQueryOptions) {
    // console.log(
    //   `MetadataDriver directFind tableName: ${tableName}, query: ${JSON.stringify(query)}`,
    // );
    const result = await super.find(tableName, query);
    // console.log(`directFind result: ${JSON.stringify(result)}`);
    return result;
  }

  async count(tableName: string, query: SteedosQueryOptions): Promise<any> {
    const result = await this.find(tableName, query);
    return result.length;
  }

  async insert(tableName: string, doc: any) {
    const nameValue = tableName === "apps" ? doc.code : doc.name;
    if (nameValue && tableName != "permission_objects") {
      isAPIName(nameValue);
    }

    const result = await super.insert(tableName, doc);
    await broker.call(`b6-metadata.inserted`, {
      type: tableName,
      data: result,
    });
    return result;
  }

  async update(
    tableName: string,
    id: SteedosIDType | SteedosQueryOptions,
    data: Dictionary<any>,
  ): Promise<any> {
    const nameValue = tableName === "apps" ? data.code : data.name;
    if (nameValue && tableName != "permission_objects") {
      isAPIName(nameValue);
    }

    const result = await super.update(tableName, id, data);
    // console.log(`broker.call b6-metadata.updated`, tableName, result);
    await broker.call(`b6-metadata.updated`, {
      type: tableName,
      id,
      data: result,
    });
    return result;
  }

  async delete(
    tableName: string,
    id: SteedosIDType | SteedosQueryOptions,
  ): Promise<any> {
    const record = await super.findOne(tableName, id, {});
    const result = await super.delete(tableName, id);
    if (record) {
      await broker.call(`b6-metadata.deleted`, {
        type: tableName,
        id,
        data: record,
      });
    }
    return result;
  }

  // find(collection: any, query: SteedosQueryOptions, spaceId?: SteedosIDType) {
  //     const result = this.queryMetadata(collection, query, spaceId).all();
  //     return result;
  // }

  async findOne(
    collection: any,
    id: SteedosIDType,
    query: SteedosQueryOptions,
    spaceId?: SteedosIDType,
  ) {
    // console.log(
    //   `MetadataDriver find tableName: ${collection}, id:${id},  query: ${JSON.stringify(query)}`,
    // );

    let filters = [];

    if (_.isString(id)) {
      filters = ["_id", "=", id];
    } else if (_.isArray(id)) {
      filters = id as any;
    } else if (_.has(id, "filters")) {
      filters = (id as any).filters;
    }

    const records = await this.find(collection, { filters: filters });
    return records.length > 0 ? records[0] : null;
  }
}
