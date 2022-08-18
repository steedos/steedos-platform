(() => {
var exports = {};
exports.id = 888;
exports.ids = [888];
exports.modules = {

/***/ 9768:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "L": () => (/* binding */ AppLayout)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_Navbar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7134);
/* harmony import */ var _components_Sidebar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6798);
/* harmony import */ var _lib_apps__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2593);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1853);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _lib_steedos_client__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(8282);
/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(1649);
/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(next_auth_react__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _components_AppLauncherBar__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(1571);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_components_Navbar__WEBPACK_IMPORTED_MODULE_2__]);
_components_Navbar__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 09:31:04
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-11 18:11:49
 * @Description:  
 */ 







function AppLayout({ children  }) {
    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_5__.useRouter)();
    const { app_id , tab_id  } = router.query;
    const { 0: app , 1: setApp  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const { 0: selected , 1: setSelected  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(tab_id);
    const { data: session  } = (0,next_auth_react__WEBPACK_IMPORTED_MODULE_7__.useSession)();
    if (session) {
        (0,_lib_steedos_client__WEBPACK_IMPORTED_MODULE_6__/* .setSteedosAuth */ .sq)(session.steedos.space, session.steedos.token, session.steedos.userId, session.steedos.name);
    }
    // 默认进入第一个tab
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        if (!selected && (app === null || app === void 0 ? void 0 : app.children[0])) {
            router.push(app.children[0].path);
            setSelected(app.children[0].id);
        }
    }, [
        app
    ]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        setSelected(tab_id);
    }, [
        tab_id
    ]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        if (!app_id || !session) return;
        (0,_lib_apps__WEBPACK_IMPORTED_MODULE_4__/* .getApp */ .M)(app_id).then((data)=>{
            setApp(data);
        });
    }, [
        app_id,
        session
    ]);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: "h-full flex flex-col",
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_Navbar__WEBPACK_IMPORTED_MODULE_2__/* .Navbar */ .w, {
                navigation: app === null || app === void 0 ? void 0 : app.children,
                selected: selected,
                app: app
            }),
            session && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        className: "hidden lg:block fixed z-20 inset-0 top-[3rem] right-auto w-[16rem] overflow-y-auto bg-slate-50 border-r border-slate-200",
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                className: "slds-context-bar h-12 pl-3 pt-1",
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_AppLauncherBar__WEBPACK_IMPORTED_MODULE_8__/* .AppLauncherBar */ .A, {
                                    app: app
                                })
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_Sidebar__WEBPACK_IMPORTED_MODULE_3__/* .Sidebar */ .Y, {
                                navigation: app === null || app === void 0 ? void 0 : app.children,
                                selected: selected
                            })
                        ]
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: "lg:pl-[16rem] lg:m-6",
                        children: children
                    })
                ]
            })
        ]
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 278:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";

;// CONCATENATED MODULE: external "antd"
const external_antd_namespaceObject = require("antd");
// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_);
;// CONCATENATED MODULE: external "react-dom/client"
const client_namespaceObject = require("react-dom/client");
// EXTERNAL MODULE: external "lodash"
var external_lodash_ = __webpack_require__(6517);
var external_lodash_default = /*#__PURE__*/__webpack_require__.n(external_lodash_);
;// CONCATENATED MODULE: ./src/components/functions/modal.jsx

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:36:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-15 10:37:37
 * @Description: 
 */ 



const newFunctionComponent = (Component)=>{
    return (props)=>{
        // const ref = useRef(null);
        const { 0: isVisible , 1: setIsVisible  } = (0,external_react_.useState)(true);
        const defProps = {
            width: "70%",
            style: {
                width: "70%",
                maxWidth: "950px",
                minWidth: "480px"
            }
        };
        const show = ()=>{
            setIsVisible(true);
        };
        const close = ()=>{
            setIsVisible(false);
        };
        if (!(0,external_lodash_.has)(props, "ref")) {
            window.SteedosUI.refs[props.name] = {
                show: show,
                close: close
            };
        }
        return /*#__PURE__*/ jsx_runtime_.jsx(Component, {
            visible: isVisible,
            onCancel: close,
            onClose: close,
            ...defProps,
            ...props
        }) //ref={ref}
        ;
    };
};
const newComponentRender = (prefix, Component)=>{
    return (props, container)=>{
        if (!props.name) {
            props.name = `${prefix}-${props.name || "default"}`;
        }
        if (!container) {
            container = document.getElementById(`steedos-${prefix}-root-${props.name}`);
            if (!container) {
                container = document.createElement("div");
                container.setAttribute("id", `steedos-${prefix}-root-${props.name}`);
                document.body.appendChild(container);
            }
        }
        const element = /*#__PURE__*/ external_react_default().createElement(newFunctionComponent(Component), props);
        const root = (0,client_namespaceObject.createRoot)(container);
        root.render(element);
    };
};
const Modal = (0,external_lodash_.assign)(newComponentRender("modal", external_antd_namespaceObject.Modal), {
    info: external_antd_namespaceObject.Modal.info,
    success: external_antd_namespaceObject.Modal.success,
    error: external_antd_namespaceObject.Modal.error,
    warning: external_antd_namespaceObject.Modal.warning,
    confirm: external_antd_namespaceObject.Modal.confirm
});
const Drawer = newComponentRender("drawer", external_antd_namespaceObject.Drawer);

// EXTERNAL MODULE: ./src/components/AmisRender.jsx
var AmisRender = __webpack_require__(1095);
// EXTERNAL MODULE: ./src/lib/objects.js + 4 modules
var objects = __webpack_require__(6195);
;// CONCATENATED MODULE: ./src/components/object/Form.jsx

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-27 17:34:25
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-09 16:44:59
 * @Description: 
 */ 


function Form({ appId , objectName , recordId , className , data  }) {
    const { 0: schema , 1: setSchema  } = (0,external_react_.useState)(null);
    const { 0: formFactor , 1: setFormFactor  } = (0,external_react_.useState)(null);
    (0,external_react_.useEffect)(()=>{
        if (window.innerWidth < 768) {
            setFormFactor("SMALL");
        } else {
            setFormFactor("LARGE");
        }
    }, []);
    (0,external_react_.useEffect)(()=>{
        if (objectName && recordId) {
            (0,objects/* getFormSchema */.KR)(objectName, {
                recordId: recordId,
                tabId: objectName,
                appId: appId,
                formFactor: formFactor
            }).then((data)=>{
                setSchema(data);
            });
        }
    }, [
        formFactor
    ]);
    return /*#__PURE__*/ jsx_runtime_.jsx(jsx_runtime_.Fragment, {
        children: schema && /*#__PURE__*/ jsx_runtime_.jsx(AmisRender/* AmisRender */.k, {
            id: SteedosUI.getRefId({
                type: "form",
                appId: appId,
                name: objectName
            }),
            schema: schema.amisSchema,
            data: data,
            className: className
        })
    });
}

// EXTERNAL MODULE: ./src/lib/steedos.client.js
var steedos_client = __webpack_require__(8282);
;// CONCATENATED MODULE: ./src/components/functions/sObject.jsx





const editRecordHandle = (props)=>{
    const { appId , name , title , objectName , recordId , type , options , router , refId , data , onSubmitted , onCancel  } = props;
    if (type === "modal") {
        SteedosUI.Modal(Object.assign({
            name: name,
            title: title,
            destroyOnClose: true,
            maskClosable: false,
            keyboard: false,
            // footer: null,
            cancelText: "\u53D6\u6D88",
            okText: "\u786E\u5B9A",
            onOk: (e)=>{
                const scope = SteedosUI.getRef(SteedosUI.getRefId({
                    type: `form`,
                    appId: appId,
                    name: objectName
                }));
                const form = scope.getComponentByName(`page_edit_${recordId}.form_edit_${recordId}`);
                form.handleAction({}, {
                    type: "submit"
                }).then((data)=>{
                    if (data) {
                        SteedosUI.getRef(name).close();
                        if ((0,external_lodash_.isFunction)(onSubmitted)) {
                            onSubmitted(e, data);
                        }
                    }
                });
            },
            onCancel: (e)=>{
                SteedosUI.getRef(name).close();
                if ((0,external_lodash_.isFunction)(onCancel)) {
                    onCancel(e);
                }
            },
            bodyStyle: {
                padding: "0px",
                paddingTop: "12px"
            },
            children: /*#__PURE__*/ jsx_runtime_.jsx(Form, {
                appId: appId,
                objectName: objectName,
                recordId: recordId,
                data: data
            })
        }, options === null || options === void 0 ? void 0 : options.props));
    } else if (type === "drawer") {
        SteedosUI.Drawer(Object.assign({
            name: name,
            title: title,
            destroyOnClose: true,
            maskClosable: false,
            footer: null,
            bodyStyle: {
                padding: "0px",
                paddingTop: "12px"
            },
            children: /*#__PURE__*/ jsx_runtime_.jsx(Form, {
                appId: appId,
                objectName: objectName,
                recordId: recordId,
                data: data
            }),
            mask: false,
            size: "large",
            style: null,
            extra: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(external_antd_namespaceObject.Space, {
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(external_antd_namespaceObject.Button, {
                        onClick: (e)=>{
                            SteedosUI.getRef(name).close();
                            if ((0,external_lodash_.isFunction)(onCancel)) {
                                onCancel(e);
                            }
                        },
                        children: "\u53D6\u6D88"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(external_antd_namespaceObject.Button, {
                        type: "primary",
                        onClick: (e)=>{
                            const scope = SteedosUI.getRef(SteedosUI.getRefId({
                                type: `form`,
                                appId: appId,
                                name: objectName
                            }));
                            const form = scope.getComponentByName(`page_edit_${recordId}.form_edit_${recordId}`);
                            form.handleAction({}, {
                                type: "submit"
                            }).then((data)=>{
                                if (data) {
                                    SteedosUI.getRef(name).close();
                                    if ((0,external_lodash_.isFunction)(onSubmitted)) {
                                        onSubmitted(e, data);
                                    }
                                }
                            });
                        },
                        children: "\u786E\u8BA4"
                    })
                ]
            })
        }, options === null || options === void 0 ? void 0 : options.props));
    } else {
        router.push(`/app/${appId}/${objectName}/view/new`);
    }
};
const getGraphqlFieldsQuery = (fields)=>{
    const fieldsName = [
        "_id"
    ];
    fields.push("record_permissions");
    //TODO 此处需要考虑相关对象查询
    (0,external_lodash_.each)(fields, (fieldName)=>{
        if (fieldName.indexOf(".") > -1) {
            fieldName = fieldName.split(".")[0];
        }
        fieldsName.push(`${fieldName}`);
    });
    return `${fieldsName.join(" ")}`;
};
const getFindOneQuery = (objectName, id, fields)=>{
    objectName = objectName.replace(/\./g, "_");
    const queryFields = getGraphqlFieldsQuery(fields);
    let queryOptions = "";
    let alias = "record";
    const queryOptionsArray = [
        `id: "${id}"`
    ];
    if (queryOptionsArray.length > 0) {
        queryOptions = `(${queryOptionsArray.join(",")})`;
    }
    return `{${alias}:${objectName}__findOne${queryOptions}{${queryFields}}}`;
};
const SObject = {
    //TODO 清理router参数传递
    newRecord: (props)=>{
        return editRecordHandle(props);
    },
    editRecord: (props)=>{
        return editRecordHandle(props);
    },
    getRecord: async (objectName, recordId, fields)=>{
        const result = await (0,steedos_client/* fetchAPI */.Io)("/graphql", {
            method: "post",
            body: JSON.stringify({
                query: getFindOneQuery(objectName, recordId, fields)
            })
        });
        return result.data.record;
    }
};

;// CONCATENATED MODULE: ./src/components/functions/amis.jsx
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-02 11:19:09
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-05 11:15:42
 * @Description:
 */ // # 日期类型: date, datetime  支持操作符: "=", "<>", "<", ">", "<=", ">="
// # 文本类型: text, textarea, html  支持操作符: "=", "<>", "contains", "notcontains", "startswith"
// # 选择类型: lookup, master_detail, select 支持操作符: "=", "<>"
// # 数值类型: currency, number  支持操作符: "=", "<>", "<", ">", "<=", ">="
// # 布尔类型: boolean  支持操作符: "=", "<>"
// # 数组类型: checkbox, [text]  支持操作符: "=", "<>"

const DATE_DATETIME_BETWEEN_VALUES = [
    "last_year",
    "this_year",
    "next_year",
    "last_quarter",
    "this_quarter",
    "next_quarter",
    "last_month",
    "this_month",
    "next_month",
    "last_week",
    "this_week",
    "next_week",
    "yestday",
    "today",
    "tomorrow",
    "last_7_days",
    "last_30_days",
    "last_60_days",
    "last_90_days",
    "last_120_days",
    "next_7_days",
    "next_30_days",
    "next_60_days",
    "next_90_days",
    "next_120_days", 
];
/**
 *
 */ const opMaps = {
    equal: "=",
    not_equal: "!=",
    less: "<",
    less_or_equal: "<=",
    greater: ">",
    greater_or_equal: ">=",
    between: "between",
    not_between: "not_between",
    is_empty: "is_empty",
    is_not_empty: "is_not_empty",
    select_equals: "=",
    select_not_equals: "!=",
    select_any_in: "in",
    select_not_any_in: "<>",
    like: "contains",
    not_like: "notcontains",
    starts_with: "startswith",
    ends_with: "endswith"
};
const isGroup = (item)=>{
    return _.has(item, "conjunction");
};
const conditionGroupToFilters = (group)=>{
    const filters = [];
    const { conjunction , children  } = group;
    if (conjunction && children) {
        children.forEach((item)=>{
            if (filters.length > 0) {
                filters.push(conjunction);
            }
            if (isGroup(item)) {
                const filter = conditionGroupToFilters(item);
                if (filter && filter.length > 0) {
                    filters.push(filter);
                }
            } else {
                const filter1 = conditionItemToFilters(item);
                if (filter1) {
                    filters.push(filter1);
                }
            }
        });
    }
    return filters;
};
const conditionItemToFilters = (item)=>{
    const { left , op , right  } = item;
    if (left && left.type === "field") {
        if (op) {
            if (op.startsWith("between:")) {
                const array = op.split(":");
                return [
                    left.field,
                    array[0],
                    array[1]
                ];
            } else {
                if (right != null) {
                    return [
                        left.field,
                        opMaps[op],
                        right
                    ];
                }
            }
        }
    }
};
// const conditionChildrenToFilters = (children)=>{
// }
const filterToConditionItem = (filter)=>{
    if (filter.length === 3) {
        const op = external_lodash_default().findKey(opMaps, (value)=>{
            return value === filter[1];
        });
        if (op === "between" && external_lodash_default().includes(DATE_DATETIME_BETWEEN_VALUES, filter[2])) {
            return {
                left: {
                    type: "field",
                    field: filter[0]
                },
                op: `${op}:${filter[2]}`
            };
        } else {
            return {
                left: {
                    type: "field",
                    field: filter[0]
                },
                op: op,
                right: filter[2]
            };
        }
    } else {
        console.warn(`无效的filter:${JSON.stringify(filter)}`);
    }
};
const filterObjectToArray = (filter)=>{
    if (!external_lodash_default().isArray(filter) && external_lodash_default().isObject(filter)) {
        return [
            filter.field,
            filter.operation,
            filter.value
        ];
    }
    return filter;
};
const filtersToConditionGroup = (filters)=>{
    filters = filterObjectToArray(filters);
    const conditions = {
        conjunction: "and",
        children: []
    };
    if (!filters || filters.length == 0) {
        return conditions;
    }
    filters.forEach((filter)=>{
        filter = filterObjectToArray(filter);
        if (filter === "or" || filter === "and") {
            conditions.conjunction = filter;
        } else {
            if (filter.length === 3 && filter.indexOf("and") == -1 && filter.indexOf("or") == -1) {
                conditions.children.push(filterToConditionItem(filter));
            } else {
                conditions.children.push(filtersToConditionGroup(filter));
            }
        }
    });
    return conditions;
};
const conditionsToFilters = (conditions)=>{
    return conditionGroupToFilters(conditions);
};
const filtersToConditions = (filters)=>{
    return filtersToConditionGroup(filters);
};

;// CONCATENATED MODULE: ./src/components/functions/listView.jsx

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-04 17:10:53
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-05 15:56:49
 * @Description: 
 */ 





const filtersAmisSchema = __webpack_require__(575);
const canSaveFilter = (listView)=>{
    var ref;
    if (listView._id && listView.owner === ((ref = (0,steedos_client/* getSteedosAuth */.Z0)()) === null || ref === void 0 ? void 0 : ref.userId)) {
        return true;
    } else {
        return false;
    }
};
const saveFilters = async (listView, filters)=>{
    const api = "/api/listview/filters";
    await (0,steedos_client/* fetchAPI */.Io)(api, {
        method: "post",
        body: JSON.stringify({
            id: listView._id,
            filters: filters
        })
    });
    await (0,objects/* getUISchema */.NW)(listView.object_name, true);
};
const ListView = {
    showFilter: (objectName, { listView , data , props , onFilterChange  })=>{
        const pageName = `${objectName}-list-filter`;
        const amisScopeId = `amis-${pageName}`;
        const canSave = canSaveFilter(listView);
        if (data.filters) {
            data.filters = filtersToConditions(data.filters);
        }
        SteedosUI.Drawer(Object.assign({
            name: pageName,
            title: "\u8FC7\u6EE4\u5668",
            destroyOnClose: true,
            maskClosable: false,
            footer: null,
            bodyStyle: {
                padding: "0px",
                paddingTop: "12px"
            },
            children: /*#__PURE__*/ jsx_runtime_.jsx(AmisRender/* AmisRender */.k, {
                id: amisScopeId,
                schema: filtersAmisSchema,
                data: {
                    data: Object.assign({}, data, {
                        objectName: objectName
                    })
                }
            }),
            mask: false,
            width: 550,
            style: null,
            extra: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(external_antd_namespaceObject.Space, {
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(external_antd_namespaceObject.Button, {
                        onClick: (e)=>{
                            SteedosUI.getRef(pageName).close();
                        },
                        children: "\u53D6\u6D88"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(external_antd_namespaceObject.Button, {
                        type: "primary",
                        onClick: async (e)=>{
                            const formValues = SteedosUI.getRef(amisScopeId).getComponentById("filtersForm").getValues();
                            const filters = conditionsToFilters(formValues.filters);
                            if (canSave) {
                                saveFilters(listView, filters);
                            }
                            if ((0,external_lodash_.isFunction)(onFilterChange)) {
                                onFilterChange(filters);
                            }
                            SteedosUI.getRef(pageName).close();
                        },
                        children: canSave ? "\u4FDD\u5B58" : "\u5E94\u7528"
                    })
                ]
            })
        }, props));
    },
    getVisibleFilter: (listView, userFilter)=>{
        if (userFilter) {
            return userFilter;
        }
        ;
        const canSave = canSaveFilter(listView);
        if (canSave) {
            return listView.filters;
        }
    },
    getQueryFilter: (listView, userFilter)=>{
        const canSave = canSaveFilter(listView);
        if (canSave) {
            return getVisibleFilter(listView, userFilter);
        } else {
            if ((0,external_lodash_.isEmpty)(userFilter)) {
                return listView.filters;
            } else {
                return [
                    listView.filters,
                    "and",
                    userFilter
                ];
            }
        }
    }
};

;// CONCATENATED MODULE: ./src/components/functions/field.jsx

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-06 13:33:37
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-08 15:21:25
 * @Description: 
 */ 

const schema = __webpack_require__(4056);
const Field = {
    showFieldsTransfer: (objectName, data, onOk, onCancel)=>{
        const name = `${objectName}-fields-transfer`;
        const amisScopeId = `amis-${name}`;
        SteedosUI.Modal(Object.assign({
            name: name,
            title: "\u9009\u62E9\u5B57\u6BB5",
            destroyOnClose: true,
            maskClosable: false,
            keyboard: false,
            // footer: null,
            cancelText: "\u53D6\u6D88",
            okText: "\u786E\u5B9A",
            onOk: async (e)=>{
                const formValues = SteedosUI.getRef(amisScopeId).getComponentByName("page.form").getValues();
                SteedosUI.getRef(name).close();
                return await onOk(formValues);
            },
            onCancel: (e)=>{
                SteedosUI.getRef(name).close();
                if ((0,external_lodash_.isFunction)(onCancel)) {
                    onCancel(e);
                }
            },
            bodyStyle: {
                padding: "0px",
                paddingTop: "12px"
            },
            children: /*#__PURE__*/ jsx_runtime_.jsx(AmisRender/* AmisRender */.k, {
                id: amisScopeId,
                schema: schema,
                data: {
                    data: Object.assign({}, data, {
                        objectName: objectName
                    })
                }
            })
        }, {}));
    }
};

;// CONCATENATED MODULE: ./src/components/functions/index.jsx
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-27 15:54:12
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-09 10:55:17
 * @Description: 
 */ 




const functions_SteedosUI = Object.assign({}, {
    Field: Field,
    ListView: ListView,
    Object: SObject,
    Modal: Modal,
    Drawer: Drawer,
    refs: {},
    getRef (name) {
        return functions_SteedosUI.refs[name];
    },
    router: ()=>{
    // TODO
    },
    message: external_antd_namespaceObject.message,
    notification: external_antd_namespaceObject.notification,
    components: {
        Button: external_antd_namespaceObject.Button,
        Space: external_antd_namespaceObject.Space
    },
    getRefId: ({ type , appId , name  })=>{
        switch(type){
            case "listview":
                return `amis-${appId}-${name}-listview`;
            case "form":
                return `amis-${appId}-${name}-form`;
            case "detail":
                return `amis-${appId}-${name}-detail`;
            default:
                return `amis-${appId}-${name}-${type}`;
        }
    }
});
if (false) {}


/***/ }),

/***/ 2654:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ App)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1649);
/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth_react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var focus_visible__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2235);
/* harmony import */ var focus_visible__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(focus_visible__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var antd_dist_antd_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4722);
/* harmony import */ var antd_dist_antd_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(antd_dist_antd_css__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_AppLayout__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9768);
/* harmony import */ var _components_functions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(278);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_components_AppLayout__WEBPACK_IMPORTED_MODULE_4__]);
_components_AppLayout__WEBPACK_IMPORTED_MODULE_4__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-10 15:30:24
 * @Description: 
 */ 






function App({ Component , pageProps: { session , ...pageProps } ,  }) {
    const Layout = Component.getLayout ? Component.getLayout() : _components_AppLayout__WEBPACK_IMPORTED_MODULE_4__/* .AppLayout */ .L;
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_auth_react__WEBPACK_IMPORTED_MODULE_1__.SessionProvider, {
        session: session,
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Layout, {
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Component, {
                ...pageProps
            })
        })
    });
};

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 4722:
/***/ (() => {



/***/ }),

/***/ 8768:
/***/ ((module) => {

"use strict";
module.exports = require("@heroicons/react/outline");

/***/ }),

/***/ 1143:
/***/ ((module) => {

"use strict";
module.exports = require("@heroicons/react/solid");

/***/ }),

/***/ 2235:
/***/ ((module) => {

"use strict";
module.exports = require("focus-visible");

/***/ }),

/***/ 6517:
/***/ ((module) => {

"use strict";
module.exports = require("lodash");

/***/ }),

/***/ 1649:
/***/ ((module) => {

"use strict";
module.exports = require("next-auth/react");

/***/ }),

/***/ 3280:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/app-router-context.js");

/***/ }),

/***/ 2796:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/head-manager-context.js");

/***/ }),

/***/ 4014:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/i18n/normalize-locale-path.js");

/***/ }),

/***/ 8524:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/is-plain-object.js");

/***/ }),

/***/ 8020:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/mitt.js");

/***/ }),

/***/ 4406:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/page-path/denormalize-page-path.js");

/***/ }),

/***/ 4964:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router-context.js");

/***/ }),

/***/ 1751:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/add-path-prefix.js");

/***/ }),

/***/ 299:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/format-next-pathname-info.js");

/***/ }),

/***/ 3938:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/format-url.js");

/***/ }),

/***/ 9565:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/get-asset-path-from-route.js");

/***/ }),

/***/ 5789:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/get-next-pathname-info.js");

/***/ }),

/***/ 1428:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/is-dynamic.js");

/***/ }),

/***/ 8854:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/parse-path.js");

/***/ }),

/***/ 1292:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/parse-relative-url.js");

/***/ }),

/***/ 4567:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/path-has-prefix.js");

/***/ }),

/***/ 979:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/querystring.js");

/***/ }),

/***/ 3297:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/remove-trailing-slash.js");

/***/ }),

/***/ 6052:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/resolve-rewrites.js");

/***/ }),

/***/ 4226:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/route-matcher.js");

/***/ }),

/***/ 5052:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/route-regex.js");

/***/ }),

/***/ 9232:
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/utils.js");

/***/ }),

/***/ 1853:
/***/ ((module) => {

"use strict";
module.exports = require("next/router");

/***/ }),

/***/ 6689:
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ 997:
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ 1185:
/***/ ((module) => {

"use strict";
module.exports = import("@headlessui/react");;

/***/ }),

/***/ 4056:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"type":"page","body":[{"type":"form","mode":"normal","persistData":false,"promptPageLeave":true,"name":"form","debug":false,"title":"","body":[{"label":"","type":"transfer","name":"fields","options":[],"id":"u:92c0b3cccca0","required":true,"placeholder":"-","source":{"method":"get","url":"${context.rootUrl}/service/api/amis-metadata-objects/objects/${objectName}/fields/options","data":null,"requestAdaptor":"","adaptor":"","dataType":"json","headers":{"Authorization":"Bearer ${context.tenantId},${context.authToken}"}},"className":"col-span-2 m-0","checkAll":false,"searchable":true,"sortable":true,"joinValues":false,"extractValue":true}],"actions":[],"panelClassName":"m-0","bodyClassName":"p-4","className":"steedos-amis-form"}],"regions":["body"],"data":{},"bodyClassName":"p-0","name":"page","initApi":null,"initFetch":null}');

/***/ }),

/***/ 575:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"type":"page","title":"过滤器","name":"steedos-filters","body":[{"type":"form","title":"过滤器","body":[{"label":"","type":"condition-builder","name":"filters","description":"","id":"filters","source":{"method":"get","url":"${context.rootUrl}/service/api/amis-metadata-listviews/getFilterFields?objectName=${objectName}","dataType":"json","headers":{"Authorization":"Bearer ${context.tenantId},${context.authToken}"}},"disabled":false}],"id":"filtersForm","wrapWithPanel":false}],"regions":["body"],"data":{"recordId":"","initialValues":{},"appId":"builder","title":""}}');

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [952,664,282,345,804,95,79,939], () => (__webpack_exec__(2654)));
module.exports = __webpack_exports__;

})();