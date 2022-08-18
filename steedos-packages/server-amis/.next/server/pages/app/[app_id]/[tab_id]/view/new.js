"use strict";
(() => {
var exports = {};
exports.id = 234;
exports.ids = [234];
exports.modules = {

/***/ 5767:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ newRecord),
/* harmony export */   "getServerSideProps": () => (/* binding */ getServerSideProps)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5152);
/* harmony import */ var next_dynamic__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_dynamic__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_document__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6859);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1853);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _lib_objects__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6195);
/* harmony import */ var _components_AmisRender__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1095);
/* harmony import */ var next_auth_next__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(2113);
/* harmony import */ var next_auth_next__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(next_auth_next__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _pages_api_auth_nextauth___WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(6295);
/* harmony import */ var _headlessui_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(1185);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_headlessui_react__WEBPACK_IMPORTED_MODULE_9__]);
_headlessui_react__WEBPACK_IMPORTED_MODULE_9__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-13 18:06:23
 * @Description:
 */ 








function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
function newRecord({}) {
    var ref;
    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_4__.useRouter)();
    const { app_id , tab_id , record_id ="new"  } = router.query;
    const { 0: schema , 1: setSchema  } = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(null);
    const { 0: formFactor , 1: setFormFactor  } = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(null);
    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(()=>{
        if (window.innerWidth < 768) {
            setFormFactor("SMALL");
        } else {
            setFormFactor("LARGE");
        }
    }, []);
    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(()=>{
        editRecord(tab_id, record_id, formFactor);
    }, [
        formFactor
    ]);
    const editRecord = (tab_id, record_id, formFactor)=>{
        if (tab_id && record_id) {
            (0,_lib_objects__WEBPACK_IMPORTED_MODULE_5__/* .getFormSchema */ .KR)(tab_id, {
                recordId: record_id,
                tabId: tab_id,
                appId: app_id,
                formFactor: formFactor
            }).then((data)=>{
                setSchema(data);
            });
        }
    };
    const cancelClick = ()=>{
        router.back();
    };
    const submitClick = (e)=>{
        const scope = SteedosUI.getRef(SteedosUI.getRefId({
            type: "form",
            appId: app_id,
            name: schema.uiSchema.name
        }));
        const form = scope.getComponentByName(`page_edit_${record_id}.form_edit_${record_id}`);
        form.handleAction({}, {
            type: "submit"
        }).then((data)=>{
            if (data) {
                router.push(`/app/${app_id}/${tab_id}/view/${data.recordId}`);
            }
        });
    };
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "z-9 relative ",
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: "space-y-4",
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: "pointer-events-auto w-full text-[0.8125rem] leading-5",
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "",
                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                className: "flex justify-between",
                                children: [
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                        className: "inline-block text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-200 sm:text-3xl",
                                        children: [
                                            "\u521B\u5EFA ",
                                            schema === null || schema === void 0 ? void 0 : (ref = schema.uiSchema) === null || ref === void 0 ? void 0 : ref.label
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                        className: "ml-6 flex flex-nowrap space-x-2 fill-slate-400",
                                        children: [
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                                onClick: cancelClick,
                                                className: "antd-Button py-0.5 px-3 text-slate-700 border-solid border-1 border-gray-300 sm:rounded-[2px]",
                                                children: "\u53D6\u6D88"
                                            }),
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                                onClick: submitClick,
                                                className: "antd-Button bg-sky-500 py-0.5 px-3 font-semibold text-white hover:bg-sky-600 focus:outline-none sm:rounded-[2px]",
                                                children: "\u63D0\u4EA4"
                                            })
                                        ]
                                    })
                                ]
                            })
                        })
                    })
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "z-9 relative mt-2 ",
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_headlessui_react__WEBPACK_IMPORTED_MODULE_9__.Tab.Group, {
                    vertical: true,
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_9__.Tab.List, {
                            className: "flex space-x-1 p-2",
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_9__.Tab, {
                                className: ({ selected  })=>classNames("w-full max-w-[15rem] pb-2", "", selected ? "border-b-2 border-sky-500" : ""),
                                children: "\u57FA\u672C\u4FE1\u606F"
                            }, "detail")
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_9__.Tab.Panels, {
                            className: "mt-0",
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_9__.Tab.Panel, {
                                className: classNames("bg-white sm:rounded-b-xl", ""),
                                children: (schema === null || schema === void 0 ? void 0 : schema.amisSchema) && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_AmisRender__WEBPACK_IMPORTED_MODULE_6__/* .AmisRender */ .k, {
                                    id: SteedosUI.getRefId({
                                        type: "form",
                                        appId: app_id,
                                        name: schema.uiSchema.name
                                    }),
                                    schema: (schema === null || schema === void 0 ? void 0 : schema.amisSchema) || {},
                                    router: router
                                })
                            }, "detail")
                        })
                    ]
                })
            })
        ]
    });
};
async function getServerSideProps(context) {
    const session = context.req.session || await (0,next_auth_next__WEBPACK_IMPORTED_MODULE_7__.unstable_getServerSession)(context.req, context.res, _pages_api_auth_nextauth___WEBPACK_IMPORTED_MODULE_8__/* .authOptions */ .L);
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

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

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

/***/ 1185:
/***/ ((module) => {

module.exports = import("@headlessui/react");;

/***/ }),

/***/ 6113:
/***/ ((module) => {

module.exports = require("crypto");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [952,859,152,282,295,345,804,95], () => (__webpack_exec__(5767)));
module.exports = __webpack_exports__;

})();