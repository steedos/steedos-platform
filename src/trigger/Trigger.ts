import { JsonMap } from '@salesforce/ts-types';

/**
 * Connection is a single database ORM connection to a specific database.
 * Its not required to be a database connection, depend on database type it can create connection pool.
 * You can have multiple connections to multiple databases in your application.
 */
export abstract class Trigger {


    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(options: JsonMap) {
    }

    // -------------------------------------------------------------------------
    // Public Readonly Properties
    // -------------------------------------------------------------------------
    
    /**
     * Trigger name.
     */
    readonly name: string; 
    
    /**
    * Object name.
    */
    readonly object_name: string;

    beforeInsert(userId: string, doc: JsonMap) {

	}

    /* 
    Fired before the doc is updated.

    Allows you to to change the modifier as needed, or run additional functionality.
    - this.transform() obtains transformed version of document, if a transform was defined.
    */
    beforeUpdate(userId: string, doc: JsonMap, fieldNames:string[], modifier: JsonMap, options: JsonMap) {

	}

    beforeDelete(userId: string, doc: JsonMap) {

	}

    afterInsert(userId: string, doc: JsonMap) {
	}

    afterUpdate(userId: string, doc: JsonMap, fieldNames:string[], modifier: JsonMap, options: JsonMap) {
	}
    
    afterDelete(userId: string, doc: JsonMap) {
	}
}
