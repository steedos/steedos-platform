"use strict";
exports.id = 939;
exports.ids = [939];
exports.modules = {

/***/ 712:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "h": () => (/* binding */ AppLauncher)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_AmisRender__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1095);


const schema = __webpack_require__(4997);
const AppLauncher = ({ router  })=>{
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_AmisRender__WEBPACK_IMPORTED_MODULE_1__/* .AmisRender */ .k, {
        className: "",
        id: `app_launcher`,
        schema: schema,
        router: router
    });
};


/***/ }),

/***/ 1571:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "A": () => (/* binding */ AppLauncherBar)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1853);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_AppLauncher__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(712);

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-11 16:46:07
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-11 17:55:40
 * @Description:
 */ 

const AppLauncherBar = ({ app  })=>{
    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_1__.useRouter)();
    const openAppLauncher = ()=>{
        const name = "app-launcher-modal";
        SteedosUI.Modal(Object.assign({
            name: name,
            title: `App Launcher`,
            destroyOnClose: true,
            maskClosable: false,
            keyboard: false,
            footer: null,
            width: "90%",
            style: {
                width: "90%",
                maxWidth: "90"
            },
            bodyStyle: {
                padding: "0px",
                paddingTop: "12px"
            },
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_AppLauncher__WEBPACK_IMPORTED_MODULE_2__/* .AppLauncher */ .h, {
                router: router
            })
        }, {}));
    };
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
            className: "slds-context-bar__primary",
            onClick: openAppLauncher,
            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "slds-context-bar__item slds-context-bar__dropdown-trigger slds-dropdown-trigger slds-dropdown-trigger_click slds-no-hover",
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: "slds-context-bar__icon-action",
                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", {
                            "aria-haspopup": "true",
                            className: "slds-button slds-icon-waffle_container slds-context-bar__button",
                            title: "Open App Launcher",
                            type: "button",
                            children: [
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                    className: "slds-icon-waffle",
                                    children: [
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                            className: "slds-r1"
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                            className: "slds-r2"
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                            className: "slds-r3"
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                            className: "slds-r4"
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                            className: "slds-r5"
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                            className: "slds-r6"
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                            className: "slds-r7"
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                            className: "slds-r8"
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                            className: "slds-r9"
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                    className: "slds-assistive-text",
                                    children: "Open App Launcher"
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                        className: "slds-context-bar__label-action slds-context-bar__app-name",
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                            className: "slds-truncate",
                            title: "App Name",
                            children: app === null || app === void 0 ? void 0 : app.name
                        })
                    })
                ]
            })
        })
    });
};


/***/ }),

/***/ 9074:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "e": () => (/* binding */ GlobalHeader)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _headlessui_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1185);
/* harmony import */ var _heroicons_react_solid__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1143);
/* harmony import */ var _heroicons_react_solid__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_heroicons_react_solid__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _heroicons_react_outline__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8768);
/* harmony import */ var _heroicons_react_outline__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_heroicons_react_outline__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1649);
/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(next_auth_react__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _components_Logo__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(4079);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(1853);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _components_AppLauncherBar__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(1571);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_headlessui_react__WEBPACK_IMPORTED_MODULE_2__]);
_headlessui_react__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];









function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
const defaultAvatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";
function GlobalHeader({ navigation , selected , app  }) {
    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_7__.useRouter)();
    const { data: session  } = (0,next_auth_react__WEBPACK_IMPORTED_MODULE_5__.useSession)();
    const user = session ? {
        name: session.user.name,
        email: session.user.email,
        imageUrl: session.user.image ? session.user.image : defaultAvatar
    } : {
        name: "",
        email: "",
        imageUrl: defaultAvatar
    };
    const userNavigation = [];
    if (session) {
        userNavigation.push({
            name: "\u6CE8\u9500",
            href: "#",
            onClick: ()=>(0,next_auth_react__WEBPACK_IMPORTED_MODULE_5__.signOut)()
        });
    } else {
        userNavigation.push({
            name: "\u767B\u5F55",
            onClick: ()=>(0,next_auth_react__WEBPACK_IMPORTED_MODULE_5__.signIn)()
        });
    }
    const handleClick = (e)=>{
        e.preventDefault();
        router.push(e.target.href);
    };
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_2__.Disclosure, {
            as: "header",
            className: "slds-global-header_container supports-backdrop-blur:bg-white/60 sticky top-0 z-40 w-full flex-none bg-white/95 shadow-none backdrop-blur transition-colors duration-500 dark:border-slate-50/[0.06] dark:bg-transparent lg:z-50 lg:border-b lg:border-slate-900/10",
            children: ({ open  })=>{
                /*#__PURE__*/ return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: "slds-global-header slds-grid slds-grid_align-spread shadow-none",
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                    className: "slds-global-header__item",
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                        className: "slds-global-header__logo",
                                        style: {
                                            backgroundImage: "url(/logo.png)",
                                            display: "inline-block"
                                        }
                                    })
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                    className: "slds-global-header__item",
                                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                                        className: "slds-global-actions",
                                        children: [
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                className: "slds-global-actions__item",
                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                    className: "slds-dropdown-trigger slds-dropdown-trigger_click",
                                                    style: {
                                                        display: "inline-block"
                                                    },
                                                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", {
                                                        className: "slds-button slds-button_icon-container slds-button_icon-small slds-button_icon slds-global-actions__help slds-global-actions__item-action",
                                                        id: "header-help-popover-id",
                                                        tabindex: "0",
                                                        title: "Help and Training",
                                                        type: "button",
                                                        "aria-haspopup": "true",
                                                        onClick: ()=>{
                                                            window.open(`https://www.steedos.com/docs`, "_blank");
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("svg", {
                                                                focusable: "false",
                                                                "data-key": "down",
                                                                "aria-hidden": "true",
                                                                className: "slds-button__icon slds-global-header__icon",
                                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("use", {
                                                                    xlinkHref: "/assets/icons/utility-sprite/svg/symbols.svg#help"
                                                                })
                                                            }),
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                className: "slds-assistive-text",
                                                                children: "Help and Training"
                                                            })
                                                        ]
                                                    })
                                                })
                                            }),
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                className: "slds-global-actions__item",
                                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                    className: "slds-dropdown-trigger slds-dropdown-trigger_click",
                                                    style: {
                                                        display: "inline-block"
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", {
                                                            className: "slds-button slds-button_icon-container slds-button_icon-small slds-button_icon slds-global-actions__notifications slds-global-actions__item-action",
                                                            id: "header-notifications-popover-id",
                                                            title: "5 new notifications",
                                                            type: "button",
                                                            "aria-live": "assertive",
                                                            "aria-haspopup": "dialog",
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("svg", {
                                                                    focusable: "false",
                                                                    "data-key": "down",
                                                                    "aria-hidden": "true",
                                                                    className: "slds-button__icon slds-global-header__icon",
                                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("use", {
                                                                        xlinkHref: "/assets/icons/utility-sprite/svg/symbols.svg#notification"
                                                                    })
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                    className: "slds-assistive-text",
                                                                    children: "5 new notifications"
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                            "aria-hidden": "true",
                                                            className: "slds-notification-badge slds-incoming-notification slds-show-notification",
                                                            children: "5"
                                                        })
                                                    ]
                                                })
                                            }),
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                className: "relative z-10 flex items-center lg:hidden",
                                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_headlessui_react__WEBPACK_IMPORTED_MODULE_2__.Disclosure.Button, {
                                                    className: "inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500",
                                                    children: [
                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                            className: "sr-only",
                                                            children: "Open menu"
                                                        }),
                                                        open ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroicons_react_outline__WEBPACK_IMPORTED_MODULE_4__.XIcon, {
                                                            className: "block h-6 w-6",
                                                            "aria-hidden": "true"
                                                        }) : /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroicons_react_outline__WEBPACK_IMPORTED_MODULE_4__.MenuIcon, {
                                                            className: "block h-6 w-6",
                                                            "aria-hidden": "true"
                                                        })
                                                    ]
                                                })
                                            }),
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                className: "hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center",
                                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_headlessui_react__WEBPACK_IMPORTED_MODULE_2__.Menu, {
                                                    as: "div",
                                                    className: "relative ml-0 flex-shrink-0",
                                                    children: [
                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                            className: "slds-global-actions__item",
                                                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_headlessui_react__WEBPACK_IMPORTED_MODULE_2__.Menu.Button, {
                                                                className: "slds-dropdown-trigger slds-dropdown-trigger_click",
                                                                children: [
                                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                        className: "sr-only",
                                                                        children: "Open user menu"
                                                                    }),
                                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                                                                        className: "h-8 w-8 rounded-full",
                                                                        src: user.imageUrl,
                                                                        alt: ""
                                                                    })
                                                                ]
                                                            })
                                                        }),
                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_2__.Transition, {
                                                            as: react__WEBPACK_IMPORTED_MODULE_1__.Fragment,
                                                            enter: "transition ease-out duration-100",
                                                            enterFrom: "transform opacity-0 scale-95",
                                                            enterTo: "transform opacity-100 scale-100",
                                                            leave: "transition ease-in duration-75",
                                                            leaveFrom: "transform opacity-100 scale-100",
                                                            leaveTo: "transform opacity-0 scale-95",
                                                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_headlessui_react__WEBPACK_IMPORTED_MODULE_2__.Menu.Items, {
                                                                className: "fixed right-6 mt-2 min-w-[160px] origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
                                                                children: [
                                                                    session && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                                        className: "flex items-center py-2 px-4",
                                                                        children: [
                                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                                                className: "flex-shrink-0",
                                                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                                                                                    className: "h-10 w-10 rounded-full",
                                                                                    src: user.imageUrl,
                                                                                    alt: ""
                                                                                })
                                                                            }),
                                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                                                className: "ml-3",
                                                                                children: [
                                                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                                                        className: "text-base font-medium text-gray-800",
                                                                                        children: user.name
                                                                                    }),
                                                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                                                        className: "text-sm font-medium text-gray-500",
                                                                                        children: user.email
                                                                                    })
                                                                                ]
                                                                            })
                                                                        ]
                                                                    }),
                                                                    userNavigation.map((item)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_2__.Menu.Item, {
                                                                            children: ({ active  })=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
                                                                                    href: item.href,
                                                                                    onClick: item.onClick,
                                                                                    className: classNames(active ? "bg-gray-100" : "", "block py-2 px-4 text-sm text-gray-700"),
                                                                                    children: item.name
                                                                                })
                                                                        }, item.name))
                                                                ]
                                                            })
                                                        })
                                                    ]
                                                })
                                            })
                                        ]
                                    })
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_headlessui_react__WEBPACK_IMPORTED_MODULE_2__.Disclosure.Panel, {
                            as: "nav",
                            className: "lg:hidden",
                            "aria-label": "Global",
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                    className: "slds-context-bar h-12 pl-3",
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_AppLauncherBar__WEBPACK_IMPORTED_MODULE_8__/* .AppLauncherBar */ .A, {
                                        app: app
                                    })
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                    className: "space-y-1 px-2 pt-2 pb-3",
                                    children: navigation === null || navigation === void 0 ? void 0 : navigation.map((item)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_2__.Disclosure.Button, {
                                            as: "a",
                                            href: item.path,
                                            className: classNames(item.id === selected ? "bg-gray-100 text-gray-900" : "text-gray-900 hover:bg-gray-50 hover:text-gray-900", "block rounded-md py-2 px-3 text-base font-medium"),
                                            "aria-current": item.id === selected ? "page" : undefined,
                                            children: item.name
                                        }, item.id))
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                    className: "border-t border-gray-200 pt-4 pb-3",
                                    children: [
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                            className: "flex items-center px-4",
                                            children: [
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                    className: "flex-shrink-0",
                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                                                        className: "h-10 w-10 rounded-full",
                                                        src: user.imageUrl,
                                                        alt: ""
                                                    })
                                                }),
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                    className: "ml-3",
                                                    children: [
                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                            className: "text-base font-medium text-gray-800",
                                                            children: user.name
                                                        }),
                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                            className: "text-sm font-medium text-gray-500",
                                                            children: user.email
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", {
                                                    type: "button",
                                                    className: "ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                                                    children: [
                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                            className: "sr-only",
                                                            children: "View notifications"
                                                        }),
                                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroicons_react_outline__WEBPACK_IMPORTED_MODULE_4__.BellIcon, {
                                                            className: "h-6 w-6",
                                                            "aria-hidden": "true"
                                                        })
                                                    ]
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                            className: "mt-3 space-y-1 px-2",
                                            children: userNavigation.map((item)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_2__.Disclosure.Button, {
                                                    as: "a",
                                                    href: item.href,
                                                    onClick: item.onClick,
                                                    className: "block rounded-md py-2 px-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                                                    children: item.name
                                                }, item.name))
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                });
            }
        })
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 7134:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "w": () => (/* binding */ Navbar)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_GlobalHeader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9074);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_components_GlobalHeader__WEBPACK_IMPORTED_MODULE_1__]);
_components_GlobalHeader__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


function Navbar({ navigation , selected , app , router  }) {
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_GlobalHeader__WEBPACK_IMPORTED_MODULE_1__/* .GlobalHeader */ .e, {
            navigation: navigation,
            selected: selected,
            app: app
        })
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 6798:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Y": () => (/* binding */ Sidebar)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _heroicons_react_outline__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8768);
/* harmony import */ var _heroicons_react_outline__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_heroicons_react_outline__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1853);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1664);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_3__);

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-29 10:46:29
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-10 13:16:20
 * @Description: 
 */ /* This example requires Tailwind CSS v2.0+ */ 


function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
function Sidebar({ navigation , selected  }) {
    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();
    const handleClick = (e)=>{
        e.preventDefault();
        router.push(e.target.href);
    };
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("nav", {
        "aria-label": "Sidebar",
        className: "sticky top-6 divide-y divide-gray-300",
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
            className: "",
            children: navigation === null || navigation === void 0 ? void 0 : navigation.map((item)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_3___default()), {
                    href: item.path,
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
                        onClick: handleClick,
                        className: classNames(item.id === selected ? "text-sky-500 border-current font-semibold dark:text-sky-400 bg-slate-100" : "border-transparent hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300", "block border-l-[3px] pl-4 -ml-px text-base no-underline py-2 hover:bg-slate-100"),
                        "aria-current": item.current ? "page" : undefined,
                        children: item.name
                    })
                }, item.name))
        })
    });
}


/***/ }),

/***/ 2593:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "M": () => (/* binding */ getApp)
/* harmony export */ });
/* unused harmony export getApps */
/* harmony import */ var _steedos_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8282);
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-05 15:54:17
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-05 16:30:29
 * @Description: 
 */ 
async function getApps() {
    const APPS_API = "/service/api/apps/menus";
    const apps = await fetchAPI(APPS_API);
    return apps;
}
async function getApp(appName) {
    const appApi = `/service/api/apps/${appName}/menus`;
    const app = await (0,_steedos_client__WEBPACK_IMPORTED_MODULE_0__/* .fetchAPI */ .Io)(appApi);
    return app;
}


/***/ }),

/***/ 4997:
/***/ ((module) => {

module.exports = JSON.parse('{"type":"page","title":"Welcome to Steedos","body":[{"type":"service","id":"u:0f6224a0836f","affixFooter":false,"body":[{"type":"collapse-group","activeKey":["1"],"body":[{"type":"collapse","key":"1","header":"所有应用程序","body":[{"type":"each","name":"app_items","items":{"type":"tpl","tpl":"<a class=\'slds-app-launcher__tile slds-text-link_reset \' role=\'button\' tabindex=\'0\' href=\'${path}\'><div class=\'slds-app-launcher__tile-figure\'><span class=\'slds-icon_container slds-icon-standard-approval\'><img class=\'slds-icon slds-icon_container slds-icon-standard-${icon}\' src=\'${context.rootUrl}/unpkg.com/@salesforce-ux/design-system/assets/icons/standard/${icon}.svg\'><span class=\'slds-assistive-text\'>${name}</span></span></div><div class=\'slds-app-launcher__tile-body\'><span class=\'slds-link text-blue-600 font-bold\'><span title=\'${name}\'>${name}</span></span><div style=\'display: -webkit-box; -webkit-line-clamp: 1;-webkit-box-orient: vertical;overflow: hidden;\'><span title=\'${description}\'>${description}</span></div></div></a>","inline":true,"style":{},"className":"slds-p-horizontal_small slds-size_1-of-1 slds-medium-size_1-of-3"},"id":"u:a0f163ed207f","className":"slds-grid slds-wrap slds-grid_pull-padded"}]},{"type":"collapse","key":"2","header":"所有项目","body":[{"type":"html","html":"<ul class=\'slds-grid slds-wrap\'>${object_items_dom|raw}</ul>","className":"dec"}],"id":"u:a88a225c8832","className":""}],"id":"u:cb1c62622fd6"}],"className":"","visibleOn":"","clearValueOnHidden":false,"visible":true,"messages":{},"api":{"method":"get","url":"${context.rootUrl}/service/api/apps/menus","data":null,"headers":{"Authorization":"Bearer ${context.tenantId},${context.authToken}"},"adaptor":"\\nlet app_items = payload;\\nlet object_items = [];\\napp_items.forEach((item) => {\\n  object_items = object_items.concat(item.children);\\n})\\nlet object_items_dom = \'\';\\nobject_items.forEach((item) => {\\n  object_items_dom = object_items_dom +\\n    `<li class=\\"slds-col--padded slds-p-vertical_xx-small slds-size_1-of-5 slds-grow-none oneAppLauncherItem\\">\\n      <a data-object-name=\\"${item.id}\\" href=\\"${item.path}\\" class=\\"app-launcher-link slds-text-link--reset slds-app-launcher__tile--small slds-truncate creator-object-nav-${item.id}\\">\\n        <span class=\\"slds-truncate slds-text-link\\">${item.name}</span>\\n      </a>\\n    </li>`\\n})\\npayload.data = {\\n  app_items,\\n  object_items_dom\\n}\\nreturn payload;"}}],"regions":["body"],"data":{"objectName":"space_users","recordId":"","initialValues":{},"appId":"builder","title":"","context":{}}}');

/***/ })

};
;