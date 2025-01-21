/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-24 09:30:45
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-01-21 17:30:00
 * @Description: 
 */
'use strict';
// @ts-check
const express = require('express');
const router = express.Router();
const auth = require('@steedos/auth');
const _ = require('underscore');
const Fiber = require('fibers');
/**
@api {get} /api/designer/startup 流程设计器初始化接口
@apiVersion 0.0.0
@apiName /api/designer/startup
@apiGroup service-workflow
@apiQuery {String} companyId 组织ID
@apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        "SpaceUsers"": [],
        "Users"": [],
        "Forms"": [],
        "Flows"": [],
        "Organizations"": [],
        "Positions"": [],
        "Roles"": [],
        "Categories"": [],
        "Spaces"": [],
    }
@apiErrorExample {json} Error-Response:
    HTTP/1.1 200 OK
    {
      errors: [{ errorMessage: e.message }]
    }
 */
router.get('/api/designer/startup', auth.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const userId = userSession.userId;
        userSession._id = userId;
        Fiber(async function () {
            try {
                var categories, companyId, flows, forms, org, organizations, positions, query, ref, result, roles, spaceIds, spaceUsers, spaces, spacesQuery, userIds, users;
                companyId = ((ref = req.query) != null ? ref.companyId : void 0) || '';
                spacesQuery = {
                    admins: userId
                };
                if (companyId) {
                    org = db.organizations.findOne(companyId, {
                        fields: {
                            space: 1
                        }
                    });
                    if (!org) {
                        throw new Error('companyId is invalid');
                    }
                    spacesQuery = {
                        _id: org.space
                    };
                }
                spaces = db.spaces.find(spacesQuery).fetch();
                spaceIds = _.pluck(spaces, '_id');
                query = {
                    space: {
                        $in: spaceIds
                    }
                };
                if (companyId) {
                    query.company_id = companyId;
                }
                spaceUsers = db.space_users.find(query).fetch();
                forms = db.forms.find(query, {
                    fields: {
                        name: 1,
                        state: 1,
                        is_deleted: 1,
                        is_valid: 1,
                        space: 1,
                        description: 1,
                        help_text: 1,
                        created: 1,
                        created_by: 1,
                        current: 1,
                        category: 1,
                        instance_style: 1,
                        company_id: 1
                    }
                }).fetch();
                flows = db.flows.find(query, {
                    fields: {
                        name: 1,
                        name_formula: 1,
                        code_formula: 1,
                        space: 1,
                        description: 1,
                        is_valid: 1,
                        form: 1,
                        flowtype: 1,
                        state: 1,
                        is_deleted: 1,
                        created: 1,
                        created_by: 1,
                        help_text: 1,
                        current_no: 1,
                        current: 1,
                        perms: 1,
                        error_message: 1,
                        distribute_optional_users: 1,
                        company_id: 1
                    }
                }).fetch();
                roles = db.flow_roles.find(query).fetch();
                organizations = db.organizations.find(query).fetch();
                positions = db.flow_positions.find(query).fetch();
                categories = db.categories.find({
                    space: {
                        $in: spaceIds
                    }
                }).fetch();
                userIds = _.pluck(spaceUsers, 'user');
                users = db.users.find({
                    _id: {
                        $in: userIds
                    }
                }, {
                    fields: {
                        name: 1
                    }
                }).fetch();
                result = {};
                result.SpaceUsers = spaceUsers;
                result.Users = users;
                result.Forms = forms;
                result.Flows = flows;
                result.Organizations = organizations;
                result.Positions = positions;
                result.Roles = roles;
                result.Categories = categories;
                result.Spaces = spaces;

                res.status(200).send(result);
            } catch (e) {
                console.error(e);
                res.status(200).send({
                    errors: [{ errorMessage: e.message }]
                });
            }
        }).run()
    } catch (e) {
        res.status(200).send({
            errors: [{ errorMessage: e.message }]
        });
    }
});
exports.default = router;
