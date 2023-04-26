const { getObject } = require('@steedos/objectql');
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
                const _tplObj = getObject('spaces');
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
                                insertText: `${k2}(${this.getParameterNames(_tplObj[k2])})`, 
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

                // console.log('global.services', global.services)
                const servicesSug = [];
                _.each(global.services, (v, k)=>{
                    if(this.checkVariableName(k)){
                        servicesSug.push({
                            label: k, // 对象label ?
                            insertText: k, 
                            documentation: "", // 对象documentation ?
                        });
                        _.each(v, (v2, k2)=>{
                            servicesSug.push({
                                label: `${k}.${k2}`, // 对象label ?
                                insertText: `${k}.${k2}(${this.getParameterNames(v2)})`, 
                                documentation: ""
                            })
                        })
                    }
                })
                return {
                    objects: {
                        data: objectsSug,
                        props: objectsProps
                    },
                    services:{
                        data: servicesSug
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
        checkVariableName:(variableName)=>{
            var reg = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
            if(reg.test(variableName)){
              var keywords = ['break', 'case', 'catch', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'finally', 'for', 'function', 'if', 'in', 'instanceof', 'new', 'return', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'true', 'false', 'null', 'undefined', 'NaN', 'Infinity'];
              if(keywords.indexOf(variableName) === -1){
                return true;
              } else {
                return false;
              }
            } else {
              return false;
            }
          },
        getParameterNames:(func)=>{
            const fnStr = func.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, '');
            const result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(/([^\s,]+)/g);
            if (result === null)
              return [];
            else
              return result;
          }
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
}