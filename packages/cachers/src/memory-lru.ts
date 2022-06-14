/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-10 09:33:03
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-14 19:01:42
 * @Description: 
 */
import { defaultsDeep } from 'lodash';

const LRU = require('lru-cache');

const defaultOptions = {
    max: 5000,
    ttl: null,
    keygen: null,
    maxParamsLength: null
}

export class MemoryLRUCacher {
    private cache: any;
    opts: any;
    constructor(opts){
        this.opts = defaultsDeep(opts, defaultOptions);
        this.cache = new LRU({
			max: this.opts.max,
			maxAge: this.opts.ttl ? this.opts.ttl * 1000 : null,
			updateAgeOnGet: !!this.opts.ttl
		});
    }

    get(key: string){
        return this.cache.get(key);
    }
    
    set(key: string, data: any, opt?: any){
        return this.cache.set(key, data, opt);
    }

    delete(key: string){
        return this.cache.delete(key);
    }
    
    clear(){
        return this.cache.clear();
    }

    keys(){
        return this.cache.keys();
    }

    values(){
        return this.cache.values();
    }
}