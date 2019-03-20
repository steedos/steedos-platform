var path = require("path");
var util = require("../util");
import { getFromContainer } from "../container";


import ObjectSchema from "./ObjectSchema";
import ObjectSchemaOptions from "./ObjectSchemaOptions";

import { JsonMap, getString } from '@salesforce/ts-types';
import { Validators } from '../validator';

import { getCreator } from '../index';
/**
 * ConnectionManager is used to store and manage multiple orm connections.
 * It also provides useful factory methods to simplify connection creation.
 */
export default class ObjectSchemaManager {

    // -------------------------------------------------------------------------
    // Protected Properties
    // -------------------------------------------------------------------------

    /**
     * List of connections registered in this connection manager.
     */
    public readonly objectSchemas: ObjectSchema[] = [];

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    
    /**
     * Checks if connection with the given name exist in the manager.
     */
    has(name: string): boolean {
        return !!this.objectSchemas.find(object => object.name === name);
    }

    /**
     * Gets registered connection with the given name.
     * If connection name is not given then it will get a default connection.
     * Throws error if connection with the given name was not found.
     */
    get(name: string = "default"): ObjectSchema {
        const objectSchema = this.objectSchemas.find(object => object.name === name);
        if (!objectSchema)
            throw new Error(name);

        return objectSchema;
    };

    /**
     * Creates a new connection based on the given connection options and registers it in the manager.
     * Connection won't be established, you'll need to manually call connect method to establish connection.
     */
    create(options: ObjectSchemaOptions): ObjectSchema {

        this.validate(options);

        // check if such connection is already registered
        let existSchema = this.objectSchemas.find(objectSchema => objectSchema.name === (options.name || "default"));
        if(options.extend){
            let extendSchema = this.objectSchemas.find(objectSchema => objectSchema.name === (options.extend || "default"));
            if(extendSchema){
                let objectSchema = new ObjectSchema(options);
                objectSchema.extend(extendSchema.schema)
                this.objectSchemas.push(objectSchema);
                this.registerCreator(objectSchema.schema);
                return objectSchema;
            }else{
                throw new Error("Object schema not exists");
            }
        }else if (existSchema) {
            // if its registered but closed then simply remove it from the manager
            if (!options.extend)
                throw new Error("Object schema exists, do you want to extend?");
            // else{
            //     existSchema.extend(options);
            //     this.registerCreator(existSchema.schema);
            // }
        }else{
            // create a new objectSchema
            let objectSchema = new ObjectSchema(options);
            this.objectSchemas.push(objectSchema);
            this.registerCreator(objectSchema.schema);
            return objectSchema;
        }
    };

    createFromFile(filePath: string): ObjectSchema {
        let options: ObjectSchemaOptions = util.loadFile(filePath);
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
    
    validate(options: ObjectSchemaOptions): boolean {
        return Validators.steedosObjectSchema(options);
    };

    remove(name: string) {
        const existSchema = this.objectSchemas.find(objectSchema => objectSchema.name === name);
        if (existSchema) {
            // if its registered but closed then simply remove it from the manager
            this.objectSchemas.splice(this.objectSchemas.indexOf(existSchema), 1);
        }
    };
    
    loadStandardObjects() {
        this.createFromFile(path.resolve(__dirname, "../../standard/objects/spaces.yml"))
        this.createFromFile(path.resolve(__dirname, "../../standard/objects/users.yml"))
        this.createFromFile(path.resolve(__dirname, "../../standard/objects/organizations.yml"))
        this.createFromFile(path.resolve(__dirname, "../../standard/objects/space_users.yml"))
        this.createFromFile(path.resolve(__dirname, "../../standard/objects/apps.yml"))
    }


}



/**
 * Gets a ObjectSchemaManager which creates object schema.
 */
export function getObjectSchemaManager(): ObjectSchemaManager {
    return getFromContainer(ObjectSchemaManager);
}
