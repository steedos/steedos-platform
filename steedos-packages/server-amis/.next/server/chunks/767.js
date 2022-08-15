"use strict";
exports.id = 767;
exports.ids = [767];
exports.modules = {

/***/ 2767:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "z": () => (/* binding */ Button)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_AmisRender__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1095);
/* harmony import */ var _lib_buttons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4413);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1853);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_3__);

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-27 17:34:25
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-09 16:52:45
 * @Description: 
 */ 


function Button(props) {
    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_3__.useRouter)();
    const { button , data , className , scopeClassName , inMore  } = props;
    const { dataComponentId  } = data;
    const buttonClick = ()=>{
        return (0,_lib_buttons__WEBPACK_IMPORTED_MODULE_2__/* .execute */ .ht)(button, Object.assign({}, data, {
            scope: SteedosUI.getRef(dataComponentId)
        })); //TODO 处理参数
    };
    if (button.type === "amis_action") {
        const schema = {
            type: "page",
            bodyClassName: "p-0",
            body: [
                {
                    type: "button",
                    label: button.label,
                    className: `${inMore ? "" : "slds-button slds-button_neutral"} ${className ? className : ""}`,
                    onEvent: {
                        click: {
                            actions: JSON.parse(button.amis_actions)
                        }
                    }
                }
            ],
            regions: [
                "body"
            ],
            data: {
                ...data
            }
        };
        return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_AmisRender__WEBPACK_IMPORTED_MODULE_1__/* .AmisRender */ .k, {
            id: SteedosUI.getRefId({
                type: "button",
                appId: data.app_id,
                name: button.name
            }),
            schema: schema,
            router: router,
            className: scopeClassName
        });
    } else {
        return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
            onClick: buttonClick,
            className: `slds-button slds-button_neutral ${className ? className : ""}`,
            children: button.label
        });
    }
}


/***/ }),

/***/ 4413:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "ht": () => (/* binding */ execute),
  "Iv": () => (/* binding */ getListViewButtons),
  "vU": () => (/* binding */ getObjectDetailButtons),
  "ud": () => (/* binding */ getObjectDetailMoreButtons)
});

// UNUSED EXPORTS: getButtons, standardButtonsTodo

// EXTERNAL MODULE: external "lodash"
var external_lodash_ = __webpack_require__(6517);
var external_lodash_default = /*#__PURE__*/__webpack_require__.n(external_lodash_);
;// CONCATENATED MODULE: ./src/lib/expression.js

const globalTag = "__G_L_O_B_A_L__";
const getParentPath = function(path) {
    var pathArr;
    if (typeof path === "string") {
        pathArr = path.split(".");
        if (pathArr.length === 1) {
            return "#";
        }
        pathArr.pop();
        return pathArr.join(".");
    }
    return "#";
};
const getValueByPath = function(formData, path) {
    if (path === "#" || !path) {
        return formData || {};
    } else if (typeof path === "string") {
        return external_lodash_.get(formData, path);
    } else {
        console.error("path has to be a string");
    }
};
const isExpression = function(func) {
    var pattern, reg1, reg2;
    if (typeof func !== "string") {
        return false;
    }
    pattern = /^{{(.+)}}$/;
    reg1 = /^{{(function.+)}}$/;
    reg2 = /^{{(.+=>.+)}}$/;
    if (typeof func === "string" && func.match(pattern) && !func.match(reg1) && !func.match(reg2)) {
        return true;
    }
    return false;
};
const parseSingleExpression = function(func, formData, dataPath, global, userSession = {}) {
    var error, funcBody, parent, parentPath, str;
    if (formData === void 0) {
        formData = {};
    }
    parentPath = getParentPath(dataPath);
    parent = getValueByPath(formData, parentPath) || {};
    if (typeof func === "string") {
        funcBody = func.substring(2, func.length - 2);
        str = `\n  var $user=${JSON.stringify(userSession)};   return ` + funcBody.replace(/\bformData\b/g, JSON.stringify(formData).replace(/\bglobal\b/g, globalTag)).replace(/\bglobal\b/g, JSON.stringify(global)).replace(new RegExp("\\b" + globalTag + "\\b", "g"), "global").replace(/rootValue/g, JSON.stringify(parent));
        try {
            return Function(str)();
        } catch (_error) {
            error = _error;
            console.log(error, func, dataPath);
            return func;
        }
    } else {
        return func;
    }
};

;// CONCATENATED MODULE: ./src/lib/buttons.js


const getGlobalData = ()=>{
    return {
        now: new Date()
    };
};
const isVisible = (button, ctx)=>{
    if (button._visible) {
        if (external_lodash_default().startsWith(external_lodash_default().trim(button._visible), "function")) {
            window.eval("var fun = " + button._visible);
            button.visible = fun;
        } else if (isExpression(button._visible)) {
            button.visible = (props)=>{
                parseSingleExpression(button._visible, props.record, "#", getGlobalData(), props.userSession);
            };
        }
    }
    if (external_lodash_default().isFunction(button.visible)) {
        try {
            return button.visible(ctx);
        } catch (error) {
        // console.error(`${button.name} visible error: ${error}`);
        }
    } else {
        return button.visible;
    }
};
// TODO
const standardButtonsTodo = {
    standard_new: (event, props)=>{
        props.router.push("/app/" + props.data.app_id + "/" + props.data.objectName + "/view/new");
    },
    standard_edit: (event, props)=>{},
    standard_delete: (event, props)=>{}
};
// TODO
const standardButtonsVisible = {
    standard_newVisible: (props)=>{}
};
const getButtons = (uiSchema, ctx)=>{
    const disabledButtons = uiSchema.permissions.disabled_actions;
    let buttons = external_lodash_default().sortBy(external_lodash_default().values(uiSchema.actions), "sort");
    if (external_lodash_default().has(uiSchema, "allow_customActions")) {
        buttons = external_lodash_default().filter(buttons, (button)=>{
            return external_lodash_default().include(uiSchema.allow_customActions, button.name) // || _.include(_.keys(Creator.getObject('base').actions) || {}, button.name)
            ;
        });
    }
    if (external_lodash_default().has(uiSchema, "exclude_actions")) {
        buttons = external_lodash_default().filter(buttons, (button)=>{
            return !external_lodash_default().include(uiSchema.exclude_actions, button.name);
        });
    }
    external_lodash_default().each(buttons, (button)=>{
        if (ctx.isMobile && [
            "record",
            "record_only"
        ].indexOf(button.on) > -1 && button.name != "standard_edit") {
            if (button.on == "record_only") {
                button.on = "record_only_more";
            } else {
                button.on = "record_more";
            }
        }
    });
    if (ctx.isMobile && [
        "cms_files",
        "cfs.files.filerecord"
    ].indexOf(uiSchema.name) > -1) {
        external_lodash_default().map(buttons, (button)=>{
            if (button.name === "standard_edit") {
                button.on = "record_more";
            }
            if (button.name === "download") {
                button.on = "record";
            }
        });
    }
    return external_lodash_default().filter(buttons, (button)=>{
        return external_lodash_default().indexOf(disabledButtons, button.name) < 0;
    });
};
const getListViewButtons = (uiSchema, ctx)=>{
    const buttons = getButtons(uiSchema, ctx);
    return external_lodash_default().filter(buttons, (button)=>{
        if (button.on == "list") {
            return isVisible(button, ctx);
        }
        return false;
    });
};
const getObjectDetailButtons = (uiSchema, ctx)=>{
    const buttons = getButtons(uiSchema, ctx);
    return external_lodash_default().filter(buttons, (button)=>{
        if (button.on == "record" || button.on == "record_only") {
            return isVisible(button, ctx);
        }
        return false;
    });
};
const getObjectDetailMoreButtons = (uiSchema, ctx)=>{
    const buttons = getButtons(uiSchema, ctx);
    return external_lodash_default().filter(buttons, (button)=>{
        if (button.on == "record_more" || button.on == "record_only_more") {
            return isVisible(button, ctx);
        }
        return false;
    });
};
const execute = (button, props)=>{
    if (!button.todo) {
        return; //TODO 弹出提示未配置todo
    }
    if (external_lodash_default().isString(button.todo)) {
        if (external_lodash_default().startsWith(external_lodash_default().trim(button.todo), "function")) {
            window.eval("var fun = " + button.todo);
            button.todo = fun;
        }
    }
    if (external_lodash_default().isFunction(button.todo)) {
        return button.todo.apply({}, [
            props
        ]);
    }
};


/***/ })

};
;