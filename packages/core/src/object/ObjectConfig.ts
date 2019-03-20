import ObjectConfigOptions from "./ObjectConfigOptions";
var util = require("../util");
var clone = require("clone")
/**
 * Connection is a single database ORM connection to a specific database.
 * Its not required to be a database connection, depend on database type it can create connection pool.
 * You can have multiple connections to multiple databases in your application.
 */
export default class ObjectConfig {

    extend(options: ObjectConfigOptions) {
        let destination = clone(options);
        util.extend(destination, this.config);
        this.config = destination;
    }

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(options: ObjectConfigOptions) {
        this.name = options.name;
        this.config = options;
        this.configOptions.push(options);
    }

    // -------------------------------------------------------------------------
    // Public Readonly Properties
    // -------------------------------------------------------------------------
    /**
     * object name.
     */
    readonly name: string;

    /**
     * ObjectSchema options.
     */
    readonly configOptions: ObjectConfigOptions[] = [];
    config: ObjectConfigOptions;
    
}
