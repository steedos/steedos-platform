import { JsonMap } from '@salesforce/ts-types';
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

  constructor(){
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

  getFields(objectName: string, spaceId: string, userId: string) {
    return Creator.getFields(objectName, spaceId, userId);
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

  VERSION: string = SteedosOData.VERSION;

  getODataNextLinkPath(spaceId: string, objectName: string) {
    return SteedosOData.getODataNextLinkPath(spaceId, objectName);
  }

  hashLoginToken(authToken: string | string[]) {
    return Accounts._hashLoginToken(authToken);
  }

  getMetaDataPath(spaceId: string) {
    return SteedosOData.getMetaDataPath(spaceId);
  }

  fiberLoadObjects(object){
    if (typeof Creator.fiberLoadObjects == 'function') {
      return Creator.fiberLoadObjects(object);
    }
  }

}