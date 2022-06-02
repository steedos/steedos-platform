/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-05-20 17:42:20
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-01 15:44:44
 * @Description: 提供辅助函数
 */
(function(){
    // # 日期类型: date, datetime  支持操作符: "=", "<>", "<", ">", "<=", ">="
	// # 文本类型: text, textarea, html  支持操作符: "=", "<>", "contains", "notcontains", "startswith"
	// # 选择类型: lookup, master_detail, select 支持操作符: "=", "<>"
	// # 数值类型: currency, number  支持操作符: "=", "<>", "<", ">", "<=", ">="
	// # 布尔类型: boolean  支持操作符: "=", "<>"
	// # 数组类型: checkbox, [text]  支持操作符: "=", "<>"

    const DATE_DATETIME_BETWEEN_VALUES = ['last_year', 'this_year', 'next_year', 'last_quarter', 'this_quarter', 'next_quarter', 'last_month', 'this_month', 'next_month', 'last_week', 'this_week', 'next_week', 'yestday', 'today', 'tomorrow', 'last_7_days', 'last_30_days', 'last_60_days', 'last_90_days', 'last_120_days', 'next_7_days', 'next_30_days', 'next_60_days', 'next_90_days', 'next_120_days'];

    /**
     * 
     */

    const opMaps = {
        equal: '=',
        not_equal: '!=',
        less: '<', 
        less_or_equal: '<=', 
        greater: '>', 
        greater_or_equal: '>=',
        between: 'between',
        not_between: 'not_between', // TODO 不支持待@steedos/filters 增强
        is_empty:  'is_empty', // TODO  不支持待@steedos/filters 增强
        is_not_empty: 'is_not_empty',  // TODO 不支持待@steedos/filters 增强
        select_equals: '=', 
        select_not_equals: '!=', 
        select_any_in: 'in',
        select_not_any_in: '<>',
        like: 'contains',
        not_like: 'notcontains',
        starts_with: 'startswith',
        ends_with: 'endswith'
    }

    const isGroup = (item)=>{
        return _.has(item, 'conjunction');
    }

    const conditionGroupToFilters = (group)=>{
        const filters = [];
        const {conjunction, children} = group;
        if(conjunction && children){
            children.forEach((item)=>{
                if(filters.length > 0){
                    filters.push(conjunction);
                }
                if(isGroup(item)){
                    const filter = conditionGroupToFilters(item);
                    if(filter && filter.length > 0){
                        filters.push(filter) 
                    }
                }else{
                    const filter = conditionItemToFilters(item);
                    if(filter){
                        filters.push(filter) 
                    }
                }
            })
        }
        return filters;
    };

    const conditionItemToFilters = (item)=>{
        const { left , op, right } = item;
        if(left && left.type === 'field'){
            if(op){
                if(op.startsWith('between:')){
                    const array = op.split(':');
                    return [left.field, array[0], array[1]];
                }else{
                    if(right != null){
                        return [left.field, opMaps[op], right]
                    }
                }
            }
        }
    };

    // const conditionChildrenToFilters = (children)=>{

    // }
    const filterToConditionItem = (filter)=>{
        if(filter.length === 3){
            const op =lodash.findKey(opMaps, (value)=>{ return value === filter[1]});
            if(op === 'between' && lodash.includes(DATE_DATETIME_BETWEEN_VALUES, filter[2])){
                return {
                    left:{
                        type: 'field',
                        field: filter[0]
                    },
                    op: `${op}:${filter[2]}`
                }
            }else{
                return {
                    left:{
                        type: 'field',
                        field: filter[0]
                    },
                    op: op, 
                    right: filter[2]
                }
            }
        }else{
            console.warn(`无效的filter:${JSON.stringify(filter)}`)
        }
    }

    const filterObjectToArray = (filter)=>{
        if(!lodash.isArray(filter) && lodash.isObject(filter)){
            return [filter.field, filter.operation, filter.value];
        };
        return filter;
    }

    const filtersToConditionGroup = (filters)=>{
        filters = filterObjectToArray(filters);
        
        const conditions = {
            conjunction: 'and',
            children: []
        };
        if(!filters || filters.length ==0){
            return conditions
        }
        filters.forEach((filter)=>{
            filter = filterObjectToArray(filter);
            if(filter === 'or' || filter === 'and'){
                conditions.conjunction = filter;
            }else{
                if(filter.length === 3 && filter.indexOf("and") == -1 && filter.indexOf("or") == -1){
                    conditions.children.push(filterToConditionItem(filter));
                }else{
                    conditions.children.push(filtersToConditionGroup(filter));
                }
            }
        });
        return conditions;
    }

    window.amisConvert = {
        conditionsToFilters: (conditions)=>{
            return conditionGroupToFilters(conditions);
        },
        filtersToConditions: (filters)=>{
            return filtersToConditionGroup(filters);
        }
    }
})()