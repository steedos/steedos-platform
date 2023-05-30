import _ = require('lodash');
import { getLazyLoadFields } from './field';
import { getLazyLoadButtons } from './button';
import { addObjectConfig } from './core';
import { loadObjectMethods } from './method';
import { addPermissionConfig, getLazyLoadPermissions } from './permission';
import { objectToJson } from '../utils/convert';
import { registerPermissionFields } from '../metadata-register/permissionFields';
import { MetadataRegister } from '../metadata-register';
var util = require('../util');
var clone = require('clone');

/***
 * 此文件应该迁移到metadata/core中：系统的结构为所有元数据加载都有metadata/core处理，这样metadata的处理就集中了，规则也就一致了，目前metadata core、objectql各自维护一套。
 */
const getListenTo = function (json) {
    if (!json.listenTo) {
        console.log('json', json);
        throw new Error('missing attribute listenTo');
    }

    if (!_.isString(json.listenTo) && !_.isFunction(json.listenTo)) {
        throw new Error('listenTo must be a function or string')
    }

    let listenTo: string = '';

    if (_.isString(json.listenTo)) {
        listenTo = json.listenTo
    } else if (_.isFunction(json.listenTo)) {
        listenTo = json.listenTo()
    }
    return listenTo;
}

const loadPackageObjects = function (filePath: string) {
    const objectJsons = util.loadObjects(filePath);
    return objectJsons;
}

const loadPackageFields = function (filePath: string) {
    const fieldJsons = util.loadFields(filePath);
    return fieldJsons;
}

const loadPackageListViews = function (filePath: string) {
    let listViewJsons = util.loadListViews(filePath);
    return listViewJsons;
}

const loadPackageButtons = function (filePath: string) {
    let buttonJsons = util.loadButtons(filePath);
    return buttonJsons;
}

const loadPackageActions = function (filePath: string) {
    let actions = util.loadActions(filePath);
    return _.map(actions, actionToMetadata);
}

const loadPackageActionScripts = function (filePath: string) {
    let buttonScripts = util.loadButtonScripts(filePath);
    return _.map(buttonScripts, actionToMetadata);
}

const actionToMetadata = (config) => {
    const actions = {};
    let object_name = getListenTo(config);
    const keys = _.keys(config);
    _.each(keys, (key) => {
        if (key.endsWith('Visible')) {
            if (_.isFunction(config[key])) {
                const _key = key.replace(/(.*)Visible/, '$1');
                if (!actions[_key]) {
                    actions[_key] = {};
                }
                actions[_key]._visible = config[key].toString();
            }
        } else {
            if (_.isFunction(config[key])) {
                if (!actions[key]) {
                    actions[key] = {};
                }
                actions[key].todo = config[key].toString();
                actions[key]._todo = config[key].toString();
            }
        }
    })
    return { object_name, actions };
}

const loadPackagePermissions = function (filePath: string) {
    let permissions = util.loadPermissions(filePath);
    return _.map(permissions, (permission) => {
        delete permission.field_permissions;
        return permission;
    });
}

const registerPackageFieldPermissions = async function (filePath: string, broker, serviceName: string) {
    let permissions = util.loadPermissions(filePath);
    permissions.forEach(permission => {
        addPermissionConfig(permission.object_name, permission);
    });

    const data = [];

    for (const permission of permissions) {
        const { field_permissions } = permission;
        if (field_permissions && _.isArray(field_permissions) && field_permissions.length > 0) {
            for (const field_permission of field_permissions) {
                data.push({
                    "name": `${permission.name}.${permission.object_name}.${field_permission.field}`,
                    "permission_set_id": permission.name,
                    "permission_object": `${permission.name}_${permission.object_name}`,
                    "object_name": permission.object_name,
                    "field": field_permission.field,
                    "readable": field_permission.readable,
                    "editable": field_permission.editable,
                    "is_system": true,
                })
            }
        }
    }
    if (data.length > 0) {
        return await registerPermissionFields.mregister(broker, serviceName, data);
    }
}

async function addObjectConfigs(broker, serviceName, objectConfigs) {
    if(_.isEmpty(objectConfigs)){
        return ;
    }
    let metadatas = clone(objectConfigs);
    _.map(metadatas, (metadata) => {
        delete metadata.triggers;
        delete metadata.listeners;
        delete metadata.methods;
        objectToJson(metadata);
    })
    const res = await broker.call("objects.addConfigs", { data: metadatas }, {
        meta: {
            metadataServiceName: serviceName,
            caller: {
                nodeID: broker.nodeID
            }
        }
    });
    return res;
}

/**
 * 加载软件包下的所有元数据
 * 1 在内存中合并所有对象元数据并发送: object.yml 、field.yml、.listview.yml、.button.yml、TODO .action.yml
 * 2 TODO 其他元数据发送
 * @param packagePath 软件包路径
 * @param datasource 软件数据源
 * @param serviceName 软件包服务名称
 */
export const loadPackageMetadatas = async function (packagePath: string, datasource: string, serviceName?: string) {
    let packageObjects = loadPackageObjects(packagePath);
    const packageFields = loadPackageFields(packagePath);
    const packageListviews = loadPackageListViews(packagePath);
    const packageButtons = loadPackageButtons(packagePath);
    const packageActions = loadPackageActions(packagePath);
    const packageActionScripts = loadPackageActionScripts(packagePath);
    const packagePermissions = loadPackagePermissions(packagePath);

    const packageObjectApiNames = _.map(packageObjects, 'name');

    packageObjects = _.map(packageObjects, (packageObject) => {
        _.map(packageFields, (field) => {
            if (field && field.object_name == packageObject.name) {
                packageObject = _.defaultsDeep(packageObject, { fields: { [field.name]: field } }, packageObject);
            }
        })
        _.map(packageListviews, (listview) => {
            if (listview && listview.object_name == packageObject.name) {
                packageObject = _.defaultsDeep(packageObject, { list_views: { [listview.name]: listview } }, packageObject);
            }
        })

        _.map(packageButtons, (button) => {
            if (button && button.object_name == packageObject.name) {
                packageObject = _.defaultsDeep(packageObject, { actions: { [button.name]: button } }, packageObject);
            }
        })

        _.map(packageActions, (action) => {
            if (action && action.object_name == packageObject.name) {
                packageObject = _.defaultsDeep(packageObject, { actions: action.actions }, packageObject);
            }
        })

        _.map(packageActionScripts, (actionScript) => {
            if (actionScript && actionScript.object_name == packageObject.name) {
                packageObject = _.defaultsDeep(packageObject, { actions: actionScript.actions }, packageObject);
            }
        })

        _.map(packagePermissions, (permission) => {
            if (permission && permission.object_name == packageObject.name) {
                packageObject = _.defaultsDeep(packageObject, { permission_set: { [permission.name]: permission } }, packageObject);
            }
        })
        return packageObject;
    })
    for (const element of packageObjects) {
        if (datasource) {
            element.datasource = datasource
        }
        if (!element.extend) {
            element.isMain = true;
        }
        if(!_.has(element, 'extend')){
            let startNo = 10;
            _.each(element.fields, function (field) {
                if (!_.has(field, 'sort_no')) {
                    field.sort_no = startNo;
                    startNo = startNo + 10;
                }
                if((field.type === 'lookup' || field.type === 'master_detail') && field.reference_to ==='users'){
                    if(element.name != 'space_users' && field.name != 'user'){
                        field.reference_to = 'space_users';
                        field.reference_to_field = 'user';
                    }
                }
            })
        }
        
        if (!element.fields) {
            element.fields = {}
        }
        _.each(getLazyLoadFields(element.name), function (field) {
            util.extend(element.fields, { [field.name]: field })
        });
        _.each(element.fields, (field)=>{
            if(field.omit === true && !_.has(field, 'hidden')){
                field.hidden = true;
            }
        })
        if (!element.actions) {
            element.actions = {}
        }
        _.each(getLazyLoadButtons(element.name), function (action) {
            util.extend(element.actions, { [action.name]: action })
        })
        let _mf = _.maxBy(_.values(element.fields), function (field) { return field.sort_no; });
        if (_mf && element.name) {
            element.fields_serial_number = _mf.sort_no + 10;
        }

        if (!element.permission_set) {
            element.permission_set = {}
        }
        _.each(getLazyLoadPermissions(element.name), function (permission) {
            util.extend(element.permission_set, {[permission.name]: permission})
        })
        addObjectConfig(element, datasource, null);
    }

    if(broker){

        // loadObjectTriggers(packagePath, serviceName);
        //此功能不支持微服务模式
        loadObjectMethods(packagePath);

        await addObjectConfigs(broker, serviceName, packageObjects);
        if (serviceName) {
            for await (const packageField of packageFields) {
                if (packageField && !_.includes(packageObjectApiNames, packageField.object_name)) {

                    await MetadataRegister.addObjectConfig(serviceName, Object.assign({ extend: packageField.object_name }, {
                        fields: {
                            [packageField.name]: packageField
                        }
                    }));
                }
            }

            for await (const packageListview of packageListviews) {
                if (packageListview && !_.includes(packageObjectApiNames, packageListview.object_name)) {
                    await MetadataRegister.addObjectConfig(serviceName, Object.assign({ extend: packageListview.object_name }, {
                        list_views: {
                            [packageListview.name]: packageListview
                        }
                    }));
                }
            }

            for await (const packageButton of packageButtons) {
                if (packageButton && !_.includes(packageObjectApiNames, packageButton.object_name)) {
                    await MetadataRegister.addObjectConfig(serviceName, Object.assign({ extend: packageButton.object_name }, {
                        actions: {
                            [packageButton.name]: packageButton
                        }
                    }));
                }
            }

            for await (const packageAction of packageActions) {
                if (packageAction && !_.includes(packageObjectApiNames, packageAction.object_name)) {
                    await MetadataRegister.addObjectConfig(serviceName, Object.assign({ extend: packageAction.object_name }, {
                        actions: packageAction.actions
                    }));
                }
            }

            for await (const packageActionScript of packageActionScripts) {
                if (packageActionScript && !_.includes(packageObjectApiNames, packageActionScript.object_name)) {
                    await MetadataRegister.addObjectConfig(serviceName, Object.assign({ extend: packageActionScript.object_name }, {
                        actions: packageActionScript.actions
                    }));
                }
            }

            for await (const permission of packagePermissions) {
                if (permission && !_.includes(packageObjectApiNames, permission.object_name)) {
                    await MetadataRegister.addObjectConfig(serviceName, Object.assign({ extend: permission.object_name }, {
                        permission_set: {
                            [permission.name]: permission
                        }
                    }));
                }
            }
        }

        await registerPackageFieldPermissions(packagePath, broker, packagePath)
    }
}