export * from './objectServiceDispatcher';
export * from './objectService';

export * from './datasourceServiceFactory';
export * from './objectServiceFactory';

export function getObjectServiceName(objectApiName: string){
    return `@${objectApiName}`;
}

export function getDataSourceServiceName(dataSource: string) {
    return `~dataSource-${dataSource}`;
}