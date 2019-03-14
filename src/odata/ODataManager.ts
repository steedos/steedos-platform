import { getCreator } from "../index";
import _ = require('underscore');
import { Request, Response } from "express";

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

  excludeDeleted(query: any) {
    query.is_deleted = { $ne: true };
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

  dealWithExpand(createQuery: any, entities: Array<any>, key: string, spaceId: string) {
    if (_.isEmpty(createQuery.includes)) {
      return;
    }

    let obj = getCreator().getObject(key, spaceId);

    _.each(createQuery.includes, function (include: any) {
      let navigationProperty = include.navigationProperty;
      let field = obj.fields[navigationProperty];
      if (field && (field.type === 'lookup' || field.type === 'master_detail')) {
        if (_.isFunction(field.reference_to)) {
          field.reference_to = field.reference_to();
        }
        if (field.reference_to) {
          let queryOptions = this.visitorParser(include);
          if (_.isString(field.reference_to)) {
            let ref: any;
            let referenceToCollection = getCreator().getCollection(field.reference_to, spaceId);
            let _ro_NAME_FIELD_KEY = (ref = getCreator().getObject(field.reference_to, spaceId)) != null ? ref.NAME_FIELD_KEY : void 0;
            _.each(entities, function (entity, idx) {
              if (entity[navigationProperty]) {
                if (field.multiple) {
                  let originalData = _.clone(entity[navigationProperty]);
                  let multiQuery = _.extend({
                    _id: {
                      $in: entity[navigationProperty]
                    }
                  }, include.query);
                  entities[idx][navigationProperty] = referenceToCollection.find(multiQuery, queryOptions).fetch();
                  if (!entities[idx][navigationProperty].length) {
                    entities[idx][navigationProperty] = originalData;
                  }
                  entities[idx][navigationProperty] = getCreator().getOrderlySetByIds(entities[idx][navigationProperty], originalData);
                  return entities[idx][navigationProperty] = _.map(entities[idx][navigationProperty], function (o) {
                    o['reference_to.o'] = referenceToCollection._name;
                    o['reference_to._o'] = field.reference_to;
                    o['_NAME_FIELD_VALUE'] = o[_ro_NAME_FIELD_KEY];
                    return o;
                  });
                } else {
                  let singleQuery = _.extend({
                    _id: entity[navigationProperty]
                  }, include.query);
                  entities[idx][navigationProperty] = referenceToCollection.findOne(singleQuery, queryOptions) || entities[idx][navigationProperty];
                  if (entities[idx][navigationProperty]) {
                    entities[idx][navigationProperty]['reference_to.o'] = referenceToCollection._name;
                    entities[idx][navigationProperty]['reference_to._o'] = field.reference_to;
                    return entities[idx][navigationProperty]['_NAME_FIELD_VALUE'] = entities[idx][navigationProperty][_ro_NAME_FIELD_KEY];
                  }
                }
              }
            });
          }
          if (_.isArray(field.reference_to)) {
            return _.each(entities, function (entity, idx) {
              let ref1: any;
              let ref2: any;
              if ((ref1 = entity[navigationProperty]) != null ? ref1.ids : void 0) {
                let _o = entity[navigationProperty].o;
                let _ro_NAME_FIELD_KEY = (ref2 = getCreator().getObject(_o, spaceId)) != null ? ref2.NAME_FIELD_KEY : void 0;
                if ((queryOptions != null ? queryOptions.fields : void 0) && _ro_NAME_FIELD_KEY) {
                  queryOptions.fields[_ro_NAME_FIELD_KEY] = 1;
                }
                let referenceToCollection = getCreator().getCollection(entity[navigationProperty].o, spaceId);
                if (referenceToCollection) {
                  if (field.multiple) {
                    let _ids = _.clone(entity[navigationProperty].ids);
                    let multiQuery = _.extend({
                      _id: {
                        $in: entity[navigationProperty].ids
                      }
                    }, include.query);
                    entities[idx][navigationProperty] = _.map(referenceToCollection.find(multiQuery, queryOptions).fetch(), function (o) {
                      o['reference_to.o'] = referenceToCollection._name;
                      o['reference_to._o'] = _o;
                      o['_NAME_FIELD_VALUE'] = o[_ro_NAME_FIELD_KEY];
                      return o;
                    });
                    return entities[idx][navigationProperty] = getCreator().getOrderlySetByIds(entities[idx][navigationProperty], _ids);
                  } else {
                    let singleQuery = _.extend({
                      _id: entity[navigationProperty].ids[0]
                    }, include.query);
                    entities[idx][navigationProperty] = referenceToCollection.findOne(singleQuery, queryOptions);
                    if (entities[idx][navigationProperty]) {
                      entities[idx][navigationProperty]['reference_to.o'] = referenceToCollection._name;
                      entities[idx][navigationProperty]['reference_to._o'] = _o;
                      return entities[idx][navigationProperty]['_NAME_FIELD_VALUE'] = entities[idx][navigationProperty][_ro_NAME_FIELD_KEY];
                    }
                  }
                }
              }
            });
          }
        } else {
          // TODO
        }
      }
    });

    return;
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
    console.error(e.stack);
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
    let userId: string | string[] = request.headers['x-user-id'] || cookies.get("X-User-Id");
    let authToken: string | string[] = request.headers['x-auth-token'] || cookies.get("X-Auth-Token");
    let collection = getCreator().getCollection('users');
    let searchQuery = { _id: userId };
    searchQuery['services.resume.loginTokens.hashedToken'] = getCreator().hashLoginToken(authToken);
    let user = {};
    user = await collection.rawCollection().findOne(searchQuery, { projection: { services: 0 } });
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