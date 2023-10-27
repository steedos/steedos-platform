/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-26 10:31:50
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-26 10:44:27
 * @FilePath: /steedos-platform-2.3/services/service-package-loader/src/imports/ImportExcel.ts
 * @Description: 
 */
import xlsx from 'node-xlsx';
import { Base } from './Base';

export default class ImportExcel implements Base {

    readFile(filePath: string, options: any = {}): { datas: Array<any>, headers: Array<string> } {
        const { sheetIndex = 0, headerIndex = 0 } = options;
        let workbook = xlsx.parse(filePath, {
            cellDates: true,
        });
        const data = workbook[sheetIndex].data;
        const headers = data[headerIndex];
        const datas = data.slice(1);
        return {
            headers,
            datas
        };
    }

}