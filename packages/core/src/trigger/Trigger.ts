import { JsonMap } from '@salesforce/ts-types';

/**
 * Connection is a single database ORM connection to a specific database.
 * Its not required to be a database connection, depend on database type it can create connection pool.
 * You can have multiple connections to multiple databases in your application.
 */
export abstract class Trigger {

    constructor(options: JsonMap) {
        if (!this.listenTo())
            throw new Error("You must specify listenTo() for this trigger.")
    }

	listenTo(){
        return null
    };
    
    readonly object_name: string;

    abstract beforeInsert(userId: string, doc: JsonMap): any

    abstract beforeUpdate(userId: string, doc: JsonMap, fieldNames:string[], modifier: JsonMap, options: JsonMap): any

    abstract beforeDelete(userId: string, doc: JsonMap): any

    abstract afterInsert(userId: string, doc: JsonMap): any

    abstract afterUpdate(userId: string, doc: JsonMap, fieldNames:string[], modifier: JsonMap, options: JsonMap): any
    
    abstract afterDelete(userId: string, doc: JsonMap): any
}
