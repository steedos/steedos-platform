import * as _ from 'lodash';

function funEval(funStr) {
    try {
        return eval(funStr)
    } catch (e) {
        console.error(e, funStr);
    }
};

export function jsonToObject(objectMetadata) {
    _.forEach(objectMetadata.fields, (field, key) => {
        const _reference_to = field._reference_to;
        if (_reference_to && _.isString(_reference_to)) {
            field.reference_to = funEval(`(${_reference_to})`);
        }
    })
}

export function objectToJson(objectConfig) {
    _.forEach(objectConfig.actions, (action, key) => {
        const _todo = action?.todo
        if (_todo && _.isFunction(_todo)) {
            action.todo = _todo.toString()
            action._todo = _todo.toString()
        }
        const _visible = action?.visible
        if (_visible && _.isFunction(_visible)) {
            action._visible = _visible.toString()
        }
    })

    _.forEach(objectConfig.fields, (field, key) => {

        const options = field.options
        if (options && _.isFunction(options)) {
            field._options = field.options.toString()
        }

        if (field.regEx) {
            field._regEx = field.regEx.toString();
        }
        if (_.isFunction(field.min)) {
            field._min = field.min.toString();
        }
        if (_.isFunction(field.max)) {
            field._max = field.max.toString();
        }
        if (field.autoform) {
            const _type = field.autoform.type;
            if (_type && _.isFunction(_type) && _type != Object && _type != String && _type != Number && _type != Boolean && !_.isArray(_type)) {
                field.autoform._type = _type.toString();
            }
        }
        const optionsFunction = field.optionsFunction;
        const reference_to = field.reference_to;
        const createFunction = field.createFunction;
        const beforeOpenFunction = field.beforeOpenFunction;
        const filtersFunction = field.filtersFunction;
        if (optionsFunction && _.isFunction(optionsFunction)) {
            field._optionsFunction = optionsFunction.toString()
        }
        if (reference_to && _.isFunction(reference_to)) {
            field._reference_to = reference_to.toString()
        }
        if (createFunction && _.isFunction(createFunction)) {
            field._createFunction = createFunction.toString()
        }
        if (beforeOpenFunction && _.isFunction(beforeOpenFunction)) {
            field._beforeOpenFunction = beforeOpenFunction.toString()
        }
        if (filtersFunction && _.isFunction(filtersFunction)) {
            field._filtersFunction = filtersFunction.toString()
        }


        const defaultValue = field.defaultValue
        if (defaultValue && _.isFunction(defaultValue)) {
            field._defaultValue = field.defaultValue.toString()
        }

        const is_company_limited = field.is_company_limited;
        if (is_company_limited && _.isFunction(is_company_limited)) {
            field._is_company_limited = field.is_company_limited.toString()
        }
    })

    _.forEach(objectConfig.list_views, (list_view, key) => {
        if (_.isFunction(list_view.filters)) {
            list_view._filters = list_view.filters.toString()
        } else if (_.isArray(list_view.filters)) {
            _.forEach(list_view.filters, (filter: any, _index) => {
                if (_.isArray(filter)) {
                    if (filter.length == 3 && _.isFunction(filter[2])) {
                        filter[2] = filter[2].toString()
                        filter[3] = "FUNCTION"
                    } else if (filter.length == 3 && _.isDate(filter[2])) {
                        filter[3] = "DATE"
                    }
                } else if (_.isObject(filter)) {
                    if (_.isFunction((filter as any)?.value)) {
                        (filter as any)._value = (filter as any).value.toString()
                    } else if (_.isDate((filter as any)?.value)) {
                        (filter as any)._is_date = true
                    }
                }
            })
        }

        // 兼容列表视图共享规则原shared字段，改为shared_to，且优先认shared_to
        // 因为列表视图权限中依然保留了shared为true表示共享的规则，所以shared_to有值的情况下还要同步shared属性值
        if (list_view.shared_to === "mine" || list_view.shared_to === "organizations") {
            list_view.shared = false;
        }
        else if (list_view.shared_to === "space") {
            list_view.shared = true;
        }
        else {
            list_view.shared_to = "space";
        }
    })

    if (objectConfig.form && !_.isString(objectConfig.form)) {
        objectConfig.form = JSON.stringify(objectConfig.form, (key, val) => {
            if (_.isFunction(val))
                return val + '';
            else
                return val;
        })
    }

    _.forEach(objectConfig.relatedList, (relatedObjInfo) => {
        if (_.isObject(relatedObjInfo)) {
            _.forEach(relatedObjInfo, (val: any, key) => {
                if (key == 'filters' && _.isFunction(val)) {
                    relatedObjInfo[key] = val.toString();
                }
            })
        }
    })

    return objectConfig;
}