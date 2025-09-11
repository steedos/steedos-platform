import {
  defaultsDeep,
  cloneDeep,
  compact,
  each,
  isString,
  get,
  isEmpty,
} from "lodash";
import { getSteedosConfigs } from "@builder6/core";

if (isEmpty(process.env.STEEDOS_TENANT_ENABLE_PASSWORD_LOGIN)) {
  process.env.STEEDOS_TENANT_ENABLE_PASSWORD_LOGIN = "true";
}

if (isEmpty(process.env.STEEDOS_WIDGETS_ADDITIONAL)) {
  process.env.STEEDOS_WIDGETS_ADDITIONAL = "@steedos-widgets/liveblocks";
}

if (isEmpty(process.env.STEEDOS_UNPKG_URL)) {
  process.env.STEEDOS_UNPKG_URL = "https://unpkg.steedos.cn";
}
process.env.STEEDOS_UNPKG_URL = process.env.STEEDOS_UNPKG_URL.replace(
  /\/+$/,
  "",
);

if (isEmpty(process.env.STEEDOS_BUILDER_URL)) {
  process.env.STEEDOS_BUILDER_URL = "https://6-3.builder.steedos.com";
}
process.env.STEEDOS_BUILDER_URL = process.env.STEEDOS_BUILDER_URL.replace(
  /\/+$/,
  "",
);

if (isEmpty(process.env.STEEDOS_AMIS_VERSION)) {
  process.env.STEEDOS_AMIS_VERSION = "6.3.0-patch.8";
}

if (isEmpty(process.env.STEEDOS_AMIS_URL)) {
  // process.env.STEEDOS_AMIS_URL = process.env.STEEDOS_UNPKG_URL + '/amis@' + process.env.STEEDOS_AMIS_VERSION;
  // 默认加载 https://unpkg.steedos.cn/@steedos-widgets/amis@3.6.3-patch.2， STEEDOS_AMIS_VERSION可变更版本号
  process.env.STEEDOS_AMIS_URL =
    process.env.STEEDOS_UNPKG_URL +
    "/@steedos-widgets/amis@" +
    process.env.STEEDOS_AMIS_VERSION;
} else {
  process.env.STEEDOS_AMIS_URL = process.env.STEEDOS_AMIS_URL.replace(
    "https://unpkg.com",
    process.env.STEEDOS_UNPKG_URL,
  );
}
process.env.STEEDOS_AMIS_URL = process.env.STEEDOS_AMIS_URL.replace(/\/+$/, "");

if (isEmpty(process.env.STEEDOS_WIDGETS_VERSION)) {
  process.env.STEEDOS_WIDGETS_VERSION = "v6.10.1-beta.61";
}

if (isEmpty(process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS)) {
  const widgetsVersion = process.env.STEEDOS_WIDGETS_VERSION;
  const unpkgUrl = process.env.STEEDOS_UNPKG_URL;
  let steedosPublicPageAsseturls = `${unpkgUrl}/@steedos-widgets/amis-object@${widgetsVersion}/dist/assets.json`;
  if (!isEmpty(process.env.STEEDOS_WIDGETS_ADDITIONAL)) {
    process.env.STEEDOS_WIDGETS_ADDITIONAL.split(",").forEach((additional) => {
      const lastAtIndex = additional.lastIndexOf("@");
      let packageName = additional;
      let versionToUse = widgetsVersion;

      // 只有当 '@' 不在字符串开头（即大于0的位置）才视为存在版本信息
      if (lastAtIndex > 0) {
        packageName = additional.substring(0, lastAtIndex);
        versionToUse = additional.substring(lastAtIndex + 1) || widgetsVersion;
      }
      steedosPublicPageAsseturls += `,${unpkgUrl}/${packageName}@${versionToUse}/dist/assets.json`;
    });
  }
  process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS = steedosPublicPageAsseturls;
}

if (isEmpty(process.env.SERIALIZER)) {
  process.env.SERIALIZER = "JSON";
}

if (isEmpty(process.env.ROOT_URL)) {
  console.error("ERROR: Environment variable ROOT_URL is not defined.");
  process.env.ROOT_URL = "http://localhost";
}

process.env.ROOT_URL = process.env.ROOT_URL.replace(/\/+$/, "");

export function initSteedos() {
  const steedosConfig = getSteedosConfigs();
  global.Steedos = {
    settings: {
      ...steedosConfig,
    },
  };
  console.log("Steedos settings:", global.Steedos.settings.datasources);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { version } = require("@steedos/server/package.json");

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const i18n = require("@steedos/i18n");
  global.t = i18n.t;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  global._ = require("underscore");

  process.env.STEEDOS_VERSION = version;
}

export function moleculerCreated(broker: any) {
  global.broker = broker;
  // Clear all cache entries
  broker.logger.warn("Clear all cache entries on startup.");
  // broker.cacher.clean();
  const objectql = require("@steedos/objectql");
  objectql.broker.init(broker);
  //TODO 此处不考虑多个node服务模式.
  process.on("SIGTERM", close.bind(broker, "SIGTERM"));
  process.on("SIGINT", close.bind(broker, "SIGINT"));
  async function close(signal) {
    try {
      await this.cacher.clean(); //TODO 此clean 有问题，如果在启动过程中就停止服务，则会清理不干净。尝试试用reids client 原生clean（flushdb）。
      await this.cacher.close();
    } catch (error) {
      // console.log(`error`, error)
    }
    console.log(
      `[${signal}]服务已停止: namespace: ${this.namespace}, nodeID: ${this.nodeID}`,
    );
    process.exit(0);
  }
}
