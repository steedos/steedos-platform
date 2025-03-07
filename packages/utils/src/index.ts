/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-08-06 14:44:51
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-03-07 11:41:20
 * @Description:
 */

export * from "./queryMetadata";
export * from "./defaultsDeep";
export * from "./settings";

export * from "./cookies";

export const hiddenObjects = ["core", "base", "cfs_instances_filerecord"];

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

export function processPermissions(po) {
  if (po.allowCreate) {
    po.allowRead = true;
  }
  if (po.allowEdit) {
    po.allowRead = true;
  }
  if (po.allowDelete) {
    po.allowEdit = true;
    po.allowRead = true;
  }
  if (po.viewAllRecords) {
    po.allowRead = true;
  }
  if (po.modifyAllRecords) {
    po.allowRead = true;
    po.allowEdit = true;
    po.allowDelete = true;
    po.viewAllRecords = true;
  }
  if (po.viewCompanyRecords) {
    po.allowRead = true;
  }
  if (po.modifyCompanyRecords) {
    po.allowRead = true;
    po.allowEdit = true;
    po.allowDelete = true;
    po.viewCompanyRecords = true;
  }

  // If attachment-related permission configuration is empty,
  // it is compatible with the previous rules when there was no attachment permission configuration
  if (po.allowRead) {
    if (typeof po.allowReadFiles !== "boolean") po.allowReadFiles = true;
    if (typeof po.viewAllFiles !== "boolean") po.viewAllFiles = true;
  }
  if (po.allowEdit) {
    if (typeof po.allowCreateFiles !== "boolean") po.allowCreateFiles = true;
    if (typeof po.allowEditFiles !== "boolean") po.allowEditFiles = true;
    if (typeof po.allowDeleteFiles !== "boolean") po.allowDeleteFiles = true;
  }
  if (po.modifyAllRecords) {
    if (typeof po.modifyAllFiles !== "boolean") po.modifyAllFiles = true;
  }

  if (po.allowCreateFiles) {
    po.allowReadFiles = true;
  }
  if (po.allowEditFiles) {
    po.allowReadFiles = true;
  }
  if (po.allowDeleteFiles) {
    po.allowEditFiles = true;
    po.allowReadFiles = true;
  }
  if (po.viewAllFiles) {
    po.allowReadFiles = true;
  }
  if (po.modifyAllFiles) {
    po.allowReadFiles = true;
    po.allowEditFiles = true;
    po.allowDeleteFiles = true;
    po.viewAllFiles = true;
  }

  return po;
}
