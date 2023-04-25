const _ = require('lodash');

module.exports = {
    name: "suggestions",
    namespace: "steedos",
    
    /**
	 * Actions
	 */
	actions: {
        triggerSuggestions: {
            rest: {
                method: "GET",
                path: "/trigger",
            },
            async handler(ctx) {
                
                const objectsSug = [];
                const objectsProps = [];
                _.each(global.objects, (v, k)=>{
                    objectsSug.push({
                        label: k, // 对象label ?
                        insertText: k, 
                        documentation: "", // 对象documentation ?
                    });
                    if(_.isEmpty(objectsProps)){
                        _.each(v, (v2, k2)=>{
                            objectsProps.push({
                                label: k2, // 对象label ?
                                insertText: k2, 
                                documentation: "", // 对象documentation ?
                                // insertText: `${k2}(\${1:arg1}, \${2:args});`, 
                                // arguments: [
                                //     { label: 'query', documentation: 'Objectql Query' },
                                //     { label: 'userSession', documentation: 'User Session' },
                                //   ]
                            })
                        })
                    }
                })

                return {
                    objects: {
                        data: objectsSug,
                        props: objectsProps
                    },
                    // services:
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
        
	},

	/**
	 * Service created lifecycle event handler
	 */
	async created() {
        console.log('suggestions====>created...')
	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {
        console.log('suggestions====>started...')
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {
        console.log('suggestions====>stopped...')
	}
}