import * as Odata from 'ts-odata-client';
import { getUserId, getAuthToken, getSpaceId } from '../utils';
import _ from 'underscore';
import { formatFiltersToODataQuery } from "@steedos/filters";
import { request } from "./request";
import store from "../stores/configureStore";

function getSelect(columns){
    return _.uniq(_.compact(_.pluck(columns, 'field'))).map((n)=> {
        // odata请求中a.b需要换成a/b
        return n.replace(".", "/");
    });
}

function getExpand(columns) {
    return _.pluck(_.filter(columns, (column: any)=>{
        if(column.hidden){
            // 隐藏的字段不需要expand，比如grid那边的company_id、company_ids、locked等
            return false
        }
        if(column.type === 'lookup' || column.type === 'master_detail'){
            return true
        }
        return false
    }), 'field')
}

function convertSortToString(sort: Array<[]>){
    return sort.map(function(n){
        return n.join(" ");
    }).join(",");
}

function getODataFilter(options: any, $select: any) : string{
    if (options.filters || options.baseFilters || (options.search && $select)) {
        let { searchMode, baseFilters } = options;
        let result: any, _filters: any, _query: any;
        if (options.filters && (options.filters.length || typeof options.filters === "function")) {
            _filters = options.filters;
        }
        if (options.search && $select) {
            $select = _.union($select, ["_id"]);
            _query = [];
            $select.forEach((element: string, i: number) => {
                if(i > 0){
                    _query.push('or');
                }
                _query.push([element, 'contains', options.search]);
            });
        }

        if (searchMode && _query) {
            result = _query;
        }
        else if (_filters && _query) {
            result = [_filters, 'and', _query];
        }
        else if (_filters){
            result = _filters;
        }
        else if (_query) {
            result = _query;
        }
        
        if (result){
            if (baseFilters){
                result = [baseFilters, 'and', result];
            }
        }else{
            if (baseFilters){
                result = baseFilters;
            }
        }

        if (!result){
            return "";
        }
        let userContext: any = {};
        const state = window.store ? window.store.getState() : store.getState();
        if (state.entities.user){
            // 新版本的bootstrap接口返回的是user，要处理下
            userContext.userId = state.entities.user.userId;
            userContext.spaceId = state.entities.user.spaceId;
            userContext.user = state.entities.user;
        }
        else{
            // 老版本的bootstrap接口返回的是USER_CONTEXT，直接取值
            userContext = state.entities.USER_CONTEXT;
        }
        return formatFiltersToODataQuery(result, userContext) as string;
    }
    else{
        return "";
    }
}

export async function query(service: string, options: any = { pageSize: 10, currentPage: 0 }) {
    let { currentPage, pageSize, objectName, columns, sort, count } = options

    let $select = getSelect(columns);
    let $expand = getExpand(columns);
    let skip = currentPage * pageSize

    let authToken = getAuthToken();
    let userId = getUserId();

    let endpoint = options.endpoint ? options.endpoint : `${service}/api/v4/${objectName}`;
    const requestInit = () => {
        return {
            headers: {
                'X-Auth-Token': authToken,
                'X-User-Id': userId
            }
        }
    }
    const baseQuery = Odata.ODataV4QueryProvider.createQuery<any>(endpoint, requestInit);
    let query = baseQuery.skip(skip || 0)

    if (_.isNumber(pageSize)) {
        query = query.top(pageSize)
    }

    if ($select) {
        query = query.select(...$select)
    }

    _.each(($expand as any), (e:string)=>{
        query = query.expand(e);
    })

    let odataFilter: string = getODataFilter(options, $select);
    let odataUrl = query.provider.buildQuery(query.expression);
    if (odataFilter){
        odataUrl = `${odataUrl}&$filter=${encodeURIComponent(odataFilter)}`;
    }

    if (_.isArray(sort)){
        sort = convertSortToString(sort);
    }

    if (sort) {
        sort = sort.replace(/, /g, ",").trim();//清除空格符
        odataUrl = `${odataUrl}&$orderby=${encodeURIComponent(sort)}`;
    }
    if (count === undefined) {
        odataUrl = `${odataUrl}&$count=false`;
    }
    else{
        odataUrl = `${odataUrl}&$count=${count}`;
    }
    let spaceId = options.spaceId || getSpaceId();
    let results = await request(odataUrl, {spaceId: spaceId});
    return results
}