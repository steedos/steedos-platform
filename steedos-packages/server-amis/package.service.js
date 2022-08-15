/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 15:21:28
 * @Description: 登录 web
 */
"use strict";
const project = require("./package.json");
const packageName = project.name;
const packageLoader = require("@steedos/service-package-loader");
const next = require("next");
const path = require("path");
const auth = require("@steedos/auth");
const _ = require("lodash");
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * 软件包服务启动后也需要抛出事件。
 */
module.exports = {
  name: packageName,
  namespace: "steedos",
  mixins: [packageLoader],
  /**
   * Settings
   */
  settings: {
    packageInfo: {
      path: __dirname,
      name: packageName,
      isPackage: false,
      loadPublicFolder: false,
    },
  },

  /**
   * Dependencies
   */
  dependencies: [],

  /**
   * Actions
   */
  actions: {},

  /**
   * Events
   */
  events: {},

  /**
   * Methods
   */
  methods: {
    /**
     * Middleware for ExpressJS
     *
     * @returns {Function}
     */
    express() {
      const app = next({
        dir: __dirname,
        conf: {
          // assetPrefix: process.env.ROOT_URL + '/nextjs-amis'
          // publicRuntimeConfig: {
          // 	staticFolder: process.env.ROOT_URL + '/nextjs-amis',
          //   }
        },
      });

      const handle = app.getRequestHandler();

      return async (req, res, next) => {
        if (req.url === "/api/auth/session" || _.endsWith(req.url, 'app.json') || _.includes(req.url, '/app')) {
          const user = await auth.auth(req, res);
		  if(user && user.userId){
			const session = {
				user: { 
					name: user.name, 
					email: user.email
				},
				expires: "2022-09-12T09:11:06.459Z",
				steedos: {
				  space: user.spaceId,
				  token: user.authToken,
				  userId: user.userId,
				  name: user.name,
				},
			  };
			if(req.url === "/api/auth/session"){
				return res.json(session)
			}else{
				req.session = session;
			}
		  }
        }
        await handle(req, res, next);
      };
    },

    static() {
      return path.join(__dirname, "public");
    },
    cacheTime() {
      return 86400000 * 1;
    },
  },

  /**
   * Service created lifecycle event handler
   */
  created() {
    process.env.NEXTAUTH_URL = "http://127.0.0.1:3333";
    process.env.NEXT_PUBLIC_STEEDOS_ROOT_URL = process.env.ROOT_URL;
    process.env.NEXT_PUBLIC_NEXTAUTH_PROVIDER_ID = "keycloak";
    process.env.NEXT_STATIC_PROPS_REVALIDATE = 3600;
    process.env.KEYCLOAK_ID = process.env.STEEDOS_IDENTITY_OIDC_CLIENT_ID;
    process.env.KEYCLOAK_SECRET =
      process.env.STEEDOS_IDENTITY_OIDC_CLIENT_SECRET;
    process.env.KEYCLOAK_ISSUER = process.env.STEEDOS_IDENTITY_OIDC_CONFIG_URL;
    process.env.NEXTAUTH_SECRET = process.env.STEEDOS_IDENTITY_JWT_SECRET;
    process.env.JWT_SECRET = process.env.STEEDOS_IDENTITY_JWT_SECRET;
  },

  /**
   * Service started lifecycle event handler
   */
  async started() {},

  /**
   * Service stopped lifecycle event handler
   */
  async stopped() {},
};
