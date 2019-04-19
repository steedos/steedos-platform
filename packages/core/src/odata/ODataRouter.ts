
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
router.use(function auth(req: Request, res: Response, next: () => void) {
  getODataManager().auth(req, res).then(function (result) {
    if (result) {
      req.user = result;
      next();
    } else {
      res.status(401).send({ status: 'error', message: 'You must be logged in to do this.' });
    }
  })
})

router.get('/:spaceId/:objectName', async function (req: Request, res: Response) {
  try {
    let userId = req.user._id;
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

    if (userId) {
      let entities = [];
      let filters = queryParams.$filter;
      let fields = [];
      // filters = `(${filters}) and (space eq \'${spaceId}\')`;
      if (queryParams.$select) {
        fields = queryParams.$select.split(',');
      } else {
        fields = _.keys(collection.toConfig().fields);
      }
      if (queryParams.$top !== '0') {
        let query = { filters: filters, fields: fields, top: Number(queryParams.$top) };
        if (queryParams.hasOwnProperty('$skip')) {
          query['skip'] = Number(queryParams.$skip);
        }
        entities = await collection.find(query, userId);
      }
      let scannedCount = await collection.count({ filters: filters, fields: ['_id'] }, userId);
      if (entities) {
        entities = await getODataManager().dealWithExpand(createQuery, entities, key, spaceId, userId);
        let body = {};
        body['@odata.context'] = getCreator().getODataContextPath(spaceId, key);
        body['@odata.count'] = scannedCount;
        let entities_OdataProperties = getODataManager().setOdataProperty(entities, spaceId, key);
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
    let userId = req.user._id;
    let urlParams = req.params;
    let queryParams = req.query;
    let key = urlParams.objectName;
    let spaceId = urlParams.spaceId;
    let collection = getCreator().getSteedosSchema().getObject(key);
    let setErrorMessage = getODataManager().setErrorMessage;

    if (!collection) {
      res.status(401).send(setErrorMessage(404, collection, key));
    }

    if (userId) {
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

      // getODataManager().excludeDeleted(createQuery.query);
      let entities = [];
      let filters = queryParams.$filter;
      let fields = [];
      // filters = `(${filters}) and (space eq \'${spaceId}\')`;
      if (queryParams.$select) {
        fields = queryParams.$select.split(',');
      } else {
        fields = _.keys(collection.toConfig().fields);
      }
      if (queryParams.$top !== '0') {
        let query = { filters: filters, fields: fields, top: Number(queryParams.$top) };
        if (queryParams.hasOwnProperty('$skip')) {
          query['skip'] = Number(queryParams.$skip);
        }
        entities = await collection.find(query, userId, userId);
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
        getODataManager().dealWithExpand(createQuery, sort_entities, key, urlParams.spaceId, userId);
        let body = {};
        body['@odata.context'] = getCreator().getODataContextPath(spaceId, key);
        body['@odata.count'] = sort_entities.length;
        let entities_OdataProperties = getODataManager().setOdataProperty(sort_entities, spaceId, key);
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
    let userId = req.user._id;
    let urlParams = req.params;
    let bodyParams = req.body;
    let key = urlParams.objectName;
    let spaceId = urlParams.spaceId;
    let collection = getCreator().getSteedosSchema().getObject(key);
    let setErrorMessage = getODataManager().setErrorMessage;

    if (!collection) {
      res.status(401).send(setErrorMessage(404, collection, key));
    }
    if (userId) {
      // bodyParams.space = spaceId;
      if (spaceId == 'guest') {
        delete bodyParams.space;
      }
      let entity = await collection.insert(bodyParams, userId);
      console.log('entity: ', entity)
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
      res.status(403).send(setErrorMessage(403, collection, key, 'post'));
    }
  } catch (error) {
    let handleError = getODataManager().handleError(error);
    res.status(handleError.statusCode).send(handleError.body);
  }
})
router.get('/:spaceId/:objectName/:_id', async function (req: Request, res: Response) {
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
    let collection = getCreator().getSteedosSchema().getObject(collectionName)
    let entity = collection.findOne(id, {
      fields: [fieldName]
    });
    let fieldValue = null;
    if (entity) {
      fieldValue = entity[fieldName];
    }
    let field = collection.fields[fieldName];
    if (field && fieldValue && (field.type === 'lookup' || field.type === 'master_detail')) {
      let lookupCollection = getCreator().getSteedosSchema().getObject(field.reference_to);
      if (field.multiple) {
        let values = [];
        let filters = [];
        _.each(fieldValue, function (f) {
          filters.push(`(_id eq '${f}')`);
        })
        await lookupCollection.find({
          filters: filters.join(' or ')
        }, userId).forEach(function (obj) {
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
        body = await lookupCollection.findOne(fieldValue) || {};
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
      if (userId) {
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

        let entity = await collection.findOne(recordId, userId);
        let entities = [];
        if (entity) {
          let isAllowed = true;

          if (isAllowed) {
            let body = {};
            entities.push(entity);
            getODataManager().dealWithExpand(createQuery, entities, key, spaceId, userId);
            body['@odata.context'] = getCreator().getODataContextPath(spaceId, key) + '/$entity';
            let entity_OdataProperties = getODataManager().setOdataProperty(entities, spaceId, key);
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
    let userId = req.user._id;
    let urlParams = req.params;
    let bodyParams = req.body;
    let key = urlParams.objectName;
    // let spaceId = urlParams.spaceId;
    let recordId = urlParams._id;
    let setErrorMessage = getODataManager().setErrorMessage;

    let collection = getCreator().getSteedosSchema().getObject(key)
    if (!collection) {
      res.status(404).send(setErrorMessage(404, collection, key));
    }

    let isAllowed = true;
    if (isAllowed) {
      getODataManager().checkGlobalRecord(collection, recordId, collection);

      let fields_editable = true;

      if (fields_editable) {
        let data = bodyParams.$set ? bodyParams.$set : bodyParams
        let entityIsUpdated = await collection.update(recordId, data, userId);
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
    let userId = req.user._id;
    let urlParams = req.params;
    let key = urlParams.objectName;
    // let spaceId = urlParams.spaceId;
    let recordId = urlParams._id;
    let setErrorMessage = getODataManager().setErrorMessage;

    let collection = getCreator().getSteedosSchema().getObject(key);
    if (!collection) {
      res.status(404).send(setErrorMessage(404, collection, key));
    }
    let isAllowed = true
    if (isAllowed) {
      getODataManager().checkGlobalRecord(collection, recordId, collection);

      if (collection != null ? collection.enable_trash : void 0) {
        let entityIsUpdated = await collection.update(recordId, {
          is_deleted: true,
          deleted: new Date(),
          deleted_by: userId
        }, userId);
        if (entityIsUpdated) {
          getODataManager().setHeaders(res);
          res.send({});
        } else {
          res.status(404).send(setErrorMessage(404, collection, key));
        }
      } else {
        if (await collection.delete(recordId, userId)) {
          getODataManager().setHeaders(res);
          res.send({});
        } else {
          res.status(404).send(setErrorMessage(404, collection, key));
        }
      }
    } else {
      res.status(403).send(setErrorMessage(403, collection, key));
    }
  } catch (error) {
    let handleError = getODataManager().handleError(error);
    res.status(handleError.statusCode).send(handleError.body);
  }
})

export default router