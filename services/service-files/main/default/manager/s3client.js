/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-10 19:00:40
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-06-10 20:04:14
 * @Description: 
 */

const AWS = require('aws-sdk');
const {
    getS3ServiceParams,
} = require('./util');

class S3 {
    constructor() {

        const serviceParams = getS3ServiceParams();

        this._client = new AWS.S3(serviceParams);
    }

    get client() {
        return this._client;
    }

}

module.exports = {
    S3Client: new S3().client,
}