/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-03-12 14:39:31
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-03-12 15:18:54
 * @Description: 
 */
import { RegisterBase } from "./_base";
const SERVICE_NAME = 'workflow';
class RegisterWorkflowRule extends RegisterBase {
    constructor() {
        super(SERVICE_NAME);
    }

    getApiName(config) {
        return `${config.object_name}.${config.name}`
    }
}

export const registerWorkflowRules = new RegisterWorkflowRule();