import { getCreator } from "../index";
import _ = require('underscore');
import { Request, Response } from "express";
import { JsonMap } from '@salesforce/ts-types';
import { getSession } from '@steedos/auth';

var Cookies = require("cookies");

export class ODataManager {
  setErrorMessage(statusCode: number, collection: string = '', key: string = '', action: string = '') {
    let body = {};

    let error = {};

    let innererror = {};

    let t = getCreator().t();

    if (statusCode === 404) {
      if (collection) {
        if (action === 'post') {
          innererror['message'] = t("creator_odata_post_fail");
          innererror['type'] = 'Microsoft.OData.Core.UriParser.ODataUnrecognizedPathException';
          error['code'] = 404;
          error['message'] = "creator_odata_post_fail";
        } else {
          innererror['message'] = t("creator_odata_record_query_fail");
          innererror['type'] = 'Microsoft.OData.Core.UriParser.ODataUnrecognizedPathException';
          error['code'] = 404;
          error['message'] = "creator_odata_record_query_fail";
        }
      } else {
        innererror['message'] = t("creator_odata_collection_query_fail") + key;
        innererror['type'] = 'Microsoft.OData.Core.UriParser.ODataUnrecognizedPathException';
        error['code'] = 404;
        error['message'] = "creator_odata_collection_query_fail";
      }
    }

    if (statusCode === 401) {
      innererror['message'] = t("creator_odata_authentication_required");
      innererror['type'] = 'Microsoft.OData.Core.UriParser.ODataUnrecognizedPathException';
      error['code'] = 401;
      error['message'] = "creator_odata_authentication_required";
    }

    if (statusCode === 403) {
      switch (action) {
        case 'get':
          innererror['message'] = t("creator_odata_user_access_fail");
          break;
        case 'post':
          innererror['message'] = t("creator_odata_user_create_fail");
          break;
        case 'put':
          innererror['message'] = t("creator_odata_user_update_fail");
          break;
        case 'delete':
          innererror['message'] = t("creator_odata_user_remove_fail");
      }
      innererror['message'] = t("creator_odata_user_access_fail");
      innererror['type'] = 'Microsoft.OData.Core.UriParser.ODataUnrecognizedPathException';
      error['code'] = 403;
      error['message'] = "creator_odata_user_access_fail";
    }

    error['innererror'] = innererror;

    body['error'] = error;

    return body;
  }

  removeInvalidMethod(queryParams: any) {
    if (queryParams.$filter && queryParams.$filter.indexOf('tolower(') > -1) {
      let removeMethod = function ($1: string) {
        return $1.replace('tolower(', '').replace(')', '')
      };
      queryParams.$filter = queryParams.$filter.replace(/tolower\(([^\)]+)\)/g, removeMethod);
    }
  }

  isSameCompany(spaceId: string, userId: string, companyId: string, query: any = null) {
    let su = getCreator().getCollection("space_users").findOne({ space: spaceId, user: userId }, { fields: { company_id: 1, company_ids: 1 } });
    if (!companyId && query) {
      companyId = su.company_id;
      query.company_id = { $in: su.company_ids };
    }
    return su.company_ids.includes(companyId);
  }

  excludeDeleted(filters: string) {
    filters = `(${filters}) and (is_deleted ne true)`;
  }

  visitorParser(visitor: any) {
    let parsedOpt: any = {};
    if (visitor.projection) {
      parsedOpt.fields = visitor.projection;
    }

    if (visitor.hasOwnProperty('limit')) {
      parsedOpt.limit = visitor.limit;
    }

    if (visitor.hasOwnProperty('skip')) {
      parsedOpt.skip = visitor.skip;
    }

    if (visitor.sort) {
      parsedOpt.sort = visitor.sort;
    }
  }

  async dealWithExpand(createQuery: any, entities: Array<any>, key: string, spaceId: string, userSession: object) {
    if (_.isEmpty(createQuery.includes)) {
      return entities;
    }
    let obj = getCreator().getSteedosSchema().getObject(key);

    for (let i = 0; i < createQuery.includes.length; i++) {
      let navigationProperty = createQuery.includes[i].navigationProperty;
      navigationProperty = navigationProperty.replace('/', '.')
      let field = obj.fields[navigationProperty].toConfig();
      if (field && (field.type === 'lookup' || field.type === 'master_detail')) {
        if (_.isFunction(field.reference_to)) {
          field.reference_to = field.reference_to();
        }
        if (field.reference_to) {
          let queryOptions = { fields: [] };
          if (createQuery.includes[i].projection) {
            queryOptions.fields = _.keys(createQuery.includes[i].projection);
          }

          if (_.isString(field.reference_to)) {
            let ref: any;
            let referenceToCollection = getCreator().getSteedosSchema().getObject(field.reference_to);
            let _ro_NAME_FIELD_KEY = (ref = getCreator().getSteedosSchema().getObject(field.reference_to)) != null ? ref.NAME_FIELD_KEY : void 0;
            for (let idx = 0; idx < entities.length; idx++) {
              let entityValues = navigationProperty.split('.').reduce(function (o, x) {
                if (o) { return o[x] }
              }, entities[idx])
              if (entityValues) {
                if (field.multiple) {
                  let originalData = _.clone(entityValues);
                  let filters = [];
                  _.each(entityValues, function (f) {
                    filters.push(`(_id eq '${f}')`);
                  })
                  let multiQuery = { filters: filters.join(' or '), fields: queryOptions.fields };
                  let queryFields = _.clone(queryOptions.fields)
                  if (_.isEmpty(queryFields)) {
                    multiQuery.fields = [_ro_NAME_FIELD_KEY]
                  }
                  let entityValuesRecord = await referenceToCollection.find(multiQuery, userSession);
                  if (!entityValuesRecord.length) {
                    entities[idx][navigationProperty] = originalData;
                  } else {
                    entityValuesRecord = getCreator().getOrderlySetByIds(entityValuesRecord, originalData);
                    entityValuesRecord = _.map(entityValuesRecord, function (o) {
                      o['reference_to.o'] = referenceToCollection._name;
                      o['reference_to._o'] = field.reference_to;
                      o['_NAME_FIELD_VALUE'] = o[_ro_NAME_FIELD_KEY];
                      if (_.isEmpty(queryFields)) {

                        delete o[_ro_NAME_FIELD_KEY]
                      }
                      return o;
                    });
                    entityValues.splice(0, entityValues.length, ...entityValuesRecord)
                  }

                } else {
                  let queryFields = _.clone(queryOptions.fields)
                  if (_.isEmpty(queryFields)) {
                    queryOptions.fields = [_ro_NAME_FIELD_KEY]
                  }
                  let originalData = _.clone(entities[idx][navigationProperty]);
                  entities[idx][navigationProperty] = await referenceToCollection.findOne(entities[idx][navigationProperty], queryOptions, userSession);
                  if (!entities[idx][navigationProperty]) {
                    entities[idx][navigationProperty] = originalData;
                  } else {
                    entities[idx][navigationProperty]['reference_to.o'] = referenceToCollection._name;
                    entities[idx][navigationProperty]['reference_to._o'] = field.reference_to;
                    entities[idx][navigationProperty]['_NAME_FIELD_VALUE'] = entities[idx][navigationProperty][_ro_NAME_FIELD_KEY];
                    if (_.isEmpty(queryFields)) {
                      delete entities[idx][navigationProperty][_ro_NAME_FIELD_KEY]
                    }
                  }
                }
              }
            };
          }
          if (_.isArray(field.reference_to)) {
            for (let idx = 0; idx < entities.length; idx++) {
              let ref1: any;
              let ref2: any;
              if ((ref1 = entities[idx][navigationProperty]) != null ? ref1.ids : void 0) {
                let _o = entities[idx][navigationProperty].o;
                let _ro_NAME_FIELD_KEY = (ref2 = getCreator().getSteedosSchema().getObject(_o)) != null ? ref2.NAME_FIELD_KEY : void 0;
                // if ((queryOptions != null ? queryOptions.fields : void 0) && _ro_NAME_FIELD_KEY) {
                //   queryOptions.fields.push(_ro_NAME_FIELD_KEY);
                // }
                let referenceToCollection = getCreator().getSteedosSchema().getObject(entities[idx][navigationProperty].o);
                if (referenceToCollection) {
                  if (field.multiple) {
                    let _ids = _.clone(entities[idx][navigationProperty].ids);
                    let filters = [];
                    _.each(entities[idx][navigationProperty].ids, function (f) {
                      filters.push(`(_id eq '${f}')`);
                    })
                    let multiQuery = { filters: filters.join(' or '), fields: queryOptions.fields };
                    let queryFields = _.clone(queryOptions.fields)
                    if (_.isEmpty(queryFields)) {
                      multiQuery.fields = [_ro_NAME_FIELD_KEY]
                    }
                    entities[idx][navigationProperty] = _.map(await referenceToCollection.find(multiQuery, userSession), function (o) {
                      o['reference_to.o'] = referenceToCollection._name;
                      o['reference_to._o'] = _o;
                      o['_NAME_FIELD_VALUE'] = o[_ro_NAME_FIELD_KEY];
                      if (_.isEmpty(queryFields)) {
                        delete o[_ro_NAME_FIELD_KEY]
                      }
                      return o;
                    });
                    entities[idx][navigationProperty] = getCreator().getOrderlySetByIds(entities[idx][navigationProperty], _ids);
                  } else {
                    let queryFields = _.clone(queryOptions.fields)
                    let query: JsonMap = {}
                    if (_.isEmpty(queryFields)) {
                      query.fields = [_ro_NAME_FIELD_KEY]
                    } else {
                      query.fields = queryFields
                    }
                    entities[idx][navigationProperty] = await referenceToCollection.findOne(entities[idx][navigationProperty].ids[0], query, userSession);
                    if (entities[idx][navigationProperty]) {
                      entities[idx][navigationProperty]['reference_to.o'] = referenceToCollection._name;
                      entities[idx][navigationProperty]['reference_to._o'] = _o;
                      entities[idx][navigationProperty]['_NAME_FIELD_VALUE'] = entities[idx][navigationProperty][_ro_NAME_FIELD_KEY];
                      if (_.isEmpty(queryFields)) {
                        delete entities[idx][navigationProperty][_ro_NAME_FIELD_KEY]
                      }
                    }
                  }
                }
              }
            };
          }
        } else {
          // TODO
        }
      }
    };

    return entities;
  }

  setOdataProperty(entities: any[], space: string, key: string) {
    let entities_OdataProperties = [];

    _.each(entities, function (entity, idx) {
      let entity_OdataProperties = {};
      let id = entities[idx]["_id"];
      entity_OdataProperties['@odata.id'] = getCreator().getODataNextLinkPath(space, key) + '(\'' + ("" + id) + '\')';
      entity_OdataProperties['@odata.etag'] = "W/\"08D589720BBB3DB1\"";
      entity_OdataProperties['@odata.editLink'] = entity_OdataProperties['@odata.id'];
      _.extend(entity_OdataProperties, entity);
      return entities_OdataProperties.push(entity_OdataProperties);
    });

    return entities_OdataProperties;
  }

  handleError(e: any) {
    console.log(e)
    let body = {};
    let error = {};
    error['message'] = e.message;
    let statusCode = 500;
    if (e.error && _.isNumber(e.error)) {
      statusCode = e.error;
    }
    error['code'] = statusCode;
    error['error'] = statusCode;
    error['details'] = e.details;
    error['reason'] = e.reason;
    body['error'] = error;
    return {
      statusCode: statusCode,
      body: body
    };
  }

  async auth(request: Request, response: Response) {
    let cookies = new Cookies(request, response);
    let authToken: string = request.headers['x-auth-token'] || cookies.get("X-Auth-Token");
    if (!authToken && request.headers.authorization && request.headers.authorization.split(' ')[0] == 'Bearer') {
      authToken = request.headers.authorization.split(' ')[1]
    }
    let spaceId: string = String(request.headers['x-space-id']);
    let user = await getSession(authToken, spaceId);
    return user;
  }

  // 修改、删除时，如果 doc.space = "global"，报错
  checkGlobalRecord(collection: any, id: string, object: any) {
    if (object.enable_space_global && collection.find({ _id: id, space: 'global' }).count()) {
      throw new Error("不能修改或者删除标准对象");
    }
  }

  setHeaders(response: Response) {
    response.setHeader('Content-Type', 'application/json;odata.metadata=minimal;charset=utf-8');
    response.setHeader('OData-Version', getCreator().VERSION);
  }

}