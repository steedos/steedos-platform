import { SteedosDataSourceTypeConfig, getSteedosSchema, SteedosDataSourceType } from "../";
import { getSteedosConfig } from '../util';

export type Connection = SteedosDataSourceType;
export type ConnectionOptions = SteedosDataSourceTypeConfig;

export function getConnection(datasourceName: string = "default") {
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
    if (typeof optionsOrName === "string")
    {
        connection =  getSteedosSchema().getDataSource(optionsOrName)
    } else {
        let datasourceName: string = optionsOrName.name? optionsOrName.name : "default";
        connection =  getSteedosSchema().addDataSource(datasourceName, optionsOrName);
    }

    connection.connect();
    return connection;
}

export async function createConnections(optionsArray: Array<ConnectionOptions>): Promise<Array<Connection>> {
    let connections:Array<Connection> = []
    optionsArray.forEach( async element => {
        let connection = await createConnection(element);
        connections.push(connection);
    });
    return connections;
}

export const getConnectionOptions = async (connectionName: string = "default"): Promise<ConnectionOptions> => {
    let config:any = getSteedosConfig();
    if (config && config.datasources && config.datasources[connectionName] )
        return config.datasources[connectionName]
}