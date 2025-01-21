/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2025-01-13 11:05:55
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-01-20 15:06:38
 * @Description: 
 */
import {  SteedosDriverConfig, SteedosMongoDriver } from "./index"
import _ = require("underscore");

export class SteedosMeteorMongoDriver extends SteedosMongoDriver {
    constructor(config: SteedosDriverConfig){
        super(config);
    }
}