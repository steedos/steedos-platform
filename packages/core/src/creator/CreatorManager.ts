import { JsonMap } from '@salesforce/ts-types';
import _ = require('underscore');
// import Fiber = require('fibers');
declare var Fiber;
declare var Creator: any;
declare var t: any;
declare var Steedos: any;
declare var SteedosOData: any;
declare var Accounts: any;

/**
 * ConnectionManager is used to store and manage multiple orm connections.
 * It also provides useful factory methods to simplify connection creation.
 */
export class CreatorManager {

  Objects: JsonMap = {};

  constructor() {
    this.Objects = Creator.Objects
  }

  getCollection(objectName: string, spaceId: string = '') {
    return Creator.getCollection(objectName, spaceId);
  }

  getObject(objectName: string, spaceId: string = '') {
    return Creator.getObject(objectName, spaceId);
  }

  t() {
    return t;
  }

  getObjectPermissions(spaceId: string, userId: string, objectName: string) {
    return Creator.getObjectPermissions(spaceId, userId, objectName);
  }

  isCommonSpace(spaceId: string) {
    return Creator.isCommonSpace(spaceId);
  }

  isSpaceAdmin(spaceId: string, userId: string) {
    return Creator.isSpaceAdmin(spaceId, userId);
  }

  isLegalVersion(spaceId: string, appVersion: string) {
    return Steedos.isLegalVersion(spaceId, appVersion);
  }

  async getFields(objectName: string, spaceId: string, userId: string) {
    return await new Promise((resolve, reject) => {
      Fiber(function () {
          try {
              resolve(Creator.getFields(objectName, spaceId, userId));
          } catch (error) {
              reject(error)
          }
      }).run()
  });
  }

  getUserOrganizations(spaceId: string, userId: string, isIncludeParents: boolean) {
    return Steedos.getUserOrganizations(spaceId, userId, isIncludeParents);
  }

  getOrderlySetByIds(docs: any[], ids: string[], id_key: string = '', hit_first: boolean = false) {
    return Creator.getOrderlySetByIds(docs, ids, id_key, hit_first);
  }

  getODataContextPath(spaceId: string, objectName: string) {
    return SteedosOData.getODataContextPath(spaceId, objectName);
  }

  VERSION: string = '4.0';

  getODataNextLinkPath(spaceId: string, objectName: string) {
    return SteedosOData.getODataNextLinkPath(spaceId, objectName);
  }

  hashLoginToken(authToken: string | string[]) {
    return Accounts._hashLoginToken(authToken);
  }

  getMetaDataPath(spaceId: string) {
    return SteedosOData.getMetaDataPath(spaceId);
  }

  loadObjects(object) {
    if (typeof Creator.loadObjects == 'function') {
      return Creator.loadObjects(object);
    }
  }

  fiberLoadObjects(object) {
    if (typeof Creator.fiberLoadObjects == 'function') {
      return Creator.fiberLoadObjects(object);
    }
  }

  getSteedosSchema() {
    return Creator.steedosSchema
  }

  setOdataProperty(entities: any[], space: string, key: string) {
    let that = this;
    let entities_OdataProperties = [];

    _.each(entities, function (entity, idx) {
      let entity_OdataProperties = {};
      let id = entities[idx] ? entities[idx]["_id"] : null;
      entity_OdataProperties['@odata.id'] = that.getODataNextLinkPath(space, key) + '(\'' + ("" + id) + '\')';
      entity_OdataProperties['@odata.etag'] = "W/\"08D589720BBB3DB1\"";
      entity_OdataProperties['@odata.editLink'] = entity_OdataProperties['@odata.id'];
      _.extend(entity_OdataProperties, entity);
      return entities_OdataProperties.push(entity_OdataProperties);
    });

    return entities_OdataProperties;
  }
}