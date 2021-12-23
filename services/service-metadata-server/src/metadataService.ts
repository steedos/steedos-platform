import _ = require("lodash");

module.exports = {
    name: "#",

    /**
     * Dependencies
     */
    dependencies: ['metadata'],

    methods: {
        getMatadataCacherKey: {
            handler(metadataApiName: string) {
                return `$steedos.#${this.settings.metadataType}.${metadataApiName}`
            }
        },
        getServiceConfig: {
            async handler(serviceName, apiName, meta) {
                const metadataType = this.settings.metadataType;
                const metadataConfig = await this.broker.call(`metadata.getServiceMetadata`, {
                    serviceName,
                    metadataType,
                    metadataApiName: apiName
                }, {meta: meta})
                return metadataConfig?.metadata;
            }
        },
        getServicesConfigs:{
            async handler(apiName, meta) {
                const serviceName = '*';
                const metadataType = this.settings.metadataType;
                const configs = await this.broker.call(`metadata.getServiceMetadatas`, {
                    serviceName,
                    metadataType,
                    metadataApiName: apiName
                }, {meta: meta})
                return _.map(configs, 'metadata');
            }
        },
        register: {
            async handler(apiName, data, meta) {
                return await this.broker.call('metadata.add', {key: this.getMatadataCacherKey(apiName), data: data}, {meta: meta});
            }
        },
        refresh: {
            async handler(apiName, meta) {
                let config: any = {};
                const configs = await this.getServicesConfigs(apiName, meta);
                if(configs.length == 0){
                    return null
                }
                config = _.defaultsDeep({}, ..._.reverse(configs), config)
                return config;
            }
        }
    },
    /**
     * Actions
     */
    actions: {
        /**
         * Say a 'Hello' action.
         *
         * @returns
         */
        get: {
            async handler(ctx) {
                return await ctx.broker.call('metadata.get', {key: this.getMatadataCacherKey(ctx.params.metadataApiName)}, {meta: ctx.meta})
            }
        },
        getAll: {
            async handler(ctx) {
                return await ctx.broker.call('metadata.filter', {key: this.getMatadataCacherKey("*")}, {meta: ctx.meta})
            }
        },
        filter: {
            async handler(ctx) {
                let { pattern } = ctx.params;
                return await ctx.broker.call('metadata.filter', { key: this.getMatadataCacherKey(pattern) }, { meta: ctx.meta })
            }
        },
        add: {
            async handler(ctx) {
                let config = ctx.params.data;
                const serviceName = ctx.meta.metadataServiceName
                const metadataApiName = ctx.params.apiName;
                const metadataConfig = await this.getServiceConfig(serviceName, `${metadataApiName}`, ctx.meta)
                if(metadataConfig && metadataConfig.metadata){
                    config = _.defaultsDeep(config, metadataConfig.metadata);
                }
                await ctx.broker.call('metadata.addServiceMetadata', {key: this.getMatadataCacherKey(metadataApiName), data: config}, {meta: Object.assign({}, ctx.meta, {metadataType: this.settings.metadataType, metadataApiName: metadataApiName})})
                const newConfig = await this.refresh(metadataApiName, ctx.meta);
                return await this.register(metadataApiName, newConfig, ctx.meta)
            }
        },
        delete: {
            async handler(ctx) {
                return await ctx.broker.call('metadata.delete', {key: this.getMatadataCacherKey(ctx.params.metadataApiName)}, {meta: ctx.meta})
            }
        },
        verify: {
            async handler(ctx) {
                return true;
            }
        }
    },
    merged(schema) {
        if(!schema.events){
            schema.events = {}
        }
        schema.events[`$METADATA.${schema.settings.metadataType}.*`] = {
            handler: async (ctx) =>{
                const { isClear, metadataApiNames } = ctx.params
                if(isClear){
                    for await (const metadataApiName of metadataApiNames) {
                        const config = await this.refresh(metadataApiName, ctx.meta);
                        if(!config){
                            await ctx.broker.call('metadata.delete', {key: this.getMatadataCacherKey(metadataApiName)})
                        }else{
                            await this.register(ctx, metadataApiName, config, {});
                        }
                    }
                }
            }
        };
    }
};
