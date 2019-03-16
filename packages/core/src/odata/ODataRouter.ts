
import { getCreator } from '../index';
import { getODataManager } from './server';

import querystring = require('querystring');
import odataV4Mongodb = require('odata-v4-mongodb');
import _ = require('underscore');
import { Response } from 'express';

var express = require('express');
var router = express.Router();

import * as core from "express-serve-static-core";
interface Request extends core.Request {
  user: any;
}

// middleware that is specific to this router
router.use(function timeLog(req: Request, res: Response, next: () => void) {
  getODataManager().auth(req, res).then(function (result) {
    if (result) {
      req.user = result;
      next();
    } else {
      let err = {
        statusCode: 401,
        body: { status: 'error', message: 'You must be logged in to do this.' }
      }
      res.send(err);
    }
  })
})

router.get('/:spaceId/:objectName', function (req: Request, res: Response) {
  try {
    let userId = req.user._id;
    let urlParams = req.params;
    let queryParams = req.query;

    let key = urlParams.objectName;
    let spaceId = urlParams.spaceId;
    let object = getCreator().getObject(key, spaceId);
    let setErrorMessage = getODataManager().setErrorMessage;
    if (!object || !object.enable_api) {
      res.send({
        statusCode: 401,
        body: setErrorMessage(401)
      })
    }

    let collection = getCreator().getCollection(key, spaceId);
    if (!collection) {
      res.send({
        statusCode: 401,
        body: setErrorMessage(404, collection, key)
      })
    }

    getODataManager().removeInvalidMethod(queryParams);
    let qs = decodeURIComponent(querystring.stringify(queryParams));
    if (qs) {
      var createQuery = odataV4Mongodb.createQuery(qs);
    } else {
      var createQuery: any = {
        query: {},
        sort: undefined,
        projection: {},
        includes: []
      };
    }
    let permissions = getCreator().getObjectPermissions(spaceId, userId, key);

    if (permissions.viewAllRecords || (permissions.viewCompanyRecords && getODataManager().isSameCompany(spaceId, userId, createQuery.query.company_id, createQuery.query)) || (permissions.allowRead && userId)) {

      if (key === 'cfs.files.filerecord') {
        createQuery.query['metadata.space'] = spaceId;
      } else if (key === 'spaces') {
        if (spaceId !== 'guest') {
          createQuery.query._id = spaceId;
        }
      } else {
        if (spaceId !== 'guest' && key !== 'users' && createQuery.query.space !== 'global') {
          createQuery.query.space = spaceId;
        }
      }

      if (getCreator().isCommonSpace(spaceId)) {
        if (getCreator().isSpaceAdmin(spaceId, userId)) {
          if (key === 'spaces') {
            delete createQuery.query._id;
          } else {
            delete createQuery.query.space;
          }
        } else {
          let user_spaces = getCreator().getCollection('space_users').find({
            user: userId
          }, {
              fields: {
                space: 1
              }
            }).fetch();
          if (key === 'spaces') {
            delete createQuery.query._id;
          } else {
            createQuery.query.space = {
              $in: _.pluck(user_spaces, 'space')
            };
          }
        }
      }

      if (!createQuery.sort || !_.size(createQuery.sort)) {
        createQuery.sort = {
          modified: -1
        };
      }

      // 暂时先注释
      // let is_enterprise = getCreator().isLegalVersion(spaceId, 'workflow.enterprise');

      // let is_professional = getCreator().isLegalVersion(spaceId, 'workflow.professional');

      // let is_standard = getCreator().isLegalVersion(spaceId, 'workflow.standard');

      // if (createQuery.limit) {
      //   let limit = createQuery.limit;
      //   if (is_enterprise && limit > 100000) {
      //     createQuery.limit = 100000;
      //   } else if (is_professional && limit > 10000 && !is_enterprise) {
      //     createQuery.limit = 10000;
      //   } else if (is_standard && limit > 1000 && !is_professional && !is_enterprise) {
      //     createQuery.limit = 1000;
      //   }
      // } else {
      //   if (is_enterprise) {
      //     createQuery.limit = 100000;
      //   } else if (is_professional && !is_enterprise) {
      //     createQuery.limit = 10000;
      //   } else if (is_standard && !is_enterprise && !is_professional) {
      //     createQuery.limit = 1000;
      //   }
      // }

      let unreadable_fields = permissions.unreadable_fields || [];

      if (createQuery.projection) {
        let projection = {};
        _.keys(createQuery.projection).forEach(function (key) {
          if (_.indexOf(unreadable_fields, key) < 0) {
            return projection[key] = 1;
          }
        });
        createQuery.projection = projection;
      }

      if (!createQuery.projection || !_.size(createQuery.projection)) {
        let readable_fields = getCreator().getFields(key, spaceId, userId);
        _.each(readable_fields, function (field: string) {
          if (field.indexOf('$') < 0) {
            return createQuery.projection[field] = 1;
          }
        });
      }

      if (!permissions.viewAllRecords && !permissions.viewCompanyRecords) {
        if (object.enable_share) {
          delete createQuery.query.owner;
          let shares = [];
          let orgs = getCreator().getUserOrganizations(spaceId, userId, true);
          shares.push({
            'owner': userId
          });
          shares.push({
            'sharing.u': userId
          });
          shares.push({
            'sharing.o': {
              $in: orgs
            }
          });
          createQuery.query['$or'] = shares;
        } else {
          createQuery.query.owner = userId;
        }
      }

      let entities = [];

      getODataManager().excludeDeleted(createQuery.query);

      if (queryParams.$top !== '0') {
        entities = collection.find(createQuery.query, getODataManager().visitorParser(createQuery)).fetch();
      }

      let scannedCount = collection.find(createQuery.query, {
        fields: {
          _id: 1
        }
      }).count();

      if (entities) {
        getODataManager().dealWithExpand(createQuery, entities, key, spaceId);
        let body = {};
        body['@odata.context'] = getCreator().getODataContextPath(spaceId, key);
        body['@odata.count'] = scannedCount;
        let entities_OdataProperties = getODataManager().setOdataProperty(entities, spaceId, key);
        body['value'] = entities_OdataProperties;
        getODataManager().setHeaders(res);
        res.send(body);
      } else {
        res.send({
          statusCode: 404,
          body: setErrorMessage(404, collection, key)
        });
      }
    } else {
      res.send({
        statusCode: 403,
        body: setErrorMessage(403, collection, key, 'get')
      })
    }
  } catch (error) {
    res.send(getODataManager().handleError(error));
  }
})

router.get('/:spaceId/:objectName/recent', function (req: Request, res: Response) {
  try {
    let userId = req.user._id;
    let urlParams = req.params;
    let queryParams = req.query;
    let key = urlParams.objectName;
    let spaceId = urlParams.spaceId;
    let object = getCreator().getObject(key, spaceId);
    let setErrorMessage = getODataManager().setErrorMessage;
    if (!object || !object.enable_api) {
      res.send({
        statusCode: 401,
        body: setErrorMessage(401)
      })
    }

    let collection = getCreator().getCollection(key, spaceId);
    if (!collection) {
      res.send({
        statusCode: 401,
        body: setErrorMessage(404, collection, key)
      })
    }

    let permissions = getCreator().getObjectPermissions(spaceId, userId, key);

    if (permissions.allowRead) {
      let recent_view_collection = getCreator().getCollection('object_recent_viewed', spaceId);
      let recent_view_selector = {
        'record.o': key,
        created_by: userId
      };
      let recent_view_options: any = {};
      recent_view_options.sort = {
        created: -1
      };
      recent_view_options.fields = {
        record: 1
      };
      let recent_view_records = recent_view_collection.find(recent_view_selector, recent_view_options).fetch();
      let recent_view_records_ids: any = _.pluck(recent_view_records, 'record');
      recent_view_records_ids = recent_view_records_ids.getProperty('ids');
      recent_view_records_ids = _.flatten(recent_view_records_ids);
      recent_view_records_ids = _.uniq(recent_view_records_ids);
      getODataManager().removeInvalidMethod(queryParams);
      let qs = decodeURIComponent(querystring.stringify(queryParams));
      if (qs) {
        var createQuery = odataV4Mongodb.createQuery(qs);
      } else {
        var createQuery: any = {
          query: {},
          sort: undefined,
          projection: {},
          includes: []
        };
      }
      if (key === 'cfs.files.filerecord') {
        createQuery.query['metadata.space'] = urlParams.spaceId;
      } else {
        createQuery.query.space = urlParams.spaceId;
      }
      if (!createQuery.limit) {
        createQuery.limit = 100;
      }
      if (createQuery.limit && recent_view_records_ids.length > createQuery.limit) {
        recent_view_records_ids = _.first(recent_view_records_ids, createQuery.limit);
      }
      createQuery.query._id = {
        $in: recent_view_records_ids
      };
      let unreadable_fields = permissions.unreadable_fields || [];
      if (createQuery.projection) {
        let projection = {};
        _.keys(createQuery.projection).forEach(function (key) {
          if (_.indexOf(unreadable_fields, key) < 0) {
            return projection[key] = 1;
          }
        });
        createQuery.projection = projection;
      }
      if (!createQuery.projection || !_.size(createQuery.projection)) {
        let readable_fields = getCreator().getFields(key, urlParams.spaceId, userId);
        _.each(readable_fields, function (field: string) {
          if (field.indexOf('$') < 0) {
            return createQuery.projection[field] = 1;
          }
        });
      }
      getODataManager().excludeDeleted(createQuery.query);
      if (queryParams.$top !== '0') {
        var entities = collection.find(createQuery.query, getODataManager().visitorParser(createQuery)).fetch();
      }
      let entities_ids = _.pluck(entities, '_id');
      let sort_entities = [];
      if (!createQuery.sort || !_.size(createQuery.sort)) {
        _.each(recent_view_records_ids, function (recent_view_records_id) {
          var index;
          index = _.indexOf(entities_ids, recent_view_records_id);
          if (index > -1) {
            return sort_entities.push(entities[index]);
          }
        });
      } else {
        sort_entities = entities;
      }
      if (sort_entities) {
        getODataManager().dealWithExpand(createQuery, sort_entities, key, urlParams.spaceId);
        let body = {};
        body['@odata.context'] = getCreator().getODataContextPath(urlParams.spaceId, key);
        body['@odata.count'] = sort_entities.length;
        let entities_OdataProperties = getODataManager().setOdataProperty(sort_entities, urlParams.spaceId, key);
        body['value'] = entities_OdataProperties;
        getODataManager().setHeaders(res);
        res.send(body);
      } else {
        res.send({
          statusCode: 404,
          body: setErrorMessage(404, collection, key, 'get')
        });
      }
    } else {
      res.send({
        statusCode: 403,
        body: setErrorMessage(403, collection, key, 'get')
      });
    }
  } catch (error) {
    res.send(getODataManager().handleError(error));
  }
})
router.post('/:spaceId/:objectName', function (req: Request, res: Response) {
  try {
    let userId = req.user._id;
    let urlParams = req.params;
    let bodyParams = req.body;
    let key = urlParams.objectName;
    let spaceId = urlParams.spaceId;
    let object = getCreator().getObject(key, spaceId);
    let setErrorMessage = getODataManager().setErrorMessage;
    if (!object || !object.enable_api) {
      res.send({
        statusCode: 401,
        body: setErrorMessage(401)
      })
    }
    let collection = getCreator().getCollection(key, spaceId);
    if (!collection) {
      res.send({
        statusCode: 401,
        body: setErrorMessage(404, collection, key)
      })
    }
    let permissions = getCreator().getObjectPermissions(spaceId, userId, key);
    if (permissions.allowCreate) {
      bodyParams.space = spaceId;
      if (spaceId == 'guest') {
        delete bodyParams.space;
      }
      let entityId = collection.insert(bodyParams);
      let entity = collection.findOne(entityId);
      let entities = [];
      if (entity) {
        let body = {};
        entities.push(entity);
        body['@odata.context'] = getCreator().getODataContextPath(spaceId, key) + '/$entity';
        let entity_OdataProperties = getODataManager().setOdataProperty(entities, spaceId, key);
        body['value'] = entity_OdataProperties;
        getODataManager().setHeaders(res);
        res.send(body);
      }
    } else {
      res.send({
        statusCode: 403,
        body: setErrorMessage(403, collection, key, 'post')
      })
    }
  } catch (error) {
    res.send(getODataManager().handleError(error));
  }
})
router.get('/:spaceId/:objectName/:_id', function (req: Request, res: Response) {
  let userId = req.user._id;
  let urlParams = req.params;
  let queryParams = req.query;
  let key = urlParams.objectName;
  let spaceId = urlParams.spaceId;
  let recordId = urlParams._id;
  let setErrorMessage = getODataManager().setErrorMessage;
  if (key.indexOf("(") > -1) {
    let body = {};
    let collectionInfo = key;
    let fieldName = recordId.split('_expand')[0];
    let collectionInfoSplit = collectionInfo.split('(');
    let collectionName = collectionInfoSplit[0];
    let id = collectionInfoSplit[1].split('\'')[1];
    let collection = getCreator().getCollection(collectionName, spaceId);
    let fieldsOptions = {};
    fieldsOptions[fieldName] = 1;
    let entity = collection.findOne({
      _id: id
    }, {
        fields: fieldsOptions
      });
    let fieldValue = null;
    if (entity) {
      fieldValue = entity[fieldName];
    }
    let obj = getCreator().getObject(collectionName, spaceId);
    let field = obj.fields[fieldName];
    if (field && fieldValue && (field.type === 'lookup' || field.type === 'master_detail')) {
      let lookupCollection = getCreator().getCollection(field.reference_to, spaceId);
      let queryOptions = {
        fields: {}
      };
      let readable_fields = getCreator().getFields(field.reference_to, spaceId, userId);
      _.each(readable_fields, function (f: string) {
        if (f.indexOf('$') < 0) {
          return queryOptions.fields[f] = 1;
        }
      });
      if (field.multiple) {
        let values = [];
        lookupCollection.find({
          _id: {
            $in: fieldValue
          }
        }, queryOptions).forEach(function (obj) {
          _.each(obj, function (v, k) {
            if (_.isArray(v) || (_.isObject(v) && !_.isDate(v))) {
              return obj[k] = JSON.stringify(v);
            }
          });
          return values.push(obj);
        });
        body['value'] = values;
        body['@odata.context'] = getCreator().getMetaDataPath(spaceId) + ("#" + collectionInfo + "/" + recordId);
      } else {
        body = lookupCollection.findOne({
          _id: fieldValue
        }, queryOptions) || {};
        _.each(body, function (v, k) {
          if (_.isArray(v) || (_.isObject(v) && !_.isDate(v))) {
            return body[k] = JSON.stringify(v);
          }
        });
        body['@odata.context'] = getCreator().getMetaDataPath(spaceId) + ("#" + field.reference_to + "/$entity");
      }
    } else {
      body['@odata.context'] = getCreator().getMetaDataPath(spaceId) + ("#" + collectionInfo + "/" + recordId);
      body['value'] = fieldValue;
    }
    getODataManager().setHeaders(res);
    res.send(body);
  } else {
    try {
      let object = getCreator().getObject(key, spaceId);
      if (!(object != null ? object.enable_api : void 0)) {
        res.send({
          statusCode: 401,
          body: setErrorMessage(401)
        });
      }
      let collection = getCreator().getCollection(key, spaceId);
      if (!collection) {
        res.send({
          statusCode: 404,
          body: setErrorMessage(404, collection, key)
        });
      }
      let permissions = getCreator().getObjectPermissions(spaceId, userId, key);
      if (permissions.allowRead) {
        let unreadable_fields = permissions.unreadable_fields || [];
        getODataManager().removeInvalidMethod(queryParams);
        let qs = decodeURIComponent(querystring.stringify(queryParams));
        if (qs) {
          var createQuery = odataV4Mongodb.createQuery(qs);
        } else {
          var createQuery: any = {
            query: {},
            sort: undefined,
            projection: {},
            includes: []
          };
        }
        createQuery.query._id = recordId;
        if (key === 'cfs.files.filerecord') {
          createQuery.query['metadata.space'] = spaceId;
        } else if (key !== 'spaces') {
          createQuery.query.space = spaceId;
        }
        unreadable_fields = permissions.unreadable_fields || [];
        if (createQuery.projection) {
          let projection = {};
          _.keys(createQuery.projection).forEach(function (key) {
            if (_.indexOf(unreadable_fields, key) < 0) {
              return projection[key] = 1;
            }
          });
          createQuery.projection = projection;
        }
        if (!createQuery.projection || !_.size(createQuery.projection)) {
          let readable_fields = getCreator().getFields(key, spaceId, userId);
          _.each(readable_fields, function (field: string) {
            if (field.indexOf('$') < 0) {
              return createQuery.projection[field] = 1;
            }
          });
        }
        let entity = collection.findOne(createQuery.query, getODataManager().visitorParser(createQuery));
        let entities = [];
        if (entity) {
          let isAllowed = entity.owner === userId || permissions.viewAllRecords || (permissions.viewCompanyRecords && getODataManager().isSameCompany(spaceId, userId, entity.company_id));
          if (object.enable_share && !isAllowed) {
            let shares = [];
            let orgs = getCreator().getUserOrganizations(spaceId, userId, true);
            shares.push({
              "sharing.u": userId
            });
            shares.push({
              "sharing.o": {
                $in: orgs
              }
            });
            isAllowed = collection.findOne({
              _id: recordId,
              "$or": shares
            }, {
                fields: {
                  _id: 1
                }
              });
          }
          if (isAllowed) {
            let body = {};
            entities.push(entity);
            getODataManager().dealWithExpand(createQuery, entities, key, spaceId);
            body['@odata.context'] = getCreator().getODataContextPath(spaceId, key) + '/$entity';
            let entity_OdataProperties = getODataManager().setOdataProperty(entities, spaceId, key);
            _.extend(body, entity_OdataProperties[0]);
            getODataManager().setHeaders(res);
            res.send(body);
          } else {
            res.send({
              statusCode: 403,
              body: setErrorMessage(403, collection, key, 'get')
            });
          }
        } else {
          res.send({
            statusCode: 404,
            body: setErrorMessage(404, collection, key, 'get')
          });
        }
      } else {
        res.send({
          statusCode: 403,
          body: setErrorMessage(403, collection, key, 'get')
        });
      }
    } catch (error) {
      res.send(getODataManager().handleError(error));
    }
  }
})
router.put('/:spaceId/:objectName/:_id', function (req: Request, res: Response) {
  try {
    let userId = req.user._id;
    let urlParams = req.params;
    let bodyParams = req.body;
    let key = urlParams.objectName;
    let spaceId = urlParams.spaceId;
    let recordId = urlParams._id;
    let object = getCreator().getObject(key, spaceId);
    let setErrorMessage = getODataManager().setErrorMessage;
    if (!(object != null ? object.enable_api : void 0)) {
      res.send({
        statusCode: 401,
        body: setErrorMessage(401)
      });
    }
    let collection = getCreator().getCollection(key, spaceId);
    if (!collection) {
      res.send({
        statusCode: 404,
        body: setErrorMessage(404, collection, key)
      });
    }
    let permissions = getCreator().getObjectPermissions(spaceId, userId, key);
    if (key === "users") {
      var record_owner = recordId;
    } else {
      let ref = null;
      var record_owner = (ref = collection.findOne({
        _id: recordId
      }, {
          fields: {
            owner: 1
          }
        })) != null ? ref.owner : void 0;
    }
    let ref1 = null;
    let companyId = (ref1 = collection.findOne({
      _id: recordId
    }, {
        fields: {
          company_id: 1
        }
      })) != null ? ref1.company_id : void 0;

    let isAllowed = permissions.modifyAllRecords || (permissions.allowEdit && record_owner === userId) || (permissions.modifyCompanyRecords && getODataManager().isSameCompany(spaceId, userId, companyId));

    if (isAllowed) {
      getODataManager().checkGlobalRecord(collection, recordId, object);
      let selector = {
        _id: recordId,
        space: spaceId
      };
      if (spaceId === 'guest' || spaceId === 'common' || key === "users") {
        delete selector.space;
      }
      let fields_editable = true;
      _.keys(bodyParams.$set).forEach(function (key) {
        if (_.indexOf(permissions.uneditable_fields, key) > -1) {
          return fields_editable = false;
        }
      });
      if (fields_editable) {
        if (key === 'spaces') {
          delete selector.space;
        }
        let entityIsUpdated = collection.update(selector, bodyParams);
        if (entityIsUpdated) {
          getODataManager().setHeaders(res);
          res.send({});
        } else {
          res.send({
            statusCode: 404,
            body: setErrorMessage(404, collection, key)
          });
        }
      } else {
        res.send({
          statusCode: 403,
          body: setErrorMessage(403, collection, key, 'put')
        });
      }
    } else {
      res.send({
        statusCode: 403,
        body: setErrorMessage(403, collection, key, 'put')
      });
    }
  } catch (error) {
    res.send(getODataManager().handleError(error));
  }
})
router.delete('/:spaceId/:objectName/:_id', function (req: Request, res: Response) {
  try {
    let userId = req.user._id;
    let urlParams = req.params;
    let key = urlParams.objectName;
    let spaceId = urlParams.spaceId;
    let recordId = urlParams._id;
    let object = getCreator().getObject(key, spaceId);
    let setErrorMessage = getODataManager().setErrorMessage;
    if (!(object != null ? object.enable_api : void 0)) {
      res.send({
        statusCode: 401,
        body: setErrorMessage(401)
      });
    }
    let collection = getCreator().getCollection(key, spaceId);
    if (!collection) {
      res.send({
        statusCode: 404,
        body: setErrorMessage(404, collection, key)
      });
    }
    let permissions = getCreator().getObjectPermissions(spaceId, userId, key);
    let recordData = collection.findOne({
      _id: recordId
    }, {
        fields: {
          owner: 1,
          company_id: 1
        }
      });
    let record_owner = recordData != null ? recordData.owner : void 0;
    let companyId = recordData != null ? recordData.company_id : void 0;
    let isAllowed = (permissions.modifyAllRecords && permissions.allowDelete) || (permissions.modifyCompanyRecords && permissions.allowDelete && getODataManager().isSameCompany(spaceId, userId, companyId)) || (permissions.allowDelete && record_owner === userId);
    if (isAllowed) {
      getODataManager().checkGlobalRecord(collection, recordId, object);
      let selector = {
        _id: recordId,
        space: spaceId
      };
      if (spaceId === 'guest') {
        delete selector.space;
      }
      if (object != null ? object.enable_trash : void 0) {
        let entityIsUpdated = collection.update(selector, {
          $set: {
            is_deleted: true,
            deleted: new Date(),
            deleted_by: userId
          }
        });
        if (entityIsUpdated) {
          getODataManager().setHeaders(res);
          res.send({});
        } else {
          res.send({
            statusCode: 404,
            body: setErrorMessage(404, collection, key)
          });
        }
      } else {
        if (collection.remove(selector)) {
          getODataManager().setHeaders(res);
          res.send({});
        } else {
          res.send({
            statusCode: 404,
            body: setErrorMessage(404, collection, key)
          });
        }
      }
    } else {
      res.send({
        statusCode: 403,
        body: setErrorMessage(403, collection, key)
      });
    }
  } catch (error) {
    res.send(getODataManager().handleError(error));
  }
})

export default router