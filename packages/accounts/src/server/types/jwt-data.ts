/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-08-12 17:04:03
 * @Description: 
 */
export interface JwtData {
  token?: string;
  isImpersonated: boolean;
  userId: string;
  name?: string,
  email?: string,
}
