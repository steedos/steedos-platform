/*
 * 资产包地址(assetUrls)白名单。
 * 页面渲染、设计器等接口支持通过 url 参数 assetUrls 指定要加载的资产包，资产包中的 js 会在页面中执行。
 * 通过环境变量 STEEDOS_PAGE_ASSETURLS_WHITELIST 配置允许的地址，多个用逗号分隔，支持：
 *   - 只写域名，如 https://cdn.example.com ，表示该域名下的地址都允许
 *   - 带路径，如 https://cdn.example.com/assets/ ，表示该路径下的地址允许
 * 未配置时不做任何限制，与之前的行为一致。
 * 环境变量 STEEDOS_PUBLIC_PAGE_ASSETURLS 中配置的资产包始终允许。
 */

const WHITELIST_ENV = "STEEDOS_PAGE_ASSETURLS_WHITELIST";

const splitUrls = (urls?: string): string[] => {
  if (typeof urls !== "string") {
    return [];
  }
  return urls
    .split(",")
    .map((url) => url.trim())
    .filter((url) => !!url);
};

const parseUrl = (url: string): URL | null => {
  try {
    return new URL(url, process.env.ROOT_URL || "http://localhost");
  } catch (e) {
    return null;
  }
};

export function getAssetUrlsWhitelist(): string[] {
  return splitUrls(process.env[WHITELIST_ENV]);
}

export function isAssetUrlsWhitelistEnabled(): boolean {
  return getAssetUrlsWhitelist().length > 0;
}

export function isAssetUrlAllowed(url: string, whitelist = getAssetUrlsWhitelist()): boolean {
  if (typeof url !== "string" || !url.trim()) {
    return false;
  }
  url = url.trim();
  if (splitUrls(process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS).indexOf(url) > -1) {
    return true;
  }
  const target = parseUrl(url);
  if (!target || ["http:", "https:"].indexOf(target.protocol) < 0) {
    return false;
  }
  return whitelist.some((item) => {
    const allowed = parseUrl(item);
    if (!allowed || allowed.origin !== target.origin) {
      return false;
    }
    const allowedPath = allowed.pathname;
    if (allowedPath === "/" || target.pathname === allowedPath) {
      return true;
    }
    return target.pathname.startsWith(allowedPath.endsWith("/") ? allowedPath : allowedPath + "/");
  });
}

/**
 * 按白名单过滤 url 参数中的 assetUrls。
 * 未配置白名单时原样返回；配置后只保留允许的地址，全部不允许时返回环境变量 STEEDOS_PUBLIC_PAGE_ASSETURLS 中的默认资产包。
 */
export function filterAssetUrls(assetUrls: any): any {
  const whitelist = getAssetUrlsWhitelist();
  if (!whitelist.length) {
    return assetUrls;
  }
  const urls = splitUrls(typeof assetUrls === "string" ? assetUrls : undefined);
  const allowedUrls = urls.filter((url) => isAssetUrlAllowed(url, whitelist));
  if (allowedUrls.length < urls.length) {
    console.warn(
      `[assetUrls] blocked by ${WHITELIST_ENV}:`,
      urls.filter((url) => allowedUrls.indexOf(url) < 0).join(","),
    );
  }
  return allowedUrls.join(",") || process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS || "";
}
