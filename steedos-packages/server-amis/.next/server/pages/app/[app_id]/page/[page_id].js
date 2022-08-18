"use strict";
(() => {
var exports = {};
exports.id = 372;
exports.ids = [372];
exports.modules = {

/***/ 5793:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Page),
  "getServerSideProps": () => (/* binding */ getServerSideProps)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: ./node_modules/next/dynamic.js
var dynamic = __webpack_require__(5152);
// EXTERNAL MODULE: ./node_modules/next/document.js
var next_document = __webpack_require__(6859);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
// EXTERNAL MODULE: external "next/router"
var router_ = __webpack_require__(1853);
// EXTERNAL MODULE: ./src/lib/steedos.client.js
var steedos_client = __webpack_require__(8282);
;// CONCATENATED MODULE: ./src/lib/page.js
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 15:18:03
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-13 15:25:42
 * @Description: 
 */ 
async function getPage(pageId, appId, objectName = "", recordId, formFactor = "LARGE") {
    const APPS_API = `/api/pageSchema/app?app=${appId}&objectApiName=${objectName}&recordId=${recordId}&pageId=${pageId}&formFactor=${formFactor}`;
    const page = await (0,steedos_client/* fetchAPI */.Io)(APPS_API);
    return page;
}

// EXTERNAL MODULE: external "next-auth/next"
var next_ = __webpack_require__(2113);
// EXTERNAL MODULE: ./src/pages/api/auth/[...nextauth].js + 2 modules
var _nextauth_ = __webpack_require__(6295);
// EXTERNAL MODULE: ./src/lib/amis.js
var amis = __webpack_require__(9345);
;// CONCATENATED MODULE: ./src/pages/app/[app_id]/page/[page_id]/index.jsx

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-13 20:48:28
 * @Description: 
 */ 







function Page({}) {
    const router = (0,router_.useRouter)();
    const { app_id , page_id  } = router.query;
    const { 0: page , 1: setPage  } = (0,external_react_.useState)(null);
    (0,external_react_.useEffect)(()=>{
        if (!page_id) return;
        getPage(page_id, app_id).then((data)=>{
            setPage(data);
        });
    }, [
        app_id,
        page_id
    ]);
    (0,external_react_.useEffect)(()=>{
        (function() {
            if (document.getElementById("amis-root") && page && page.schema) {
                let amisScoped = (0,amis/* amisRender */.Ac)("#amis-root", JSON.parse(page.schema), {}, {}, {
                    router: router
                });
            }
        })();
    }, [
        page
    ]);
    return /*#__PURE__*/ jsx_runtime_.jsx(jsx_runtime_.Fragment, {
        children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
            id: "amis-root",
            className: "app-wrapper",
            onClick: (e)=>{
                return (0,amis/* amisRootClick */.oo)(router, e);
            }
        })
    });
};
async function getServerSideProps(context) {
    const session = context.req.session || await (0,next_.unstable_getServerSession)(context.req, context.res, _nextauth_/* authOptions */.L);
    if (!session) {
        return {
            redirect: {
                destination: "/login?callbackUrl=/app",
                permanent: false
            }
        };
    }
    return {
        props: {}
    };
}


/***/ }),

/***/ 2167:
/***/ ((module) => {

module.exports = require("axios");

/***/ }),

/***/ 9344:
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ 6517:
/***/ ((module) => {

module.exports = require("lodash");

/***/ }),

/***/ 3227:
/***/ ((module) => {

module.exports = require("next-auth");

/***/ }),

/***/ 2113:
/***/ ((module) => {

module.exports = require("next-auth/next");

/***/ }),

/***/ 7449:
/***/ ((module) => {

module.exports = require("next-auth/providers/credentials");

/***/ }),

/***/ 4899:
/***/ ((module) => {

module.exports = require("next-auth/providers/keycloak");

/***/ }),

/***/ 4140:
/***/ ((module) => {

module.exports = require("next/dist/server/get-page-files.js");

/***/ }),

/***/ 9716:
/***/ ((module) => {

module.exports = require("next/dist/server/htmlescape.js");

/***/ }),

/***/ 6368:
/***/ ((module) => {

module.exports = require("next/dist/server/utils.js");

/***/ }),

/***/ 6724:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/constants.js");

/***/ }),

/***/ 2796:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/head-manager-context.js");

/***/ }),

/***/ 8743:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/html-context.js");

/***/ }),

/***/ 8524:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/is-plain-object.js");

/***/ }),

/***/ 5832:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/loadable.js");

/***/ }),

/***/ 1853:
/***/ ((module) => {

module.exports = require("next/router");

/***/ }),

/***/ 6689:
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ 997:
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ }),

/***/ 6113:
/***/ ((module) => {

module.exports = require("crypto");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [952,859,152,282,295,345], () => (__webpack_exec__(5793)));
module.exports = __webpack_exports__;

})();