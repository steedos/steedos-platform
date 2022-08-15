"use strict";
(() => {
var exports = {};
exports.id = 666;
exports.ids = [666];
exports.modules = {

/***/ 1695:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Login),
  "getServerSideProps": () => (/* binding */ getServerSideProps)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: external "next/head"
var head_ = __webpack_require__(968);
var head_default = /*#__PURE__*/__webpack_require__.n(head_);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(1664);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: external "next-auth/react"
var react_ = __webpack_require__(1649);
// EXTERNAL MODULE: external "next-auth/next"
var next_ = __webpack_require__(2113);
// EXTERNAL MODULE: ./src/pages/api/auth/[...nextauth].js + 2 modules
var _nextauth_ = __webpack_require__(6295);
// EXTERNAL MODULE: external "next/router"
var router_ = __webpack_require__(1853);
// EXTERNAL MODULE: external "@heroicons/react/solid"
var solid_ = __webpack_require__(1143);
// EXTERNAL MODULE: ./node_modules/next/image.js
var next_image = __webpack_require__(5675);
var image_default = /*#__PURE__*/__webpack_require__.n(next_image);
;// CONCATENATED MODULE: ./src/images/home/background-auth.jpg
/* harmony default export */ const background_auth = ({"src":"/_next/static/media/background-auth.4bcf3f4b.jpg","height":1866,"width":1664,"blurDataURL":"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/sBCgoKCgoKCwwMCw8QDhAPFhQTExQWIhgaGBoYIjMgJSAgJSAzLTcsKSw3LVFAODhAUV5PSk9ecWVlcY+Ij7u7+//CABEIAAgABwMBIgACEQEDEQH/xAAoAAEBAAAAAAAAAAAAAAAAAAAAAwEBAQAAAAAAAAAAAAAAAAAABQb/2gAMAwEAAhADEAAAALCwA//EABsQAAEEAwAAAAAAAAAAAAAAAAEAAgMEERIx/9oACAEBAAE/AI4K7K42AOeOX//EABgRAAIDAAAAAAAAAAAAAAAAAAAhASIx/9oACAECAQE/AG7Tp//EABcRAQEBAQAAAAAAAAAAAAAAAAIBACH/2gAIAQMBAT8Aij7Qd//Z"});
;// CONCATENATED MODULE: ./src/components/AuthLayout.jsx




function AuthLayout({ children  }) {
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx((head_default()), {
                children: /*#__PURE__*/ jsx_runtime_.jsx("title", {
                    children: "Sign In - Steedos"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "relative flex min-h-full justify-center md:px-12 lg:px-0",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "relative z-10 flex flex-1 flex-col justify-center bg-white py-12 px-4 shadow-2xl md:flex-none md:px-28",
                        children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                            className: "mx-auto w-full max-w-md px-6 sm:px-6 md:w-96 md:max-w-sm md:px-6",
                            children: children
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "absolute inset-0 hidden w-full flex-1 sm:block lg:relative lg:w-0",
                        children: /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                            src: background_auth,
                            alt: "",
                            layout: "fill",
                            objectFit: "cover",
                            unoptimized: true
                        })
                    })
                ]
            })
        ]
    });
}

;// CONCATENATED MODULE: ./src/components/Input.jsx

function Input({ id , label , type ="text" , ...props }) {
    return /*#__PURE__*/ _jsx("div", {
        children: /*#__PURE__*/ _jsx("input", {
            id: id,
            type: type,
            placeholder: label,
            ...props,
            className: "block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500 sm:text-sm"
        })
    });
}

// EXTERNAL MODULE: ./src/components/Logo.jsx
var Logo = __webpack_require__(4079);
// EXTERNAL MODULE: ./src/lib/steedos.client.js
var steedos_client = __webpack_require__(8282);
;// CONCATENATED MODULE: ./src/pages/login.jsx












const errors = {
    Signin: "Try signing in with a different account.",
    OAuthSignin: "Try signing in with a different account.",
    OAuthCallback: "Try signing in with a different account.",
    OAuthCreateAccount: "Try signing in with a different account.",
    EmailCreateAccount: "Try signing in with a different account.",
    Callback: "Try signing in with a different account.",
    OAuthAccountNotLinked: "To confirm your identity, sign in with the same account you used originally.",
    EmailSignin: "The e-mail could not be sent.",
    CredentialsSignin: "Sign in failed. Check the details you provided are correct.",
    SessionRequired: "Please sign in to access this page.",
    default: "Unable to sign in."
};
function Login({ providers ={} , csrfToken  }) {
    const { data: session  } = (0,react_.useSession)();
    const router = (0,router_.useRouter)();
    const { callbackUrl ="/" , error  } = router.query;
    if (false) {}
    const onSubmit = (e)=>{
        if (e.target.domain.value) {
            (0,steedos_client/* setRootUrl */.MC)(e.target.domain.value);
        }
    };
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
        children: [
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "flex flex-col items-center justify-center",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                        href: "/",
                        children: /*#__PURE__*/ jsx_runtime_.jsx("a", {
                            children: /*#__PURE__*/ jsx_runtime_.jsx(Logo/* Logo */.T, {
                                className: "h-12 w-auto"
                            })
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("h2", {
                        className: "mt-4 text-lg font-semibold text-gray-900",
                        children: "Sign in to your account"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("span", {
                        className: "mt-2 text-sm text-red-500",
                        children: error && errors[error] && /*#__PURE__*/ jsx_runtime_.jsx("div", {
                            className: "rounded-md bg-red-50 p-4",
                            children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                className: "flex",
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                        className: "flex-shrink-0",
                                        children: /*#__PURE__*/ jsx_runtime_.jsx(solid_.XCircleIcon, {
                                            className: "h-5 w-5 text-red-400",
                                            "aria-hidden": "true"
                                        })
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                        className: "ml-3",
                                        children: /*#__PURE__*/ jsx_runtime_.jsx("h3", {
                                            className: "text-sm font-medium text-red-800",
                                            children: errors[error]
                                        })
                                    })
                                ]
                            })
                        })
                    })
                ]
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "mt-4",
                children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                    className: "",
                    children: [
                        providers && Object.values(providers).map((provider)=>{
                            if (provider.type === "credentials") return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("form", {
                                method: "post",
                                action: "/api/auth/callback/credentials",
                                className: "my-2 rounded-md shadow-sm",
                                onSubmit: onSubmit,
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx("input", {
                                        name: "csrfToken",
                                        type: "hidden",
                                        defaultValue: csrfToken
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("input", {
                                        placeholder: "Domain",
                                        name: "domain",
                                        type: "text",
                                        defaultValue: (0,steedos_client/* getRootUrl */.N0)(),
                                        required: true,
                                        className: "mb-2 focus:shadow-outline-blue sm:text-md relative block w-full appearance-none rounded-none rounded border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-300 focus:outline-none sm:leading-5"
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("input", {
                                        placeholder: "Email address",
                                        id: "email",
                                        name: "email",
                                        type: "email",
                                        autoComplete: "email",
                                        className: "focus:shadow-outline-blue sm:text-md relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-300 focus:outline-none sm:leading-5",
                                        required: true
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("input", {
                                        placeholder: "Password",
                                        id: "password",
                                        name: "password",
                                        type: "password",
                                        autoComplete: "current-password",
                                        className: "focus:shadow-outline-blue sm:text-md relative -mt-px block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-300 focus:outline-none sm:leading-5",
                                        required: true
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                        className: "pt-6",
                                        children: /*#__PURE__*/ jsx_runtime_.jsx("button", {
                                            type: "submit",
                                            className: "w-full rounded-full border border-transparent bg-sky-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2",
                                            children: "Sign in"
                                        })
                                    })
                                ]
                            });
                        }),
                         true && /*#__PURE__*/ jsx_runtime_.jsx("div", {
                            className: "pt-5",
                            children: providers && Object.values(providers).map((provider)=>{
                                if (provider.type === "oauth") return /*#__PURE__*/ jsx_runtime_.jsx(jsx_runtime_.Fragment, {
                                    children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                        className: "pt-5",
                                        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("button", {
                                            onClick: ()=>(0,react_.signIn)(provider.id),
                                            className: "w-full rounded-full border border-transparent bg-green-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
                                            children: [
                                                "Sign in with ",
                                                provider.name
                                            ]
                                        })
                                    }, provider.name)
                                });
                            })
                        })
                    ]
                })
            })
        ]
    });
};
Login.getLayout = function getLayout(page) {
    return AuthLayout;
};
async function getServerSideProps(context) {
    const session = await (0,next_.unstable_getServerSession)(context.req, context.res, _nextauth_/* authOptions */.L);
    const { callbackUrl ="/" , error  } = context.query;
    if (session && callbackUrl) {
        return {
            redirect: {
                destination: callbackUrl,
                permanent: false
            }
        };
    }
    const providers = await (0,react_.getProviders)();
    const csrfToken = await (0,react_.getCsrfToken)(context);
    return {
        props: {
            providers,
            csrfToken: csrfToken ? csrfToken : null
        }
    };
}


/***/ }),

/***/ 1143:
/***/ ((module) => {

module.exports = require("@heroicons/react/solid");

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

/***/ 1649:
/***/ ((module) => {

module.exports = require("next-auth/react");

/***/ }),

/***/ 3280:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/app-router-context.js");

/***/ }),

/***/ 2796:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/head-manager-context.js");

/***/ }),

/***/ 4957:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/head.js");

/***/ }),

/***/ 4014:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/i18n/normalize-locale-path.js");

/***/ }),

/***/ 744:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/image-config-context.js");

/***/ }),

/***/ 5843:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/image-config.js");

/***/ }),

/***/ 8524:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/is-plain-object.js");

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

/***/ 968:
/***/ ((module) => {

module.exports = require("next/head");

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
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [952,664,675,282,295,79], () => (__webpack_exec__(1695)));
module.exports = __webpack_exports__;

})();