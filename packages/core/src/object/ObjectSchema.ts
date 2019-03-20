import ObjectConfig from "./ObjectConfig";
var util = require("../util");
var clone = require("clone")
/**
 * Connection is a single database ORM connection to a specific database.
 * Its not required to be a database connection, depend on database type it can create connection pool.
 * You can have multiple connections to multiple databases in your application.
 */
export default class ObjectSchema {

    extend(options: ObjectConfig) {
        let destination = clone(options);
        util.extend(destination, this.schema);
        this.schema = destination;
    }

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(options: ObjectConfig) {
        this.name = options.name;
        this.schema = options;
        this.options.push(options);
    }

    // -------------------------------------------------------------------------
    // Public Readonly Properties
    // -------------------------------------------------------------------------
    /**
     * Connection name.
     */
    readonly name: string;

    /**
     * ObjectSchema options.
     */
    readonly options: ObjectConfig[] = [];
    schema: ObjectConfig;
}
