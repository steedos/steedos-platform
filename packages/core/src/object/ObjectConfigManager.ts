var path = require("path");
var util = require("../util");
import { getFromContainer } from "../container";


import ObjectConfig from "./ObjectConfig";
import ObjectConfigOptions from "./ObjectConfigOptions";

import { JsonMap, getString } from '@salesforce/ts-types';
import { Validators } from '../validator';

import { getCreator } from '../index';
/**
 * ConnectionManager is used to store and manage multiple orm connections.
 * It also provides useful factory methods to simplify connection creation.
 */
export default class ObjectConfigManager {

    // -------------------------------------------------------------------------
    // Protected Properties
    // -------------------------------------------------------------------------

    /**
     * List of connections registered in this connection manager.
     */
    public readonly objectConfigs: ObjectConfig[] = [];

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Checks if connection with the given name exist in the manager.
     */
    has(name: string): boolean {
        return !!this.objectConfigs.find(object => object.name === name);
    }

    /**
     * Gets registered connection with the given name.
     * If connection name is not given then it will get a default connection.
     * Throws error if connection with the given name was not found.
     */
    get(name: string = "default"): ObjectConfig {
        const objectConfig = this.objectConfigs.find(object => object.name === name);
        if (!objectConfig)
            throw new Error(name);

        return objectConfig;
    };

    /**
     * Creates a new connection based on the given connection options and registers it in the manager.
     * Connection won't be established, you'll need to manually call connect method to establish connection.
     */
    create(options: any): ObjectConfig {

        this.validate(options);

        // check if such connection is already registered
        let existConfig = this.objectConfigs.find(objectConfig => objectConfig.name === (options.name || "default"));
        if (options.extend) {
            let extendConfig = this.objectConfigs.find(objectConfig => objectConfig.name === (options.extend || "default"));
            if (extendConfig) {
                let objectConfig = new ObjectConfig(options);
                objectConfig.extend(extendConfig.config)
                this.objectConfigs.push(objectConfig);
                this.registerCreator(objectConfig.config);
                return objectConfig;
            } else {
                throw new Error("Object config not exists");
            }
        } else if (existConfig) {
            // if its registered but closed then simply remove it from the manager
            if (!options.extend)
                throw new Error("Object config exists, do you want to extend?");
            // else{
            //     existConfig.extend(options);
            //     this.registerCreator(existConfig.config);
            // }
        } else {
            // create a new objectConfig
            let objectConfig = new ObjectConfig(options);
            this.objectConfigs.push(objectConfig);
            this.registerCreator(objectConfig.config);
            return objectConfig;
        }
    };

    createFromFile(filePath: string): ObjectConfig {
        let options: ObjectConfigOptions = util.loadFile(filePath);
        return this.create(options);
    };

    registerCreator(json: JsonMap) {
        let _id = getString(json, "_id") || getString(json, "name");
        if (_id) {
            let Creator = getCreator();
            if ((typeof Creator !== "undefined") && Creator.Objects) {
                Creator.Objects[_id] = json;
                Creator.loadObjects(json)
            }
        }
    };

    validate(options: ObjectConfigOptions): boolean {
        return Validators.steedosObjectConfig(options);
    };

    remove(name: string) {
        const existConfig = this.objectConfigs.find(objectConfig => objectConfig.name === name);
        if (existConfig) {
            // if its registered but closed then simply remove it from the manager
            this.objectConfigs.splice(this.objectConfigs.indexOf(existConfig), 1);
        }
    };

    loadStandardObjects() {
        let standardObjectsDir = path.dirname(require.resolve("@steedos/standard-objects"))
        if (standardObjectsDir) {
            this.createFromFile(path.join(standardObjectsDir, "spaces.object.yml"))
            this.createFromFile(path.join(standardObjectsDir, "users.object.yml"))
            this.createFromFile(path.join(standardObjectsDir, "organizations.object.yml"))
            this.createFromFile(path.join(standardObjectsDir, "space_users.object.yml"))
            this.createFromFile(path.join(standardObjectsDir, "apps.object.yml"))
            this.createFromFile(path.join(standardObjectsDir, "object_webhooks.object.yml"))
        }

    }


}



/**
 * Gets a ObjectConfigManager which creates object config.
 */
export function getObjectConfigManager(): ObjectConfigManager {
    return getFromContainer(ObjectConfigManager);
}
