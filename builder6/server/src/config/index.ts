/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2025-02-07 14:36:24
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-02-21 14:32:20
 * @Description:
 */
import { getEnvConfigs } from "@builder6/core";

import SteedosConfig from "./steedos.config";

import { moleculerConfig } from "./moleculler.config";

export const steedosConfig = SteedosConfig.getSteedosConfig();

global.Steedos = {
  settings: steedosConfig.settings,
};

export function getConfigs() {
  return {
    ...getEnvConfigs(),
  };
}

export function getSteedosConfigs() {
  return steedosConfig;
}

export function getMoleculerConfigs() {
  const config = {
    // brokerName: "builder6", // if you have multiple broker
    namespace: "steedos", // some moleculer options
    transporter: process.env.B6_TRANSPORTER,
    ...moleculerConfig,
    ...steedosConfig,
    ...getEnvConfigs(),
  };

  return config;
}
