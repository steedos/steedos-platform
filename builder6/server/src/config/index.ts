/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2025-02-07 14:36:24
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-02-21 14:32:20
 * @Description: 
 */
import SteedosConfig from './steedos.config';
import getEnvConfigs from './env.config';
import moleculerConfigs from './moleculler.config';
import getProjectConfigs from './project.config';

export const projectConfigs = getProjectConfigs(process.cwd());
export const steedosConfig = SteedosConfig.getSteedosConfig();

global.Steedos = {
  settings: steedosConfig.settings
};

export async function getDbConfigs() {
  return {};
}

export function getSteedosConfigs() {
  return steedosConfig;
}

export function getMoleculerConfigs() {
  const { moleculer } = getEnvConfigs();
  return {
    ...moleculerConfigs,
    ...moleculer,
  };
}

export function getConfigs() {
  return {
    ...steedosConfig,
    ...getEnvConfigs(),
  };
}

export const configs = getConfigs();

export { getEnvConfigs };
