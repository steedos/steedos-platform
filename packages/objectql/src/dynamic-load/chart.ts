import { LoadChartFile } from '@steedos/metadata-core';
import { registerChart } from '../metadata-register/chart';
import { getSteedosSchema } from '../types'
const loadChartFile = new LoadChartFile();

export const registerPackageCharts = async (packagePath: string, packageServiceName: string)=>{
    const charts = loadChartFile.load(packagePath);
    const schema = getSteedosSchema();
    for (const apiName in charts) {
        const chart = charts[apiName];
        await registerChart.register(schema.broker, packageServiceName, Object.assign(chart, {is_system:true, record_permissions: {
            allowEdit: false,
            allowDelete: false,
            allowRead: true,
        }}))
    }
}