/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 15:18:03
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-13 15:25:42
 * @Description: 
 */
import { fetchAPI } from './steedos.client';

export async function getPage(pageId, appId, objectName = '', recordId, formFactor = 'LARGE'){
    const APPS_API = `/api/pageSchema/app?app=${appId}&objectApiName=${objectName}&recordId=${recordId}&pageId=${pageId}&formFactor=${formFactor}`;
    const page = await fetchAPI(APPS_API);
    return page;
}