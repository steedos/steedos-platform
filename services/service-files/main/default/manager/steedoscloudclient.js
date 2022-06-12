/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-12 10:22:12
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-06-12 10:23:25
 * @Description: 
 */
const AWS = require('aws-sdk');
const {
    getCloudServiceParams,
} = require('./util');

class SteedosCloud {
    constructor() {

        const serviceParams = getCloudServiceParams();

        this._client = new AWS.S3(serviceParams);
    }

    get client() {
        return this._client;
    }

}

module.exports = {
    SteedosCloudClient: new SteedosCloud().client,
}