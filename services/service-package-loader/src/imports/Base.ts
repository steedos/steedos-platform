/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-26 10:31:50
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-26 10:41:08
 * @FilePath: /steedos-platform-2.3/services/service-package-loader/src/imports/Base.ts
 * @Description: 
 */
export interface Base {
    readFile(filePath: string, options?: any): any
}