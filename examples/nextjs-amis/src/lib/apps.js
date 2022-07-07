/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-05 15:54:17
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-05 16:30:29
 * @Description: 
 */
import { fetchAPI } from './steedos.client';

export async function getApps(){
    const APPS_API = '/service/api/apps/menus';
    const apps = await fetchAPI(APPS_API);
    return apps;
}

export async function getApp(appName){
    const appApi = `/service/api/apps/${appName}/menus`;
    const app = await fetchAPI(appApi);
    return app;
}