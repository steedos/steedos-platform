/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-09 15:03:56
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-09 15:47:58
 * @Description: 
 */
const CACHER_MAP = {};

export const getCacher = function (name: string) {
    if(!CACHER_MAP[name]){
        CACHER_MAP[name] = new Cacher();
    }
    return CACHER_MAP[name];
}

export const clearCacher = function (name: string | number) {
    if(CACHER_MAP[name]){
        CACHER_MAP[name].clear();
    }
}

class Cacher {
    private cache: any;
    hit: number;
    count: number;
    constructor(){
        this.cache = {};
        this.hit = 0;
        this.count = 0;
    }
    getHitRate(){
        return (this.hit / this.count * 100).toFixed(2) + "%";
    }
    get(key: string){
        const data = this.cache[key];
        this.count ++ ;
        if(data){
            this.hit ++;
        }
        return data
    }
    set(key: string, value: any){
        this.cache[key] = value;
    }   
    clear(){
        this.cache = {}
    }
}


