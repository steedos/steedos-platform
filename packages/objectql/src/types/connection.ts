import { SteedosDataSourceTypeConfig, getSteedosSchema, SteedosDataSourceType } from "../";
import { getSteedosConfig } from '../util';
import _ = require('lodash');

export type Connection = SteedosDataSourceType;
export type ConnectionOptions = SteedosDataSourceTypeConfig;

export function getConnection(datasourceName: string = "meteor") {
    return getSteedosSchema().getDataSource(datasourceName);
}


/**
 * Creates a new connection and registers it in the manager.
 * Only one connection from ormconfig will be created (name "default" or connection without name).
 */
export async function createConnection(): Promise<Connection>;

/**
 * Creates a new connection from the ormconfig file with a given name.
 */
export async function createConnection(name: string): Promise<Connection>;

/**
 * Creates a new connection and registers it in the manager.
 */
export async function createConnection(options: ConnectionOptions): Promise<Connection>;

/**
 * Creates a new connection and registers it in the manager.
 *
 * If connection options were not specified, then it will try to create connection automatically,
 * based on content of ormconfig (json/js/yml/xml/env) file or environment variables.
 * Only one connection from ormconfig will be created (name "default" or connection without name).
 */
export async function createConnection(optionsOrName?: any): Promise<Connection> {
    let connection: Connection;
    if (typeof optionsOrName === "string" || typeof optionsOrName === 'undefined')
    {
        connection =  getSteedosSchema().getDataSource(optionsOrName)
        if (connection) {
            connection.connect();
            return connection;
        } else 
            throw new Error (`Connection not found: ${optionsOrName}`)
    } else {
        let datasourceName: string = optionsOrName.name? optionsOrName.name : "default";
        connection =  getSteedosSchema().addDataSource(datasourceName, optionsOrName);
        connection.connect();
        return connection;
    }
}

export async function createConnections(optionsArray: ConnectionOptions[]): Promise<Connection[]> {

    let connections:Array<Connection> = []
    if (!optionsArray) {
        let _datasources = getSteedosSchema().getDataSources()
        _.each(_datasources, (connection, ds_name) => {
            connection.connect();
            connections.push(connection);
        })

    } else {
        optionsArray.forEach( async element => {
            let connection = await createConnection(element);
            connections.push(connection);
        });
    }
    return connections;
}

export const getConnectionOptions = async (connectionName: string = "meteor"): Promise<ConnectionOptions> => {
    let config:any = getSteedosConfig();
    if (config && config.datasources && config.datasources[connectionName] )
        return config.datasources[connectionName]
}

export const ConnectionManager = {
    async create(options){
        return createConnection(options)
    }
}

export const getConnectionManager = () => {
    return ConnectionManager;
}