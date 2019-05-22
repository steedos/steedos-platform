export type SteedosQueryFilters = any

/**
 * FindOptions is set of connection options shared by all database types.
 */
export type SteedosQueryOptions = {

    fields?: Array<string> | string; //['字段名1', '字段名2'] || '字段名1, 字段名2'

    readonly filters?: SteedosQueryFilters;

    /**
     * Query options for top, fetch only the top number of data
     */
    readonly top?: number;

    /**
     * Query options for skip, fetch only the data after skip count
     */
    readonly skip?: number;

    /**
     * Query options for sort, the sort of data for fetch
     */
    readonly sort?: string;

    
}