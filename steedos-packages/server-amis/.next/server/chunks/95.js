"use strict";
exports.id = 95;
exports.ids = [95];
exports.modules = {

/***/ 1095:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "k": () => (/* binding */ AmisRender)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lib_amis__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9345);
/* harmony import */ var _lib_steedos_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8282);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6517);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_3__);

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 16:55:58
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-10 13:43:54
 * @Description: 
 */ 




const AmisRender = ({ id , schema , data , router , className ,  })=>{
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        const steedosAuth = (0,_lib_steedos_client__WEBPACK_IMPORTED_MODULE_2__/* .getSteedosAuth */ .Z0)();
        const defData = (0,lodash__WEBPACK_IMPORTED_MODULE_3__.defaultsDeep)({}, data, {
            data: {
                context: {
                    rootUrl: (0,_lib_steedos_client__WEBPACK_IMPORTED_MODULE_2__/* .getRootUrl */ .N0)(),
                    userId: steedosAuth.userId,
                    tenantId: steedosAuth.space,
                    authToken: steedosAuth.token
                }
            }
        });
        // 如果已存在,则先销毁, 再创建新实例
        if (SteedosUI.refs[id]) {
            try {
                SteedosUI.refs[id].unmount();
            } catch (error) {
                console.error(`error`, id);
            }
        }
        SteedosUI.refs[id] = (0,_lib_amis__WEBPACK_IMPORTED_MODULE_4__/* .amisRender */ .Ac)(`#${id}`, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.defaultsDeep)(defData, schema), data, {}, {
            router: router
        });
    }, [
        schema
    ]);
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        id: `${id}`,
        className: `app-wrapper ${className}`,
        onClick: (e)=>{
            return (0,_lib_amis__WEBPACK_IMPORTED_MODULE_4__/* .amisRootClick */ .oo)(router, e);
        }
    });
};


/***/ })

};
;