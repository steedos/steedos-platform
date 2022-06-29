/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-29 16:05:04
 * @Description: 
 */
export interface ConnectionInformations {
  ip?: string;
  userAgent?: string;
  space?: string;
  is_phone?: boolean;
  is_tablet?: boolean;
  logout_other_clients?: boolean;
  login_expiration_in_days?: number;
  phone_logout_other_clients?: boolean;
  phone_login_expiration_in_days?: number;
  provider?: string;
  jwtToken?: string;
}
