import { SteedosDataSourceTypeConfig, getSteedosSchema, SteedosDataSourceType } from "../";

export type Connection = SteedosDataSourceType;
export type ConnectionOptions = SteedosDataSourceTypeConfig;

export function getConnection(datasourceName: string) {
    if (!datasourceName)
        datasourceName = 'default';
    return getSteedosSchema().getDataSource(datasourceName);
}

export async function createConnection(options: ConnectionOptions): Promise<Connection> {
    if (!options.name)
        throw new Error("Connection name required.");
    return getSteedosSchema().addDataSource(options.name, options);
}