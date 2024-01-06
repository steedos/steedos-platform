import * as _ from "lodash";
import { METADATA_TYPE } from "..";
import { getDBType } from "./fields";
import { generateObjectTranslationTemplate } from './translationTemplate';
const clone = require("clone");

export const SYSTEM_DATASOURCE = "__SYSTEM_DATASOURCE";
export const MONGO_BASE_OBJECT = "__MONGO_BASE_OBJECT";
export const SQL_BASE_OBJECT = "__SQL_BASE_OBJECT";

export function getObjectServiceName(objectApiName: string) {
    return `@${objectApiName}`;
}

function isExpried(expiredAt: number) {
    return expiredAt <= new Date().getTime();
}

const BASE_OBJECT_CACHE = {
    [MONGO_BASE_OBJECT]: {
        data: null,
    },
    [SQL_BASE_OBJECT]: {
        data: null,
    }
};

async function getBaseObjectConfig(ctx, datasourceName) {
    const serviceName = "*";
    const metadataType = METADATA_TYPE;
    let metadataApiName = SQL_BASE_OBJECT;
    if (datasourceName === "default" || datasourceName === "meteor") {
        metadataApiName = MONGO_BASE_OBJECT;
    }

    const cacheData = BASE_OBJECT_CACHE[metadataApiName];
    if (cacheData && cacheData.data && isExpried(cacheData.expiredAt)) {
        return cacheData.data;
    }

    const configs = await ctx.broker.call(`metadata.getServiceMetadatas`, {
        serviceName,
        metadataType,
        metadataApiName: metadataApiName,
    }, {meta: ctx.meta});

    const config = configs && configs.length > 0 ? configs[0]?.metadata : null;
    BASE_OBJECT_CACHE[metadataApiName] = {
        data: config,
        expiredAt: new Date().getTime() + 10 * 1000
    }

    return config;
}

async function getObjectConfigs(ctx, objectApiName) {
    const serviceName = "*";
    const metadataType = METADATA_TYPE;
    const objectConfigs = await ctx.broker.call(
        `metadata.getServiceMetadatas`,
        {
            serviceName,
            metadataType,
            metadataApiName: objectApiName,
        }, {meta: ctx.meta}
    );
    // console.log(`getObjectConfigs ==== `, getObjectConfigs.length);
    const configs = [];
    _.each(objectConfigs, (item)=>{
        if(item.metadata){
            item.metadata.__timestamp = item.timestamp;
            configs.push(item.metadata) //_.map(objectConfigs, "metadata")
        }else{
            configs.push(item.metadata)
        }
    })
    return _.compact(configs);
}

function getObjectDatasource(objectConfigs: Array<any>) {
    const config = _.find(objectConfigs, function(objectConfig) {
        return objectConfig?.datasource;
    });
    // if(!config){
    //     console.log(`getObjectDatasource`, _.map(objectConfigs, 'name'))
    // }
    return config?.datasource;
}

// async function refreshFields() {

// }

// async function refreshActions() {

// }

// async function refreshListViews() {

// }

// async function refreshListViews() {

// }

// async function refreshPermission() {

// }

export async function getOriginalObject(ctx, objectApiName) {
    let objectConfig: any = {};

    const objectConfigs = await getObjectConfigs(ctx, objectApiName);

    if (objectConfigs.length == 0) {
        return null;
    }

    objectConfig = _.defaultsDeep(
        {},
        ..._.reverse(objectConfigs),
        objectConfig
    );

    const _objectConfig = _.clone(objectConfig);

    objectConfig.fields = _.clone(_objectConfig.fields);

    objectConfig = _.defaultsDeep({}, clone(_objectConfig), objectConfig);

    _.each(objectConfig.fields, function(field, field_name) {
        if (field.is_name) {
            objectConfig.NAME_FIELD_KEY = field_name;
        } else if (field_name == "name" && !objectConfig.NAME_FIELD_KEY) {
            objectConfig.NAME_FIELD_KEY = field_name;
        }
    });
    return objectConfig;
}

function listviewDefaultsDeep(object, ...sources) {
    const objectProto = Object.prototype
    /** Used to check objects for own properties. */
    const hasOwnProperty = objectProto.hasOwnProperty
    object = Object(object.list_views)
    sources.forEach(({ list_views: source }) => {
        if (source != null) {
            source = Object(source)
            for (const key in source) {
                const value = object[key]
                if (value === undefined ||
                    (_.eq(value, objectProto[key]) && !hasOwnProperty.call(object, key))) {
                    object[key] = source[key]
                }
            }
        }
    })
    return object
}

export async function refreshObject(ctx, objectApiName) {
    let objectConfig: any = {};

    const objectConfigs = await getObjectConfigs(ctx, objectApiName);
    if (objectConfigs.length == 0) {
        // console.log(`refreshObject objectConfigs`, objectConfigs.length)
        return null;
    }

    const objectDatasource = getObjectDatasource(objectConfigs);

    const baseObjectConfig = await getBaseObjectConfig(ctx, objectDatasource);
    if (baseObjectConfig) {
        delete baseObjectConfig.datasource;
        delete baseObjectConfig.hidden;
    }

    const mainConfigs = _.filter(objectConfigs, (conf) => {
        return conf.isMain;
    });

    let mainConfig = null;

    if (mainConfigs.length == 1) {
        mainConfig = mainConfigs[0];
    } else if (mainConfigs.length > 1) {
        let dbMainConfig = _.find(mainConfigs, (conf) => {
            return _.has(conf, "_id") && !_.has(conf, "__filename");
        });
        if (dbMainConfig) {
            delete dbMainConfig.isMain;
        }

        mainConfig = _.find(mainConfigs, (conf) => {
            return conf.isMain;
        });

        if (!mainConfig) {
            mainConfig = mainConfigs[0];
        }
    }

    if (!mainConfig) {
        return null;
    }

    objectConfig = _.defaultsDeep(
        {},
        ..._.sortBy(objectConfigs, function(o) {
            return o.isMain ? 1 : -1;
        }),
        objectConfig
    );

    const _objectConfig = _.clone(objectConfig);

    objectConfig.fields = _.clone(_objectConfig.fields);

    if (
        objectApiName != MONGO_BASE_OBJECT &&
        objectApiName != SQL_BASE_OBJECT
    ) {
        _.each(objectConfig.actions, (action) => {
            if (!_.has(action, "_visible") && _.has(action, "visible")) {
                action._visible = `
                    function(){ 
                        return ${action.visible} 
                    }
                `;
            }
        });
    }

    await generateObjectTranslationTemplate(ctx.broker, _.defaultsDeep(
        {},
        clone(_objectConfig),
        objectConfig
    ));

    objectConfig = _.defaultsDeep(
        {},
        clone(_objectConfig),
        baseObjectConfig,
        objectConfig
    );
    
    objectConfig.originalFields = _.keys(_objectConfig.fields)

    objectConfig.list_views = listviewDefaultsDeep({ list_views: {} }, ..._.sortBy(objectConfigs, function (o) {
        return o.isMain ? 1 : (-o.__timestamp || -1);
    }))

    if(objectDatasource == "default" || objectDatasource == "meteor"){
        objectConfig.idFieldName = '_id';
        objectConfig.idFieldNames = ['_id'];
    }

    _.each(objectConfig.fields, function(field, field_name) {
        if (objectDatasource != "default" && objectDatasource != "meteor") {
            if (field.primary) {
                objectConfig.idFieldName = field.name;
                if (!objectConfig.idFieldNames) {
                    objectConfig.idFieldNames = [];
                }
                if (objectConfig.idFieldNames.indexOf(field.name) < 0) {
                    objectConfig.idFieldNames.push(field.name);
                }
            }
            if (
                !field.fieldDBType &&
                objectApiName != MONGO_BASE_OBJECT &&
                objectApiName != SQL_BASE_OBJECT
            ) {
                try {
                    field.fieldDBType = getDBType(objectApiName, field);
                } catch (error) {
                    console.log(`error`, error);
                }
            }

            if (field.generated) {
                field.omit = true;
            }
        }
        if (field.is_name) {
            objectConfig.NAME_FIELD_KEY = field_name;
        } else if (field_name == "name" && !objectConfig.NAME_FIELD_KEY) {
            objectConfig.NAME_FIELD_KEY = field_name;
        }
    });

    _.each(objectConfig.actions, (action, key) => {
        if (!_.has(action, "name")) {
            action.name = key;
        }
    });

    objectConfig.datasource = mainConfig.datasource;

    try {
        const maxSortNoField = _.maxBy(_.values(objectConfig.fields), function(
            field
        ) {
            return field.sort_no;
        });
        if (maxSortNoField) {
            objectConfig.fields_serial_number = maxSortNoField.sort_no;
        }
    } catch (error) {
        console.log(`refreshObject error`, error)
    }

    if(!objectConfig.table_name){
        objectConfig.table_name = objectConfig.name;
    }

    

    if(objectConfig && objectConfig.__deleted){
        if(objectConfig.__deleted.fields && _.isArray(objectConfig.__deleted.fields)){
            _.each(objectConfig.__deleted.fields, (fieldName)=>{
                try {
                    delete objectConfig.fields[fieldName]
                } catch (error) {
                    
                }
            })
        }

        if(objectConfig.__deleted.actions && _.isArray(objectConfig.__deleted.actions)){
            _.each(objectConfig.__deleted.actions, (actionName)=>{
                try {
                    delete objectConfig.actions[actionName]
                } catch (error) {
                    
                }
            })
        }

        delete objectConfig.__deleted
    }

    return objectConfig;
}
