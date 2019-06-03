
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
router.use('/:spaceId', function auth(req: Request, res: Response, next: () => void) {
  getODataManager().auth(req, res).then(function (result) {
    if (result) {
      req.user = result;
      next();
    } else {
      res.status(401).send({ status: 'error', message: 'You must be logged in to do this.' });
    }
  })
})

/*
在odata接口中处理
  1. space级 下增，删，改，查权限
  2. company级 下增，删，改，查权限
  3. 记录级权限：
    owner(记录所有者)处理
*/

router.get('/:spaceId/:objectName', async function (req: Request, res: Response) {
  try {
    let userSession = req.user;
    let userId = req.user.userId;
    let urlParams = req.params;
    let queryParams = req.query;

    let key = urlParams.objectName;
    let spaceId = urlParams.spaceId;
    let collection = getCreator().getSteedosSchema().getObject(key);
    let setErrorMessage = getODataManager().setErrorMessage;

    if (!collection) {
      res.status(401).send(setErrorMessage(404, collection, key))
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
    let permissions = await collection.getUserObjectPermission(userSession);
    if (permissions.viewAllRecords || (permissions.viewCompanyRecords && await getODataManager().isSameCompany(spaceId, userId, createQuery.query.company_id, queryParams)) || (permissions.allowRead && userId)) {
      let entities = [];
      let filters = queryParams.$filter;
      let fields = [];
      if (collection.tableName === 'cfs.files.filerecord') {
        filters = filters ? `(${filters}) and (metadata/space eq \'${spaceId}\')` : `(metadata/space eq \'${spaceId}\')`;
      } else {
        filters = filters ? `(${filters}) and (space eq \'${spaceId}\')` : `(space eq \'${spaceId}\')`;
      }

      if (queryParams.$select) {
        fields = _.keys(createQuery.projection)
      }
      if (!permissions.viewAllRecords && !permissions.viewCompanyRecords) {
        if (collection.enable_share) {
          // 满足共享规则中的记录也要搜索出来
          // delete createQuery.query.owner
          // shares = []
          // orgs = Steedos.getUserOrganizations(spaceId, @userId, true)
          // shares.push {"owner": @userId}
          // shares.push { "sharing.u": @userId }
          // shares.push { "sharing.o": { $in: orgs } }
          // createQuery.query["$or"] = shares
          filters = filters.replace(`(owner eq '${userId}')`, '').replace(` and (owner eq '${userId}')`, '').replace(`(owner eq '${userId}') and `, '').replace(`() and `, '')
          let orgs = await getODataManager().getUserOrganizations(spaceId, userId, true)
          let orgsFilters = _.map(orgs, function (orgId) {
            return `(sharing/o eq '${orgId}')`
          }).join(' or ')
          let or = `(owner eq '${userId}') or (sharing/u eq '${userId}') or ${orgsFilters}`
          filters = filters ? `(${filters}) and (${or})` : `(${or})`;
          console.log('enable_share filters: ', filters)
        } else {
          filters = `(${filters}) and (owner eq \'${userId}\')`;
        }
      }
      getODataManager().excludeDeleted(filters)

      if (queryParams.$top !== '0') {
        let query = { filters: filters, fields: fields, top: Number(queryParams.$top) };
        if (queryParams.hasOwnProperty('$skip')) {
          query['skip'] = Number(queryParams.$skip);
        }
        if (queryParams.$orderby) {
          query['sort'] = queryParams.$orderby;
        }
        entities = await collection.find(query, userSession);
      }
      let scannedCount = await collection.count({ filters: filters, fields: ['_id'] }, userSession);
      if (entities) {
        entities = await getODataManager().dealWithExpand(createQuery, entities, key, spaceId, userSession);
        let body = {};
        body['@odata.context'] = getCreator().getODataContextPath(spaceId, key);
        body['@odata.count'] = scannedCount;
        let entities_OdataProperties = getCreator().setOdataProperty(entities, spaceId, key);
        body['value'] = entities_OdataProperties;
        getODataManager().setHeaders(res);
        res.send(body);
      } else {
        res.status(404).send(setErrorMessage(404, collection, key))
      }
    } else {
      res.status(403).send(setErrorMessage(403, collection, key, 'get'))
    }
  } catch (error) {
    let handleError = getODataManager().handleError(error);
    res.status(handleError.statusCode).send(handleError.body)
  }
})

router.get('/:spaceId/:objectName/recent', async function (req: Request, res: Response) {
  try {
    let userSession = req.user;
    let userId = req.user.userId;
    let urlParams = req.params;
    let queryParams = req.query;
    let key = urlParams.objectName;
    let spaceId = urlParams.spaceId;
    let collection = getCreator().getSteedosSchema().getObject(key);
    let setErrorMessage = getODataManager().setErrorMessage;

    if (!collection) {
      res.status(401).send(setErrorMessage(404, collection, key));
    }
    let permissions = await collection.getUserObjectPermission(userSession);
    if (permissions.allowRead) {
      let recent_view_collection = getCreator().getSteedosSchema().getObject('object_recent_viewed');
      let filterstr = `(record/o eq '${key}') and (created_by eq '${userId}')`;
      let recent_view_options: any = { filters: filterstr, fields: ['record'], sort: 'created desc' };
      let recent_view_records = await recent_view_collection.find(recent_view_options, userSession);
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

      let entities = [];
      let filters = queryParams.$filter;
      let fields = [];
      filters = filters ? `(${filters}) and (space eq \'${spaceId}\')` : `(space eq \'${spaceId}\')`;
      if (queryParams.$select) {
        fields = _.keys(createQuery.projection)
      }
      getODataManager().excludeDeleted(filters)
      if (queryParams.$top !== '0') {
        let query = { filters: filters, fields: fields, top: Number(queryParams.$top) };
        if (queryParams.hasOwnProperty('$skip')) {
          query['skip'] = Number(queryParams.$skip);
        }
        if (queryParams.$orderby) {
          query['sort'] = queryParams.$orderby;
        }
        entities = await collection.find(query, userSession);
      }
      let entities_ids = _.pluck(entities, '_id');
      let sort_entities = [];
      if (!queryParams.$orderby) {
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
        await getODataManager().dealWithExpand(createQuery, sort_entities, key, urlParams.spaceId, userSession);
        let body = {};
        body['@odata.context'] = getCreator().getODataContextPath(spaceId, key);
        body['@odata.count'] = sort_entities.length;
        let entities_OdataProperties = getCreator().setOdataProperty(sort_entities, spaceId, key);
        body['value'] = entities_OdataProperties;
        getODataManager().setHeaders(res);
        res.send(body);
      } else {
        res.status(404).send(setErrorMessage(404, collection, key, 'get'));
      }
    } else {
      res.status(403).send(setErrorMessage(403, collection, key, 'get'));
    }
  } catch (error) {
    let handleError = getODataManager().handleError(error);
    res.status(handleError.statusCode).send(handleError.body);
  }
})

router.post('/:spaceId/:objectName', async function (req: Request, res: Response) {
  try {
    let userSession = req.user;
    // let userId = req.user.userId;
    let urlParams = req.params;
    let bodyParams = req.body;
    let key = urlParams.objectName;
    let spaceId = urlParams.spaceId;
    let collection = getCreator().getSteedosSchema().getObject(key);
    let setErrorMessage = getODataManager().setErrorMessage;

    if (!collection) {
      res.status(401).send(setErrorMessage(404, collection, key));
    }
    let permissions = await collection.getUserObjectPermission(userSession);
    if (permissions.allowCreate) {
      bodyParams.space = spaceId;
      if (spaceId == 'guest') {
        delete bodyParams.space;
      }
      let entity = await collection.insert(bodyParams, userSession);
      let entities = [];
      if (entity) {
        let body = {};
        entities.push(entity);
        body['@odata.context'] = getCreator().getODataContextPath(spaceId, key) + '/$entity';
        let entity_OdataProperties = getCreator().setOdataProperty(entities, spaceId, key);
        body['value'] = entity_OdataProperties;
        getODataManager().setHeaders(res);
        res.send(body);
      }
    } else {
      res.status(403).send(setErrorMessage(403, collection, key, 'post'));
    }
  } catch (error) {
    let handleError = getODataManager().handleError(error);
    res.status(handleError.statusCode).send(handleError.body);
  }
})

router.get('/:spaceId/:objectName/:_id', async function (req: Request, res: Response) {
  let userSession = req.user;
  let userId = req.user.userId;
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
    let collection = getCreator().getSteedosSchema().getObject(collectionName)
    let entity = await collection.findOne(id, {
      fields: [fieldName]
    });
    let fieldValue = null;
    if (entity) {
      fieldValue = entity[fieldName];
    }
    let field = collection.fields[fieldName];
    if (field && fieldValue && (field.type === 'lookup' || field.type === 'master_detail')) {
      let lookupCollection = getCreator().getSteedosSchema().getObject(field.reference_to);
      let fields = [];
      let readable_fields = getCreator().getFields(field.reference_to, spaceId, userId);
      _.each(readable_fields, function (f: string) {
        if (f.indexOf('$') < 0) {
          return fields.push(f)
        }
      });
      if (field.multiple) {
        let values = [];
        let filters = [];
        _.each(fieldValue, function (f) {
          filters.push(`(_id eq '${f}')`);
        });
        (await lookupCollection.find({
          filters: filters.join(' or '),
          fields: fields
        }, userSession)).forEach(function (obj) {
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
        body = (await lookupCollection.findOne(fieldValue, { fields: fields })) || {};
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
      let collection = getCreator().getSteedosSchema().getObject(key)
      if (!collection) {
        res.status(404).send(setErrorMessage(404, collection, key));
      }
      let permissions = await collection.getUserObjectPermission(userSession);
      if (permissions.allowRead) {
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

        let fields = [];
        if (queryParams.$select) {
          fields = _.keys(createQuery.projection)
        }

        let entity = await collection.findOne(recordId, { fields: fields }, userSession);
        let entities = [];
        if (entity) {
          let isAllowed = (entity.owner == userId) || permissions.viewAllRecords || (permissions.viewCompanyRecords && await getODataManager().isSameCompany(spaceId, userId, entity.company_id));
          // if object.enable_share and !isAllowed
          //   shares = []
          //   orgs = Steedos.getUserOrganizations(@urlParams.spaceId, @userId, true)
          //   shares.push { "sharing.u": @userId }
          //   shares.push { "sharing.o": { $in: orgs } }
          //   isAllowed = collection.findOne({ _id: @urlParams._id, "$or": shares }, { fields: { _id: 1 } })
          if (collection.enable_share && !isAllowed) {
            let orgs = await getODataManager().getUserOrganizations(spaceId, userId, true);
            let orgsFilters = _.map(orgs, function (orgId) {
              return `(sharing/o eq '${orgId}')`
            }).join(' or ')
            let or = `sharing/u eq '${userId}' or ${orgsFilters}`;
            let filters = `(_id eq '${recordId}')`;
            filters = `(${filters}) and (${or})`;
            console.log('enable_share filters: ', filters)
            isAllowed = await collection.count({ filters: filters, fields: ['_id'] }, userSession)
          }
          if (isAllowed) {
            let body = {};
            entities.push(entity);
            await getODataManager().dealWithExpand(createQuery, entities, key, spaceId, userSession);
            body['@odata.context'] = getCreator().getODataContextPath(spaceId, key) + '/$entity';
            let entity_OdataProperties = getCreator().setOdataProperty(entities, spaceId, key);
            _.extend(body, entity_OdataProperties[0]);
            getODataManager().setHeaders(res);
            res.send(body);
          } else {
            res.status(403).send(setErrorMessage(403, collection, key, 'get'));
          }
        } else {
          res.status(404).send(setErrorMessage(404, collection, key, 'get'));
        }
      } else {
        res.status(403).send(setErrorMessage(403, collection, key, 'get'));
      }
    } catch (error) {
      let handleError = getODataManager().handleError(error);
      res.status(handleError.statusCode).send(handleError.body);
    }
  }
})

router.put('/:spaceId/:objectName/:_id', async function (req: Request, res: Response) {
  try {
    let userSession = req.user;
    let userId = req.user.userId;
    let urlParams = req.params;
    let bodyParams = req.body;
    let key = urlParams.objectName;
    let spaceId = urlParams.spaceId;
    let recordId = urlParams._id;
    let setErrorMessage = getODataManager().setErrorMessage;

    let collection = getCreator().getSteedosSchema().getObject(key)
    if (!collection) {
      res.status(404).send(setErrorMessage(404, collection, key));
    }
    let permissions = await collection.getUserObjectPermission(userSession);
    if (key == "users") {
      var record_owner = recordId;
    } else {
      var record_owner = (await collection.findOne(recordId, { fields: ['owner'] })).owner
    }
    let companyId = (await collection.findOne(recordId, { fields: ['company_id'] })).company_id

    let isAllowed = permissions.modifyAllRecords || (permissions.allowEdit && record_owner == userId) || (permissions.modifyCompanyRecords && await getODataManager().isSameCompany(spaceId, userId, companyId));
    if (isAllowed) {
      await getODataManager().checkGlobalRecord(collection, recordId, collection);

      let fields_editable = true;

      if (fields_editable) {

        let entityIsUpdated = await collection.update(recordId, bodyParams, userSession);
        if (entityIsUpdated) {
          getODataManager().setHeaders(res);
          res.send({});
        } else {
          res.status(404).send(setErrorMessage(404, collection, key));
        }
      } else {
        res.status(403).send(setErrorMessage(403, collection, key, 'put'));
      }
    } else {
      res.status(403).send(setErrorMessage(403, collection, key, 'put'));
    }
  } catch (error) {
    let handleError = getODataManager().handleError(error);
    res.status(handleError.statusCode).send(handleError.body);
  }
})

router.delete('/:spaceId/:objectName/:_id', async function (req: Request, res: Response) {
  try {
    let userSession = req.user;
    let userId = req.user.userId;
    let urlParams = req.params;
    let key = urlParams.objectName;
    let spaceId = urlParams.spaceId;
    let recordId = urlParams._id;
    let setErrorMessage = getODataManager().setErrorMessage;

    let collection = getCreator().getSteedosSchema().getObject(key);
    if (!collection) {
      res.status(404).send(setErrorMessage(404, collection, key));
    }
    let permissions = await collection.getUserObjectPermission(userSession);
    let recordData = await collection.findOne(recordId, { fields: ['owner', 'company_id'] });
    let record_owner = recordData.owner;
    let companyId = recordData.company_id;
    let isAllowed = (permissions.modifyAllRecords && permissions.allowDelete) || (permissions.modifyCompanyRecords && permissions.allowDelete && await getODataManager().isSameCompany(spaceId, userId, companyId)) || (permissions.allowDelete && record_owner === userId);
    if (isAllowed) {
      await getODataManager().checkGlobalRecord(collection, recordId, collection);

      if (collection != null ? collection.enable_trash : void 0) {
        let entityIsUpdated = await collection.update(recordId, {
          $set: {
            is_deleted: true,
            deleted: new Date(),
            deleted_by: userId
          }
        }, userSession);
        if (entityIsUpdated) {
          getODataManager().setHeaders(res);
          res.send({});
        } else {
          res.status(404).send(setErrorMessage(404, collection, key));
        }
      } else {
        await collection.delete(recordId, userSession)
        getODataManager().setHeaders(res);
        res.send({});
      }
    } else {
      res.status(403).send(setErrorMessage(403, collection, key));
    }
  } catch (error) {
    let handleError = getODataManager().handleError(error);
    res.status(handleError.statusCode).send(handleError.body);
  }
})

router.post('/:spaceId/:objectName/:_id/:methodName', async function (req: Request, res: Response) {
  try {
    let userSession = req.user;
    let userId = req.user.userId;
    let urlParams = req.params;
    let bodyParams = req.body;
    let key = urlParams.objectName;
    let spaceId = urlParams.spaceId;
    let collection = getCreator().getSteedosSchema().getObject(key);
    let setErrorMessage = getODataManager().setErrorMessage;

    if (!collection) {
      res.status(401).send(setErrorMessage(404, collection, key));
    }
    let permissions = await collection.getUserObjectPermission(userSession);
    if (permissions.allowRead) {
      let methodName = urlParams.methodName;
      let methods = collection.methods || {};
      if (methods.hasOwnProperty(methodName)) {
        let thisObj = {
          object_name: key,
          record_id: urlParams._id,
          space_id: spaceId,
          user_id: userId,
          permissions: permissions,
          userSeesion: userSession
        }
        res.send(methods[methodName].apply(thisObj, [bodyParams]) || {})
      } else {
        res.status(404).send(setErrorMessage(404, collection, key));
      }
    } else {
      res.status(403).send(setErrorMessage(403, collection, key, 'post'));
    }
  } catch (error) {
    let handleError = getODataManager().handleError(error);
    res.status(handleError.statusCode).send(handleError.body);
  }
})

export default router