/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-26 10:31:50
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-26 10:46:25
 * @FilePath: /steedos-platform-2.3/services/service-package-loader/src/imports/ImportFlow.ts
 * @Description: 
 */
import { loadFile, syncMatchFiles } from '@steedos/metadata-core';
import { Base } from './Base';
import path = require('path');
import _ = require('lodash');

export default class ImportFlow implements Base {

    readFile(filePath: string): any {
        const filePatten = [
            path.join(filePath, "**", "*.flow.data.json"),
            "!" + path.join(filePath, "node_modules"),
        ]
        const matchedPaths: [string] = syncMatchFiles(filePatten);
        let flows = {};
        for (let k = 0; k < matchedPaths.length; k++) {
            let matchedPath = matchedPaths[k];
            let json = loadFile(matchedPath);
            let formName = matchedPath.substring(matchedPath.lastIndexOf('/') + 1, matchedPath.indexOf('.flow'));
            let form = {};
            try {
                if (json) {

                    let flowKeys = _.keys(json);
                    for (let m in flowKeys) {
                        let key = flowKeys[m];
                        if (typeof key === 'function') {
                            continue;
                        }
                        let val = json[key];
                        if (typeof val === 'function') {
                            json[key] = val.toString();
                        }
                        form[key] = json[key];
                    }
                    flows[formName] = json;
                }
            } catch (error) {
                console.error('loadFlows error', matchedPath, error);
                throw error
            }
        }
        return flows;
    }

}