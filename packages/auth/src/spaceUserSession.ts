import { getSteedosSchema, addConfig, getConfig, removeConfig, getObject } from '@steedos/objectql';
import { isExpried } from './utils'
import { getCacher } from '@steedos/cachers'
import { isPropValueChanged } from './session';
import { removeUserSessionFromCache } from './userSession';
import _ = require('underscore');
const sessionCacheInMinutes = 10;
const SPACEUSERCACHENAME = 'space_users_cache';

const internalProfiles = ['admin', 'user', 'supplier', 'customer']

// 使用@steedos/cacher缓存工作区信息
const SPACES_CACHER_NAME = 'lru.spaces'

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
    let permission_sets = await getSteedosSchema().getObject('permission_set').directFind({ filters: filters, fields: ['name'] });
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

    return await getSteedosSchema().getObject(objectName).directFind(query)
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

/**
 * 清除缓存
 * @param spaceId 
 * @param userId 
 */
export function removeSpaceUserSessionFromCache(spaceId: string, userId: string): void {
    removeConfig(SPACEUSERCACHENAME, { _id: `${spaceId}-${userId}` })
}

export async function getSpaceUserSession(spaceId, userId) {
    let spaceSession: any = getSpaceSessionFromCache(spaceId, userId);
    if (!spaceSession) {
        let expiredAt = new Date().getTime() + sessionCacheInMinutes * 60 * 1000;
        let su = null;
        // let suFields = ['_id', 'space', 'company_id', 'company_ids', 'organization', 'organizations', 'organizations_parents', 'user'];
        
        // 如果spaceid和user不匹配，则取用户的第一个工作区
        let spaceUsers = await getSteedosSchema().getObject('space_users').directFind({ filters: `(user eq '${userId}') and (user_accepted eq true)` });
        const findSpaceUser = _.find(spaceUsers, (spaceUser)=>{ return spaceUser.space === spaceId })
        if(findSpaceUser){
            su = findSpaceUser;
        }else{
            su = spaceUsers[0];
        }

        if (su) {
            let userSpaceId = su.space;
            let userSpaceIds = _.pluck(spaceUsers, 'space');

            let [ roles, profile, spaces, companies, organizations, permission_shares ] = await Promise.all([
                getUserRoles(userId, userSpaceId),
                getSpaceUserProfile(userId, userSpaceId),
                getSpaces(userSpaceIds),
                getObjectDataByIds('company', su.company_ids, ['name', 'organization']),
                getObjectDataByIds('organizations', su.organizations, ['name', 'fullname', 'company_id']),
                getUserPermissionShares(su)
            ])

            spaceSession = { roles: roles, profile: profile,expiredAt: expiredAt, ...su };
            spaceSession.spaceId = userSpaceId;
            spaceSession.spaces = spaces 
            spaceSession.space = _.find(spaceSession.spaces, (record)=>{ return record._id === userSpaceId });
            
            spaceSession.companies = companies;
            spaceSession.company = _.find(spaceSession.companies, (record)=>{ return record._id === su.company_id });
            
            spaceSession.organizations = organizations ;
            spaceSession.organization = _.find(spaceSession.organizations, (record)=>{ return record._id === su.organization });

            if (spaceSession.company) {
                spaceSession.company_id = spaceSession.company._id;
            }
            if (spaceSession.companies) {
                spaceSession.company_ids = spaceSession.companies.map(function (company: any) { return company._id });
            }
            spaceSession.permission_shares = permission_shares;
            spaceSession.spaceUserId = spaceSession._id;
            addSpaceSessionToCache(spaceId, userId, spaceSession);
        } else {
            spaceSession = { roles: ['guest'], expiredAt: expiredAt };
        }
    }
    if (spaceSession.space && spaceSession.space.admins) {
        spaceSession.is_space_admin = spaceSession.space.admins.indexOf(userId) > -1;
    }

    spaceSession.masterSpaceId = process.env.STEEDOS_TENANT_MASTER_ID;

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

/**
 * 获取用户所属工作区记录，优先从缓存获取
 * @param userSpaceIds 
 * @returns 工作区记录
 */
async function getSpaces(userSpaceIds: string[]) {
    const cacher = getCacher(SPACES_CACHER_NAME)
    const spaces = []
    
    for (const sId of userSpaceIds) {
        let cacheDoc = cacher.get(sId)
        if (!cacheDoc) {
            cacheDoc = (await getObject('spaces').directFind({ filters: [ ['_id', '=', sId] ], fields: ['_id', 'name', 'admins'] }))[0]
            cacher.set(sId, cacheDoc)
        }
        spaces.push(cacheDoc)
    }
    if (_.isEmpty(spaces)) {
        console.log(userSpaceIds)
    }
    return spaces
}

/**
 * userSession支持实时更新
 * 当space_users属性发生变更后清除userSession缓存
 */
export function deleteSpaceUserSessionCacheByChangedProp (newDoc: any, oldDoc: any): void {
    const { space: spaceId, user: userId } = oldDoc
    // 由于space_users和users是单独缓存，故这里分别判断清除
    
    // user session
    const uProps = [
        'locale',        // 语言
        'mobile',        // 手机号
        'name',          // 姓名
        'username',      // 用户名
        'email'          // 邮箱
    ]

    // space_users session
    const suProps = [
        'company_id',    // 主分部
        'company_ids',   // 所属公司
        'organization',  // 主部门
        'organizations', // 所属部门
        'profile',       // 简档
        ...uProps
    ]
    const suChanged = isPropValueChanged(newDoc, oldDoc, suProps)
    if (suChanged) {
        removeSpaceUserSessionFromCache(spaceId, userId)
    }
    
    const uChanged = isPropValueChanged(newDoc, oldDoc, uProps)
    if (uChanged) {
        removeUserSessionFromCache(userId)
    }
}

/**
 * userSession支持实时更新
 * 当spaces属性发生变更后清除spaces缓存
 */
 export function deleteSpaceCacheByChangedProp (newDoc: any, oldDoc: any): void {
    const { _id: spaceId } = oldDoc
    const props = [
        'name',         // 工作区名称
        'admins',       // 管理员
    ]
    const changed = isPropValueChanged(newDoc, oldDoc, props)
    if (changed) {
        // 清除spaces缓存
        const cacher = getCacher(SPACES_CACHER_NAME)
        cacher.delete(spaceId)
        // 如果admins发生了变化，则需要清除变化的人员的缓存
        const changeAdmins = <string[]> _.difference(newDoc.admins, oldDoc.admins).concat(_.difference(oldDoc.admins, newDoc.admins))
        for (const userId of changeAdmins) {
            removeSpaceUserSessionFromCache(spaceId, userId)
        }
    }
}
