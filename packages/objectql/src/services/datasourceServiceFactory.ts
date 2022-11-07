/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-13 22:22:05
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-05 18:13:51
 * @Description: 
 */
import * as _ from 'underscore';
import { getDataSourceServiceName } from './index';
import { jsonToObject } from '../util/convert';
import { getDataSource } from '../types/datasource';
const LocalDataSourceServices = {};


export async function createDataSourceService(broker, dataSource) {
    const dataSourceName = dataSource.name;
    const serviceName = getDataSourceServiceName(dataSourceName);

    if (LocalDataSourceServices[serviceName]) {
        return;
    }

    let service = broker.createService({
        name: serviceName,
        dependencies: ["objects"],
        events: {
            [`${dataSourceName}.*.metadata.objects.inserted`]: {
                handler(ctx) {
                    let objectConfig = ctx.params.data;
                    console.log(`objectConfig======>`, objectConfig.name)
                    jsonToObject(objectConfig)
                    dataSource.initObject(objectConfig)
                    /**
                     * 每次都需要初始化，TypeORM不适用于微服务模式
                     */
                    dataSource.initTypeORM();
                }
            },
            [`${dataSourceName}.*.metadata.objects.deleted`]: {
                handler(ctx) {
                    if (this.timeoutId) {
                        clearTimeout(this.timeoutId);
                    }
                    this.timeoutId = setTimeout(function(){
                        try {
                            const datasource = getDataSource(dataSourceName);
                            if (datasource) {
                                datasource.flushCacheObjects();
                            }
                        } catch (error) {
                            console.error(error)
                        }
                    }, 1000 * 0.1);
                }
            },
        },
        async started() {
           setTimeout(async ()=>{
            const objects = await dataSource.getObjects(false);
            console.log(`started=======>objects.length`, objects.length)
            for (const object of objects) {
                if(object && object.metadata){
                    const objectConfig = object.metadata;
                    console.log(`started====>objectConfig======>`, objectConfig.name)
                    jsonToObject(objectConfig)
                    dataSource.initObject(objectConfig)
                }
            }
           }, 1000 * 5)
           
        },
    })
    if (!broker.started) { //如果broker未启动则手动启动service
        await broker._restartService(service)
    }
    await broker.waitForServices(service.name, null, 10);
    LocalDataSourceServices[serviceName] = true;
    return service
} 