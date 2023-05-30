/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2021-08-30 12:06:41
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-27 16:31:15
 * @Description: 
 */
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '../typeInfo';
import { BaseLoadMetadataFile } from "./_baseLoadFile";
import path from 'path';
import { loadFile } from '../loadFile'
import { syncMatchFiles } from '..//util/match_files';
import { each } from 'lodash';

export class LoadTranslationFile extends BaseLoadMetadataFile {
    constructor() {
        super(TypeInfoKeys.Page);
    }

    getI18nLng(filePath: string): any {
        try {
          let pathJson = path.parse(filePath);
          let filename = pathJson.base;
          if (filename) {
            let f = filename.split(".");
            if (f.length >= 3) {
              return f[f.length - 3];
            }
          }
          console.log(`getI18nLng warn: Invalid file: ${filePath}`);
        } catch (error) {
          console.error(`getI18nLng error: ${filePath}`, error);
        }
      }

    load(filePath) {
        let results: any = [];
        const filePatten = [
            path.join(filePath, "*.translation.yml"),
            "!" + path.join(filePath, "node_modules"),
        ];
        const matchedPaths: [string] = syncMatchFiles(filePatten);
        each(matchedPaths, (matchedPath: string) => {
            let json = loadFile(matchedPath);
            let lng = this.getI18nLng(matchedPath);
            if (lng) {
            results.push({ lng: lng, __filename: matchedPath, data: json });
            }
        });
        return results;
    }
}