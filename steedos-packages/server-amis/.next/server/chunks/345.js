"use strict";
exports.id = 345;
exports.ids = [345];
exports.modules = {

/***/ 9345:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ac": () => (/* binding */ amisRender),
/* harmony export */   "oo": () => (/* binding */ amisRootClick)
/* harmony export */ });
/* unused harmony export getEvn */
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 11:31:12
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-11 18:23:10
 * @Description:
 */ const normalizeLink = (to, location = window.location)=>{
    to = to || "";
    if (to && to[0] === "#") {
        to = location.pathname + location.search + to;
    } else if (to && to[0] === "?") {
        to = location.pathname + to;
    }
    const idx = to.indexOf("?");
    const idx2 = to.indexOf("#");
    let pathname = ~idx ? to.substring(0, idx) : ~idx2 ? to.substring(0, idx2) : to;
    let search = ~idx ? to.substring(idx, ~idx2 ? idx2 : undefined) : "";
    let hash = ~idx2 ? to.substring(idx2) : location.hash;
    if (!pathname) {
        pathname = location.pathname;
    } else if (pathname[0] != "/" && !/^https?\:\/\//.test(pathname)) {
        let relativeBase = location.pathname;
        const paths = relativeBase.split("/");
        paths.pop();
        let m;
        while(m = /^\.\.?\//.exec(pathname)){
            if (m[0] === "../") {
                paths.pop();
            }
            pathname = pathname.substring(m[0].length);
        }
        pathname = paths.concat(pathname).join("/");
    }
    return pathname + search + hash;
};
const amisRootClick = (router, e)=>{
    if (e.target.nodeName.toLocaleLowerCase() === "a" && e.target.href) {
        e.preventDefault();
        router.push(e.target.href);
    }
};
const getEvn = (router)=>{
    return {
        theme: "antd",
        jumpTo: (to, action)=>{
            if (to === "goBack") {
                return window.history.back();
            }
            to = normalizeLink(to);
            if (action && action.actionType === "url") {
                action.blank === false ? router.push(to) : window.open(to);
                return;
            }
            // 主要是支持 nav 中的跳转
            if (action && to && action.target) {
                window.open(to, action.target);
                return;
            }
            if (/^https?:\/\//.test(to)) {
                window.location.replace(to);
            } else {
                router.push(to);
            }
        }
    };
};
const amisRender = (root, schema, data = {}, env = {}, options)=>{
    let amis = amisRequire("amis/embed");
    const { router  } = options;
    return amis.embed(root, schema, data, Object.assign(getEvn(router), env));
};


/***/ })

};
;