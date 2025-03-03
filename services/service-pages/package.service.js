"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
const objectql = require('@steedos/objectql');
const _ = require(`lodash`);
const path = require('path');
const fs = require("fs");
const getCharts = async(apiName)=>{
	const charts = await objectql.getObject('charts').find({ filters: [['name', '=', apiName]] });
	if(charts.length > 0){
		return charts[0]
	}
}

const getQueries = async(apiName)=>{
	const queries = await objectql.getObject('queries').find({ filters: [['name', '=', apiName]] });
	if(queries.length > 0){
		return queries[0]
	}
}

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
			name: this.name,
			isPackage: false
		},
		loadedPublicClientJS: false,
	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		getPageDetail: {
			rest: {
				method: "GET",
				path: "/page/:apiName"
			},
			async handler(ctx) {
				const userSession = ctx.meta.user;
				const { apiName } = ctx.params;
				let pages = await objectql.getObject('pages').find({filters: [['name', '=', apiName]]});
				let page = null;
				if(pages.length > 0){
					page = pages[0];
				}
				if(!page){return null}
				page.can_edit = userSession.is_space_admin && page.is_system != true //仅工作区管理员可以编辑
				page.user = { name: 'true' } //TODO
				page.layout = [] //TODO
				page.public_url = '' //TODO
				page.tags = []
				page.updated_at = page.modified
				page.user_id = ''
				if(page.is_system == true){
					_.each(page.widgets, (widget)=>{
						widget._id = widget.name;
					})
				}else{
					page.widgets = await objectql.getObject('widgets').find({ filters: [['page', '=', apiName]] });
				}
				page.options = {};
				const widgets = [];
				for (const widget of page.widgets) {
					if(widget.type === 'charts'){
						if(widget.visualization){
							const chart = await getCharts(widget.visualization)
							if(chart){
								const query = await getQueries(chart.query)
								if(query){
									if(!query.options){
										query.options = {}
									}
									widget.visualization = {
										_id: chart._id,
										description: chart.description,
										query: query,
										type: chart.type,
										options: chart.options,
										name: chart.name,
										label: chart.label,
									}
									widgets.push(widget)
								}
							}
						}else{
							widgets.push(widget)
						}
					}else{
						widgets.push(widget)
					}
				}
				page.widgets = widgets;
				return page;
			}
		},
		searchPage:{
			rest: {
				method: "GET",
				path: "/search/page"
			},
			async handler(ctx){
				try {
					const { q } = ctx.params;
					let pages = await objectql.getObject('pages').find({filters: [['label', 'contains', q],'or',['name', 'contains', q]]});
					_.each(pages, function(page){
						page.id = page.name
					})
					return {
						count: pages.length,
						page: 1,
						page_size: pages.length + 1000,
						results: pages
					}
				} catch (error) {
					return {
						count: 0,
						page: 1,
						page_size: 1000,
						results: []
					}
				}
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
		publicClientJS: {
            handler() {
				let packageInfo = this.settings.packageInfo;
				if (!packageInfo) {
					return;
				}
				const { path : packagePath } = packageInfo;
                let publicPath = path.join(packagePath, 'main', 'default', 'client');
                try {
                    if (!fs.existsSync(publicPath) || this.settings.loadedPublicClientJS || typeof WebApp == 'undefined') {
                        return;
                    }
                } catch (error) {
                    return
                }

                try {
                    const express = require('express');
                    this.settings.loadedPublicClientJS = true;
                    try {
                        const router = require('@steedos/router').staticRouter();
                        let routerPath = "";
                        if (__meteor_runtime_config__.ROOT_URL_PATH_PREFIX) {
                            routerPath = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX;
                        }
                        const cacheTime = 86400000 * 1; // one day
                        router.use(`${routerPath}/pages/js`, express.static(publicPath, { maxAge: cacheTime }));
                    } catch (error) {
                        console.error(error)
                        this.settings.loadedPublicClientJS = false;
                    }
                } catch (error) {
                        
                }
            }
        },
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
		await this.publicClientJS()
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
