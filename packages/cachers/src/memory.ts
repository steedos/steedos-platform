/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-10 09:32:23
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-10 09:48:37
 * @Description: 
 */
export class MemoryCacher {
    private cache: any;
    
    constructor(){
        this.cache = {};
    }
    
    get(key: string){
        return this.cache[key];
    }
    
    del(key: string){
        delete this.cache[key]
    }

    set(key: string, data: any){
        this.cache[key] = data;
    }   
    
    clear(){
        this.cache = {}
    }
}