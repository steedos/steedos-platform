import { getCreator } from "../index";
import _ = require('underscore');
import { Response } from "express";
import { JsonMap } from '@salesforce/ts-types';

export class ODataManager {
  private METADATA_PATH = '$metadata';
  private VERSION = '4.0';

  setErrorMessage(statusCode: number, collection: any, key: string = '', action: string = '') {
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

  async isSameCompany(spaceId: string, userId: string, companyId: string, queryParams: any = null) {
    let sus = await this.getObject("space_users").find({ filters: `(space eq '${spaceId}') and (user eq '${userId}')`, fields: ['company_id', 'company_ids'] });
    let su = sus[0];
    if (!companyId && queryParams) {
      companyId = su.company_id;
      let companyFilters = _.map(su.company_ids, function (cid) {
        return `(company_id eq '${cid}')`
      }).join(' or ')
      queryParams.$filter = queryParams.$filter ? `(${queryParams.$filter} and (${companyFilters}))` : `(${companyFilters})`;
    }
    return su.company_ids.includes(companyId);
  }

  excludeDeleted(filters: string) {

    if (filters && filters.indexOf('(is_deleted eq true)') > -1) {
      return filters
    }

    return filters ? `(${filters}) and (is_deleted ne true)` : `(is_deleted ne true)`;
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
    let obj = this.getObject(key);

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

            for (let idx = 0; idx < entities.length; idx++) {
              let entityValues = navigationProperty.split('.').reduce(function (o, x) {
                if (o) { return o[x] }
              }, entities[idx])
              if (!_.isEmpty(entityValues) || _.isNumber(entityValues)) {
                if (field.multiple) {
                  let originalData = _.clone(entityValues);
                  let filters = [];
                  _.each(entityValues, function (f) {
                    filters.push(`(_id eq '${f}')`);
                  })
                  let multiQuery = { filters: filters.join(' or '), fields: queryOptions.fields };
                  try {
                    let ref: any;
                    let referenceToCollection = this.getObject(field.reference_to);
                    let _ro_NAME_FIELD_KEY = (ref = this.getObject(field.reference_to)) != null ? ref.NAME_FIELD_KEY : void 0;

                    let queryFields = _.clone(queryOptions.fields)
                    if (_.isEmpty(queryFields)) {
                      multiQuery.fields = [_ro_NAME_FIELD_KEY]
                    }
                    let entityValuesRecord = await referenceToCollection.find(multiQuery);
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
                  } catch (error) {
                    console.error(error)
                    entities[idx][navigationProperty] = originalData;
                  }

                } else {
                  let originalData = _.clone(entities[idx][navigationProperty]);
                  try {
                    let ref: any;
                    let referenceToCollection = this.getObject(field.reference_to);
                    let _ro_NAME_FIELD_KEY = (ref = this.getObject(field.reference_to)) != null ? ref.NAME_FIELD_KEY : void 0;

                    let queryFields = _.clone(queryOptions.fields)
                    if (_.isEmpty(queryFields)) {
                      queryOptions.fields = [_ro_NAME_FIELD_KEY]
                    }

                    entities[idx][navigationProperty] = await referenceToCollection.findOne(entities[idx][navigationProperty], queryOptions);
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
                  } catch (error) {
                    console.error(error)
                    entities[idx][navigationProperty] = originalData;
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
                let _ro_NAME_FIELD_KEY = (ref2 = this.getObject(_o)) != null ? ref2.NAME_FIELD_KEY : void 0;
                // if ((queryOptions != null ? queryOptions.fields : void 0) && _ro_NAME_FIELD_KEY) {
                //   queryOptions.fields.push(_ro_NAME_FIELD_KEY);
                // }
                let referenceToCollection = this.getObject(entities[idx][navigationProperty].o);
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
                    entities[idx][navigationProperty] = _.map(await referenceToCollection.find(multiQuery), function (o) {
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
                    entities[idx][navigationProperty] = await referenceToCollection.findOne(entities[idx][navigationProperty].ids[0], query);
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

  makeAggregateLookup(createQuery: any, key: string, spaceId: string, userSession: object) {
    if (_.isEmpty(createQuery.includes)) {
      return [];
    }
    let obj = this.getObject(key);
    let pipeline = [];

    for (let i = 0; i < createQuery.includes.length; i++) {
      let navigationProperty = createQuery.includes[i].navigationProperty;
      navigationProperty = navigationProperty.replace('/', '.')
      let field = obj.fields[navigationProperty].toConfig();
      if (field && (field.type === 'lookup' || field.type === 'master_detail')) {
        let foreignFieldName = field.reference_to_field || '_id';

        if (_.isFunction(field.reference_to)) {
          field.reference_to = field.reference_to();
        }
        if (_.isString(field.reference_to)) {
          let refFieldName = field.name;
          let lookup = {
            from: field.reference_to,
            localField: refFieldName,
            foreignField: foreignFieldName,
            as: `${refFieldName}_$lookup`
          };

          pipeline.push({ $lookup: lookup });

        } else if (_.isArray(field.reference_to)) {
          _.each(field.reference_to, function (relatedObjName) {
            let refFieldName = field.name;
            let lookup = {
              from: relatedObjName,
              localField: refFieldName + '.ids',
              foreignField: foreignFieldName,
              as: `${refFieldName}` + '_$lookup' + `_${relatedObjName}`
            };

            pipeline.push({ $lookup: lookup });
          })

        }
      }
    };

    return pipeline;
  }

  dealWithAggregateLookup(createQuery: any, entities: Array<any>, key: string, spaceId: string, userSession: object) {
    if (_.isEmpty(createQuery.includes)) {
      return entities;
    }
    let obj = this.getObject(key);

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

            for (let idx = 0; idx < entities.length; idx++) {
              let entityValues = navigationProperty.split('.').reduce(function (o, x) {
                if (o) { return o[x] }
              }, entities[idx])
              if (!_.isEmpty(entityValues) || _.isNumber(entityValues)) {
                let tempLookupKey = navigationProperty + '_$lookup';

                if (field.multiple) {
                  let originalData = _.clone(entityValues);

                  try {
                    let referenceToCollection = this.getObject(field.reference_to);
                    let _ro_NAME_FIELD_KEY = referenceToCollection.NAME_FIELD_KEY;

                    let queryFields = _.clone(queryOptions.fields);
                    if (_.isEmpty(queryFields)) {
                      queryOptions.fields = [_ro_NAME_FIELD_KEY]
                    }

                    if (_.isEmpty(entities[idx][tempLookupKey])) {
                      entities[idx][navigationProperty] = originalData;
                    } else {
                      entities[idx][navigationProperty] = _.map(entities[idx][tempLookupKey], function (o: any) {
                        let tempId = o._id;
                        o = _.pick(o, queryOptions.fields);
                        o['reference_to.o'] = referenceToCollection._name;
                        o['reference_to._o'] = field.reference_to;
                        o['_NAME_FIELD_VALUE'] = o[_ro_NAME_FIELD_KEY];
                        o['_id'] = tempId;
                        if (_.isEmpty(queryFields)) {
                          delete o[_ro_NAME_FIELD_KEY]
                        }
                        return o;
                      });
                    }
                  } catch (error) {
                    console.error(error)
                    entities[idx][navigationProperty] = originalData;
                  }

                } else {
                  let originalData = _.clone(entities[idx][navigationProperty]);
                  try {
                    let referenceToCollection = this.getObject(field.reference_to);
                    let _ro_NAME_FIELD_KEY = referenceToCollection.NAME_FIELD_KEY;

                    let queryFields = _.clone(queryOptions.fields);
                    if (_.isEmpty(queryFields)) {
                      queryOptions.fields = [_ro_NAME_FIELD_KEY];
                    }

                    if (_.isEmpty(entities[idx][tempLookupKey]) || !_.isArray(entities[idx][tempLookupKey])) {
                      entities[idx][navigationProperty] = originalData;
                    } else {
                      let refId = entities[idx][tempLookupKey][0]._id;
                      if (field.reference_to_field) {
                        refId = entities[idx][tempLookupKey][0][field.reference_to_field];
                      }
                      entities[idx][navigationProperty] = _.pick(entities[idx][tempLookupKey][0], queryOptions.fields);
                      entities[idx][navigationProperty]['reference_to.o'] = referenceToCollection._name;
                      entities[idx][navigationProperty]['reference_to._o'] = field.reference_to;
                      entities[idx][navigationProperty]['_NAME_FIELD_VALUE'] = entities[idx][navigationProperty][_ro_NAME_FIELD_KEY];
                      entities[idx][navigationProperty]['_id'] = refId;
                      if (_.isEmpty(queryFields)) {
                        delete entities[idx][navigationProperty][_ro_NAME_FIELD_KEY]
                      }
                    }
                  } catch (error) {
                    console.error(error)
                    entities[idx][navigationProperty] = originalData;
                  }

                }

                delete entities[idx][tempLookupKey];
              } else {
                delete entities[idx][navigationProperty];
              }
            };
          }
          if (_.isArray(field.reference_to)) {
            for (let idx = 0; idx < entities.length; idx++) {
              let ref1: any;
              if ((ref1 = entities[idx][navigationProperty]) != null ? ref1.ids : void 0) {
                let _o = entities[idx][navigationProperty].o;
                let referenceToCollection = this.getObject(_o);
                if (referenceToCollection) {
                  let _ro_NAME_FIELD_KEY = referenceToCollection.NAME_FIELD_KEY;
                  let tempLookupKey = navigationProperty + '_$lookup' + `_${_o}`;
                  if (field.multiple) {
                    let _ids = _.clone(entities[idx][navigationProperty].ids);

                    let queryFields = _.clone(queryOptions.fields);
                    let query = {}
                    if (_.isEmpty(queryFields)) {
                      query['fields'] = [_ro_NAME_FIELD_KEY]
                    } else {
                      query['fields'] = queryFields
                    }

                    entities[idx][navigationProperty] = _.map(entities[idx][tempLookupKey], function (o: any) {
                      let tempId = o._id;
                      o = _.pick(entities[idx][tempLookupKey][0], query['fields']);
                      o['reference_to.o'] = referenceToCollection._name;
                      o['reference_to._o'] = _o;
                      o['_NAME_FIELD_VALUE'] = o[_ro_NAME_FIELD_KEY];
                      o['_id'] = tempId;
                      if (_.isEmpty(queryFields)) {
                        delete o[_ro_NAME_FIELD_KEY]
                      }
                      return o;
                    });
                    entities[idx][navigationProperty] = getCreator().getOrderlySetByIds(entities[idx][navigationProperty], _ids);
                  } else {
                    let queryFields = _.clone(queryOptions.fields)
                    let query = {}
                    if (_.isEmpty(queryFields)) {
                      query['fields'] = [_ro_NAME_FIELD_KEY]
                    } else {
                      query['fields'] = queryFields
                    }
                    if (!_.isEmpty(entities[idx][tempLookupKey])) {
                      let tempId = entities[idx][tempLookupKey][0]._id;
                      entities[idx][navigationProperty] = _.pick(entities[idx][tempLookupKey][0], query['fields']);
                      entities[idx][navigationProperty]['reference_to.o'] = referenceToCollection._name;
                      entities[idx][navigationProperty]['reference_to._o'] = _o;
                      entities[idx][navigationProperty]['_NAME_FIELD_VALUE'] = entities[idx][navigationProperty][_ro_NAME_FIELD_KEY];
                      entities[idx][navigationProperty]['_id'] = tempId;
                      if (_.isEmpty(queryFields)) {
                        delete entities[idx][navigationProperty][_ro_NAME_FIELD_KEY]
                      }
                    }
                  }
                  _.each(field.reference_to, function (relatedObjName) {
                    delete entities[idx][navigationProperty + '_$lookup' + `_${relatedObjName}`];
                  })
                }
              }
            };
          }
        }
      }
    };

    return entities;
  }

  setOdataProperty(entities: any[], space: string, key: string) {
    let that = this;
    let entities_OdataProperties = [];

    _.each(entities, function (entity, idx) {
      let entity_OdataProperties = {};
      let id = entities[idx]["_id"];
      entity_OdataProperties['@odata.id'] = that.getODataNextLinkPath(space, key) + '(\'' + ("" + id) + '\')';
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

  // 修改、删除时，如果 doc.space = "global"，报错
  async checkGlobalRecord(collection: any, id: string, object: any) {
    if (object.enable_space_global && await collection.count({ filters: `(_id eq '${id}') and (space eq 'global')` })) {
      throw new Error("不能修改或者删除标准对象");
    }
  }

  setHeaders(response: Response) {
    response.setHeader('Content-Type', 'application/json;odata.metadata=minimal;charset=utf-8');
    response.setHeader('OData-Version', this.VERSION);
  }

  async getUserOrganizations(spaceId: string, userId: string, isIncludeParents: boolean) {
    let space_users = await this.getObject('space_users').find({ filters: `(user eq '${userId}') and (space eq '${spaceId}')`, fields: ['organizations'] });
    if (!space_users || !space_users) {
      return []
    }
    let organizations = space_users[0].organizations;
    if (!organizations) {
      return []
    }
    if (isIncludeParents) {
      let filters = _.map(organizations, function (org) {
        return `(_id eq '${org}')`
      }).join(' or ')

      console.log('getUserOrganizations, filters: ', filters)

      let parentsOrganizations = await this.getObject('organizations').find({ filters: filters, fields: ['parents'] })
      let parents = _.flatten(_.pluck(parentsOrganizations, "parents"))
      return _.union(organizations, parents)
    } else {
      return organizations
    }

  }

  getRootPath(spaceId: string) {
    return '/api/odata/v4/' + spaceId;
  }

  getMetaDataPath(spaceId: string) {
    return this.getRootPath(spaceId) + `/${this.METADATA_PATH}`;
  }

  getODataContextPath(spaceId: string, objectName: string) {
    return this.getMetaDataPath(spaceId) + `#${objectName}`;
  }

  getODataNextLinkPath(spaceId: string, objectName: string) {
    return this.getRootPath(spaceId) + `/${objectName}`;
  }

  getObject(name) {
    try {
      return getCreator().getSteedosSchema().getObject(name);
    } catch (error) {
      console.error(error)
      return undefined
    }

  }

  getReadableFields(allFieldsObj, unreadableFieldsArry) {
    let allFieldsName = _.pluck(allFieldsObj, 'name');
    return _.difference(allFieldsName, unreadableFieldsArry);
  }

}