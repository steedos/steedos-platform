/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-03-27 15:42:20
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-03-28 11:35:16
 * @Description: 
 */

import * as faker from 'faker/locale/zh_CN'; 

export const generateSubscriberK6ChildInsertDoc = () => ({
    name: `K6_TEST - ${faker.name.firstName()} ${faker.name.lastName()}`,
    number: faker.datatype.float()
});