import { Dictionary, JsonMap } from "@salesforce/ts-types";
import { SteedosTriggerType, SteedosFieldType, SteedosFieldTypeConfig, SteedosSchema, SteedosListenerConfig, SteedosObjectListViewTypeConfig, SteedosObjectListViewType, SteedosIDType, SteedosObjectPermissionTypeConfig, SteedosActionType, SteedosActionTypeConfig, SteedosUserSession, getSteedosSchema } from ".";
import { getUserObjectSharesFilters, isTemplateSpace, isCloudAdminSpace, generateActionParams } from '../util'
import _ = require("underscore");
import { SteedosTriggerTypeConfig, SteedosTriggerContextConfig } from "./trigger";
import { SteedosQueryOptions, SteedosQueryFilters } from "./query";
import { SteedosDataSourceType, SteedosDatabaseDriverType } from "./datasource";
import { SteedosFieldDBType } from '../driver/fieldDBType';
import { runCurrentObjectFieldFormulas, runQuotedByObjectFieldFormulas } from '../formula';
import { runQuotedByObjectFieldSummaries, runCurrentObjectFieldSummaries } from '../summary';
import { formatFiltersToODataQuery } from "@steedos/filters";
import { WorkflowRulesRunner } from '../actions';
import { runValidationRules } from './validation_rules';
import { brokeEmitEvents } from "./object_events";
const clone = require('clone')

// 主子表有层级限制，超过3层就报错，该函数判断当前对象作为主表对象往下的层级最多不越过3层，
// 其3层指的是A-B-C-D，它们都有父子关系，A作为最顶层，该对象上不可以再创建主表子表关系字段，但是B、C、D上可以；
// 或者如果当前对象上创建的主表子表关系字段指向的对象是D，那么也会超过3层的层级限制；
// 又或者中间加一层M先连接B再连接C，形成A-B-M-C-D，也会超过3层的层级限制；
export const MAX_MASTER_DETAIL_LEAVE = 3;

/**
 * 判断传入的paths中最大层级深度
 * @param paths 对象上getDetailPaths或getMasterPaths函数返回的当前对象向下或向上取主表子表关联对象名称列表链条
 * 比如传入下面示例中的paths，表示当前对象b向下有4条主子关系链，最大层级深度为第2条，深度为3
 * [
    [ 'b', 't1', 't2' ],
    [ 'b', 't1', 'm1', 'm2' ],
    [ 'b', 't1', 'm2' ],
    [ 'b', 'c', 'd' ]
 * ]
 */
const getMaxPathLeave = (paths: string[]) => {
    let maxLeave = 0;
    _.each(paths, (n) => {
        if (maxLeave < n.length) {
            maxLeave = n.length;
        }
    });
    // A-B-C-D这种主表子表链按3层算
    maxLeave--;
    return maxLeave;
}

/**
 * 判断传入的paths中每条path下是否有重复对象名称，返回第一个重复的对象名称
 * 有可能传入的paths有多个链条，只要其中任何一个链条上有同名对象名说明异常，返回第一个异常的同名对象名即可
 * 比如传入下面示例中的paths，表示当前对象b向下有4条主子关系链，将返回第三条链中的重复对象名b
 * @param paths 对象上getDetailPaths或getMasterPaths函数返回的当前对象向下或向上取主表子表关联对象名称列表链条
 * [
    [ 'b', 't1', 't2' ],
    [ 'b', 't1', 'm1', 'm2' ],
    [ 'b', 't1', 'm2', 'b' ],
    [ 'b', 'c', 'd' ]
 * ]
 */
export const getRepeatObjectNameFromPaths = (paths: string[]) => {
    let repeatItem: string;
    for (let p of paths) {
        if (repeatItem) {
            break;
        }
        let g = _.groupBy(p);
        for (let k in g) {
            if (g[k].length > 1) {
                repeatItem = k;
                break;
            }
        }
    }
    return repeatItem;
}

abstract class SteedosObjectProperties {
    _id?: string
    name?: string
    extend?: string
    table_name?: string
    label?: string
    icon?: string
    enable_search?: boolean
    is_enable?: boolean
    enable_files?: boolean
    enable_tasks?: boolean
    enable_notes?: boolean
    enable_events?: boolean
    enable_api?: boolean  //TODO 未开放功能
    enable_share?: boolean
    enable_instances?: boolean
    enable_chatter?: boolean
    enable_audit?: boolean
    enable_trash?: boolean
    enable_space_global?: boolean
    enable_tree?: boolean
    enable_inline_edit?: boolean
    is_view?: boolean
    hidden?: boolean
    description?: string
    custom?: boolean
    owner?: string
    // triggers?: object
    sidebar?: object //TODO
    calendar?: object //TODO
    actions?: Dictionary<SteedosActionTypeConfig>
    fields?: Dictionary<SteedosFieldTypeConfig>
    listeners?: Dictionary<SteedosListenerConfig>
    list_views?: Dictionary<SteedosObjectListViewTypeConfig>
    permissions?: Dictionary<SteedosObjectPermissionTypeConfig>
    methods?: Dictionary<Function>
    fields_serial_number?: number
}



export interface SteedosObjectTypeConfig extends SteedosObjectProperties {
    __filename?: string
    name?: string
    datasource?: string
    fields: Dictionary<SteedosFieldTypeConfig>
    actions?: Dictionary<SteedosActionTypeConfig>
    listeners?: Dictionary<SteedosListenerConfig>
    permission_set?: Dictionary<SteedosObjectPermissionTypeConfig> //TODO remove ; 目前为了兼容现有object的定义保留
}

const _TRIGGERKEYS = ['beforeFind', 'beforeInsert', 'beforeUpdate', 'beforeDelete', 'afterFind', 'afterCount', 'afterFindOne', 'afterInsert', 'afterUpdate', 'afterDelete', 'beforeAggregate', 'afterAggregate']

const properties = ['label', 'icon', 'enable_search', 'sidebar', 'is_enable', 'enable_files', 'enable_tasks', 'enable_notes', 'enable_events', 'enable_api', 'enable_share', 'enable_instances', 'enable_chatter', 'enable_audit', 'enable_web_forms', 'enable_inline_edit', 'enable_approvals', 'enable_trash', 'enable_space_global', 'enable_tree', 'enable_workflow', 'is_view', 'hidden', 'description', 'custom', 'owner', 'methods', '_id', 'relatedList', 'fields_serial_number']

export class SteedosObjectType extends SteedosObjectProperties {

    private _schema: SteedosSchema;
    private _datasource: SteedosDataSourceType;
    public get datasource(): SteedosDataSourceType {
        return this._datasource;
    }
    private _name: string;
    private _fields: Dictionary<SteedosFieldType> = {};
    private _actions: Dictionary<SteedosActionType> = {};
    private _listeners: Dictionary<SteedosListenerConfig> = {};
    private _triggers: Dictionary<SteedosTriggerType> = {};
    private _list_views: Dictionary<SteedosObjectListViewType> = {};
    private _table_name: string;
    private _triggersQueue: Dictionary<Dictionary<SteedosTriggerType>> = {}
    private _idFieldName: string;
    private _idFieldNames: string[] = [];
    private _NAME_FIELD_KEY: string;
    private _masters: string[] = [];
    private _details: string[] = [];

    private _enable_audit: boolean;
    public get enable_audit(): boolean {
        return this._enable_audit;
    }
    public set enable_audit(value: boolean) {
        if (value && !this._datasource.enable_space) {
            throw new Error(`not support, please set ${this._name}.enable_audit to false or remove the enable_audit attribute`)
        }
        this._enable_audit = value;
    }

    private _enable_instances: boolean;
    public get enable_instances(): boolean {
        return this._enable_instances;
    }
    public set enable_instances(value: boolean) {
        if (value && !this._datasource.enable_space) {
            throw new Error(`not support, please set ${this._name}.enable_instances to false or remove the enable_instances attribute`)
        }
        this._enable_instances = value;
    }

    private _enable_trash: boolean;
    public get enable_trash(): boolean {
        return this._enable_trash;
    }
    public set enable_trash(value: boolean) {
        if (value && !this._datasource.enable_space) {
            throw new Error(`not support, please set ${this._name}.enable_trash to false or remove the enable_trash attribute`)
        }
        this._enable_trash = value;
    }

    private _enable_share;
    public get enable_share(): boolean {
        return this._enable_share;
    }
    public set enable_share(value: boolean) {
        if (value && !this._datasource.enable_space) {
            throw new Error(`not support, please set ${this._name}.enable_share to false or remove the enable_share attribute`)
        }
        this._enable_share = value;
    }

    public get NAME_FIELD_KEY(): string {
        return this._NAME_FIELD_KEY;
    }

    getMethod(method_name: string) {
        return this.methods[method_name]
    }

    public get idFieldName(): string {
        return this._idFieldName;
    }

    public get idFieldNames(): string[] {
        return this._idFieldNames;
    }

    public get masters(): string[] {
        return this._masters;
    }

    public get details(): string[] {
        return this._details;
    }

    private checkField() {
        let driverSupportedColumnTypes = this._datasource.adapter.getSupportedColumnTypes()
        _.each(this.fields, (field: SteedosFieldType, key: string) => {
            if (SteedosFieldDBType[field.fieldDBType] && !driverSupportedColumnTypes.includes(field.fieldDBType)) {
                throw new Error(`driver ${this._datasource.driver} can not support field ${key} config`)
            }
        })
    }

    constructor(object_name: string, datasource: SteedosDataSourceType, config: SteedosObjectTypeConfig) {
        super();
        this._name = object_name
        this._datasource = datasource
        this._schema = datasource.schema
        if (this._datasource.driver != SteedosDatabaseDriverType.MeteorMongo)
            this._enable_share = false

        if (/^[_a-zA-Z][_a-zA-Z0-9]*$/.test(object_name) != true) {
            throw new Error('invalid character, object_name can only be start with _ or a-zA-Z and contain only _ or _a-zA-Z0-9. you can set table_name');
        }

        if (config.table_name) {
            this._table_name = config.table_name
        } else {
            this._table_name = this._name
        }

        _.each(properties, (property) => {
            if (_.has(config, property)) {
                this[property] = config[property]
            }
        })

        _.each(config.fields, (field, field_name) => {
            this.setField(field_name, field)
        })

        this.checkField()

        _.each(config.actions, (action, action_name) => {
            this.setAction(action_name, action)
        })

        _.each(config.listeners, (listener, listener_name) => {
            this.setListener(listener_name, listener)
        })

        _.each(config.list_views, (list_view, name) => {
            this.setListView(name, list_view)
        })

        _.each(config.permissions, (permission, name) => {
            permission.name = name
            this.setPermission(permission)
        })

        //TODO remove ; 目前为了兼容现有object的定义保留
        _.each(config.permission_set, (permission, name) => {
            permission.name = name
            this.setPermission(permission)
        })

        if (this._datasource.driver == SteedosDatabaseDriverType.Mongo || this._datasource.driver == SteedosDatabaseDriverType.MeteorMongo) {
            this._idFieldName = '_id'
        }

        this.schema.setObjectMap(this.name, { datasourceName: this.datasource.name, _id: config._id })
    }

    setPermission(config: SteedosObjectPermissionTypeConfig) {
        this._datasource.setObjectPermission(this._name, config)
    }

    setListener(listener_name: string, config: SteedosListenerConfig) {
        this.listeners[listener_name] = config
        _TRIGGERKEYS.forEach((key) => {
            let event = config[key];
            if (_.isFunction(event)) {
                this.setTrigger(`${listener_name}_${event.name}`, key, event);
            }
        })
    }

    private setTrigger(name: string, when: string, todo: Function, on = 'server') {
        let triggerConfig: SteedosTriggerTypeConfig = {
            name: name,
            on: on,
            when: when,
            todo: todo,
        }
        let trigger = new SteedosTriggerType(triggerConfig)
        this.triggers[name] = trigger
        this.registerTrigger(trigger)
    }

    registerTrigger(trigger: SteedosTriggerType) {
        //如果是meteor mongo 则不做任何处理
        if (!_.isString(this._datasource.driver) || this._datasource.driver != SteedosDatabaseDriverType.MeteorMongo || trigger.when === 'beforeFind' || trigger.when === 'afterFind' || trigger.when === 'afterFindOne' || trigger.when === 'afterCount' || trigger.when === 'beforeAggregate' || trigger.when === 'afterAggregate') {
            if (!trigger.todo) {
                return;
            }
            if (!this._triggersQueue[trigger.when]) {
                this._triggersQueue[trigger.when] = {}
            }
            this._triggersQueue[trigger.when][trigger.name] = trigger
        }
    }

    unregisterTrigger(trigger: SteedosTriggerType) {
        delete this._triggersQueue[trigger.when][trigger.name]
    }

    private async runTirgger(trigger: SteedosTriggerType, context: SteedosTriggerContextConfig) {
        let object_name = this.name
        let event = trigger.todo
        let todoWrapper = async function (...args) {
            // Object.setPrototypeOf(thisArg, Object.getPrototypeOf(trigger))
            return await event.apply(thisArg, args)
        }
        let thisArg = {
            ...context,
            object_name: object_name,
            datasource_name: this._datasource.name,
            getObject: (object_name: string) => {
                return this._schema.getObject(object_name)
            }
        }

        return await todoWrapper.call(thisArg)
    }

    async runMeteorTriggers(when: string, context: SteedosTriggerContextConfig) {
        let triggers = this._triggersQueue[when]
        if (!triggers) {
            return;
        }

        let triggerKeys = _.keys(triggers)

        for (let index = 0; index < triggerKeys.length; index++) {
            let trigger = triggers[triggerKeys[index]];
            await this.runTirgger(trigger, context)
        }
    }

    async runTriggerActions(when: string, context: SteedosTriggerContextConfig) {
        let triggers = await this._schema.metadataBroker.call('triggers.filter', { objectApiName: this.name, when: when })
        if (_.isEmpty(triggers)) {
            return;
        }

        for (const trigger of triggers) {
            let params = generateActionParams(when, context); //参考sf
            try {
                await this._schema.metadataBroker.call(`${trigger.service.name}.${trigger.metadata.action}`, params)
            } catch (error) {
                console.error(error)
            }
        }

    }

    toConfig() {
        let config: JsonMap = {
            name: this.name,
            fields: {}
        }

        _.each(properties, (property) => {
            if (this[property] != null && this[property] != undefined) {
                config[property] = this[property]
            }
        })

        if (this.fields) {
            config.fields = {}
            _.each(this.fields, (field: SteedosFieldType, key: string) => {
                config.fields[key] = field.toConfig();
            })
        }

        if (this.list_views) {
            config.list_views = {}
            _.each(this.list_views, (list_view: SteedosObjectListViewType, key: string) => {
                config.list_views[key] = list_view.toConfig()
            })
        }

        if (this.actions) {
            config.actions = {}
            _.each(this.actions, (action: SteedosActionType, key: string) => {
                config.actions[key] = action.toConfig()
            })
        }

        if (this.triggers) {
            config.triggers = {}
            _.each(this.triggers, (trigger: SteedosTriggerType, key: string) => {
                config.triggers[key] = trigger.toConfig();
            })
        }

        let rolePermission = this.getObjectRolesPermission()
        if (rolePermission) {
            config.permission_set = {}
            _.each(rolePermission, (v, k) => {
                config.permission_set[k] = v
            })
        }

        return config
    }

    setField(field_name: string, fieldConfig: SteedosFieldTypeConfig) {
        let field = new SteedosFieldType(field_name, this, fieldConfig)
        this.fields[field_name] = field

        if (field.primary && this._datasource.driver != SteedosDatabaseDriverType.Mongo && this._datasource.driver != SteedosDatabaseDriverType.MeteorMongo) {
            this._idFieldName = field.name
            if (this._idFieldNames.indexOf(field.name) < 0) {
                this._idFieldNames.push(field.name);
            }
        }

        if (field.is_name) {
            this._NAME_FIELD_KEY = field_name
        } else if (field_name == 'name' && !this._NAME_FIELD_KEY) {
            this._NAME_FIELD_KEY = field_name
        }
    }

    getField(field_name: string) {
        return this.fields[field_name]
    }

    checkMasterDetails() {
        const mastersCount = this._masters.length;
        const detailsCount = this._details.length;
        if (mastersCount > 2) {
            throw new Error(`There are ${mastersCount} fields of type master_detail on the object '${this._name}', but only 2 fields are allowed at most.`);
        }
        else if (mastersCount > 1) {
            if (detailsCount > 0) {
                throw new Error(`There are ${mastersCount} fields of type master_detail on the object "${this._name}", but only 1 field are allowed at most, because this object is the master object of another object on a master-detail relationship.`);
            }
        }

        const detailPaths = this.getDetailPaths();

        /**
         * 去掉内核中判断主表子表层级限制判断，因为内核对象可能有需求不止要用3层，只保留零代码上触发器判断逻辑就行
         */
        // // 下面只需要写一个方向的层级if判断即可，不用向上和向下两边层级都判断，因为只要链条有问题，该链条任意一个对象都会报错，没必要让多个节点抛错
        // // 比如A-B-C-D-E这个链条超出最大层级数量，只要A对象向下取MaxDetailsLeave来判断就行，不必再判断E对象向上判断层级数量
        // const maxDetailLeave = this.getMaxDetailsLeave(detailPaths);
        // if(maxDetailLeave > MAX_MASTER_DETAIL_LEAVE){
        //     throw new Error(`It exceed the maximum depth of master-detail relationship for the detail side of the object '${this._name}', the paths is:${JSON.stringify(detailPaths)}`);
        // }

        // detailPaths中每个链条中不可以出现同名对象，理论上出现同名对象的话会死循环，上面的MAX_MASTER_DETAIL_LEAVE最大层级判断就已经会报错了
        const repeatName = getRepeatObjectNameFromPaths(detailPaths);
        if (repeatName) {
            throw new Error(`It meet one repeat object name '${repeatName}' in the master-detail relationships for the detail side of the object '${this._name}', the paths is:${JSON.stringify(detailPaths)}`);
        }
    }

    initMasterDetails() {
        _.each(this.fields, (field, field_name) => {
            if (field.type === "master_detail") {
                // 加try catch是因为有错误时不应该影响下一个字段逻辑
                try {
                    if (field.reference_to && typeof _.isString(field.reference_to)) {
                        if (field.reference_to === this._name) {
                            field.type = "lookup";//强行变更为最接近的类型
                            throw new Error(`Can't set a master-detail filed that reference to self on the object '${this._name}'.`);
                        }
                        const refObject = getObject(<string>field.reference_to);
                        if (refObject) {
                            const addSuc = this.addMaster(<string>field.reference_to);
                            if (addSuc) {
                                refObject.addDetail(this._name);
                                // #1435 对象是作为其他对象的子表的话，owner的omit属性必须为true
                                // 因很多应用目前已经放开了子表的omit属性，这里就不限制了，影响不大，只在零代码界面配置时限制
                                // if(!this.getField("owner").omit){
                                //     throw new Error(`The omit property of the owner field on the object '${this._name}' must be true, because there is a master-detail field named '${field.name}' on the object.`);
                                // }
                            }
                            else {
                                // 不能选之前已经在该对象上建过的主表-子表字段上关联的相同对象
                                field.type = "lookup";//强行变更为最接近的类型
                                throw new Error(`Can't set a master-detail filed that reference to the same object '${field.reference_to}' that had referenced to by other master-detail filed on the object '${this._name}'.`);
                            }
                        }
                        else {
                            throw new Error(`Can't find the reference_to object '${field.reference_to}' for the master_detail field of the object '${this._name}'`);
                        }
                    }
                }
                catch (ex) {
                    console.error(ex);
                }
            }
        });
    }

    getMaxDetailsLeave(paths?: string[]) {
        if (!paths) {
            paths = this.getDetailPaths();
        }
        return getMaxPathLeave(paths);
    }

    getMaxMastersLeave(paths?: string[]) {
        if (!paths) {
            paths = this.getMasterPaths();
        }
        return getMaxPathLeave(paths);
    }

    getDetailPaths() {
        let results = [];
        let loop = (master: string, details: string[], paths: string[], leave: number) => {
            paths.push(master);
            if (!details.length) {
                results.push(paths);
                return;
            }
            leave++;
            if (leave > MAX_MASTER_DETAIL_LEAVE + 3) {
                // 加这段逻辑是避免死循环，results最多只输出MAX_MASTER_DETAIL_LEAVE+3层
                console.error(`Meet max loop for the detail paths of ${this._name}`);
                return;
            }
            _.each(details, (n) => {
                const detailObject = getObject(n);
                if (detailObject) {
                    loop(n, detailObject.details, _.clone(paths), leave);
                }
                else {
                    throw new Error(`Can't find the detail object '${n}' for the master object '${master}' of a master-detail relationship.`);
                }
            });
        }
        // console.log("==getDetailPaths======", this._name);
        loop(this._name, this._details, [], 0);
        // console.log("==getDetailPaths=", JSON.stringify(results));
        return results;
    }

    getMasterPaths() {
        let results = [];
        let loop = (detail: string, masters: string[], paths: string[], leave: number) => {
            paths.push(detail);
            if (!masters.length) {
                results.push(paths);
                return;
            }
            leave++;
            if (leave > MAX_MASTER_DETAIL_LEAVE + 3) {
                // 加这段逻辑是避免死循环，results最多只输出MAX_MASTER_DETAIL_LEAVE+3层
                console.error(`Meet max loop for the detail paths of ${this._name}`);
                return;
            }
            _.each(masters, (n) => {
                const masterObject = getObject(n);
                if (masterObject) {
                    loop(n, masterObject.masters, _.clone(paths), leave);
                }
                else {
                    throw new Error(`Can't find the master object '${n}' for the detail object '${detail}' of a master-detail relationship.`);
                }
            });
        }
        // console.log("==getMasterPaths======", this._name);
        loop(this._name, this._masters, [], 0);
        // console.log("==getMasterPaths=", JSON.stringify(results));
        return results;
    }

    addMaster(object_name: string) {
        let index = this._masters.indexOf(object_name);
        if (index < 0) {
            this._masters.push(object_name);
            return true;
        }
        return false;
    }

    removeMaster(object_name: string) {
        let index = this._masters.indexOf(object_name);
        if (index >= 0) {
            this._masters.splice(index, 1);
        }
    }

    addDetail(object_name: string) {
        let index = this._details.indexOf(object_name);
        if (index < 0) {
            this._details.push(object_name);
            return true;
        }
        return false;
    }

    removeDetail(object_name: string) {
        let index = this._details.indexOf(object_name);
        if (index >= 0) {
            this._details.splice(index, 1);
        }
    }

    setListView(list_view_name: string, config: SteedosObjectListViewTypeConfig) {
        this.list_views[list_view_name] = new SteedosObjectListViewType(list_view_name, this, config)
    }

    setAction(action_name: string, actionConfig: SteedosActionTypeConfig) {
        this._actions[action_name] = new SteedosActionType(action_name, this, actionConfig)
    }

    getAction(action_name: string) {
        return this._actions[action_name]
    }

    //TODO 处理对象继承
    extend_TODO(config: SteedosObjectTypeConfig) {
        if (this.name != config.name)
            throw new Error("You can not extend on different object");

        // override each fields
        _.each(config.fields, (field, field_name) => {
            this.setField(field_name, field)
        })

        // override each actions
        // if (config.actions) {
        //     _.each(config.actions, (action) => {
        //         this.actions[action.name] = action
        //     })
        // }

        // override each triggers
        // if (config.triggers) {
        //     _.each(config.triggers, (trigger) => {
        //         this.triggers[trigger.name] = trigger
        //     })
        // }
    }

    getObjectRolesPermission(spaceId?: string) {
        let globalPermission = this._datasource.getObjectRolesPermission(this._name)
        if (spaceId) {
            let permission = this._datasource.getObjectSpaceRolesPermission(this._name, spaceId);
            if (!_.isEmpty(permission)) {
                return Object.assign({}, globalPermission || {}, permission);
            }
        }
        return globalPermission
    }

    async getUserObjectPermission(userSession: SteedosUserSession) {

        if (!userSession) {
            throw new Error('userSession is required')
        }

        let roles = userSession.roles
        let objectRolesPermission = this.getObjectRolesPermission(userSession.spaceId)

        let userObjectPermission = {
            allowRead: false,
            allowCreate: false,
            allowEdit: false,
            allowDelete: false,
            viewAllRecords: false,
            modifyAllRecords: false,
            viewCompanyRecords: false,
            modifyCompanyRecords: false,
            disabled_list_views: null,
            disabled_actions: null,
            unreadable_fields: null,
            uneditable_fields: null,
            unrelated_objects: null
        }

        if (_.isEmpty(roles)) {
            throw new Error('not find user permission');
        }

        roles.forEach((role) => {
            let rolePermission = objectRolesPermission[role]
            if (rolePermission) {
                _.each(userObjectPermission, (v, k) => {
                    let _v = rolePermission[k]
                    if (_.isBoolean(v)) {
                        if (v === false && _v === true) {
                            userObjectPermission[k] = _v
                        }
                    } else if ((_.isArray(v) || _.isNull(v))) {
                        if (!_.isArray(_v)) {
                            _v = []
                        }
                        if (_.isNull(v)) {
                            userObjectPermission[k] = _v
                        } else {
                            userObjectPermission[k] = _.intersection(v, _v)
                        }
                    }
                })
            }
        })


        userObjectPermission.disabled_list_views = userObjectPermission.disabled_list_views || []
        userObjectPermission.disabled_actions = userObjectPermission.disabled_actions || []
        userObjectPermission.unreadable_fields = userObjectPermission.unreadable_fields || []
        userObjectPermission.uneditable_fields = userObjectPermission.uneditable_fields || []
        userObjectPermission.unrelated_objects = userObjectPermission.unrelated_objects || []

        let spaceId = userSession.spaceId
        if (isTemplateSpace(spaceId)) {
            return Object.assign({}, userObjectPermission, { allowRead: true, viewAllRecords: true, viewCompanyRecords: true })
        }

        return userObjectPermission;
    }

    private async allowFind(userSession: SteedosUserSession) {
        if (!userSession)
            return true
        let userObjectPermission = await this.getUserObjectPermission(userSession)
        if (userObjectPermission.allowRead) {
            return true
        } else {
            return false
        }
    }

    private async allowInsert(userSession: SteedosUserSession) {
        if (!userSession)
            return true
        let userObjectPermission = await this.getUserObjectPermission(userSession)
        if (userObjectPermission.allowCreate) {
            return true
        } else {
            return false
        }
    }

    private async allowUpdate(userSession: SteedosUserSession) {
        if (!userSession)
            return true
        let userObjectPermission = await this.getUserObjectPermission(userSession)
        if (userObjectPermission.allowEdit) {
            return true
        } else {
            return false
        }
    }

    private async allowDelete(userSession: SteedosUserSession) {
        if (!userSession)
            return true
        let userObjectPermission = await this.getUserObjectPermission(userSession)
        if (userObjectPermission.allowDelete) {
            return true
        } else {
            return false
        }
    }

    async find(query: SteedosQueryOptions, userSession?: SteedosUserSession) {
        let clonedQuery = Object.assign({}, query);
        await this.processUnreadableField(userSession, clonedQuery);
        return await this.callAdapter('find', this.table_name, clonedQuery, userSession)
    }

    // 此函数支持driver: MeteorMongo
    async aggregate(query: SteedosQueryOptions, externalPipeline, userSession?: SteedosUserSession) {
        let clonedQuery = Object.assign({}, query);
        await this.processUnreadableField(userSession, clonedQuery);
        return await this.callAdapter('aggregate', this.table_name, clonedQuery, externalPipeline, userSession)
    }

    // 此函数支持driver: MeteorMongo
    async directAggregate(query: SteedosQueryOptions, externalPipeline: any[], userSession?: SteedosUserSession) {
        let clonedQuery = Object.assign({}, query);
        await this.processUnreadableField(userSession, clonedQuery);
        return await this.callAdapter('directAggregate', this.table_name, clonedQuery, externalPipeline, userSession)
    }

    // 此函数支持driver: MeteorMongo，类似于aggregate，其参数externalPipeline放在最前面而已
    async directAggregatePrefixalPipeline(query: SteedosQueryOptions, prefixalPipeline: any[], userSession?: SteedosUserSession) {
        let clonedQuery = Object.assign({}, query);
        await this.processUnreadableField(userSession, clonedQuery);
        return await this.callAdapter('directAggregatePrefixalPipeline', this.table_name, clonedQuery, prefixalPipeline, userSession)
    }

    async findOne(id: SteedosIDType, query: SteedosQueryOptions, userSession?: SteedosUserSession) {
        let clonedQuery = Object.assign({}, query);
        await this.processUnreadableField(userSession, clonedQuery);
        return await this.callAdapter('findOne', this.table_name, id, clonedQuery, userSession)
    }

    async insert(doc: Dictionary<any>, userSession?: SteedosUserSession) {
        return await this.callAdapter('insert', this.table_name, doc, userSession)
    }

    async update(id: SteedosIDType, doc: Dictionary<any>, userSession?: SteedosUserSession) {
        await this.processUneditableFields(userSession, doc)
        let clonedId = id;
        return await this.callAdapter('update', this.table_name, clonedId, doc, userSession)
    }

    async updateOne(id: SteedosIDType, doc: Dictionary<any>, userSession?: SteedosUserSession) {
        await this.processUneditableFields(userSession, doc)
        let clonedId = id;
        return await this.callAdapter('updateOne', this.table_name, clonedId, doc, userSession)
    }
    // 此函数支持driver: MeteorMongo、Mongo
    async updateMany(queryFilters: SteedosQueryFilters, doc: Dictionary<any>, userSession?: SteedosUserSession) {
        await this.processUneditableFields(userSession, doc)
        let clonedQueryFilters = queryFilters;
        return await this.callAdapter('updateMany', this.table_name, clonedQueryFilters, doc, userSession)
    }

    async delete(id: SteedosIDType, userSession?: SteedosUserSession) {
        let clonedId = id;
        return await this.callAdapter('delete', this.table_name, clonedId, userSession)
    }

    async directFind(query: SteedosQueryOptions, userSession?: SteedosUserSession) {
        let clonedQuery = Object.assign({}, query);
        await this.processUnreadableField(userSession, clonedQuery);
        return await this.callAdapter('directFind', this.table_name, clonedQuery, userSession)
    }

    async directInsert(doc: Dictionary<any>, userSession?: SteedosUserSession) {
        return await this.callAdapter('directInsert', this.table_name, doc, userSession)
    }

    async directUpdate(id: SteedosIDType, doc: Dictionary<any>, userSession?: SteedosUserSession) {
        await this.processUneditableFields(userSession, doc)
        let clonedId = id;
        return await this.callAdapter('directUpdate', this.table_name, clonedId, doc, userSession)
    }

    async directDelete(id: SteedosIDType, userSession?: SteedosUserSession) {
        let clonedId = id;
        return await this.callAdapter('directDelete', this.table_name, clonedId, userSession)
    }

    private isDirectCRUD(methodName: string) {
        return methodName.startsWith("direct");
    }


    async count(query: SteedosQueryOptions, userSession?: SteedosUserSession) {
        let clonedQuery = Object.assign({}, query);
        return await this.callAdapter('count', this.table_name, clonedQuery, userSession)
    }

    private async allow(method: string, userSession: SteedosUserSession) {
        if (_.isNull(userSession) || _.isUndefined(userSession)) {
            return true
        }
        if (method === 'find' || method === 'findOne' || method === 'count' || method === 'aggregate' || method === 'aggregatePrefixalPipeline') {
            return await this.allowFind(userSession)
        } else if (method === 'insert') {
            return await this.allowInsert(userSession)
        } else if (method === 'update' || method === 'updateOne' || method === 'updateMany') {
            return await this.allowUpdate(userSession)
        } else if (method === 'delete') {
            return await this.allowDelete(userSession)
        }
    }

    private async runBeforeTriggers(method: string, context: SteedosTriggerContextConfig) {
        if (method === 'count') {
            method = 'find';
        }
        let meteorWhen = `before${method.charAt(0).toLocaleUpperCase()}${_.rest([...method]).join('')}`
        let when = `before.${method}`;
        await this.runMeteorTriggers(meteorWhen, context);
        return await this.runTriggerActions(when, context)
    }

    private async runAfterTriggers(method: string, context: SteedosTriggerContextConfig) {
        let meteorWhen = `after${method.charAt(0).toLocaleUpperCase()}${_.rest([...method]).join('')}`
        let when = `after.${method}`;
        await this.runMeteorTriggers(meteorWhen, context);
        return await this.runTriggerActions(when, context)
    }

    private async getTriggerContext(when: string, method: string, args: any[]) {

        let userSession = args[args.length - 1]

        let context: SteedosTriggerContextConfig = { userId: userSession ? userSession.userId : undefined, spaceId: userSession ? userSession.spaceId : undefined }

        if (method === 'find' || method === 'findOne' || method === 'count') {
            context.query = args[args.length - 2]
        }

        if (method === 'aggregate' || method === 'aggregatePrefixalPipeline') {
            context.query = args[args.length - 3]
        }

        if (method === 'findOne' || method === 'update' || method === 'delete') {
            context.id = args[1]
        }

        if (method === 'insert' || method === 'update') {
            context.doc = args[args.length - 2]
        }

        if (when === 'after' && (method === 'update' || method === 'delete')) {
            context.previousDoc = await this.findOne(context.id, {}, userSession)
        }

        return context
    }

    private async processUnreadableField(userSession: SteedosUserSession, query: SteedosQueryOptions) {
        if (!userSession) {
            return
        }
        let userObjectPermission = await this.getUserObjectPermission(userSession)
        let userObjectUnreadableFields = userObjectPermission.unreadable_fields
        if (userObjectUnreadableFields.length > 0) {
            let queryFields = [];

            if (_.isArray(query.fields)) {
                queryFields = query.fields
            } else if (_.isString(query.fields)) {
                queryFields = query.fields.split(',')
            }

            if (!(query.fields && query.fields.length)) {
                queryFields = _.keys(this.toConfig().fields)
                _.each(queryFields, function (fieldName, index) {
                    if (fieldName && fieldName.indexOf("$") > -1) {
                        delete queryFields[index];
                    }
                })
                queryFields = _.compact(queryFields)
            }
            queryFields = _.difference(queryFields, userObjectUnreadableFields)

            if (queryFields.length < 1) {
                queryFields.push()
            }

            if (this.idFieldName) {
                queryFields.unshift(this.idFieldName)
                queryFields = _.compact(_.uniq(queryFields))
            }

            query.fields = queryFields.join(',')
        }
    }

    private async processUneditableFields(userSession: SteedosUserSession, doc: JsonMap) {
        // 后台直接去掉uneditable_fields相关判断逻辑
        // [签约对象同时配置了company_ids必填及uneditable_fields造成部分用户新建签约对象时报错 #192](https://github.com/steedos/steedos-project-dzug/issues/192)
        // if (!userSession) {
        //     return
        // }

        // let userObjectPermission = await this.getUserObjectPermission(userSession)
        // let userObjectUneditableFields = userObjectPermission.uneditable_fields

        // let intersection = _.intersection(userObjectUneditableFields, _.keys(doc))
        // if (intersection.length > 0) {
        //     throw new Error(`no permissions to edit fields ${intersection.join(', ')}`)
        // }

        // // _.each(userObjectUneditableFields, (name: string)=>{
        // //     delete doc[name]
        // // })
    }

    private async callAdapter(method: string, ...args: any[]) {

        const adapterMethod = this._datasource[method];
        if (typeof adapterMethod !== 'function') {
            throw new Error('Adapted does not support "' + method + '" method');
        }
        let allow = await this.allow(method, args[args.length - 1])
        if (!allow) {
            throw new Error('not find permission')
        }

        let objectName = args[0], recordId: string, doc: JsonMap;
        if (["insert", "update", "updateMany", "delete"].indexOf(method) > -1) {
            // 因下面的代码，比如函数dealWithMethodPermission可能改写args变量，所以需要提前从args取出对应变量值。
            if (method === "insert") {
                // 此处doc不带_id值，得执行完adapterMethod.apply后，doc中才有_id属性，所以这里的doc及recordId都不准确
                doc = args[1];
                recordId = <string>doc._id;
            }
            else {
                recordId = args[1];
                doc = args[2];
            }
        }

        // 判断处理工作区权限，公司级权限，owner权限
        if (this._datasource.enable_space) {
            this.dealWithFilters(method, args);
            await this.dealWithMethodPermission(method, args);
        }

        let returnValue: any;
        let userSession: SteedosUserSession;
        if (this.isDirectCRUD(method)) {
            userSession = args[args.length - 1]
            args.splice(args.length - 1, 1, userSession ? userSession.userId : undefined)
            returnValue = await adapterMethod.apply(this._datasource, args);
        } else {
            userSession = args[args.length - 1]
            let beforeTriggerContext = await this.getTriggerContext('before', method, args)
            await this.runBeforeTriggers(method, beforeTriggerContext)
            await runValidationRules(method, beforeTriggerContext, args[0], userSession)

            let afterTriggerContext = await this.getTriggerContext('after', method, args)
            let previousDoc = clone(afterTriggerContext.previousDoc);
            args.splice(args.length - 1, 1, userSession ? userSession.userId : undefined)
            returnValue = await adapterMethod.apply(this._datasource, args);
            if (method === 'find' || method == 'findOne' || method == 'count' || method == 'aggregate' || method == 'aggregatePrefixalPipeline') {
                let values = returnValue || {}
                if (method === 'count') {
                    values = returnValue || 0
                }
                Object.assign(afterTriggerContext, { data: { values: values } })
            }
            // console.log("==returnValue==", returnValue);
            if (method == "update") {
                if (returnValue) {
                    await this.runAfterTriggers(method, afterTriggerContext)
                }
            }
            else {
                await this.runAfterTriggers(method, afterTriggerContext)
            }
            await brokeEmitEvents(objectName, method, afterTriggerContext);
            if (method === 'find' || method == 'findOne' || method == 'count' || method == 'aggregate' || method == 'aggregatePrefixalPipeline') {
                if (_.isEmpty(afterTriggerContext.data) || (_.isEmpty(afterTriggerContext.data.values) && !_.isNumber(afterTriggerContext.data.values))) {
                    return returnValue
                } else {
                    return afterTriggerContext.data.values
                }
            }
            await new WorkflowRulesRunner({
                object_name: this.name,
                event: method,
                record: returnValue,
                user_session: userSession,
                previous_record: afterTriggerContext.previousDoc
            }).run();
            if (returnValue) {
                if (method === "insert") {
                    // 当为insert时，上面代码执行后的doc不带_id，只能从returnValue中取
                    doc = returnValue;
                    recordId = <string>doc._id;
                }
                // 一定要先运行公式再运行汇总，以下两个函数顺序不能反
                await this.runRecordFormula(method, objectName, recordId, doc, userSession);
                await this.runRecordSummaries(method, objectName, recordId, doc, previousDoc, userSession);
            }
        }
        return returnValue
    };

    private async runRecordFormula(method: string, objectName: string, recordId: string, doc: any, userSession: any) {
        if (["insert", "update", "updateMany"].indexOf(method) > -1) {
            if (method === "updateMany") {
                // TODO:暂时不支持updateMany公式计算，因为拿不到修改了哪些数据
                // let filters: SteedosQueryFilters = args[1];
                // await runManyCurrentObjectFieldFormulas(objectName, filters, userSession);
            }
            else {
                let currentUserId = userSession ? userSession.userId : undefined;
                await runCurrentObjectFieldFormulas(objectName, recordId, doc, currentUserId, true);
                if (method === "update") {
                    // 新建记录时肯定不会有字段被引用，不需要重算被引用的公式字段值
                    await runQuotedByObjectFieldFormulas(objectName, recordId, userSession);
                }
            }
        }
    }

    private async runRecordSummaries(method: string, objectName: string, recordId: string, doc: any, previousDoc: any, userSession: any) {
        if (["insert", "update", "updateMany", "delete"].indexOf(method) > -1) {
            if (method === "updateMany") {
                // TODO:暂时不支持updateMany汇总计算，因为拿不到修改了哪些数据
            }
            else {
                if (method === "insert") {
                    await runCurrentObjectFieldSummaries(objectName, recordId);
                }
                await runQuotedByObjectFieldSummaries(objectName, recordId, previousDoc, userSession);
            }
        }
    }

    /**
     * 把query.filters用formatFiltersToODataQuery转为odata query
     * 主要是为了把userSession中的utcOffset逻辑传入formatFiltersToODataQuery函数处理
     */
    private dealWithFilters(method: string, args: any[]) {
        let userSession = args[args.length - 1];
        if (userSession) {
            if (method === 'find' || method === 'count' || method === 'aggregate' || method === 'aggregatePrefixalPipeline') {
                let query = args[args.length - 2];
                if (method === 'aggregate' || method === 'aggregatePrefixalPipeline') {
                    query = args[args.length - 3];
                }
                if (query.filters && !_.isString(query.filters)) {
                    query.filters = formatFiltersToODataQuery(query.filters, userSession);
                }
            }
        }
    }

    private async dealWithMethodPermission(method: string, args: any[]) {
        let userSession = args[args.length - 1];
        if (userSession) {
            let spaceId = userSession.spaceId;
            let userId = userSession.userId;
            let objPm = await this.getUserObjectPermission(userSession);
            if (method === 'find' || method === 'count' || method === 'findOne' || method === 'aggregate' || method === 'aggregatePrefixalPipeline') {
                let query = args[args.length - 2];
                if (method === 'aggregate' || method === 'aggregatePrefixalPipeline') {
                    query = args[args.length - 3];
                }

                if (query.filters && !_.isString(query.filters)) {
                    query.filters = formatFiltersToODataQuery(query.filters);
                }

                if (this.table_name == 'cfs.files.filerecord' || this.table_name == 'cfs.instances.filerecord') {
                    return;
                }

                if (isCloudAdminSpace(spaceId)) {
                    return
                }

                let spaceFilter, companyFilter, ownerFilter, sharesFilter, clientFilter = query.filters, filters, permissionFilters = [], userFilters = [];

                if (spaceId) {
                    spaceFilter = `(space eq '${spaceId}')`;
                }

                if (spaceId && !objPm.viewAllRecords && objPm.viewCompanyRecords) { // 公司级
                    if (_.isEmpty(userSession.companies)) {
                        console.log('objPm', objPm);
                        throw new Error("user not belong any company!");
                    }
                    companyFilter = _.map(userSession.companies, function (comp: any) {
                        return `(company_id eq '${comp._id}') or (company_ids eq '${comp._id}')`
                    });
                }

                if (!objPm.viewAllRecords && !objPm.viewCompanyRecords && objPm.allowRead) { // owner
                    ownerFilter = `(owner eq '${userId}')`;
                }

                if (!objPm.viewAllRecords) {
                    sharesFilter = getUserObjectSharesFilters(this.name, userSession);
                }

                if (!_.isEmpty(companyFilter)) {
                    permissionFilters.push(`(${companyFilter.join(' or ')})`);
                }

                if (ownerFilter) {
                    permissionFilters.push(ownerFilter);
                }

                if (!_.isEmpty(sharesFilter)) {
                    permissionFilters.push(`(${sharesFilter.join(' or ')})`);
                }

                if (clientFilter) {
                    userFilters.push(clientFilter);
                }

                if (spaceFilter) {
                    userFilters.push(spaceFilter);
                }

                if (!userSession.is_space_admin && !_.isEmpty(permissionFilters)) {
                    filters = permissionFilters.join(' or ');
                }

                if (!_.isEmpty(userFilters)) {
                    filters = filters ? `(${filters}) and (${userFilters.join(' and ')})` : userFilters.join(' and ')
                }

                query.filters = filters;
            }
            else if (method === 'insert') {
                if (!objPm.allowCreate) {
                    throw new Error(`no ${method} permission!`);
                }
            }
            else if (method === 'update' || method === 'updateOne') {
                if (!objPm.allowEdit) {
                    throw new Error(`no ${method} permission!`);
                }
                let id = args[args.length - 3];
                if (!objPm.modifyAllRecords && objPm.modifyCompanyRecords) {
                    let companyFilters = _.map(userSession.companies, function (comp: any) {
                        return `(company_id eq '${comp._id}') or (company_ids eq '${comp._id}')`
                    }).join(' or ')
                    if (companyFilters) {
                        if (_.isString(id)) {
                            id = { filters: `(_id eq \'${id}\') and (${companyFilters})` }
                        }
                        else if (_.isObject(id)) {
                            if (id.filters && !_.isString(id.filters)) {
                                id.filters = formatFiltersToODataQuery(id.filters);
                            }
                            id.filters = id.filters ? `(${id.filters}) and (${companyFilters})` : `(${companyFilters})`;
                        }
                    }
                }
                else if (!objPm.modifyAllRecords && !objPm.modifyCompanyRecords && objPm.allowEdit) {
                    if (_.isString(id)) {
                        id = { filters: `(_id eq \'${id}\') and (owner eq \'${userId}\')` }
                    }
                    else if (_.isObject(id)) {
                        if (id.filters && !_.isString(id.filters)) {
                            id.filters = formatFiltersToODataQuery(id.filters);
                        }
                        id.filters = id.filters ? `(${id.filters}) and (owner eq \'${userId}\')` : `(owner eq \'${userId}\')`;
                    }
                }
                args[args.length - 3] = id;
            }
            else if (method === 'updateMany') {
                if (!objPm.modifyAllRecords && !objPm.modifyCompanyRecords) {
                    throw new Error(`no ${method} permission!`);
                }
                if (!objPm.modifyAllRecords && objPm.modifyCompanyRecords) {
                    let queryFilters = args[args.length - 3];
                    let companyFilters = _.map(userSession.companies, function (comp: any) {
                        return `(company_id eq '${comp._id}') or (company_ids eq '${comp._id}')`
                    }).join(' or ')
                    if (companyFilters) {
                        if (queryFilters && !_.isString(queryFilters)) {
                            queryFilters = formatFiltersToODataQuery(queryFilters);
                        }
                        queryFilters = queryFilters ? `(${queryFilters}) and (${companyFilters})` : `(${companyFilters})`;
                        args[args.length - 3] = queryFilters;
                    }
                }
            }
            else if (method === 'delete') {
                if (!objPm.allowDelete) {
                    throw new Error(`no ${method} permission!`);
                }
                let id = args[args.length - 2];
                if (!objPm.modifyAllRecords && objPm.modifyCompanyRecords) {
                    let companyFilters = _.map(userSession.companies, function (comp: any) {
                        return `(company_id eq '${comp._id}') or (company_ids eq '${comp._id}')`
                    }).join(' or ')
                    if (companyFilters) {
                        id = { filters: `(_id eq \'${id}\') and (${companyFilters})` };
                    }
                }
                else if (!objPm.modifyAllRecords && !objPm.modifyCompanyRecords) {
                    id = { filters: `(_id eq \'${id}\') and (owner eq \'${userId}\')` };
                }
                args[args.length - 2] = id;
            }

        }

    }

    /***** get/set *****/
    public get schema(): SteedosSchema {
        return this._schema;
    }

    public get name(): string {
        return this._name;
    }

    public get fields(): Dictionary<SteedosFieldType> {
        return this._fields;
    }

    public get actions(): Dictionary<SteedosActionType> {
        return this._actions;
    }

    public get triggers(): Dictionary<SteedosTriggerType> {
        return this._triggers;
    }

    public get listeners(): Dictionary<SteedosListenerConfig> {
        return this._listeners;
    }
    public set listeners(value: Dictionary<SteedosListenerConfig>) {
        this._listeners = value;
    }

    public get list_views(): Dictionary<SteedosObjectListViewType> {
        return this._list_views;
    }

    public get table_name(): string {
        return this._table_name;
    }

    public get primaryField(): SteedosFieldType {
        return this._fields[this._idFieldName];
    }

    public get primaryFields(): SteedosFieldType[] {
        return this._idFieldNames.map((fieldName) => {
            return this._fields[fieldName]
        });
    }
}

export function getObject(objectName: string, schema?: SteedosSchema) {
    return (schema ? schema : getSteedosSchema()).getObject(objectName);
}
