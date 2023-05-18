const { getObject } = require('@steedos/objectql');
const _ = require('lodash');

module.exports = {
    name: "suggestions",
    namespace: "steedos",
    
    /**
	 * Actions
	 */
	actions: {
        triggerTSExtraLib: {
            rest: {
                method: "GET",
                path: "/trigger.d.ts",
            },
            async handler(ctx) {
                let servicesTypes = 'declare const services: {';
                _.each(global.services, (v, k)=>{
                    if(this.checkVariableName(k)){
                        servicesTypes = `${servicesTypes} ${k}: {`
                        _.each(v, (v2, k2)=>{
                            servicesTypes = `${servicesTypes} ${k2}: (${this.getParameterNames(v2)}) => any`
                        })
                        servicesTypes = servicesTypes + '}'
                    }
                });

                servicesTypes = servicesTypes + '}'

                let objectsTypes = 'declare const objects: {';
                _.each(global.objects, (v, k)=>{
                    objectsTypes = `${objectsTypes} ${k}: SteedosObjectType;`
                });

                objectsTypes = objectsTypes + '}'

                return `
                    declare var _: any;
                    declare var moment: any;
                    declare var validator: any;
                    declare var Filters: any;

                    declare type TriggerParams = {
                        isInsert?: boolean;
                        isUpdate?: boolean;
                        isDelete?: boolean;
                        isFind?: boolean;
                        isBefore?: boolean;
                        isAfter?: boolean;
                        isFindOne?: boolean;
                        isCount?: boolean;
                        id?: SteedosIDType;
                        doc?: JsonMap;
                        previousDoc?: JsonMap;
                        size?: number;
                        userId: SteedosIDType;
                        spaceId?: SteedosIDType;
                        objectName?: string;
                        query?: SteedosQueryOptions;
                        data?: JsonMap;
                    }

                    declare type CTXType = {
                        params: TriggerParams;
                        broker: {
                            meta: any;
                            call: any;
                            mcall: any;
                            emit: any;
                            broadcast: any;
                            broadcastLocal: any;
                            namespace: string;
                            nodeID: string;
                            instanceID: string;
                            logger: any;
                            metadata: any;
                        },
                        getObject(objectName: string): any;
                        getUser(userId: string, spaceId: string): Promise<SteedosUserSession>;
                        makeNewID(): string;
                    };

                    declare var ctx: CTXType;

                    declare type SteedosQueryFilters = any;
                    declare type SteedosIDType = number | string;
                    declare type SteedosQueryOptions = {
                        fields?: Array<string> | string;
                        readonly filters?: SteedosQueryFilters;
                        readonly top?: number;
                        readonly skip?: number;
                        readonly sort?: string;
                    };
                    declare type SteedosUserSession = {
                        userId: SteedosIDType;
                        spaceId?: string;
                        name: string;
                        username?: string;
                        mobile?: string;
                        email?: string;
                        utcOffset?: number;
                        locale?: string;
                        roles?: string[];
                        space?: any;
                        spaces?: any;
                        company?: any;
                        companies?: any;
                        organization?: any;
                        organizations?: any;
                        permission_shares?: any;
                        company_id?: string;
                        company_ids?: string[];
                        is_space_admin?: boolean;
                        steedos_id?: string;
                    };
                    declare class SteedosObjectType {
                        find(query: SteedosQueryOptions, userSession?: SteedosUserSession): Promise<any>;
                        findOne(id: SteedosIDType, query: SteedosQueryOptions, userSession?: SteedosUserSession): Promise<any>;
                        insert(doc: Dictionary<any>, userSession?: SteedosUserSession): Promise<any>;
                        update(id: SteedosIDType, doc: Dictionary<any>, userSession?: SteedosUserSession): Promise<any>;
                        delete(id: SteedosIDType, userSession?: SteedosUserSession): Promise<any>;
                        directFind(query: SteedosQueryOptions, userSession?: SteedosUserSession): Promise<any>;
                        directInsert(doc: Dictionary<any>, userSession?: SteedosUserSession): Promise<any>;
                        directUpdate(id: SteedosIDType, doc: Dictionary<any>, userSession?: SteedosUserSession): Promise<any>;
                        directDelete(id: SteedosIDType, userSession?: SteedosUserSession): Promise<any>;
                        count(query: SteedosQueryOptions, userSession?: SteedosUserSession): Promise<any>;
                    }
                    ${objectsTypes}
                    ${servicesTypes}
                `
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