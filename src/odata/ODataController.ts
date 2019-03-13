
import { Controller, Param, Body, Get, Post, Put, Delete, Params, QueryParams, CurrentUser } from "routing-controllers";
import { getCreator } from "../index";
import { getODataManager } from "./server";

import querystring = require('querystring');
import odataV4Mongodb = require('odata-v4-mongodb');
import _ = require('underscore');

/*
  https://github.com/typestack/routing-controllers
*/
@Controller()
export class ODataController {

  @Get("/api/odata/v4/:spaceId/:objectName")
  async getAll(@CurrentUser({ required: true }) user: { _id: string }, @Params() urlParams: any, @QueryParams() queryParams: any) {
    try {
      let userId = user._id;
      let key = urlParams.objectName;
      let spaceId = urlParams.spaceId;
      let object = getCreator().getObject(key, spaceId);
      let setErrorMessage = getODataManager().setErrorMessage;
      if (!object || !object.enable_api) {
        return {
          statusCode: 401,
          body: setErrorMessage(401)
        }
      }

      let collection = getCreator().getCollection(key, spaceId);
      if (!collection) {
        return {
          statusCode: 401,
          body: setErrorMessage(404, collection, key)
        }
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
          if (spaceId !== 'guest' && key !== "users" && createQuery.query.space !== 'global') {
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
            let user_spaces = getCreator().getCollection("space_users").find({
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

        let is_enterprise = getCreator().isLegalVersion(spaceId, "workflow.enterprise");

        let is_professional = getCreator().isLegalVersion(spaceId, "workflow.professional");

        let is_standard = getCreator().isLegalVersion(spaceId, "workflow.standard");

        if (createQuery.limit) {
          let limit = createQuery.limit;
          if (is_enterprise && limit > 100000) {
            createQuery.limit = 100000;
          } else if (is_professional && limit > 10000 && !is_enterprise) {
            createQuery.limit = 10000;
          } else if (is_standard && limit > 1000 && !is_professional && !is_enterprise) {
            createQuery.limit = 1000;
          }
        } else {
          if (is_enterprise) {
            createQuery.limit = 100000;
          } else if (is_professional && !is_enterprise) {
            createQuery.limit = 10000;
          } else if (is_standard && !is_enterprise && !is_professional) {
            createQuery.limit = 1000;
          }
        }

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
              "owner": userId
            });
            shares.push({
              "sharing.u": userId
            });
            shares.push({
              "sharing.o": {
                $in: orgs
              }
            });
            createQuery.query["$or"] = shares;
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
          let headers = {};
          body['@odata.context'] = getCreator().getODataContextPath(spaceId, key);
          body['@odata.count'] = scannedCount;
          let entities_OdataProperties = getODataManager().setOdataProperty(entities, spaceId, key);
          body['value'] = entities_OdataProperties;
          headers['Content-type'] = 'application/json;odata.metadata=minimal;charset=utf-8';
          headers['OData-Version'] = getCreator().VERSION;
          return {
            body: body,
            headers: headers
          };
        } else {
          return {
            statusCode: 404,
            body: setErrorMessage(404, collection, key)
          };
        }
      } else {
        return {
          statusCode: 403,
          body: setErrorMessage(403, collection, key, "get")
        }
      }
    } catch (error) {
      return getODataManager().handleError(error);
    }

  }

  @Get("/api/odata/v4/:spaceId/:objectName/:id")
  getOne(@Param("id") id: number) {
    return "This action returns record #" + id;
  }

  @Post("/api/odata/v4/:spaceId/:objectName")
  post(@Body() user: any) {
    return "Saving record...";
  }

  @Put("/api/odata/v4/:spaceId/:objectName/:id")
  put(@Param("id") id: number, @Body() user: any) {
    return "Updating a record...";
  }

  @Delete("/api/odata/v4/:spaceId/:objectName/:id")
  remove(@Param("id") id: number) {
    return "Removing record...";
  }

}