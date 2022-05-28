/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-05-20 17:42:20
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-05-21 15:55:09
 * @Description: 提供辅助函数
 */
(function(){
    // # 日期类型: date, datetime  支持操作符: "=", "<>", "<", ">", "<=", ">="
	// # 文本类型: text, textarea, html  支持操作符: "=", "<>", "contains", "notcontains", "startswith"
	// # 选择类型: lookup, master_detail, select 支持操作符: "=", "<>"
	// # 数值类型: currency, number  支持操作符: "=", "<>", "<", ">", "<=", ">="
	// # 布尔类型: boolean  支持操作符: "=", "<>"
	// # 数组类型: checkbox, [text]  支持操作符: "=", "<>"
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
        not_between: 'not_between', // TODO
        is_empty:  'is_empty', // TODO
        is_not_empty: 'is_not_empty',  // TODO
        select_equals: '=', 
        select_not_equals: '!=', 
        select_any_in: 'in',
        select_not_any_in: '<>'
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
                    filters.push(conditionGroupToFilters(item)) 
                }else{
                    filters.push(conditionItemToFilters(item)) 
                }
            })
        }
        return filters;
    };

    const conditionItemToFilters = (item)=>{
        const { left , op, right } = item;
        if(left.type === 'field'){
            return [left.field, opMaps[op], right]
        }
    };

    // const conditionChildrenToFilters = (children)=>{

    // }
    const filterToConditionItem = (filter)=>{
        if(filter.length === 3){
            return {
                left:{
                    type: 'field',
                    field: filter[0]
                },
                op: lodash.findKey(opMaps, (value)=>{ return value === filter[1]}),
                right: filter[2]
            }
        }else{
            console.warn(`无效的filter:${JSON.stringify(filter)}`)
        }
    }

    const filtersToConditionGroup = (filters)=>{
        const conditions = {
            conjunction: 'and',
            children: []
        };
        if(!filters || filters.length ==0){
            return conditions
        }
        filters.forEach((filter)=>{
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