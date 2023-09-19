/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-09-19 09:13:33
 * @Description: 
 */
export interface Session {
  id: string;
  userId: string;
  token: string;
  valid: boolean;
  userAgent?: string;
  ip?: string;
  createdAt: string;
  updatedAt: string;
  space?: string
}
