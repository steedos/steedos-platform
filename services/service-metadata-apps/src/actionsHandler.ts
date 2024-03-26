import { getServiceAppConfig, METADATA_TYPE, refreshApp } from ".";
import _ = require("lodash");
import { translationApp, translationObjectLabel, translationTabLabel } from '@steedos/i18n';
import { getAssignedApps, getObject as _getObject, absoluteUrl } from "@steedos/objectql";
import { getNotLicensedTabNames } from "./getNotLicensedTabNames"

function cacherKey(appApiName: string): string {
    return `$steedos.#${METADATA_TYPE}.${appApiName}`
}

async function registerApp(ctx, appApiName, data, meta) {
    return await ctx.broker.call('metadata.add', { key: cacherKey(appApiName), data: data }, { meta: meta });
}

async function getSpaceApp(ctx: any, appApiName: string) {
    const allApps = await getAllApps(ctx);
    const userSession = ctx.meta.user;
    const spaceId = userSession.spaceId;
    const userApps = _.filter(allApps, function (metadataConfig) {
        const config = metadataConfig.metadata;
        //只判断是否启用
        if (!config.visible) {
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

    return _.find(userApps, function (metadataConfig) {
        const config = metadataConfig.metadata;
        return config.space && config.code === appApiName
    })
}

async function get(ctx: any) {
    const spaceAppMetadataConfig = await getSpaceApp(ctx, ctx.params.appApiName)
    if (spaceAppMetadataConfig) {
        return spaceAppMetadataConfig;
    } else {
        const metadataConfig = await ctx.broker.call('metadata.get', { key: cacherKey(ctx.params.appApiName) }, { meta: ctx.meta });
        if (metadataConfig) {
            return metadataConfig;
        } else {
            const allApps = await getAllApps(ctx);
            const userSession = ctx.meta.user;
            const spaceId = userSession.spaceId;
            const userApps = _.filter(allApps, function (metadataConfig) {
                const config = metadataConfig.metadata;
                //只判断是否启用
                if (!config.visible) {
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
            if (ctx.params.appApiName === '-') {
                return _.first(_.sortBy(userApps, ['metadata.sort']));
            }
            return _.find(userApps, function (metadataConfig) {
                const app = metadataConfig.metadata;
                return app.code === ctx.params.appApiName
            })
        }
    }
}

async function getAllApps(ctx: any) {
    return await ctx.broker.call('metadata.filter', { key: cacherKey("*") }, { meta: ctx.meta })
}

// async function getObject(ctx: any, objectApiName: string){
//     return await ctx.broker.call('objects.get', {objectApiName})
// }

async function getAllTabs(ctx: any) {
    return await ctx.broker.call('tabs.getAll');
}

async function getContext(ctx: any) {
    const allTabs = await getAllTabs(ctx)
    // const allObject = await getSteedosSchema().getAllObject()
    let hiddenTabNames = await getHiddenTabNames(ctx, allTabs)
    const notLicensedTabNames = await getNotLicensedTabNames(ctx, allTabs)
    hiddenTabNames = hiddenTabNames.concat(notLicensedTabNames)
    return {
        tabs: allTabs,
        // objects: allObject,
        hiddenTabNames: hiddenTabNames
    }
}

async function getTab(ctx: any, tabApiName: string) {
    const metadataConfig = await ctx.broker.call('tabs.get', { tabApiName });
    return metadataConfig?.metadata;
}

// async function getChildren(ctx: any, tabApiName: string){
//     return await ctx.broker.call('tabs.getChildren', {tabApiName});
// }

function getTabChildren(context: any, tabApiName: string) {
    if (context) {
        const { tabs } = context;
        return _.filter(tabs, function (tab) {
            return tab?.metadata.parent === tabApiName
        })
    }
}

/**
 * 判断tab是否符合mobile配置
 * @param tab 
 * @param mobile 是否是在移动设备上显示tab
 * @returns 
 */
function checkTabMobile(tab, mobile) {
    let isChecked = false;
    if (mobile === true || mobile === "true") {
        isChecked = tab.mobile !== false;
    }
    else {
        isChecked = tab.desktop !== false;
    }
    return isChecked;
}
function checkAppMobile(app, mobile) {
    let isChecked = false;
    // 手机端访问
    if (mobile === true || mobile === "true") {
        isChecked = app.mobile === true;
    }
    else {
        // 桌面端访问
        isChecked = app.is_creator === true
    }
    return isChecked;
}

/**
 * 根据选项卡权限的配置决定选项卡是否可见，默认可见，关闭的和隐藏的选项卡不可见
 * @param ctx 
 * @return ['tabName', ...]
 */
async function getHiddenTabNames(ctx, allTabs) {
    const userSession = ctx.meta.user
    if (!userSession) {
        throw new Error('no permission.')
    }
    const hiddenTabNames = []
    const permissionTabs = await getPermissionTabs(ctx, userSession)
    const showTabNames = [] // 同一个选项卡在不同权限集中的权限叠加，如有一个是默认打开的则选项卡默认打开
    for (const permissionTab of permissionTabs) {
        if (permissionTab.permission === 'on') {
            showTabNames.push(permissionTab.tab)
        }
    }
    for (const permissionTab of permissionTabs) {
        if ((permissionTab.permission === 'off' || permissionTab.permission === 'hidden') && !showTabNames.includes(permissionTab.tab)) {
            hiddenTabNames.push(permissionTab.tab)
        }
    }

    // .tab.yml中配置了hidden:true
    for (const config of allTabs) {
        if (config.metadata && config.metadata.hidden) {
            hiddenTabNames.push(config.metadata.name)
        }
    }

    return hiddenTabNames
}

async function getPermissionTabs(ctx, userSession): Promise<any[]>{
    const { roles, spaceId } = userSession
    const permissionTabs = []
    for (const role of roles) {
        const pattern = `${role}_*`
        const filterResult = await ctx.broker.call('permission_tabs.filter', {
            pattern: pattern,
        }, {
            user: { spaceId: spaceId }
        });
        for (const ptConfig of filterResult) {
            if (ptConfig.metadata.permission_set === role && (!_.has(ptConfig.metadata, 'space') || ptConfig.metadata.space === spaceId)) {
                permissionTabs.push(ptConfig.metadata)
            }
        }
    }
    return permissionTabs
}


async function tabMenus(ctx: any, appPath, tabApiName, menu, mobile, userSession, context, props:any = {}) {
    try {
        // const objectsConfigs = context.objects;
        const tab = await getTab(ctx, tabApiName);
        if(props.group){
            props.group = _.find(menu.tab_groups, { id: props.group })?.group_name || props.group;
        }
        if (tab) {
            const isMobileChecked = checkTabMobile(tab, mobile)
            if (!isMobileChecked) {
                return;
            }
            const tabChildren = getTabChildren(context, tabApiName);

            if (tabChildren && tabChildren.length > 0) {
                const tabMenu = {
                    id: tab.name,
                    icon: tab.icon,
                    name: `${tab.label}`,
                    children: [],
                    ...props
                };
                for (const { metadata: tabChild } of tabChildren) {
                    if (tabChild && tabChild.apiName) {
                        await tabMenus(ctx, appPath, tabChild.apiName, tabMenu, mobile, userSession, context);
                    }
                }
                menu.children.push(tabMenu);
            } else {
                if (tab.type === 'object') {
                    const allowRead = await objectAllowRead(tab.object, userSession);
                    if (!allowRead) {
                        return;
                    }
                    // const objectMetadata = await getObject(ctx, tab.object);
                    // const objectMetadata = _.find(objectsConfigs, (config) => {
                    //     return config && config.metadata.name === tab.object
                    // });
                    const objectConfig = await _getObject(tab.object).getConfig()
                    if (objectConfig) {
                        // const objectConfig = objectMetadata.metadata;
                        const objectLabel = translationObjectLabel(userSession.language, objectConfig.name, objectConfig.label || objectConfig.name)
                        menu.children.push(
                            {
                                id: objectConfig.name,
                                type: tab.type,
                                icon: objectConfig.icon,
                                path: `${appPath}/${objectConfig.name}`,
                                name: `${objectLabel}`,
                                ...props
                            }
                        )
                    }
                }
                if (tab.type === 'url') {
                    tab.label = translationTabLabel(userSession.language, tab.name, tab.label || tab.name);
                    let urlMenu: any = {
                        id: `${tab.name}`,
                        type: tab.type,
                        icon: tab.icon,
                        path: `${tab.url}`,
                        name: `${tab.label}`,
                        ...props
                    };
                    if (tab.is_new_window) {
                        urlMenu.target = '_blank'
                    }else if(tab.is_use_iframe){
                        urlMenu.is_use_iframe = true;
                        urlMenu.path = `${appPath}/tab_iframe/${tab.name}/?url=${tab.url}`
                    }
                    menu.children.push(
                        urlMenu
                    )
                }
                if (tab.type === 'page') {
                    tab.label = translationTabLabel(userSession.language, tab.name, tab.label || tab.name);
                    menu.children.push(
                        {
                            id: `${tab.name}`,
                            icon: tab.icon,
                            type: tab.type,
                            page: tab.page,
                            path: `${appPath}/${tab.type}/${tab.page}`,
                            name: `${tab.label}`,
                            ...props
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
    return await _getObject(objectApiName).allowRead(userSession);
}

async function transformAppToMenus(ctx, app, mobile, userSession, context) {
    if (!app.code && !app._id) {
        return;
    }

    const isAppShow = checkAppMobile(app, mobile);
    if (!isAppShow) {
        return;
    }

    if (!app.code) {
        app.code = app._id;
    }
    translationApp(userSession.language, app.code, app);
    var appPath = `/app/${app.code}`
    if(app.url){
        if(/^http(s?):\/\//.test(app.url)){
            if(app.secret){
				appPath = absoluteUrl("/api/external/app/" + (app._id || app.code))
            }else{
                appPath = app.url
            }
        }else{
            appPath = app.url
        }
    }
    const menu: any = {
        id: app.code,
        path: appPath,
        name: `${app.label || app.name}`,
        icon: app.icon_slds,
        showSidebar: app.showSidebar,
        description: app.description,
        children: [],
        blank: app.is_new_window,
        on_click: app.on_click,
        isExternalUrl: !!app.url,
        tab_groups: app.tab_groups,
        is_hide_menu: app.is_hide_menu
    }
    if(app.enable_nav_schema && app.nav_schema && !mobile){
        menu.nav_schema = _.isString(app.nav_schema) ? JSON.parse(app.nav_schema) : app.nav_schema
    }
    
    const hiddenTabNames = context.hiddenTabNames || []
    if (app.tab_items) {
        // app.tab_items is array
        if (_.isArray(app.tab_items)) {
            for (const item of app.tab_items) {
                try {
                    if (hiddenTabNames.includes(item.tab_name)) continue;
                    await tabMenus(ctx, appPath, item.tab_name, menu, mobile, userSession, context, item)
                } catch (error) {
                    ctx.broker.logger.info(error.message);
                }
            }
        } else {
            for (const tabApiName in app.tab_items) {
                try {
                    if (hiddenTabNames.includes(tabApiName)) continue;
                    const props = app.tab_items[tabApiName]
                    await tabMenus(ctx, appPath, tabApiName, menu, mobile, userSession, context, props)
                } catch (error) {
                    ctx.broker.logger.info(error.message);
                }
            }
        }
    } else if (_.isArray(app.tabs)) {
        for (const tabApiName of app.tabs) {
            try {
                if (hiddenTabNames.includes(tabApiName)) continue;
                await tabMenus(ctx, appPath, tabApiName, menu, mobile, userSession, context)
            } catch (error) {
                ctx.broker.logger.info(error.message);
            }
        }
    }
    const objects = mobile ? app.mobile_objects : app.objects
    // const objectsConfigs = context.objects;
    if (_.isArray(objects)) {
        const getChildrenPromises = []
        for (const objectApiName of objects) {
            getChildrenPromises.push(getMenuChildren({
                objectApiName, userSession, ctx, appPath, app
            }))
        }
        const children = await Promise.all(getChildrenPromises)
        for (const child of children) {
            if (child) {
                menu.children.push(child)
            }
        }
    }
    
    return menu;
}

async function getMenuChildren({ objectApiName, userSession, ctx, appPath, app }) {
    try {
        const objectConfig = await _getObject(objectApiName).getConfig()
        if (!objectConfig) {
            ctx.broker.logger.error(`${objectApiName} is not found in the objects of app ${app.code} `)
            return
        }
        const allowRead = await objectAllowRead(objectApiName, userSession);
        if (!allowRead) {
            return
        }
        if (objectConfig) {
            // const objectConfig = objectMetadata.metadata;
            const objectLabel = translationObjectLabel(userSession.language, objectConfig.name, objectConfig.label || objectConfig.name)
            return {
                id: objectConfig.name,
                icon: objectConfig.icon,
                path: `${appPath}/${objectConfig.name}`,
                name: `${objectLabel}`
            }
        }
    } catch (error) {
        ctx.broker.logger.error(error);
    }
}

async function getAppsMenus(ctx) {
    const userSession = ctx.meta.user;
    if (!userSession) {
        throw new Error('no permission.')
    }
    let assigned_apps = await getAssignedApps(userSession);
    let mobile = ctx.params.mobile;
    if (typeof mobile !== 'boolean') {
        mobile = mobile === "true" ? true : false;
    }
    const spaceId = userSession.spaceId;
    const metadataApps = await getAllApps(ctx);
    const context = await getContext(ctx)
    const allApps = _.map(metadataApps, 'metadata');
    if (assigned_apps && assigned_apps.length) {
        assigned_apps = _.filter(allApps, (item) => { return assigned_apps.includes(item.code) });
    } else {
        assigned_apps = allApps;
    }
    const _userApps = _.filter(assigned_apps, function (config) {
        if (!config.visible) {
            return false;
        }

        if (config._id === config.code) {
            let dbApp = _.find(assigned_apps, (item) => {
                return item.code === config.code && item._id != item.code && item.space === spaceId;
            });
            if (dbApp) {
                return dbApp.visible
            }
        }

        if (_.has(config, 'space') && config.space) {
            return config.space === spaceId;
        }
        return true;
    })
    const menus = [];

    let userApps = [];
    _.each(_.sortBy(_userApps, ['sort']), function (app) {
        if (!app.code) {
            app.code = app._id;
        }
        const _appIndex = _.findIndex(userApps, function (item) { return item.code === app.code });
        if (_appIndex < 0) {
            userApps.push(app)
        } else {
            const _app = userApps[_appIndex];
            if (!_app.space && app.space) {
                userApps[_appIndex] = app;
            }
        }
    })
    for (const app of _.sortBy(userApps, ['sort'])) {
        const menu = await transformAppToMenus(ctx, app, mobile, userSession, context);
        if (menu) {
            menus.push(menu);
        }
    }
    // if (!mobile) {
        // const setupApp = {
        //     code: 'admin',
        //     name: '设置',
        //     icon_slds: 'settings',
        //     description: '管理员设置公司、人员、权限等。',
        //     children: [],
        //     mobile: true,
        //     is_creator: true,
        // }
        // const menu = await transformAppToMenus(ctx, setupApp, mobile, userSession, context);
        // menus.push(menu);
    // }
    return menus;
}

async function getAppMenus(ctx) {
    const userSession = ctx.meta.user;
    const { mobile } = ctx.params;
    if (!userSession) {
        throw new Error('no permission.')
    }
    const spaceId = userSession.spaceId;
    const metadataConf = await get(ctx);
    if (metadataConf) {
        const appConfig = metadataConf.metadata;
        if (_.has(appConfig, 'space') && appConfig.space && appConfig.space != spaceId) {
            return;
        }
        const context = await getContext(ctx)
        const appMenus = await transformAppToMenus(ctx, appConfig, mobile, userSession, context);
        return appMenus;
    }

}

export const ActionHandlers = {
    async get(ctx: any): Promise<any> {
        return await ctx.broker.call('metadata.get', { key: cacherKey(ctx.params.appApiName) }, { meta: ctx.meta })
    },
    async getAll(ctx: any): Promise<any> {
        return await getAllApps(ctx);
    },
    async getMenus(ctx: any): Promise<any> {
        const menus = await getAppsMenus(ctx);
        return menus;
    },
    async getAppMenus(ctx: any): Promise<any> {
        return await getAppMenus(ctx);
    },
    async add(ctx: any): Promise<boolean> {
        let config = ctx.params.data;
        const serviceName = ctx.meta.metadataServiceName
        const metadataApiName = ctx.params.appApiName;
        const metadataConfig = await getServiceAppConfig(ctx, serviceName, metadataApiName)
        if (metadataConfig && metadataConfig.metadata) {
            config = _.defaultsDeep(config, metadataConfig.metadata);
        }
        await ctx.broker.call('metadata.addServiceMetadata', { key: cacherKey(metadataApiName), data: config }, { meta: Object.assign({}, ctx.meta, { metadataType: METADATA_TYPE, metadataApiName: metadataApiName }) })
        const appConfig = await refreshApp(ctx, metadataApiName);
        return await registerApp(ctx, metadataApiName, appConfig, ctx.meta)
    },
    async delete(ctx: any): Promise<boolean> {
        return await ctx.broker.call('metadata.delete', { key: cacherKey(ctx.params.appApiName) }, { meta: ctx.meta })
    },
    async verify(ctx: any): Promise<boolean> {
        console.log("verify");
        return true;
    },
    async refresh(ctx) {
        const { isClear, metadataApiNames } = ctx.params
        if (isClear) {
            for (const metadataApiName of metadataApiNames) {
                const appConfig = await refreshApp(ctx, metadataApiName);
                if (!appConfig) {
                    await ctx.broker.call('metadata.delete', { key: cacherKey(metadataApiName) })
                } else {
                    await registerApp(ctx, metadataApiName, appConfig, {});
                }
            }
        }
    }
}