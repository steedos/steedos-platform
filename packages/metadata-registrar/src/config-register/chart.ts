/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-27 11:48:22
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-27 11:48:40
 * @Description: 
 */
import { LoadChartFile } from '@steedos/metadata-core';
import { registerChart } from '../metadata-register/chart';
const loadChartFile = new LoadChartFile();

export const registerPackageCharts = async (packagePath: string, packageServiceName: string)=>{
    const charts = loadChartFile.load(packagePath);
    const data = [];
    for (const apiName in charts) {
        const chart = charts[apiName];
        data.push(Object.assign(chart, {
            is_system: true, record_permissions: {
            allowEdit: false,
            allowDelete: false,
            allowRead: true,
        }}))
    }
    if (data.length > 0) {
        await registerChart.mregister(broker, packageServiceName, data)
    }
}