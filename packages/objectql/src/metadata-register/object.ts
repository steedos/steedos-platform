// import { createObjectService } from './objectServiceManager';
// import { getObjectServiceName } from '../services/index';
import * as _ from 'underscore';
const clone = require('clone');

export async function registerObject(broker, serviceName, objectConfig) {
    // const serviceName = getObjectServiceName(objectConfig.name);
    const metadata = clone(objectConfig);
    delete metadata.triggers
    const res = await broker.call("objects.add", {data: metadata}, {meta: {
        caller: {
            nodeID: broker.nodeID,
            service: {
                name: serviceName,
                // version: broker.service.version, TODO
                // fullName: broker.service.fullName, TODO
            }
        }
    }});
    // if (res) { //TODO  && objectConfig.hidden != true
    //    await createObjectService(broker, serviceName, objectConfig)
    // }
    return res;
}

export async function addObjectConfig(broker, serviceName, objectConfig) {
    let metadata = clone(objectConfig);
    delete metadata.triggers;
    delete metadata.listeners;
    delete metadata.methods;
    objectToJson(metadata);
    const res = await broker.call("objects.addConfig", {data: metadata}, {meta: {
        metadataServiceName: serviceName,
        caller: {
            nodeID: broker.nodeID
        }
    }});
    return res;
}

export async function getObjectsConfig(broker, datasourceName){
    const objectsConfig = await broker.call('objects.getAll', {datasource: datasourceName})
    _.map(objectsConfig, (metadataConfig)=>{
        if(metadataConfig && metadataConfig.metadata){
            jsonToObject(metadataConfig.metadata)
        }
    })
    return objectsConfig;
}

export async function removeObject(broker, objectApiName) {
    // const serviceName = getObjectServiceName(objectConfig.name);
    const res = await broker.call("objects.delete", {objectApiName: objectApiName}, {meta: {
        caller: {
            nodeID: broker.nodeID,
        }
    }});
    return res;
}

function funEval (funStr){
	try{
		return eval(funStr)
	}catch (e){
		console.error(e, funStr);
	}
};

export function jsonToObject(objectMetadata){
    _.forEach(objectMetadata.fields, (field, key)=>{
        const _reference_to = field._reference_to;
        if(_reference_to && _.isString(_reference_to)){
            field.reference_to = funEval(`(${_reference_to})`);
        }
    })
}

/**
 * 对objectConfig中的function属性做toString()处理
 * This method mutates objectConfig.
 * @param objectConfig 
 * @returns objectConfig
 */
function objectToJson(objectConfig){
    _.forEach(objectConfig.actions, (action, key)=>{
        const _todo = action?.todo
        if(_todo && _.isFunction(_todo)){
            action._todo = _todo.toString()
        }
        const _visible = action?.visible
        if(_visible && _.isFunction(_visible)){
            action._visible = _visible.toString()
        }
    })

    _.forEach(objectConfig.fields, (field, key)=>{

        const options = field.options
        if(options && _.isFunction(options)){
            field._options = field.options.toString()
        }

        if(field.regEx){
            field._regEx = field.regEx.toString();
        }
        if(_.isFunction(field.min)){
            field._min = field.min.toString();
        }
        if(_.isFunction(field.max)){
            field._max = field.max.toString();
        }
        if(field.autoform){
            const _type = field.autoform.type;
            if(_type && _.isFunction(_type) && _type != Object && _type != String && _type != Number && _type != Boolean && !_.isArray(_type)){
                field.autoform._type = _type.toString();
            }
        }
        const optionsFunction = field.optionsFunction;
        const reference_to = field.reference_to;
        const createFunction = field.createFunction;
        const beforeOpenFunction = field.beforeOpenFunction;
        const filtersFunction = field.filtersFunction;
        if(optionsFunction && _.isFunction(optionsFunction)){
            field._optionsFunction = optionsFunction.toString()
        }
        if(reference_to && _.isFunction(reference_to)){
            field._reference_to = reference_to.toString()
        }
        if(createFunction && _.isFunction(createFunction)){
            field._createFunction = createFunction.toString()
        }
        if(beforeOpenFunction && _.isFunction(beforeOpenFunction)){
            field._beforeOpenFunction = beforeOpenFunction.toString()
        }
        if(filtersFunction && _.isFunction(filtersFunction)){
            field._filtersFunction = filtersFunction.toString()
        }


        const defaultValue = field.defaultValue
        if(defaultValue && _.isFunction(defaultValue)){
            field._defaultValue = field.defaultValue.toString()
        }

        const is_company_limited = field.is_company_limited;
        if(is_company_limited && _.isFunction(is_company_limited)){
            field._is_company_limited = field.is_company_limited.toString()
        }
    })

    _.forEach(objectConfig.list_views, (list_view, key)=>{
        if(_.isFunction(list_view.filters)){
            list_view._filters = list_view.filters.toString()
        }else if(_.isArray(list_view.filters)){
            _.forEach(list_view.filters, (filter, _index)=>{
                if(_.isArray(filter)){
                    if(filter.length == 3 && _.isFunction(filter[2])){
                        filter[2] = filter[2].toString()
						filter[3] = "FUNCTION"
                    }else if(filter.length == 3 && _.isDate(filter[2])){
                        filter[3] = "DATE"
                    }
                }else if(_.isObject(filter)){
                    if(_.isFunction(filter?.value)){
                        filter._value = filter.value.toString()
                    }else if(_.isDate(filter?.value)){
                        filter._is_date = true
                    }
                }
            })
        }
    })

    if(objectConfig.form && !_.isString(objectConfig.form)){
        objectConfig.form = JSON.stringify(objectConfig.form, (key, val)=>{
            if(_.isFunction(val))
                return val + '';
            else
                return val;
        })
    }

    _.forEach(objectConfig.relatedList, (relatedObjInfo)=>{
        if(_.isObject(relatedObjInfo)){
            _.forEach(relatedObjInfo, (val, key)=>{
                if(key == 'filters' && _.isFunction(val)){
                    relatedObjInfo[key] = val.toString();
                }
            })
        }
    })

    return objectConfig;
}