Steedos.organizationsTree = {
    // 抄widgets crud中获取可搜索字段的相关代码
    getSearchableFields: function (api) {
        const QUICK_SEARCHABLE_FIELD_TYPES = ["text", "textarea", "autonumber", "url", "email"];
        function isFieldQuickSearchable(field, nameFieldKey) {
            let fieldSearchable = field.searchable;
            if (fieldSearchable !== false && field.name === nameFieldKey) {
                // 对象上名称字段的searchable默认认为是true
                fieldSearchable = true;
            }
            if (fieldSearchable && QUICK_SEARCHABLE_FIELD_TYPES.indexOf(field.type) > -1) {
                return true;
            }
            return false;
        }

        const searchableFields = [];
        const mainObject = api.context.uiSchema;
        if (mainObject) {
            _.each(mainObject.fields, function (field) {
                if (isFieldQuickSearchable(field, mainObject.NAME_FIELD_KEY)) {
                    searchableFields.push(field.name);
                }
            })
        }
        return searchableFields;
    },
    // 抄widgets crud中发送适配器整理过滤条件的相关代码
    getApiRequestAdaptor: function (api, context, option = {}) {
        var keywordsSearchBoxName = "__keywords";
        if (option.isLookup) {
            if (context.op === "loadOptions") {
                var filters = [["_id", "=", context.value]];
                return Object.assign({}, api, {
                    "method": "post",
                    "url": "/graphql",
                    "data": {
                        "query": '{rows:organizations(filters: ' + JSON.stringify(filters) + ', top: 5000, skip: 0, sort: "sort_no desc"){_id,fullname,name,sort_no,_display:_ui{sort_no},parent,children}}'
                    }
                });
            }
            else{
                const __lookupField = context.__lookupField;
                if(__lookupField){
                    keywordsSearchBoxName = `__keywords_lookup__${__lookupField.name.replace(/\./g, "_")}__to__${__lookupField.reference_to}`;
                }
                else{
                    // 没有__lookupField是异常情况，此时不传入任何过滤条件，避免使用默认的__keywords
                    keywordsSearchBoxName = "";
                    console.error("lookup字段快速搜索异常，作用域中未找到变量__lookupField");
                }
            }
        }
        var allowSearchFields = this.getSearchableFields(api);
        var filters = [];
        var selfData = JSON.parse(JSON.stringify(api.context));
        var searchableFilter = SteedosUI.getSearchFilter(selfData) || [];
        if (searchableFilter.length > 0) {
            if (filters.length > 0) {
                filters = [filters, 'and', searchableFilter];
            } else {
                filters = searchableFilter;
            }
        }
        // "搜索此列表"搜索框
        if (allowSearchFields) {
            allowSearchFields.forEach(function (key) {
                const keyValue = selfData[key];
                if (_.isString(keyValue)) {
                    filters.push([key, "contains", keyValue]);
                } else if (_.isArray(keyValue) || _.isBoolean(keyValue) || keyValue) {
                    filters.push([key, "=", keyValue]);
                }
            })
        }
        var keywordsFilters = SteedosUI.getKeywordsSearchFilter(selfData[keywordsSearchBoxName], allowSearchFields);
        if (keywordsFilters && keywordsFilters.length > 0) {
            filters.push(keywordsFilters);
        }

        api.data = {};

        if (filters.length > 0) {
            Object.assign(api.data, {
                filters: JSON.stringify(filters)
            });
        }

        const queryFields = api.body && api.body.queryFields;
        if(queryFields){
            Object.assign(api.data, {
                fields: queryFields
            });
        }

        if(api.body.$self){
            // amis bug，接口为Get请求时，url上的data参数无法删除，只能手动把url重写掉，见：https://github.com/baidu/amis/issues/9813
            let rootURL = api.body.$self.context && api.body.$self.context.rootUrl || "";
            // url为${context.rootUrl}/service/api/organizations/root
            api.url = rootURL = "/service/api/organizations/root";
        }

        return api;
    },
    getApiAdaptor: function (payload, response, api, context, option = {}) {
        if(option.isLookup && context.op === "loadOptions") {
            const rows = _.map(payload.data.rows, function (item) {
                delete item.children;
                delete item.parent;
                return item;
            });
            payload.data.rows = rows;

            return payload;
        }
        let filtersJson = api.data && api.data.filters;
        payload.data = {
            ...payload.data,
            isFilter: !!filtersJson
        };

        // 把上面拿到的queryFields返回到data中，以便在getDeferApiRequestAdaptor中能拿到queryFields
        payload.data.__rootQueryFields = api.data && api.data.fields;

        // 因为自动展开的第一层节点拿不到上面返回的__rootQueryFields，只能把它放到rows数据内，以便在getDeferApiRequestAdaptor中能始终能拿到queryFields
        (payload.data.rows || []).forEach(function (item) {
            item.__rootQueryFields = api.data && api.data.fields;
        });

        return payload;
    },
    getDeferApiRequestAdaptor: function (api, context, option = {}) {
        var selfData = JSON.parse(JSON.stringify(api.context));
        let filters = [];
        var dep = selfData._id;
        if (dep) {
            filters = [['parent', '=', dep]];
        }

        const queryFields = (context && context.__rootQueryFields) || "_id,fullname,name,sort_no,hidden,_display:_ui{sort_no,hidden},parent,children";

        return Object.assign({}, api, {
            data: {
                query: '{rows:organizations(filters: ' + JSON.stringify(filters) + ', top: 5000, skip: 0, sort: "sort_no desc"){' + queryFields + '}}'
            }
        });
    },
    getDeferApiAdaptor: function (payload, response, api, context, option = {}) {
        var data = payload.data;
        if (data.children) {
            return payload;
        }
        data.rows = data.rows.map(function (optionItem) {
            optionItem.defer = !!(optionItem.children && optionItem.children.length);
            delete optionItem.children;
            return optionItem;
        });

        data.children = data.rows;
        delete data.rows;
        delete data.count;
        return payload;
    }
}