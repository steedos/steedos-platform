import { JsonMap } from '@salesforce/ts-types';

/**
 * BaseConnectionOptions is set of connection options shared by all database types.
 */
export default interface ObjectConfigOptions extends JsonMap {

    /**
     * Schema name.
     * Different schemas must have different names.
     */
    readonly name: string;
    
    /**
     * Schema extended from.
     * Steedos will merge properties with parent schema(s).
     */
    readonly extend: string;
    
}
