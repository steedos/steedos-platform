/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-10-24 10:37:03
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-10-24 11:02:15
 * @Description: 
 */
import { RegisterBase } from "./_base";
const SERVICE_NAME = 'clientJS';
class RegisterClientJS extends RegisterBase{
    constructor(){
        super(SERVICE_NAME);
    }
}

export const registerClientJS = new RegisterClientJS();