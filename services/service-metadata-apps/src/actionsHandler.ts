import { getServiceAppConfig, METADATA_TYPE, refreshApp } from ".";
import _ = require("lodash");
import {translationApp, translationObject} from '@steedos/i18n';
import {getAssignedApps, getObject as _getObject} from "@steedos/objectql";

function cacherKey(appApiName: string): string{
    return `$steedos.#${METADATA_TYPE}.${appApiName}`
}

async function registerApp(ctx, appApiName, data, meta){
    return await ctx.broker.call('metadata.add', {key: cacherKey(appApiName), data: data}, {meta: meta});
}

async function getSpaceApp(ctx: any, appApiName: string){
    const allApps = await getAll(ctx);
    const userSession = ctx.meta.user;
    const spaceId = userSession.spaceId;
    const userApps = _.filter(allApps, function (metadataConfig) {
        const config = metadataConfig.metadata;
        if(!config.is_creator || !config.visible){
            return false;
        }
        if (_.has(config, 'space') && config.space) {
            return config.space === spaceId;
        }
        if (!_.isEmpty(config.tabs) || !_.isEmpty(config.objects) || !_.isEmpty(config.mobile_objects)) {
            return true;
        }
        return true;
    });
    
    return _.find(userApps, function(metadataConfig){
        const config = metadataConfig.metadata;
        return config.space && config.code === appApiName
    })
}

async function get(ctx: any){
    const spaceAppMetadataConfig = await getSpaceApp(ctx, ctx.params.appApiName)
    if(spaceAppMetadataConfig){
     return spaceAppMetadataConfig;   
    }else{
        const metadataConfig = await ctx.broker.call('metadata.get', {key: cacherKey(ctx.params.appApiName)}, {meta: ctx.meta});
        if(metadataConfig){
            return metadataConfig;
        }else{
            const allApps = await getAll(ctx);
            const userSession = ctx.meta.user;
            const spaceId = userSession.spaceId;
            const userApps = _.filter(allApps, function (metadataConfig) {
                const config = metadataConfig.metadata;
                if(!config.is_creator || !config.visible){
                    return false;
                }
                if (_.has(config, 'space') && config.space) {
                    return config.space === spaceId;
                }
                if (!_.isEmpty(config.tabs) || !_.isEmpty(config.objects) || !_.isEmpty(config.mobile_objects)) {
                    return true;
                }
                return true;
            })
            if(ctx.params.appApiName === '-'){
                return _.first(_.sortBy(userApps, ['metadata.sort']));
            }
            return _.find(userApps, function(metadataConfig){
                const app = metadataConfig.metadata;
                return app.code === ctx.params.appApiName
            })
        }
    }
}

async function getAll(ctx: any){
    return await ctx.broker.call('metadata.filter', {key: cacherKey("*")}, {meta: ctx.meta})
}

async function getObject(ctx: any, objectApiName: string){
    return await ctx.broker.call('objects.get', {objectApiName})
}

async function getTab(ctx: any, tabApiName: string){
    const metadataConfig = await ctx.broker.call('tabs.get', {tabApiName});
    return metadataConfig?.metadata;
}

async function getChildren(ctx: any, tabApiName: string){
    return await ctx.broker.call('tabs.getChildren', {tabApiName});
}

/**
 * 判断tab是否符号mobile配置
 * @param tab 
 * @param mobile 是否是在移动设备上显示tab
 * @returns 
 */
function checkTabMobile(tab, mobile){
    let isChecked = false;
    if(mobile === true || mobile === "true"){
        isChecked = tab.mobile !== false;
    }
    else{
        isChecked = tab.desktop !== false;
    }
    return isChecked;
}
function checkAppMobile(app, mobile){
    let isChecked = false;
    if(mobile === true || mobile === "true"){
        isChecked = app.mobile !== false;
    }
    else{
        isChecked = app.is_creator !== false;
    }
    return isChecked;
}

async function tabMenus(ctx: any, appPath, tabApiName, menu, mobile, userSession){
    try {
        const tab = await getTab(ctx, tabApiName);
        if(tab){
            const isMobileChecked = checkTabMobile(tab, mobile)
            if(!isMobileChecked){
                return;
            }
            const tabChildren = await getChildren(ctx, tabApiName);
            if(tabChildren && tabChildren.length > 0){
                const tabMenu = {
                    id: tab.name,
                    icon: tab.icon,
                    name: `${tab.label}`,
                    children: []
                };
                for await (const {metadata: tabChild} of tabChildren) {
                    if(tabChild && tabChild.apiName){
                        await tabMenus(ctx, appPath, tabChild.apiName, tabMenu, mobile, userSession);
                    }
                }
                menu.children.push(tabMenu);
            }else{
                if(tab.type === 'object'){
                    const allowRead = await objectAllowRead(tab.object, userSession);
                    if(!allowRead){
                        return;
                    }
                    const objectMetadata = await getObject(ctx, tab.object);
                    if(objectMetadata){
                        const objectConfig = objectMetadata.metadata;
                        translationObject(userSession.language, objectConfig.name, objectConfig)
                        menu.children.push(
                            {
                                id: objectConfig.name,
                                type: tab.type,
                                icon: objectConfig.icon,
                                path: `${appPath}/${objectConfig.name}`,
                                name: `${objectConfig.label}`
                            }
                        )
                    }
                }
                if(tab.type === 'url'){
                    let urlMenu: any = {
                        id: `${tab.name}`,
                        type: tab.type,
                        icon: tab.icon,
                        path: `${tab.url}`,
                        name: `${tab.label}`
                    };
                    if(tab.is_new_window){
                        urlMenu.target ='_blank'
                    }
                    menu.children.push(
                        urlMenu
                    )
                }
                if(tab.type === 'page'){
                    menu.children.push(
                        {
                            id: `${tab.name}`,
                            icon: tab.icon,
                            type: tab.type,
                            page: tab.page,
                            path: `${appPath}/${tab.type}/${tab.page}`,
                            name: `${tab.label}`
                        }
                    )
                }
            }
        }
    } catch (error) {
        ctx.broker.logger.info(error.message);
    }
}
async function objectAllowRead(objectApiName: string, userSession) {
    const userObjectPermission = await _getObject(objectApiName).getUserObjectPermission(userSession);
    return userObjectPermission.allowRead;
}

async function transformAppToMenus(ctx, app, mobile, userSession){
    if(!app.code && !app._id){
        return;
    }

    const isAppShow = checkAppMobile(app, mobile);
    if(!isAppShow){
        return;
    }

    if(!app.code){
        app.code = app._id;
    }

    translationApp(userSession.language, app.code, app);
    const appPath = `/app/${app.code}`
    const menu = {
        id: app.code,
        path: appPath,
        name: `${app.label || app.name}`,
        icon: app.icon_slds,
        description: app.description,
        children: []
    }

    if(_.isArray(app.tabs)){
        for await (const tabApiName of app.tabs) {
            try {
                await tabMenus(ctx, appPath, tabApiName, menu, mobile, userSession)
            } catch (error) {
                ctx.broker.logger.info(error.message);
            }
        }
    }

    const objects = mobile ? app.mobile_objects : app.objects

    if(_.isArray(objects)){
        for await (const objectApiName of objects) {
            try {
                const objectMetadata = await getObject(ctx, objectApiName);
                if(!objectMetadata){
                    throw new Error(`${objectApiName} is not found in the objects of app ${app.code} `)
                }
                const allowRead = await objectAllowRead(objectApiName, userSession);
                if(!allowRead){
                    continue;
                }
                if(objectMetadata){
                    const objectConfig = objectMetadata.metadata;
                    translationObject(userSession.language, objectConfig.name, objectConfig)
                    menu.children.push(
                        {
                            id: objectConfig.name,
                            icon: objectConfig.icon,
                            path: `${appPath}/${objectConfig.name}`,
                            name: `${objectConfig.label}`
                        }
                    )
                }
            } catch (error) {
                ctx.broker.logger.error(error);
            }
        }
    }

    return menu;
}

async function getAppsMenus(ctx) {
    const userSession = ctx.meta.user;
    let assigned_apps = await getAssignedApps(userSession);
    const mobile = ctx.params.mobile;
    if (!userSession) {
        throw new Error('no permission.')
    }
    const spaceId = userSession.spaceId;
    const metadataApps = await getAll(ctx);
    const allApps = _.map(metadataApps, 'metadata');
    if(assigned_apps && assigned_apps.length){
        assigned_apps = _.filter(allApps, (item)=>{ return assigned_apps.includes(item.code)});
    }else{
        assigned_apps = allApps;
    }
    const _userApps = _.filter(assigned_apps, function (config) {
        if(!config.is_creator || !config.visible){
            return false;
        }
        if (_.has(config, 'space') && config.space) {
            return config.space === spaceId;
        }
        return true;
    })
    const menus = [];

    let userApps = [];
    _.each(_.sortBy(_userApps, ['sort']), function(app){
        if(!app.code){
            app.code = app._id;
        }
        const _appIndex = _.findIndex(userApps, function(item){ return item.code === app.code});
        if(_appIndex < 0){
            userApps.push(app)
        }else{
            const _app = userApps[_appIndex];
            if(!_app.space && app.space){
                userApps[_appIndex] = app;
            }
        }
    })

    for await (const app of _.sortBy(userApps, ['sort'])) {
        const menu = await transformAppToMenus(ctx, app, mobile, userSession);
        if(menu){
            menus.push(menu);
        }
    }
    if(!mobile){
        menus.push(
            {
                id: 'admin',
                path: '/app/admin',
                name: '设置',
                icon: 'settings',
                description: '管理员设置公司、人员、权限等。',
                children: []
            }
        )
    }
    return menus;
}

async function getAppMenus(ctx){
    const userSession = ctx.meta.user;
    const { mobile } = ctx.params;
    if (!userSession) {
        throw new Error('no permission.')
    }
    const spaceId = userSession.spaceId;

    const metadataConf = await get(ctx);
    if(metadataConf){
        const appConfig = metadataConf.metadata;
        if (_.has(appConfig, 'space') && appConfig.space && appConfig.space != spaceId) {
            return ;
        }
        const appMeuns = await transformAppToMenus(ctx, appConfig, mobile, userSession);
        return appMeuns;
    }

}

export const ActionHandlers = {
    async get(ctx: any): Promise<any> {
        return await ctx.broker.call('metadata.get', {key: cacherKey(ctx.params.appApiName)}, {meta: ctx.meta})
    },
    async getAll(ctx: any): Promise<any> {
        return await getAll(ctx);
    },
    async getMenus(ctx: any): Promise<any> {
        return await getAppsMenus(ctx);
    },
    async getAppMenus(ctx: any): Promise<any> {
        return await getAppMenus(ctx);
    },
    async add(ctx: any): Promise<boolean>{
        let config = ctx.params.data;
        const serviceName = ctx.meta.metadataServiceName
        const metadataApiName = ctx.params.appApiName;
        const metadataConfig = await getServiceAppConfig(ctx, serviceName, metadataApiName)
        if(metadataConfig && metadataConfig.metadata){
            config = _.defaultsDeep(config, metadataConfig.metadata);
        }
        await ctx.broker.call('metadata.addServiceMetadata', {key: cacherKey(metadataApiName), data: config}, {meta: Object.assign({}, ctx.meta, {metadataType: METADATA_TYPE, metadataApiName: metadataApiName})})
        const appConfig = await refreshApp(ctx, metadataApiName);
        return await registerApp(ctx, metadataApiName, appConfig, ctx.meta)
    },
    async delete(ctx: any): Promise<boolean>{
        return await ctx.broker.call('metadata.delete', {key: cacherKey(ctx.params.appApiName)}, {meta: ctx.meta})
    },
    async verify(ctx: any): Promise<boolean>{
        console.log("verify");
        return true;
    },
    async refresh(ctx){
        const { isClear, metadataApiNames } = ctx.params
        if(isClear){
            for await (const metadataApiName of metadataApiNames) {
                const appConfig = await refreshApp(ctx, metadataApiName);
                if(!appConfig){
                    await ctx.broker.call('metadata.delete', {key: cacherKey(metadataApiName)})
                }else{
                    await registerApp(ctx, metadataApiName, appConfig, {});
                }
            }
        }
    }
}