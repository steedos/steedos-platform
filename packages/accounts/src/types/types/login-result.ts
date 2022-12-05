/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-12 14:07:01
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-05 09:09:03
 * @Description: 
 */
import { Tokens } from './tokens';

export interface LoginResult {
  sessionId: string;
  token: string;
  tokens: Tokens;
  user: any;
  space?: string;
  spaces?: Array<any>
}
