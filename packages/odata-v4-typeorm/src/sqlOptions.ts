/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-05-19 11:38:30
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-05 15:15:00
 * @Description: 
 */
import {SQLLang} from '@steedos/odata-v4-sql';

export interface SqlOptions {
  useParameters?: boolean;
  type?: SQLLang;
  alias: string;
  version?: string;
}