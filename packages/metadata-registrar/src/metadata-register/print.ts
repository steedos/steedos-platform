/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-12-10 16:13:36
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-12-10 16:13:47
 * @FilePath: /steedos-platform-2.3/packages/metadata-registrar/src/metadata-register/print.ts
 * @Description: 
 */
import { RegisterBase } from "./_base";
const SERVICE_NAME = 'print';
class RegisterPrint extends RegisterBase{
    constructor(){
        super(SERVICE_NAME);
    }
}

export const registerPrint = new RegisterPrint();