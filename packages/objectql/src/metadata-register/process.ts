/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-03-30 11:20:03
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-03-30 11:20:35
 * @Description: 
 */
import { RegisterBase } from "./_base";
const SERVICE_NAME = 'process';
class RegisterProcess extends RegisterBase{
    constructor(){
        super(SERVICE_NAME);
    }
}

export const registerProcess = new RegisterProcess();