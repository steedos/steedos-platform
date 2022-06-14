/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-10 09:32:23
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-14 19:08:50
 * @Description: 
 */
import { keys, values } from 'lodash'
export class MemoryCacher {
    private cache: any;
    
    constructor(){
        this.cache = {};
    }
    
    get(key: string){
        return this.cache[key];
    }
    
    delete(key: string){
        delete this.cache[key]
    }

    set(key: string, data: any){
        this.cache[key] = data;
    }   
    
    clear(){
        this.cache = {}
    }

    keys(){
        return keys(this.cache);
    }

    values(){
        return values(this.cache);
    }
}