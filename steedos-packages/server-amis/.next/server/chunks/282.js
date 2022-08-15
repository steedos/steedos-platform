"use strict";
exports.id = 282;
exports.ids = [282];
exports.modules = {

/***/ 8282:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GR": () => (/* binding */ absoluteUrl),
/* harmony export */   "Io": () => (/* binding */ fetchAPI),
/* harmony export */   "MC": () => (/* binding */ setRootUrl),
/* harmony export */   "N0": () => (/* binding */ getRootUrl),
/* harmony export */   "Z0": () => (/* binding */ getSteedosAuth),
/* harmony export */   "bW": () => (/* binding */ getAuthToken),
/* harmony export */   "jM": () => (/* binding */ getTenantId),
/* harmony export */   "sq": () => (/* binding */ setSteedosAuth)
/* harmony export */ });
/* unused harmony exports getFileSrc, getImageSrc, getAuthorization */
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6517);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-11 14:13:18
 * @Description: 
 */ 
const ROOT_URL = "http://192.168.50.181:5000";
const STEEDOS_AUTH = {};
const setSteedosAuth = (space, token, userId, name, options)=>{
    STEEDOS_AUTH.space = space;
    STEEDOS_AUTH.token = token;
    STEEDOS_AUTH.userId = userId;
    STEEDOS_AUTH.name = name;
    Object.assign(STEEDOS_AUTH, options);
};
async function fetchAPI(api, options = {
    credentials: "include"
}) {
    const headers = {
        "Content-Type": "application/json"
    };
    const AUTHORIZATION = getAuthorization();
    if (AUTHORIZATION) {
        headers["Authorization"] = AUTHORIZATION;
    } else {
        throw new Error(401);
    }
    options.headers = Object.assign({}, headers, options.headers);
    const res = await fetch(`${getRootUrl()}${api}`, options);
    if (res.status === 401) {
        throw new Error(401);
    }
    const json = await res.json();
    if (json.errors) {
        console.error(json.errors);
        throw new Error("Failed to fetch API");
    }
    return json;
}
function getFileSrc(fileId) {
    return `${getRootUrl()}/api/files/files/${fileId}`;
}
function getImageSrc(fileId) {
    return `${getRootUrl()}/api/files/images/${fileId}`;
}
function getTenantId() {
    try {
        let spaceId = localStorage.getItem("steedos:spaceId");
        if (window.location.search && !spaceId) {
            var searchParams = new URLSearchParams(window.location.search);
            spaceId = searchParams.get("X-Space-Id");
        }
        if (!spaceId) {
            return null;
        }
        return spaceId;
    } catch (error) {
        console.error(error);
    }
}
function getAuthToken() {
    try {
        const auth = getSteedosAuth();
        let token = auth.token;
        if (!token) {
            return null;
        }
        return token;
    } catch (error) {
        console.error(error);
    }
}
function getAuthorization() {
    try {
        const auth = getSteedosAuth();
        let spaceId = auth.space;
        let token = auth.token;
        if (!spaceId || !token) {
            return null;
        }
        return `Bearer ${spaceId},${token}`;
    } catch (error) {
        console.error(error);
    }
}
function absoluteUrl(url) {
    return `${getRootUrl()}${url}`;
}
function getRootUrl() {
    const rootUrl =  false ? 0 : "";
    if (rootUrl) {
        return rootUrl;
    }
    return ROOT_URL;
}
function setRootUrl(rootUrl) {
    if ((0,lodash__WEBPACK_IMPORTED_MODULE_0__.endsWith)(rootUrl, "/")) {
        rootUrl = rootUrl.substring(0, rootUrl.length - 1);
    }
    localStorage.setItem("steedos:rootUrl", rootUrl);
}
const getSteedosAuth = ()=>{
    // if(isEmpty(STEEDOS_AUTH)){
    //     return {
    //         space: localStorage.getItem("steedos:spaceId"),
    //         token: localStorage.getItem("steedos:token"), 
    //         userId: localStorage.getItem("steedos:userId"),
    //         name: Meteor.user().name  //TODO: 使用steedos 函数. 此属性在上传附件时使用
    //     }
    // }
    return Object.assign({}, STEEDOS_AUTH);
};


/***/ })

};
;