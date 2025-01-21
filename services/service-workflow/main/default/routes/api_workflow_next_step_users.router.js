/*
 * @Author: sunhaolin@hotoa.com 
 * @Date: 2022-03-26 09:40:49 
 * @Last Modified by: sunhaolin@hotoa.com
 * @Last Modified time: 2022-03-26 15:28:27
 */
'use strict';
// @ts-check
const express = require("express");
const router = express.Router();
const auth = require('@steedos/auth');
const _ = require('lodash');
const Fiber = require("fibers");
const { excuteTriggers } = require('../utils/trigger');
const objectql = require('@steedos/objectql');
/**
 * 计算下一步处理人
 * body {
 *   instanceId: 申请单ID
 *   nextStepId: 下一步步骤ID
 *   values: 最新的表单值
 * }
 */
router.post('/api/workflow/v2/nextStepUsers', auth.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const userId = userSession.userId;
        const spaceId = userSession.spaceId;
        Fiber(async function () {
            try {
                var error = "";

                if (!spaceId) {
                    throw new Error('缺少参数')
                }

                var nextStepUsers = [];
                const {
                    instanceId: insId,
                    nextStepId,
                    values
                } = req.body;

                let instance = uuflowManager.getInstance(insId);
                let flow = uuflowManager.getFlow(instance.flow);
                let nextStep = uuflowManager.getStep(instance, flow, nextStepId);
                console.log(`nextStep`, nextStep)
                switch (nextStep.step_type) {
                    case 'start':
                        var applicantId = instance.applicant;
                        nextStepUsers = WorkflowManager.getUsers(spaceId, applicantId);
                        break;
                    default:
                        switch (nextStep.deal_type) {
                            case 'specifyUser':
                                var specifyUserIds = nextStep.approver_users;
                                nextStepUsers = WorkflowManager.getUsers(spaceId, specifyUserIds);
                                break;
                            case 'applicantRole':
                                var
                                    applicantId = instance.applicant,
                                    approveRoleIds = nextStep.approver_roles;
                                var applicant = WorkflowManager.getUser(spaceId, applicantId);
        
                                if (applicant)
                                    nextStepUsers = WorkflowManager.getRoleUsersByOrgsAndRoles(spaceId, applicant.organizations, approveRoleIds);
                                break;
                            case 'hrRole':
                                var approveHrRoleIds = nextStep.approver_hr_roles;
                                if (approveHrRoleIds)
                                    nextStepUsers = WorkflowManager.getHrRolesUsers(spaceId, approveHrRoleIds);
                                break;
                            case 'applicantSuperior':
                                var applicantId = instance.applicant;
                                var applicant = WorkflowManager.getUser(spaceId, applicantId);
                                if (applicant.manager) {
                                    nextStepUsers = WorkflowManager.getUsers(spaceId, applicant.manager);
                                }
                                break;
                            case 'applicant':
                                var applicantId = instance.applicant;
                                nextStepUsers = WorkflowManager.getUsers(spaceId, applicantId);
                                break;
                            case 'userField':
                                var
                                    userField = nextStep.approver_user_field,
                                    userFieldValue = values[userField];
                                if (userField.is_multiselect) { //如果多选，以userFieldValue值为Array
                                    nextStepUsers = WorkflowManager.getUsers(spaceId, userFieldValue);
                                } else {
                                    nextStepUsers.push(WorkflowManager.getUser(spaceId, userFieldValue));
                                }
                                break;
                            case 'orgField':
                                var
                                    orgs,
                                    orgChildrens,
                                    orgField = nextStep.approver_org_field,
                                    orgFieldValue = values[orgField];
                                if (orgFieldValue) {
                                    if (orgField.is_multiselect) { //如果多选，以orgFieldValue值为Array
                                        orgs = WorkflowManager.getOrganizations(orgFieldValue);
                                        orgChildrens = WorkflowManager.getOrganizationsChildrens(spaceId, orgFieldValue);
                                    } else {
                                        orgs = [WorkflowManager.getOrganization(orgFieldValue)];
                                        orgChildrens = WorkflowManager.getOrganizationChildrens(spaceId, orgFieldValue);
                                    }
                                    nextStepUsers = WorkflowManager.getOrganizationsUsers(spaceId, orgChildrens);
        
                                    orgFieldUsers = WorkflowManager.getOrganizationsUsers(spaceId, orgs);
        
                                    nextStepUsers = nextStepUsers.concat(orgFieldUsers);
        
                                    if (!nextStepUsers || nextStepUsers.length < 1) {
                                        error = "ORG_NO_MEMBERS";
                                    }
                                } else {
                                    error = "FIELD_VALUE_EMPTY";
                                }
        
                                break;
                            case 'specifyOrg':
                                var specifyOrgIds = nextStep.approver_orgs;
                                var specifyOrgs = WorkflowManager.getOrganizations(specifyOrgIds);
                                var specifyOrgChildrens = WorkflowManager.getOrganizationsChildrens(spaceId, specifyOrgIds);
        
                                nextStepUsers = WorkflowManager.getOrganizationsUsers(spaceId, specifyOrgs);
                                nextStepUsers = nextStepUsers.concat(WorkflowManager.getOrganizationsUsers(spaceId, specifyOrgChildrens));
                                break;
                            case 'userFieldRole':
                                var
                                    userField = nextStep.approver_user_field,
                                    userFieldValue = values[userField],
                                    approverRoleIds = nextStep.approver_roles;
                                if (userFieldValue) {
                                    if (userField.is_multiselect) { //如果多选，以userFieldValue值为Array
                                        nextStepUsers = WorkflowManager.getRoleUsersByUsersAndRoles(spaceId, userFieldValue, approverRoleIds);
                                    } else {
                                        nextStepUsers = WorkflowManager.getRoleUsersByUsersAndRoles(spaceId, [userFieldValue], approverRoleIds);
                                    }
        
                                    if (!nextStepUsers || nextStepUsers.length < 1) {
                                        error = "ROLE_NO_MEMBERS";
                                    }
                                } else {
                                    error = "FIELD_VALUE_EMPTY";
                                }
        
        
                                break;
                            case 'orgFieldRole':
                                var
                                    orgField = nextStep.approver_org_field,
                                    orgFieldValue = values[orgField],
                                    approverRoleIds = nextStep.approver_roles;
        
                                if (orgFieldValue) {
                                    if (orgField.is_multiselect) { //如果多选，以orgFieldValue值为Array
                                        nextStepUsers = WorkflowManager.getRoleUsersByOrgsAndRoles(spaceId, orgFieldValue, approverRoleIds);
                                    } else {
                                        nextStepUsers = WorkflowManager.getRoleUsersByOrgsAndRoles(spaceId, [orgFieldValue], approverRoleIds);
                                    }
        
                                    if (!nextStepUsers || nextStepUsers.length < 1) {
                                        error = "ROLE_NO_MEMBERS";
                                    }
                                } else {
                                    error = "FIELD_VALUE_EMPTY";
                                }
                                break;
                            default:
                                break;
                        }
                        break;
                }


                var result = [];

                nextStepUsers.forEach(function (su) {
                    if (su.user_accepted) {
                        var o = {
                            id: su.id,
                            name: su.name
                        };
                        result.push(o);
                    }
                });
                let finalNextStepUsers = WorkflowManager.uniqUsers(result);
                // cacluateNextStepUsers
                
                let nextUserIds = _.map(finalNextStepUsers, 'id');
                await excuteTriggers({ when: 'cacluateNextStepUsers', userId: userId, flowId: instance.flow, insId: insId, nextStep: nextStep, nextUserIds });
                let nextUsersDocs = await objectql.getObject('space_users').find({ filters: [ ['user', 'in', nextUserIds] ], fields: ['name','user'] });
                let newNextUsers = [];
                for(const doc of nextUsersDocs) {
                    newNextUsers.push({
                        id: doc.user,
                        name: doc.name
                    });
                }
                res.status(200).send({
                    'nextStepUsers': newNextUsers,
                    'error': error
                });
            } catch (error) {
                console.error(error);
                res.status(200).send({
                    error: error.message
                });
            }

        }).run()
    
    } catch (error) {
        console.error(error);
        res.status(200).send({
            error: error.message
        });
    }
});
exports.default = router;