/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-09 16:16:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-01-20 15:03:09
 * @Description: 
 */
import * as _ from 'underscore';
import { getDataSourceServiceName } from './index';
import { jsonToObject } from '../util/convert';
import { getDataSource } from '../types/datasource';
import { addOriginalObjectConfigs, getOriginalObjectConfig } from '@steedos/metadata-registrar';

const clone = require('clone');

const LocalDataSourceServices = {};


export async function createDataSourceService(broker, dataSource) {
    const dataSourceName = dataSource.name;
    const serviceName = getDataSourceServiceName(dataSourceName);

    if (LocalDataSourceServices[serviceName]) {
        return;
    }

    const actions: any = {};

    if(dataSourceName === 'default'){
        actions.encryptValue = {
			async handler(ctx) {
				const { value } = ctx.params;
				return await dataSource.adapter.encryptValue(value);
			}
        }
    }

    let service = broker.createService({
        name: serviceName,
        events: {
            [`${dataSourceName}.*.metadata.objects.inserted`]: {
                async handler(ctx) {
                    let objectConfig = ctx.params.data;
                    jsonToObject(objectConfig)

                    if(!getOriginalObjectConfig(objectConfig.name)){
                        // 此处的objectConfig是已继承了base之后的结果. 已无法识别出原始定义.
                        addOriginalObjectConfigs(objectConfig.name, dataSourceName, clone(objectConfig));
                    }
                    
                    dataSource.initObject(objectConfig)
                    /**
                     * 每次都需要初始化，TypeORM不适用于微服务模式
                     */
                    await dataSource.initTypeORM();
                }
            },
            [`${dataSourceName}.*.metadata.objects.deleted`]: {
                handler(ctx) {
                    try {
                        // console.log(`${dataSourceName} removeLocalObject`, ctx.params.objectApiName)
                        getDataSource(dataSourceName).removeLocalObject(ctx.params.objectApiName)
                    } catch (error) {
                        console.error(error)
                    }

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
        actions: actions
    })
    if (!broker.started) { //如果broker未启动则手动启动service
        await broker._restartService(service)
    }
    await broker.waitForServices(service.name, null, 10);
    LocalDataSourceServices[serviceName] = true;
    return service
} 