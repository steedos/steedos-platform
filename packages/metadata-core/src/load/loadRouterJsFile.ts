/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-26 16:34:33
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-26 16:42:54
 * @Description: 
 */
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '../typeInfo';
import { loadFile } from '../loadFile'
import { BaseLoadMetadataFile } from "./_baseLoadFile";
import { syncMatchFiles, getMD5 } from '..//util/match_files';
import { each } from 'lodash';
const fs = require("fs");
const path = require("path");


export class LoadRouterJsFile extends BaseLoadMetadataFile{
    constructor(){
        super(TypeInfoKeys.Chart);
    }

    getRouterInfoList(router, md5){
        const infoList: any = [];
        if (
          router &&
          router.default &&
          router.default.stack &&
          router.default.stack.length > 0
        ) {
          each(router.default.stack, (_route) => {
            const info = {
              path: "",
              methods: "",
              md5: md5,
            };
            if (_route.route) {
              info.path = _route.route.path;
              info.methods = _route.route.methods;
              infoList.push(info);
            }
          });
        }
        return infoList;
      };
      
    getFileMD5(filePath){
        const buffer = fs.readFileSync(filePath);
        return getMD5(buffer);
    };

    load(filePath){
        let results: any = [];
        const filePatten = [
            path.join(filePath, "*.router.js"),
            "!" + path.join(filePath, "node_modules"),
        ];
        const matchedPaths: [string] = syncMatchFiles(filePatten);
        each(matchedPaths, (matchedPath: string) => {
            delete require.cache[require.resolve(matchedPath)];
            let router = loadFile(matchedPath);
            let md5 = this.getFileMD5(matchedPath);
            let infoList = this.getRouterInfoList(router, md5);
            results.push({ router: router, infoList: infoList });
        });
        return results;
    }
}