/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-07-10 14:02:57
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-07-10 14:03:19
 * @Description: 
 */
import { RegisterBase } from "./_base";
const SERVICE_NAME = 'import';
class RegisterImport extends RegisterBase{
    constructor(){
        super(SERVICE_NAME);
    }
}

export const registerImport = new RegisterImport();