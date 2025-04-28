/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2025-02-07 14:36:24
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-02-21 14:32:20
 * @Description:
 */
import SteedosConfig from "./steedos.config";
export { getMoleculerConfigs } from "./moleculler.config";

export const steedosConfig = SteedosConfig.getSteedosConfig();

global.Steedos = {
  settings: steedosConfig.settings,
};

export async function getDbConfigs() {
  return {};
}

export function getSteedosConfigs() {
  return steedosConfig;
}
