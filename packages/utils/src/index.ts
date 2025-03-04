/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-08-06 14:44:51
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-03-04 16:54:26
 * @Description:
 */

export * from "./queryMetadata";
export * from "./defaultsDeep";
export * from "./settings";

export * from "./cookies";

export async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function absoluteUrl(path, options?) {
  // path is optional
  if (!options && typeof path === "object") {
    options = path;
    path = undefined;
  }
  const rootUrl = process.env.ROOT_URL;
  // merge options with defaults
  options = Object.assign({}, { rootUrl: rootUrl }, options || {});

  var url = options.rootUrl;
  if (!url)
    throw new Error(
      "Must pass options.rootUrl or set ROOT_URL in the server environment",
    );

  if (!/^http[s]?:\/\//i.test(url))
    // url starts with 'http://' or 'https://'
    url = "http://" + url; // we will later fix to https if options.secure is set

  if (!url.endsWith("/")) {
    url += "/";
  }

  if (path) {
    // join url and path with a / separator
    while (path.startsWith("/")) {
      path = path.slice(1);
    }
    url += path;
  }

  // turn http to https if secure option is set, and we're not talking
  // to localhost.
  if (
    options.secure &&
    /^http:/.test(url) && // url starts with 'http:'
    !/http:\/\/localhost[:\/]/.test(url) && // doesn't match localhost
    !/http:\/\/127\.0\.0\.1[:\/]/.test(url)
  )
    // or 127.0.0.1
    url = url.replace(/^http:/, "https:");

  if (options.replaceLocalhost)
    url = url.replace(/^http:\/\/localhost([:\/].*)/, "http://127.0.0.1$1");

  return url;
}

export function JSONStringify(data) {
  return JSON.stringify(data, function (key, val) {
    if (typeof val === "function") {
      return val + "";
    }
    return val;
  });
}
