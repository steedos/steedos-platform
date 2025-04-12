/* eslint-disable @typescript-eslint/no-explicit-any */
import { SteedosMongoDriver } from ".";
import { SteedosIDType, SteedosQueryOptions, getAllObject } from "../types";
import { SteedosDriverConfig } from "./driver";
import mingo = require("mingo");
import clone = require("clone");
import _ = require("underscore");
import { Dictionary } from "@salesforce/ts-types";

export class MetadataDriver extends SteedosMongoDriver {
  databaseVersion?: string;
  config?: SteedosDriverConfig;

  constructor(config?: SteedosDriverConfig) {
    super(config);
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
    const _collection = clone(collection, false);
    _.each(_collection, function (item) {
      try {
        if (!item.space && spaceId) {
          item.space = spaceId;
        }
      } catch (error) {
        console.error(
          `metadata driver queryMetadata: ${item} is not json data`,
        );
      }
    });
    let mongoOptions = this.getMongoOptions(queryOptions);
    let query = new mingo.Query(mongoFilters);
    let projection = queryOptions.projection
      ? Object.assign({}, queryOptions.projection, {
          record_permissions: 1,
          is_system: 1,
        })
      : null;
    let cursor = query.find(_collection, projection);
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

  async getCachedSources(tableName: string) {
    switch (tableName) {
      case "objects":
        const objects = await getAllObject();
        return _.map(objects, (metadataObject: any) => {
          return {
            _id: metadataObject.metadata.name,
            ...metadataObject.metadata,
          };
        });
      case "object_fields":
        const objects2 = await getAllObject();
        const fields = [];
        _.each(objects2, (metadataObject: any) => {
          _.each(metadataObject.metadata.fields, (field) => {
            fields.push({
              _id: `${metadataObject.metadata.name}.${field.name}`,
              object: metadataObject.metadata.name,
              ...field,
            });
          });
        });
        return fields;
      default:
        break;
    }
  }

  async mixinSources(dbSources = [], codeSources = []) {
    const dbMap = new Map(dbSources.map((item) => [item.name, item]));
    codeSources.forEach((item) => {
      if (!dbMap.has(item.name)) {
        dbMap.set(item.name, item);
      }
    });
    return Array.from(dbMap.values());
  }

  async find(tableName: string, query: SteedosQueryOptions) {
    // console.log(
    //   `MetadataDriver find tableName: ${tableName}, query: ${JSON.stringify(query)}`,
    // );
    const result = await super.find(tableName, query);
    const spaceId = result.length > 0 ? result[0].space || null : null;
    const cachedSources = await this.getCachedSources(tableName);
    // console.log(`cachedSources`, cachedSources.length);
    const sources = await this.mixinSources(result, cachedSources);
    return this.queryMetadata(sources, query, spaceId).all();
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
    const result = await super.insert(tableName, doc);
    broker.call(`$metadata.inserted`, { type: tableName, data: result });
    return result;
  }

  async update(
    tableName: string,
    id: SteedosIDType | SteedosQueryOptions,
    data: Dictionary<any>,
  ): Promise<any> {
    const result = await super.update(tableName, id, data);
    broker.call(`$metadata.updated`, { type: tableName, id, data: result });
    return result;
  }

  async delete(
    tableName: string,
    id: SteedosIDType | SteedosQueryOptions,
  ): Promise<any> {
    const result = await super.delete(tableName, id);
    broker.call(`$metadata.deleted`, { type: tableName, id, data: result });
    return result;
  }

  // find(collection: any, query: SteedosQueryOptions, spaceId?: SteedosIDType) {
  //     const result = this.queryMetadata(collection, query, spaceId).all();
  //     return result;
  // }

  // findOne(collection: any, id: SteedosIDType, query: SteedosQueryOptions, spaceId?: SteedosIDType) {
  //     throw new Error("Method not implemented.");
  // }
}
