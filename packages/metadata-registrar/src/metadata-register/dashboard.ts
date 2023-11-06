/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-08-01 10:39:16
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-08-03 14:24:08
 * @Description: 
 */
import { RegisterBase } from "./_base";
const SERVICE_NAME = 'dashboard';
class RegisterDashboard extends RegisterBase {
    constructor() {
        super(SERVICE_NAME);
    }

    getApiName(config) {
        return `${config.id}`
    }
}

export const registerDashboard = new RegisterDashboard();