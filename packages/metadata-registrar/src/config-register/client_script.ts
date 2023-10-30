/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-14 18:43:07
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-10-24 16:39:29
 * @Description: 
 */
import _ = require('lodash')
import path = require('path')
import fs = require('fs')
import { syncMatchFiles } from '@steedos/metadata-core';
import { registerClientJS } from '../metadata-register/clientJS';

export const getClientScripts = async () => {
    const metadata = await registerClientJS.getAll(broker);
    let scripts = "";

    _.each(_.sortBy(metadata, 'timestamp'), (item)=>{
        scripts = scripts + item.metadata.code;
    });
    return scripts;
}

export const loadPackageClientScripts = async (packageName, packageDir)=>{
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
        registerClientJS.register(broker, packageName, {_id: `${packageName}.index`, code: packageClientScripts});
        broker.broadcast('clientJS.changed', {
            packageName: packageName,
        })
    }
}

export const deletePackageClientScripts = async (packageName)=>{
    console.log(`deletePackageClientScripts`, packageName)
    await registerClientJS.remove(broker, packageName, `${packageName}.index`)
    broker.broadcast('clientJS.changed', {
        packageName: packageName,
    })
}

