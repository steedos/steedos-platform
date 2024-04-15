/*
 * @Author: yinlianghui@steedos.com
 * @Date: 2022-07-22 09:48:17
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-04-15 14:21:01
 * @Description: 产品分析
 */
"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
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
			isPackage: false
		}
	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		getAnalyticsScript: {
			rest: {
				method: "GET",
				fullPath: "/analytics/index.js",
				authorization: false,
                authentication: false
			},
			async handler(ctx) {
				ctx.meta.$responseType = "application/javascript; charset=UTF-8";
				var analyticsConfig = Meteor.settings.public.analytics;
				var defaultId = "phc_Hs5rJpeE5JK3GdR3NWOf75TvjEcnYShmBxNU2Y942HB";
				var defaultApiHost = "https://posthog.steedos.cn";
				var posthogConfig = analyticsConfig && analyticsConfig.posthog || { id: defaultId, api_host: defaultApiHost };
				if (!posthogConfig) {
					return '';
				}
				var posthogId = posthogConfig.id || defaultId;
				var posthogHost = posthogConfig.api_host || defaultApiHost;

				return `!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
				posthog.init('${posthogId}',{api_host:'${posthogHost}'});`
			}
		}
	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {

	},

	/**
	 * Service created lifecycle event handler
	 */
	async created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
