/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-02-28 09:25:02
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-04-23 11:30:57
 * @Description: 
 */
export * from './datasourceServiceFactory';

export function getObjectServiceName(objectApiName: string){
    return `@${objectApiName}`;
}

export function getDataSourceServiceName(dataSource: string) {
    return `~dataSource-${dataSource}`;
}