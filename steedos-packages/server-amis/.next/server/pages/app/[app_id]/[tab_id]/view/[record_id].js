"use strict";
(() => {
var exports = {};
exports.id = 866;
exports.ids = [866];
exports.modules = {

/***/ 2917:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "b": () => (/* binding */ RecordHeader)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1853);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _headlessui_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1185);
/* harmony import */ var _lib_buttons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4413);
/* harmony import */ var _components_object_Button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2767);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(7733);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_headlessui_react__WEBPACK_IMPORTED_MODULE_3__]);
_headlessui_react__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];







function RecordHeader({ schema  }) {
    var ref, ref1, ref2, ref3;
    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();
    const { app_id , tab_id , record_id  } = router.query;
    const { 0: record , 1: setRecord  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const { 0: buttons , 1: setButtons  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const { 0: moreButtons , 1: setMoreButtons  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const editRecord = ()=>{
        const type = _config__WEBPACK_IMPORTED_MODULE_6__/* ["default"].listView.editRecordMode */ .Z.listView.editRecordMode;
        SteedosUI.Object.editRecord({
            appId: app_id,
            name: SteedosUI.getRefId({
                type: `${type}-form`
            }),
            title: `编辑 ${schema.uiSchema.label}`,
            objectName: schema.uiSchema.name,
            recordId: record_id,
            type,
            options: {},
            router,
            onSubmitted: ()=>{
                SteedosUI.getRef(SteedosUI.getRefId({
                    type: "detail",
                    appId: app_id,
                    name: schema.uiSchema.name
                })).getComponentById(`detail_${record_id}`).reload();
            }
        });
    };
    const loadButtons = (schema)=>{
        if (schema && schema.uiSchema) {
            setButtons((0,_lib_buttons__WEBPACK_IMPORTED_MODULE_4__/* .getObjectDetailButtons */ .vU)(schema.uiSchema, {
                app_id: app_id,
                tab_id: tab_id,
                router: router
            }));
            setMoreButtons((0,_lib_buttons__WEBPACK_IMPORTED_MODULE_4__/* .getObjectDetailMoreButtons */ .ud)(schema.uiSchema, {
                app_id: app_id,
                tab_id: tab_id,
                router: router
            }));
        }
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        if (schema) {
            loadButtons(schema);
            window.addEventListener("message", function(event) {
                const { data  } = event;
                if (data.type === "record.loaded") {
                    const { record  } = data;
                    setRecord(record);
                }
            });
        }
    }, [
        schema
    ]);
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: "slds-page-header slds-page-header_record-home bg-white shadow-none border-none p-0 pb-4",
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: "slds-page-header__row",
            children: [
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: "slds-page-header__col-title",
                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        className: "slds-media",
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                className: "slds-media__figure",
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                    className: "slds-icon_container slds-icon-standard-opportunity",
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("svg", {
                                        className: "slds-icon slds-page-header__icon",
                                        "aria-hidden": "true",
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("use", {
                                            xlinkHref: `/assets/icons/standard-sprite/svg/symbols.svg#${schema.uiSchema.icon}`
                                        })
                                    })
                                })
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                className: "slds-media__body",
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                    className: "slds-page-header__name",
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                        className: "slds-page-header__name-title",
                                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                            className: "",
                                            children: [
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                    children: schema === null || schema === void 0 ? void 0 : (ref = schema.uiSchema) === null || ref === void 0 ? void 0 : ref.label
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                    className: "slds-page-header__title slds-truncate",
                                                    children: record ? record[schema === null || schema === void 0 ? void 0 : (ref1 = schema.uiSchema) === null || ref1 === void 0 ? void 0 : ref1.NAME_FIELD_KEY] : ""
                                                })
                                            ]
                                        })
                                    })
                                })
                            })
                        ]
                    })
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: "slds-page-header__col-actions",
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: "slds-page-header__controls",
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "slds-page-header__control",
                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                                className: "slds-button-group-list",
                                children: [
                                    (schema === null || schema === void 0 ? void 0 : (ref2 = schema.uiSchema) === null || ref2 === void 0 ? void 0 : (ref3 = ref2.permissions) === null || ref3 === void 0 ? void 0 : ref3.allowEdit) && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                            onClick: editRecord,
                                            className: "slds-button slds-button_neutral",
                                            children: "\u7F16\u8F91"
                                        })
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                                        children: [
                                            buttons === null || buttons === void 0 ? void 0 : buttons.map((button)=>{
                                                return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_object_Button__WEBPACK_IMPORTED_MODULE_5__/* .Button */ .z, {
                                                        button: button,
                                                        data: {
                                                            app_id: app_id,
                                                            tab_id: tab_id,
                                                            object_name: schema.uiSchema.name,
                                                            dataComponentId: `${app_id}-${tab_id}-${record_id}`
                                                        }
                                                    })
                                                }, button.name);
                                            }),
                                            (moreButtons === null || moreButtons === void 0 ? void 0 : moreButtons.length) > 0 && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_headlessui_react__WEBPACK_IMPORTED_MODULE_3__.Menu, {
                                                    as: "div",
                                                    className: "slds-dropdown-trigger slds-dropdown-trigger_click",
                                                    children: [
                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_3__.Menu.Button, {
                                                                className: "slds-button slds-button_icon-border-filled slds-button_last",
                                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("svg", {
                                                                        focusable: "false",
                                                                        "data-key": "down",
                                                                        "aria-hidden": "true",
                                                                        className: "slds-button__icon",
                                                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("use", {
                                                                            xlinkHref: "/assets/icons/utility-sprite/svg/symbols.svg#down"
                                                                        })
                                                                    })
                                                                })
                                                            })
                                                        }),
                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_3__.Transition, {
                                                            as: react__WEBPACK_IMPORTED_MODULE_1__.Fragment,
                                                            enter: "transition ease-out duration-100",
                                                            enterFrom: "transform opacity-0 scale-95",
                                                            enterTo: "transform opacity-100 scale-100",
                                                            leave: "transition ease-in duration-75",
                                                            leaveFrom: "transform opacity-100 scale-100",
                                                            leaveTo: "transform opacity-0 scale-95",
                                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_3__.Menu.Items, {
                                                                className: "absolute right-0 z-10 mt-1 w-56 origin-top-right divide-y divide-gray-100 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:rounded-[2px]",
                                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                                    className: "",
                                                                    children: moreButtons.map((button, index)=>{
                                                                        return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_3__.Menu.Item, {
                                                                            children: ({ active  })=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_object_Button__WEBPACK_IMPORTED_MODULE_5__/* .Button */ .z, {
                                                                                    button: button,
                                                                                    inMore: true,
                                                                                    data: {
                                                                                        app_id: app_id,
                                                                                        tab_id: tab_id,
                                                                                        object_name: schema.uiSchema.name
                                                                                    },
                                                                                    className: `${active ? "bg-violet-500 text-white" : "text-gray-900"} slds-dropdown__item group flex w-full items-center border-0 px-2 py-2`
                                                                                })
                                                                        }, index);
                                                                    })
                                                                })
                                                            })
                                                        })
                                                    ]
                                                })
                                            })
                                        ]
                                    })
                                ]
                            })
                        })
                    })
                })
            ]
        })
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 6479:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "S": () => (/* binding */ RecordRelateds)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
// EXTERNAL MODULE: ./src/components/AmisRender.jsx
var AmisRender = __webpack_require__(1095);
// EXTERNAL MODULE: external "next/router"
var router_ = __webpack_require__(1853);
// EXTERNAL MODULE: ./src/components/object/RecordRelatedListButtons.jsx
var RecordRelatedListButtons = __webpack_require__(5125);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(1664);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
;// CONCATENATED MODULE: ./src/components/object/RecordRelatedHeader.jsx

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-04 13:59:06
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-09 11:16:24
 * @Description:
 */ 


const RecordRelatedHeader = ({ schema , object_name , foreign_key , app_id , record_id , masterObjectName , refId  })=>{
    const { 0: queryInfo , 1: setQueryInfo  } = (0,external_react_.useState)();
    (0,external_react_.useEffect)(()=>{
        if (schema) {
            window.addEventListener("message", (event)=>{
                const { data  } = event;
                if (data.type === "listview.loaded") {
                    if (schema) {
                        setTimeout(()=>{
                            const listViewId = SteedosUI.getRefId({
                                type: "related_list",
                                appId: app_id,
                                name: `${object_name}-${foreign_key}`
                            });
                            if (SteedosUI.getRef(listViewId) && SteedosUI.getRef(listViewId).getComponentByName) {
                                const listViewRef = SteedosUI.getRef(listViewId).getComponentByName(`page.listview_${schema.uiSchema.name}`);
                                setQueryInfo({
                                    count: listViewRef.props.data.count
                                });
                            }
                        }, 300);
                    }
                }
            });
        }
    }, [
        schema
    ]);
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
        children: [
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("header", {
                className: "slds-media slds-media--center slds-has-flexi-truncate",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        "aria-hidden": "true",
                        className: "slds-media__figure stencil slds-avatar slds-avatar_small",
                        children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                            style: {
                                backgroundColor: "#3c97dd"
                            },
                            className: "extraSmall forceEntityIcon",
                            children: /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                className: "uiImage",
                                children: /*#__PURE__*/ jsx_runtime_.jsx("svg", {
                                    className: "slds-icon slds-page-header__icon",
                                    "aria-hidden": "true",
                                    children: /*#__PURE__*/ jsx_runtime_.jsx("use", {
                                        xlinkHref: `/assets/icons/standard-sprite/svg/symbols.svg#${schema.uiSchema.icon}`
                                    })
                                })
                            })
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "slds-media__body",
                        children: /*#__PURE__*/ jsx_runtime_.jsx("h2", {
                            className: "slds-card__header-title",
                            children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                href: `/app/${app_id}/${masterObjectName}/${record_id}/${object_name}/grid?related_field_name=${foreign_key}`,
                                children: /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                    className: "slds-card__header-link baseCard__header-title-container",
                                    children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
                                        children: [
                                            /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                                className: "slds-truncate slds-m-right--xx-small",
                                                children: schema.uiSchema.label
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("span", {
                                                className: "slds-shrink-none slds-m-right--xx-small",
                                                children: [
                                                    "(",
                                                    queryInfo === null || queryInfo === void 0 ? void 0 : queryInfo.count,
                                                    ")"
                                                ]
                                            })
                                        ]
                                    })
                                })
                            })
                        })
                    })
                ]
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "slds-no-flex",
                children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                    className: "actionsContainer",
                    children: /*#__PURE__*/ jsx_runtime_.jsx("ul", {
                        className: "branding-actions slds-button-group slds-m-left--xx-small small oneActionsRibbon forceActionsContainer",
                        children: /*#__PURE__*/ jsx_runtime_.jsx(RecordRelatedListButtons/* RecordRelatedListButtons */.B, {
                            foreign_key: foreign_key,
                            record_id: record_id,
                            refId: refId,
                            app_id: app_id,
                            tab_id: object_name,
                            object_name: object_name,
                            masterObjectName: masterObjectName,
                            schema: schema
                        })
                    })
                })
            })
        ]
    });
};

;// CONCATENATED MODULE: ./src/components/object/RecordRelatedList.jsx

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-05 15:54:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-09 11:14:02
 * @Description: 
 */ 


function RecordRelatedList(props) {
    const { schema , object_name , foreign_key , app_id , record_id , masterObjectName  } = props;
    const router = (0,router_.useRouter)();
    const id = SteedosUI.getRefId({
        type: "related_list",
        appId: app_id,
        name: `${object_name}-${foreign_key}`
    });
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("article", {
        className: "slds-card slds-card_boundary shadow-none border-slate-200",
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "slds-grid slds-page-header rounded-b-none p-2",
                children: schema && /*#__PURE__*/ jsx_runtime_.jsx(RecordRelatedHeader, {
                    refId: id,
                    ...props
                })
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "border-t",
                children: schema && /*#__PURE__*/ jsx_runtime_.jsx(AmisRender/* AmisRender */.k, {
                    id: id,
                    schema: schema.amisSchema,
                    router: router,
                    className: "steedos-listview"
                })
            })
        ]
    });
}

;// CONCATENATED MODULE: ./src/components/object/RecordRelateds.jsx

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-04 15:01:06
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-09 11:14:50
 * @Description: 
 */ 

const RecordRelateds = ({ app_id , record_id , relateds  })=>{
    return /*#__PURE__*/ jsx_runtime_.jsx(jsx_runtime_.Fragment, {
        children: relateds === null || relateds === void 0 ? void 0 : relateds.map((related)=>{
            return /*#__PURE__*/ jsx_runtime_.jsx(RecordRelatedList, {
                ...related,
                app_id: app_id,
                record_id: record_id
            }, `${related.object_name}-${related.foreign_key}`);
        })
    });
};


/***/ }),

/***/ 9960:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Record),
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
/* harmony import */ var _components_object_RecordHeader__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(2917);
/* harmony import */ var _components_object_RecordRelateds__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(6479);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_headlessui_react__WEBPACK_IMPORTED_MODULE_9__, _components_object_RecordHeader__WEBPACK_IMPORTED_MODULE_10__]);
([_headlessui_react__WEBPACK_IMPORTED_MODULE_9__, _components_object_RecordHeader__WEBPACK_IMPORTED_MODULE_10__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-13 18:06:20
 * @Description:
 */ 










function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
function Record({}) {
    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_4__.useRouter)();
    const { app_id , tab_id , record_id  } = router.query;
    const { 0: isEditing , 1: setIsEditing  } = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(false);
    const { 0: schema , 1: setSchema  } = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(null);
    const { 0: relateds , 1: setRelateds  } = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(null);
    const { 0: formFactor , 1: setFormFactor  } = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(null);
    const doEditing = ()=>{
        if (!formFactor) {
            return;
        }
        editRecord(tab_id, record_id, formFactor);
    };
    const doReadonly = ()=>{
        if (!formFactor) {
            return;
        }
        viewRecord(tab_id, record_id, formFactor);
    };
    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(()=>{
        if (window.innerWidth < 768) {
            setFormFactor("SMALL");
        } else {
            setFormFactor("LARGE");
        }
    }, []);
    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(()=>{
        doReadonly();
    }, [
        router
    ]);
    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(()=>{
        if (isEditing) {
            doEditing();
        } else {
            doReadonly();
        }
    }, [
        formFactor
    ]);
    const viewRecord = (tab_id, record_id, formFactor)=>{
        if (tab_id && record_id) {
            const p1 = (0,_lib_objects__WEBPACK_IMPORTED_MODULE_5__/* .getObjectRelateds */ .ke)(app_id, tab_id, record_id, formFactor);
            const p2 = (0,_lib_objects__WEBPACK_IMPORTED_MODULE_5__/* .getViewSchema */ .DM)(tab_id, record_id, {
                formFactor: formFactor
            });
            Promise.all([
                p1,
                p2
            ]).then((values)=>{
                setRelateds(values[0]);
                const schema = values[1];
                setSchema(schema);
                setIsEditing(false);
            });
        }
    };
    const editRecord = (tab_id, record_id, formFactor)=>{
        if (tab_id && record_id) {
            (0,_lib_objects__WEBPACK_IMPORTED_MODULE_5__/* .getFormSchema */ .KR)(tab_id, {
                recordId: record_id,
                tabId: tab_id,
                appId: app_id,
                formFactor: formFactor
            }).then((data)=>{
                setSchema(data);
                setIsEditing(true);
            });
        }
    };
    // const cancelClick = () => {
    //   doReadonly();
    // };
    // const submitClick = (e) => {
    //   const scope = SteedosUI.getRef(
    //     SteedosUI.getRefId({
    //       type: "form",
    //       appId: app_id,
    //       name: schema.uiSchema.name,
    //     })
    //   );
    //   const form = scope.getComponentByName(
    //     `page_edit_${record_id}.form_edit_${record_id}`
    //   );
    //   form.handleAction({}, { type: "submit" }).then((data) => {
    //     if (data) {
    //       router.push(`/app/${app_id}/${tab_id}/view/${data.recordId}`);
    //     }
    //   });
    // };
    const getTabs = ()=>{
        return [
            {
                label: "\u8BE6\u60C5",
                name: "detail",
                component: ()=>{
                    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                        children: (schema === null || schema === void 0 ? void 0 : schema.amisSchema) && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_AmisRender__WEBPACK_IMPORTED_MODULE_6__/* .AmisRender */ .k, {
                            id: SteedosUI.getRefId({
                                type: "detail",
                                appId: app_id,
                                name: schema.uiSchema.name
                            }),
                            schema: (schema === null || schema === void 0 ? void 0 : schema.amisSchema) || {},
                            router: router
                        })
                    });
                }
            },
            {
                label: "\u76F8\u5173",
                name: "relateds",
                component: ()=>{
                    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_object_RecordRelateds__WEBPACK_IMPORTED_MODULE_11__/* .RecordRelateds */ .S, {
                            app_id: app_id,
                            record_id: record_id,
                            relateds: relateds
                        })
                    });
                }
            }
        ];
    };
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: "slds-grid slds-wrap",
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "slds-col slds-size_1-of-1 row region-header",
                children: schema && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_object_RecordHeader__WEBPACK_IMPORTED_MODULE_10__/* .RecordHeader */ .b, {
                    schema: schema
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "slds-col slds-size_1-of-1 row region-main",
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: "z-9 relative mt-2 shadow-none border-none",
                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_headlessui_react__WEBPACK_IMPORTED_MODULE_9__.Tab.Group, {
                        vertical: true,
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_9__.Tab.List, {
                                className: "flex space-x-1 border-b",
                                children: getTabs().map((item)=>{
                                    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_9__.Tab, {
                                        className: ({ selected  })=>classNames("px-10", "text-base", selected ? "border-b-2 border-sky-500 text-black" : "text-current"),
                                        children: item.label
                                    }, item.name);
                                })
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_9__.Tab.Panels, {
                                className: "my-2",
                                children: getTabs().map((item)=>{
                                    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_9__.Tab.Panel, {
                                        className: classNames("bg-white sm:rounded-b-xl", "pt-2"),
                                        children: item.component()
                                    }, item.name);
                                })
                            })
                        ]
                    })
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

/***/ 3280:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/app-router-context.js");

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

/***/ 4014:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/i18n/normalize-locale-path.js");

/***/ }),

/***/ 8524:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/is-plain-object.js");

/***/ }),

/***/ 5832:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/loadable.js");

/***/ }),

/***/ 8020:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/mitt.js");

/***/ }),

/***/ 4406:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/page-path/denormalize-page-path.js");

/***/ }),

/***/ 4964:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router-context.js");

/***/ }),

/***/ 1751:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/add-path-prefix.js");

/***/ }),

/***/ 299:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/format-next-pathname-info.js");

/***/ }),

/***/ 3938:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/format-url.js");

/***/ }),

/***/ 9565:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/get-asset-path-from-route.js");

/***/ }),

/***/ 5789:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/get-next-pathname-info.js");

/***/ }),

/***/ 1428:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/is-dynamic.js");

/***/ }),

/***/ 8854:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/parse-path.js");

/***/ }),

/***/ 1292:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/parse-relative-url.js");

/***/ }),

/***/ 4567:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/path-has-prefix.js");

/***/ }),

/***/ 979:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/querystring.js");

/***/ }),

/***/ 3297:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/remove-trailing-slash.js");

/***/ }),

/***/ 6052:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/resolve-rewrites.js");

/***/ }),

/***/ 4226:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/route-matcher.js");

/***/ }),

/***/ 5052:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/route-regex.js");

/***/ }),

/***/ 9232:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/utils.js");

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
var __webpack_exports__ = __webpack_require__.X(0, [952,664,859,152,282,295,345,804,95,767,125], () => (__webpack_exec__(9960)));
module.exports = __webpack_exports__;

})();