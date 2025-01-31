import dotenvFlow from 'dotenv-flow';
import path from 'path';
const _ = require("lodash")

dotenvFlow.config({
  path: process.cwd(),
  silent: true,
});



if (_.isEmpty(process.env.STEEDOS_TENANT_ENABLE_PASSWORD_LOGIN)) {
	process.env.STEEDOS_TENANT_ENABLE_PASSWORD_LOGIN = 'true';
}

if (_.isEmpty(process.env.STEEDOS_UNPKG_URL)) {
	process.env.STEEDOS_UNPKG_URL = 'https://unpkg.steedos.cn';
}
process.env.STEEDOS_UNPKG_URL = process.env.STEEDOS_UNPKG_URL.replace(/\/+$/, "");

if (_.isEmpty(process.env.STEEDOS_BUILDER_URL)) {
	process.env.STEEDOS_BUILDER_URL = 'https://6-3.builder.steedos.com';
}
process.env.STEEDOS_BUILDER_URL = process.env.STEEDOS_BUILDER_URL.replace(/\/+$/, "");


if (_.isEmpty(process.env.STEEDOS_AMIS_VERSION)) {
	process.env.STEEDOS_AMIS_VERSION = '6.3.0-patch.3';
}

if (_.isEmpty(process.env.STEEDOS_AMIS_URL)) {
	// process.env.STEEDOS_AMIS_URL = process.env.STEEDOS_UNPKG_URL + '/amis@' + process.env.STEEDOS_AMIS_VERSION;
	// 默认加载 https://unpkg.steedos.cn/@steedos-widgets/amis@3.6.3-patch.2， STEEDOS_AMIS_VERSION可变更版本号
	process.env.STEEDOS_AMIS_URL = process.env.STEEDOS_UNPKG_URL + '/@steedos-widgets/amis@' + process.env.STEEDOS_AMIS_VERSION;
} else {
	process.env.STEEDOS_AMIS_URL = process.env.STEEDOS_AMIS_URL.replace("https://unpkg.com", process.env.STEEDOS_UNPKG_URL)
}
process.env.STEEDOS_AMIS_URL = process.env.STEEDOS_AMIS_URL.replace(/\/+$/, "");

if (_.isEmpty(process.env.STEEDOS_WIDGETS_VERSION)) {
	process.env.STEEDOS_WIDGETS_VERSION = 'v6.3.12-beta.12';
}

if (_.isEmpty(process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS)) {
	const widgetsVersion = process.env.STEEDOS_WIDGETS_VERSION;
	const unpkgUrl = process.env.STEEDOS_UNPKG_URL;
	let steedosPublicPageAsseturls = `${unpkgUrl}/@steedos-widgets/amis-object@${widgetsVersion}/dist/assets.json`;
	if (!_.isEmpty(process.env.STEEDOS_WIDGETS_ADDITIONAL)) {
		process.env.STEEDOS_WIDGETS_ADDITIONAL.split(',').forEach(additional => {
			const lastAtIndex = additional.lastIndexOf('@');
            let packageName = additional;
            let versionToUse = widgetsVersion;

            // 只有当 '@' 不在字符串开头（即大于0的位置）才视为存在版本信息
            if (lastAtIndex > 0) {
                packageName = additional.substring(0, lastAtIndex);
                versionToUse = additional.substring(lastAtIndex + 1) || widgetsVersion;
            }
			steedosPublicPageAsseturls += `,${unpkgUrl}/${packageName}@${versionToUse}/dist/assets.json`;
		})
	}
	process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS = steedosPublicPageAsseturls
}

// if (_.isEmpty(process.env.SERIALIZER)) {
// 	process.env.SERIALIZER = 'JSON'
// }

if (_.isEmpty(process.env.ROOT_URL)) {
	console.error("ERROR: Environment variable ROOT_URL is not defined.")
	process.env.ROOT_URL = "http://localhost"
}

process.env.ROOT_URL = process.env.ROOT_URL.replace(/\/+$/, "");


/* 兼容 Steedos 环境变量 */
process.env.B6_ROOT_URL = process.env.B6_ROOT_URL || process.env.ROOT_URL;
process.env.B6_MONGO_URL = process.env.B6_MONGO_URL || process.env.MONGO_URL;
process.env.B6_TRANSPORTER =
  process.env.B6_TRANSPORTER || process.env.TRANSPORTER || '';
process.env.B6_CACHER = process.env.B6_CACHER || process.env.CACHER || '';

process.env.B6_JWT_SECRET =
  process.env.B6_JWT_SECRET || process.env.JWT_SECRET || '';

process.env.B6_HOME = process.cwd();
process.env.B6_HOST = process.env.B6_HOST || process.env.B6_ROOT_URL;
process.env.B6_TENANT_NAME = process.env.B6_TENANT_NAME || 'Steedos';
process.env.B6_TENANT_LOGO_URL =
  process.env.B6_TENANT_LOGO_URL ||
  `${process.env.B6_ROOT_URL}/images/logo.png`;

process.env.B6_UNPKG_URL = process.env.B6_UNPKG_URL || process.env.STEEDOS_UNPKG_URL || 'https://unpkg.com';

process.env.B6_STORAGE_DIR = process.env.B6_STORAGE_DIR || process.env.STEEDOS_STORAGE_DIR || path.join(process.cwd(), 'steedos-storage') ;

process.env.B6_LOG_LEVEL = process.env.B6_LOG_LEVEL || process.env.STEEDOS_LOG_LEVEL || 'warn';



/**
 * 将以指定前缀开头的环境变量解析为 JSON 对象
 * @param {Object} env - 环境变量对象（通常是 process.env）
 * @param {Array<string>} prefixes - 需要解析的前缀数组
 * @returns {Object} - 转换后的 JSON 对象
 */
function parseEnvToJSON(env, prefixes) {
  const result = {};

  Object.keys(env).forEach((key) => {
    // 检查是否以指定前缀开头
    const hasValidPrefix = prefixes.some((prefix) => key.startsWith(prefix));
    if (!hasValidPrefix) {
      return; // 跳过非目标前缀的变量
    }

    // 转为小写
    const strippedKey = key.toLowerCase();
    const keys = strippedKey.split('_'); // 分割层级
    let current = result;
    keys.forEach((k, index) => {
      if (index === keys.length - 1) {
        // 最后一层，赋值
        const value = env[key];

        // 检查是否为布尔值
        if (value.toLowerCase() === 'true') {
          current[k] = true;
        } else if (value.toLowerCase() === 'false') {
          current[k] = false;
        } else if (!isNaN(value) && value.trim() !== '') {
          // 如果是数字
          current[k] = Number(value);
        } else {
          // 默认保留为字符串
          current[k] = value;
        }
      } else {
        if (typeof current[k] !== 'object' || current[k] === null) {
          current[k] = {};
        }
        current = current[k];
      }
    });
  });

  return result;
}

export default function getEnvConfigs() {
  const env = parseEnvToJSON(process.env, ['STEEDOS_', 'B6_']) as any;

  const envConfigs = {
    ...env.steedos,
    ...env.b6,
  };

  return envConfigs;
}
