/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-07-29 17:32:02
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-08-03 14:25:46
 * @Description: 
 */
import { LoadDashboardFile } from '@steedos/metadata-core';
import { registerDashboard } from '../metadata-register/dashboard';
const loadDashboard = new LoadDashboardFile();



// export const insertPackageDashBoardsToDB = async (packagePath: string, packageServiceName: string)=>{
//     try {
//         const { LoadDashboardFile, DashboardCollection } = require('@steedos/metadata-api');
//         const loadDashboardFile = new LoadDashboardFile();
//         const dashboardCollection = new DashboardCollection();
//         const dashBoards = loadDashboardFile.load(packagePath);

//         await dashboardCollection.deploy(dbManager, metatdataRecords);

//     } catch (error) {
        
//     }


// }

export const registerPackageDashboard = async (packagePath: string, packageServiceName: string) => {
    const metadata = loadDashboard.load(packagePath);
    const data = [];
    for (const apiName in metadata) {
        const item = metadata[apiName];
        data.push(Object.assign(item, {
            is_system: true, record_permissions: {
                allowEdit: false,
                allowDelete: false,
                allowRead: true,
            }
        }))
    }
    if (data.length > 0) {
        await registerDashboard.mregister(broker, packageServiceName, data)
    }
}

