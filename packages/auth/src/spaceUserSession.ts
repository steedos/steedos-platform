import { getSteedosSchema, addConfig, getConfig, removeConfig } from '@steedos/objectql';
import { isExpried } from './utils'
const _ = require('underscore');
const sessionCacheInMinutes = 10;
const SPACEUSERCACHENAME = 'space_users_cache';

const internalProfiles = ['admin', 'user', 'supplier', 'customer']

async function getSpaceUserProfile(userId: string, spaceId: string) {
    let filters = `(space eq '${spaceId}') and (user eq '${userId}')`;
    let spaceUser = await getSteedosSchema().getObject('space_users').find({ filters: filters, fields: ['profile'] });
    if (spaceUser && spaceUser.length > 0) {
        return spaceUser[0].profile
    }
}

async function getUserRoles(userId: string, spaceId: string) {
    let roles = ['user'];
    let space = await getSteedosSchema().getObject('spaces').findOne(spaceId, { fields: ['admins'] });
    if (space && space.admins.includes(userId)) {
        roles = ['admin'];
    }

    let profile = await getSpaceUserProfile(userId, spaceId);

    if (profile) {
        roles = [profile]
    }

    let filters = `(space eq '${spaceId}') and (users eq '${userId}')`;
    let permission_sets = await getSteedosSchema().getObject('permission_set').find({ filters: filters, fields: ['name'] });
    permission_sets.forEach(p => {
        if (!_.include(internalProfiles, p.name)) {
            roles.push(p.name);
        }
    });
    return roles;
}

async function getObjectDataByIds(objectName: string, ids: string[], fields?: string[]) {
    if (!ids || ids.length === 0) {
        return []
    }

    let filters = _.map(ids, function (id) {
        if (!id) {
            return ''
        }
        return `(_id eq '${id}')`
    }).join(' or ');

    if (!filters) {
        return []
    }

    let query = { filters: filters };
    if (fields && fields.length > 0) {
        query['fields'] = fields;
    }

    return await getSteedosSchema().getObject(objectName).find(query)
}

async function getUserPermissionShares(spaceUser) {
    let userFilters = [`(users eq '${spaceUser.user}')`];
    _.each(spaceUser.organizations_parents, (orgId) => {
        userFilters.push(`(organizations eq '${orgId}')`);
    })
    let filters = `((${userFilters.join(' or ')}) and space eq '${spaceUser.space}')`
    return await getSteedosSchema().getObject('permission_shares').find({ filters: filters, fields: ['_id', 'object_name'] });
}

export function getSpaceSessionFromCache(spaceId, userId) {
    let spaceUserSession = getConfig(SPACEUSERCACHENAME, `${spaceId}-${userId}`)
    if (!spaceUserSession) {
        return null;
    }
    if (isExpried(spaceUserSession.expiredAt)) {
        removeConfig(SPACEUSERCACHENAME, spaceUserSession);
        return null;
    }
    return spaceUserSession;
}

export function addSpaceSessionToCache(spaceId, userId, spaceUserSession) {
    spaceUserSession._id = `${spaceId}-${userId}`
    addConfig(SPACEUSERCACHENAME, spaceUserSession);
}


export async function getSpaceUserSession(spaceId, userId) {
    let spaceSession: any = getSpaceSessionFromCache(spaceId, userId);
    if (!spaceSession) {
        let expiredAt = new Date().getTime() + sessionCacheInMinutes * 60 * 1000;
        let su = null;
        let suFields = ['_id', 'space', 'company_id', 'company_ids', 'organization', 'organizations', 'organizations_parents', 'user'];
        let spaceUser = await getSteedosSchema().getObject('space_users').find({ filters: `(space eq '${spaceId}') and (user eq '${userId}') and (user_accepted eq true)`, fields: suFields });
        // 如果spaceid和user不匹配，则取用户的第一个工作区
        let spaceUsers = await getSteedosSchema().getObject('space_users').find({ filters: `(user eq '${userId}') and (user_accepted eq true)`, fields: suFields });
        if (spaceUser && spaceUser[0]) {
            su = spaceUser[0];
        } else {
            su = spaceUsers[0];
        }

        if (su) {
            let userSpaceId = su.space;
            let userSpaceIds = _.pluck(spaceUsers, 'space');
            let roles = await getUserRoles(userId, userSpaceId);
            spaceSession = { roles: roles, expiredAt: expiredAt };
            spaceSession.spaceId = userSpaceId;
            spaceSession.space = (await getObjectDataByIds('spaces', [userSpaceId], ['name', 'admins']))[0];
            spaceSession.spaces = await getObjectDataByIds('spaces', userSpaceIds, ['name']);
            spaceSession.company = (await getObjectDataByIds('company', [su.company_id], ['name', 'organization']))[0];
            spaceSession.companies = await getObjectDataByIds('company', su.company_ids, ['name', 'organization']);
            spaceSession.organization = (await getObjectDataByIds('organizations', [su.organization], ['name', 'fullname', 'company_id']))[0];
            spaceSession.organizations = await getObjectDataByIds('organizations', su.organizations, ['name', 'fullname', 'company_id']);
            if (spaceSession.space && spaceSession.space.admins) {
                spaceSession.is_space_admin = spaceSession.space.admins.indexOf(userId) > -1;
            }
            if (spaceSession.company) {
                spaceSession.company_id = spaceSession.company._id;
            }
            if (spaceSession.companies) {
                spaceSession.company_ids = spaceSession.companies.map(function (company: any) { return company._id });
            }
            spaceSession.permission_shares = await getUserPermissionShares(su);
            addSpaceSessionToCache(spaceId, userId, spaceSession);
            return spaceSession;
        } else {
            spaceSession = { roles: ['guest'], expiredAt: expiredAt };
        }
    }
    return spaceSession;
}

export async function updateSpaceUserSessionRolesCache(spaceId, userId) {
    let spaceSession: any = getSpaceSessionFromCache(spaceId, userId);
    if (spaceSession) {
        spaceSession.roles = await getUserRoles(userId, spaceId);
        return true;
    }
    return false;
}