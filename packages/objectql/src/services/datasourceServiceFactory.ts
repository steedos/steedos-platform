import * as _ from 'underscore';
import { getDataSourceServiceName } from './index';
import { jsonToObject } from '../util/convert';
const LocalDataSourceServices = {};


export async function createDataSourceService(broker, dataSource) {
    const dataSourceName = dataSource.name;
    const serviceName = getDataSourceServiceName(dataSourceName);

    if (LocalDataSourceServices[serviceName]) {
        return;
    }

    let service = broker.createService({
        name: serviceName,
        events: {
            [`${dataSourceName}.*.metadata.objects.inserted`]: {
                handler(ctx) {
                    let objectConfig = ctx.params.data;
                    jsonToObject(objectConfig)
                    dataSource.initObject(objectConfig)
                    /**
                     * 每次都需要初始化，TypeORM不适用于微服务模式
                     */
                    dataSource.initTypeORM();
                }
            }
        }
    })
    if (!broker.started) { //如果broker未启动则手动启动service
        await broker._restartService(service)
    }
    await broker.waitForServices(service.name, null, 10);
    LocalDataSourceServices[serviceName] = true;
    return service
} 