import { JsonMap } from '@salesforce/ts-types';

/**
 * BaseConnectionOptions is set of connection options shared by all database types.
 */
export default interface DataSourceQueryOptions extends JsonMap {

    /**
     * Query options for top, fetch only the top number of data
     */
    readonly top?: number;

    /**
     * Query options for skip, fetch only the data after skip count
     */
    readonly skip?: number;

    /**
     * Query options for orderby, the sort of data for fetch
     */
    readonly orderby?: string;
    
}
