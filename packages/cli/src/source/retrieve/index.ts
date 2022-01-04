import { fstatSync } from "fs-extra";
import { authRequest } from '../../auth';

// const fs = require('fs');
// const os = require('os');
// const path = require("path");
// const chalk= require('chalk');
// const request = require('request');
// const yaml = require('js-yaml');
// const _ = require('underscore');
const validator = require('validator');

/**
 * 
 * @param reqYml 请求的yml文件(base64)
 * @param callback 
 */
export function getFromServer(reqYml, callback){
    authRequest('/api/metadata/retrieve', {
        method: "GET",//请求方式，默认为get
        headers: {//设置请求头
            "Content-Type": "multipart/form-data"        
        },
        form: {
            yml: reqYml,
        }
        
    }, function(error, response, body) {
        if(error){
            console.error('Error: ', error.message);
        }else if (response && response.statusCode && response.statusCode != 200) {
            if(response.statusCode == 401){
                console.error('Error: Please run command, steedos source:config');
            }else{
                console.error(body);
            }
        }else{
            const isBase64 = validator.isBase64(body);
            // console.log("isBase64",isBase64);
            if(!isBase64){
                console.error('Error: metadata-api not detected, enable metadata-api first');
            }else{
                var zipBuffer = Buffer.from(body, 'base64');
                callback(zipBuffer);
            }
        }

    }); 
}
