"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');
const objectql = require('@steedos/objectql');
const _ = require(`lodash`);
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
		getPageDetail: {
			rest: {
				method: "GET",
				path: "/page/:id"
			},
			async handler(ctx) {
				const { id: pageId } = ctx.params;
				console.log(`pages findOne`, pageId)
				let page = await objectql.getObject('pages').findOne(pageId)
				page.can_edit = true //TODO
				page.user = { name: 'true' } //TODO
				page.layout = [] //TODO
				page.public_url = '' //TODO
				page.tags = []
				page.updated_at = page.modified
				page.user_id = ''
				page.widgets = await objectql.getObject('widgets').find({ filters: [['page', '=', pageId]] });
				page.options = {};
				for (const widget of page.widgets) {
					if(widget.type === 'charts'){
						if(widget.visualization){
							const chart = await objectql.getObject('charts').findOne(widget.visualization)
							const query = await objectql.getObject('queries').findOne(chart.query)
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
							}
						}
					}
				}

				return page;
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
