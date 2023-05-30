/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-14 18:43:07
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-29 18:05:41
 * @Description: 
 */
import _ = require('lodash')
import path = require('path')
import fs = require('fs')
import { syncMatchFiles } from '@steedos/metadata-core';

const CACHER_NAME = 'client-scripts';

function getCacher(name){
    try {
        const { getCacher } = require('@steedos/cachers');
        return getCacher(name)
    } catch (error) {
        
    }
}


export const getClientScripts = () => {
    const cacher = getCacher(CACHER_NAME);
    let scripts = "";

    _.each(cacher.values(), (value)=>{
        scripts = scripts + value;
    });
    return scripts;
}

export const loadPackageClientScripts = (packageName, packageDir)=>{
    const cacher = getCacher(CACHER_NAME);
    const filePatten = [
        path.join(packageDir, "*.client.js"),
        "!" + path.join(packageDir, "node_modules"),
    ];
    let packageClientScripts = "";
    let matchedPaths: Array<string> = syncMatchFiles(filePatten);
    matchedPaths = _.sortBy(matchedPaths);
    _.each(matchedPaths, (matchedPath) => {
        let code = fs.readFileSync(matchedPath, 'utf8');
        // packageClientScripts = packageClientScripts + '\r\n;' + code + '\r\n;'
        packageClientScripts = packageClientScripts + '\r\n;' + `try{${code};\r\n}catch(error){console.error('client.js [${matchedPath}] error', error)}` + ';\r\n'
    });

    if(packageClientScripts){
        cacher.set(packageName, packageClientScripts);
    }
}

export const deletePackageClientScripts = (packageName)=>{
    const cacher = getCacher(CACHER_NAME);
    cacher.delete(packageName);
}

