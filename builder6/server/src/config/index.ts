import SteedosConfig from './steedos.config';
import getEnvConfigs from './env.config';
import moleculerConfigs from './moleculler.config';
import getProjectConfigs from './project.config';

export const projectConfigs = getProjectConfigs(process.cwd());
export const steedosConfig = SteedosConfig.getSteedosConfig();

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
