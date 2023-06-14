/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-10 09:51:51
 * @Description: 
 */
import * as _ from 'underscore';

export * from './objectTranslation';
export * from './translation';
export * from './templates/objectTranslation';
export * from './templates/translation';

const getOption = function (option) {
    var foo;
    foo = option.split(":");
    if (foo.length > 1) {
        return {
            label: foo[0],
            value: foo[1]
        };
    } else {
        return {
            label: foo[0],
            value: foo[0]
        };
    }
};

export const convertObject = function (object: StringMap) {
    _.forEach(object.fields, function (field, key) {
        let _options = [];
        if (field.options && _.isString(field.options)) {
            try {
                //支持\n或者英文逗号分割,
                _.forEach(field.options.split("\n"), function (option) {
                    var options;
                    if (option.indexOf(",")) {
                        options = option.split(",");
                        _.forEach(options, function (_option) {
                            return _options.push(getOption(_option));
                        });
                    } else {
                        _options.push(getOption(option));
                    }
                });
                field.options = _options;
            } catch (error) {
                console.error("convertFieldsOptions error: ", field.options, error);
            }
        }else if(field.options && _.isArray(field.options)){
            try {
                _.forEach(field.options, function(option){
                    if(_.isString(option)){
                        _options.push(getOption(option))
                    }else{
                        _options.push(option)
                    }
                })
                field.options = _options;
            } catch (error) {
                console.error("Creator.convertFieldsOptions", field.options, error)
            }
        }else if (field.options && !_.isFunction(field.options) && !_.isArray(field.options) && _.isObject(field.options)) {
            _.each(field.options, function (v, k) {
                return _options.push({
                    label: v,
                    value: k
                });
            });
            field.options = _options;
        }
    })
}

export enum SteedosTranslationPrefixKeys {
    Object = 'CustomObject',
    Field = 'CustomField',
    Action = 'CustomAction',
    Listview = 'CustomListview',
    Permission = 'CustomPermission',
    ValidationRule = 'CustomValidationRule',
    Application = 'CustomApplication',
    Tab = 'CustomTabs',
    Permissionset = 'CustomPermissionset',
    Profile = 'CustomProfile',
    Report = 'CustomReport',
    Workflow = 'Workflow',
    Layout = 'Layout',
    Client = 'Client',
    Server = 'Server',
    Function = 'Function',
    Router = 'Router',
    Trigger = 'Trigger'
}