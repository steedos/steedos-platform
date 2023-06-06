import { SteedosDataSourceType, getSteedosSchema, getObject } from '.';
import { getConfigs, getConfigsFormFiles } from '@steedos/metadata-registrar';
import _ = require('underscore');
import * as _l from 'lodash';
export type SteedosAppTypeConfig = {
    _id: string,
    name: string,
    description: string,
    icon_slds: string,
    objects: string[],
    mobile_objects?: string[],
    admin_menus?: any
}

export class SteedosAppType{
    private _datasource: SteedosDataSourceType;
    public get datasource(): SteedosDataSourceType {
        return this._datasource;
    }
    private __id: string;
    public get _id(): string {
        return this.__id;
    }
    public set _id(value: string) {
        this.__id = value;
    }
    private _name: string;
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    private _description: string;
    public get description(): string {
        return this._description;
    }
    public set description(value: string) {
        this._description = value;
    }
    private _icon_slds: string;
    public get icon_slds(): string {
        return this._icon_slds;
    }
    public set icon_slds(value: string) {
        this._icon_slds = value;
    }
    private _objects: string[];
    public get objects(): string[] {
        return this._objects;
    }
    public set objects(value: string[]) {
        this._objects = value;
    }

    private _is_creator: boolean;
    public get is_creator(): boolean {
        return this._is_creator;
    }

    private _mobile_objects: string[];
    public get mobile_objects(): string[] {
        return this._mobile_objects;
    }
    public set mobile_objects(value: string[]) {
        this._mobile_objects = value;
    }

    private properties: string[] = ['is_creator']
    
    constructor(config: SteedosAppTypeConfig, datasource: SteedosDataSourceType){
        this._datasource = datasource
        this._is_creator = true
        this._id = config._id
        _.each(config, (value: any, key: string)=>{
            if(key != 'is_creator'){
                this[key] = value
                this.properties.push(key)
            }
        })
        // this.name = config.name
        // this.description = config.description
        // this.icon_slds = config.icon_slds
        // this.objects = config.objects
        // this.mobile_objects = config.mobile_objects
    }

    toConfig(){
        let config = {}
        this.properties.forEach((property)=>{
            config[property] = this[property]
        })
        return config
    }

    private transformReferenceTo(reference_to: string, datasource: SteedosDataSourceType): string{
        if(_.isString(reference_to)){
            if(reference_to.split('.').length = 1){
                if(datasource.getObject(reference_to)){
                    return `${datasource.name}.${reference_to}`
                }
            }
        }
        return reference_to
    }

    transformReferenceOfObject(){
        let datasource = this._datasource;
        if(datasource.name != 'meteor'){
            if(_.isArray(this.objects)){
                let objects: string[] = []
                _.each(this.objects, (object_name)=>{
                    objects.push(this.transformReferenceTo(object_name, datasource))
                })
                this.objects = objects;
            }
        }
    }
}

export async function addAppConfigFiles(filePath: string, serviceName: string){
    const configs = getConfigsFormFiles('app', filePath);
    for (const config of configs) {
        await addAppConfig(config, serviceName);
    }
}

export const addAppConfig = async (appConfig: SteedosAppTypeConfig, serviceName: string = '') => {
    const schema = getSteedosSchema();
    await schema.metadataRegister.addApp(serviceName, appConfig);
}

export const getAppConfigs = async (spaceId?) => {
    const schema = getSteedosSchema();

    if(!schema.metadataRegister){
        return getConfigs('app')
    }

    const apps = await schema.metadataRegister.getApps();
    const configs = _.pluck(apps, 'metadata');

    if(spaceId){
        let _apps = _.filter(configs, function(config){
            if(_.has(config, 'space') && config.space){
                return config.space === spaceId;                
            }
            return true;
        })
        const result = [];
        _.each(_apps, function(config){
            if(!_.has(config, 'code')){
                config.code = config._id;
            }
            const index = _l.findIndex(result, function(item){return item.code === config.code;})
            if( index > -1){
                const _config = result[index];
                if(_config.code === _config._id){
                    result[index] = config;
                }
            }else{
                result.push(config)
            }
        })
        return result;
    }

    return configs;
}

export const removeApp = async (appApiName) => {
    const schema = getSteedosSchema();
    return await schema.metadataRegister.removeApp(appApiName);
}

export const getAppConfig = async (appApiName: string):Promise<SteedosAppTypeConfig> => {
    const schema = getSteedosSchema();
    const app = await schema.metadataRegister.getApp(appApiName);
    return app?.metadata;
}

const getUserProfileApiName = async (spaceId, userId)=>{
    const spaceUsers = await getObject("space_users").find({filters: [['space', '=', spaceId],['user', '=', userId]], fields: ['profile']})
    let userProfile = 'user';
    if(spaceUsers && spaceUsers.length > 0){
        const spaceUser = spaceUsers[0];
        if(spaceUser && spaceUser.profile){
            userProfile = spaceUser.profile;
        }
    }
    return userProfile;
}

const getProfile = async (spaceId, profileApiName)=>{
    const profiles = await getObject('permission_set').find({filters: [['space', '=', spaceId],['name', '=', profileApiName]]});
    return profiles.length > 0 ? profiles[0] : null;
}

const getUserPermissionSet = async(spaceId, userId, profileApiName?)=>{
    let filters = [['space', '=', spaceId], ['users', '=', userId]];
    if(profileApiName){
        filters = [['space', '=', spaceId], [['users', '=', userId], 'or', ['name', '=', profileApiName]]];
    }

    return await getObject('permission_set').find({filters: filters});
}

export const getAssignedApps = async(userSession)=>{
    let apps = [];
    const {spaceId, userId, is_space_admin: isSpaceAdmin } = userSession;
    if(isSpaceAdmin){
        return []
    }else{
        let userProfileApiName = await getUserProfileApiName(spaceId, userId);
        let userProfile = null;
        if(userProfileApiName){
            userProfile = await getProfile(spaceId, userProfileApiName);
        }
        if(userProfile?.assigned_apps?.length){
            apps = _.union(apps, userProfile.assigned_apps)
        }else{
            apps = []
        }
        const psets = await getUserPermissionSet(spaceId, userId, userProfileApiName);
        _.each(psets, (pset)=>{
            if(!pset.assigned_apps || pset.assigned_apps?.length === 0){
                return ;
            }
            if(pset.name == "admin" ||  pset.name == "user" || pset.name == 'supplier' || pset.name == 'customer'){
                return;
            }
            apps = _.union(apps, pset.assigned_apps);
        })
        return _.without(_.uniq(apps),undefined,null)
    }
}

export const getAssignedMenus = async(userSession)=>{
    let result = null;
    const {spaceId, userId, is_space_admin: isSpaceAdmin, roles } = userSession;
    const adminApp = await getAppConfig('admin');
    const apps = await getAppConfigs()
    let { admin_menus: adminMenus } = adminApp;
    if(!adminMenus){
        return [];
    }

    const aboutMenu = _.find(adminMenus, (menu)=>{
        return menu._id == 'about';
    })

    adminMenus = _.filter(adminMenus, (menu)=>{
        return menu._id != 'about';
    })

    const otherMenuApps = _.sortBy(_.filter(apps, (menu)=>{
        return menu.admin_menus && menu._id != 'admin'
    }), 'sort');

    const otherMenus = _.flatten(_.pluck(otherMenuApps, "admin_menus"));

    // 菜单有三部分组成，设置APP菜单、其他APP菜单以及about菜单
	const allMenus = _.union(adminMenus, otherMenus, [aboutMenu]);

    if(isSpaceAdmin){
        result = allMenus
    }else{
        let userProfile = await getUserProfileApiName(spaceId, userId);
        const menus = _.filter(allMenus, (menu)=>{
            const psetsMenu = menu.permission_sets;
            if(psetsMenu && psetsMenu.indexOf(userProfile) > -1){
                return true;
            }
            return _.intersection(roles, psetsMenu).length;
        })
        result = menus;
    }

    return _.sortBy(result,"sort")
}