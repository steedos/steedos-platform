import { createQuery } from './createQuery';
import { SqlOptions } from './sqlOptions';
import { SQLLang } from '@steedos/odata-v4-sql';
const _ = require("underscore");

const mapToObject = (aMap) => {
  const obj = {};
  if (aMap) {
    aMap.forEach((v, k) => {
      obj[k] = v;
    });
  }
  return obj;
};

const queryToOdataString = (query): string => {
  let result = '';
  for (let key in query) {
    if (key.startsWith('$')) {
      if (result !== '') {
        result += '&';
      }
      result += `${key}=${query[key]}`;
    }
  }
  return result;
};

const processIncludes = (queryBuilder: any, odataQuery: any, alias: string) => {
  if (odataQuery.includes && odataQuery.includes.length > 0) {
    odataQuery.includes.forEach(item => {
      queryBuilder = queryBuilder.leftJoinAndSelect(
        (alias ? alias + '.' : '') + item.navigationProperty,
        item.navigationProperty,
        item.where.replace(/typeorm_query/g, item.navigationProperty),
        mapToObject(item.parameters)
      );

      if (item.orderby && item.orderby != '1') {
        const orders = item.orderby.split(',').map(i => i.trim().replace(/typeorm_query/g, item.navigationProperty));
        orders.forEach((itemOrd) => {
          queryBuilder = queryBuilder.addOrderBy(...(itemOrd.split(' ')));
        });
      }

      if (item.includes && item.includes.length > 0) {
        processIncludes(queryBuilder, { includes: item.includes }, item.navigationProperty);
      }
    });
  }

  return queryBuilder;
};

const executeQueryByQueryBuilder = async (inputQueryBuilder, query, options: SqlOptions, returnSql: boolean = false) => {
  const alias = inputQueryBuilder.expressionMap.mainAlias.name;
  options.alias = alias;
  //const filter = createFilter(query.$filter, {alias: alias});
  let odataQuery: any = {};
  if (query) {
    const odataString = queryToOdataString(query);
    if (odataString) {
      odataQuery = createQuery(odataString, options);
    }
  }
  let queryBuilder = inputQueryBuilder;

  if(odataQuery.where){
    queryBuilder = queryBuilder.andWhere(odataQuery.where)
  }

  if(odataQuery.parameters){
    queryBuilder = queryBuilder.setParameters(mapToObject(odataQuery.parameters));
  }

  const queryRunner = inputQueryBuilder.obtainQueryRunner();
  const isPaging = query.$skip !== undefined || query.$top !== undefined;
  if (isPaging && query.$top === undefined) {
    query.$top = 100;
  }
  if (queryRunner && isPaging && [SQLLang.MsSql, SQLLang.Oracle].indexOf(options.type) >= 0) {
    // 老版本的SqlServer/Oracle数据库不支持OFFSET FETCH 的语法来翻页，只能单独处理
    // SqlServer 2012版本号options.version为11.0.3128.0，这以下的版本，比如2008/2005都不支持OFFSET FETCH 的语法来翻页
    const oldVersionMsSql = options.type === SQLLang.MsSql && options.version && parseInt(options.version) < 11;
    const tooOldVersionMsSql = oldVersionMsSql && parseInt(options.version) < 9;
    // Oracle 12c版本号options.version为12.2...，这以下的版本，比如10.2都不支持OFFSET FETCH 的语法来翻页
    const oldVersionOracle = options.type === SQLLang.Oracle && options.version && parseInt(options.version) < 12;
    if (oldVersionMsSql || oldVersionOracle) {
      let selectFields = "*";
      if (odataQuery.select && odataQuery.select !== '*') {
        selectFields = odataQuery.select;
      }
      const RowNumberKey = "RowNumber";
      if (oldVersionMsSql) {
        if (tooOldVersionMsSql) {
          queryBuilder = queryBuilder.select(`top ${query.$top} ${selectFields}`);
        }
        else {
          let orderby = odataQuery.orderby;
          if (oldVersionMsSql && !(orderby && orderby !== '1')) {
            orderby = "(select null) ASC";
          }
          queryBuilder = queryBuilder.select(`${selectFields},ROW_NUMBER() OVER(ORDER BY ${orderby}) ${RowNumberKey}`);
        }
      }
      else if (oldVersionOracle) {
        queryBuilder = queryBuilder.select(`${selectFields}`);
      }
      if ((oldVersionOracle || tooOldVersionMsSql) && odataQuery.orderby && odataQuery.orderby !== '1') {
        const orders = odataQuery.orderby.split(',').map(i => i.trim());
        orders.forEach((item) => {
          queryBuilder = queryBuilder.addOrderBy(...(item.split(' ')));
        });
      }
      let qs = queryBuilder.getQueryAndParameters();
      if (returnSql) {
        return qs;
      }
      let splicedSql = "";
      let start = query.$skip ? query.$skip : 0;
      let end = 0;
      if (query.$top) {
        end = start + query.$top;
      }
      if (oldVersionMsSql) {
        if (tooOldVersionMsSql) {
          splicedSql = `SELECT * FROM (${qs[0]}) A`;
        }
        else {
          let betweenSql = "";
          if (end) {
            betweenSql = `BETWEEN ${start} + 1 and ${end}`;
          }
          else {
            betweenSql = `> ${start}`;
          }
          splicedSql = `SELECT * FROM (${qs[0]}) A WHERE ${RowNumberKey} ${betweenSql}`;
        }
      }
      else if (oldVersionOracle) {
        splicedSql = `SELECT * FROM (SELECT A.*, ROWNUM ${RowNumberKey} FROM (${qs[0]}) A ${end ? ('WHERE ROWNUM <= ' + end) : ''}) b WHERE B.${RowNumberKey} > ${start}`;
      }
      try {
        let getFieldMap = function(columns){
            let map = {};
            _.each(columns, function(column){
                if(column.givenDatabaseName && column.givenDatabaseName != column.propertyName){
                    map[column.givenDatabaseName] = column.propertyName
                }
            })
            return map;
        }
        let columnsMap = getFieldMap(queryBuilder.expressionMap.mainAlias.metadata.columns)
        const result = await queryRunner.query(splicedSql, qs[1]);
        let items = result.concat();
        if(!_.isEmpty(columnsMap)){
          items.map(function(item){
            _.each(columnsMap, function(v, k){
                  item[v] = item[k];
                  delete item[k];
              })
          })
        }
        if (query.$count && query.$count !== 'false') {
          return {
            items: items,
            count: result.length
          }
        }
        else {
          return items;
        }
      } finally {
        if (queryRunner !== queryBuilder.queryRunner) {
          await queryRunner.release();
        }
        if (queryBuilder.connection.driver.options.type === "sqljs") {
          // this.connection.driver instanceof SqljsDriver
          // SqljsDriver is not export from typeorm,so we user driver.options.type to check the SqljsDriver instance
          await queryBuilder.connection.driver.autoSave();
        }
      }
    }
  }

  if (odataQuery.select && odataQuery.select != '*') {
    queryBuilder = queryBuilder.select(odataQuery.select.split(',').map(i => i.trim()));
  }

  queryBuilder = processIncludes(queryBuilder, odataQuery, alias);

  if (odataQuery.orderby && odataQuery.orderby !== '1') {
    const orders = odataQuery.orderby.split(',').map(i => i.trim());
    orders.forEach((item) => {
      queryBuilder = queryBuilder.addOrderBy(...(item.split(' ')));
    });
  }
  queryBuilder = queryBuilder.skip(query.$skip || 0);
  if (query.$top) {
    queryBuilder = queryBuilder.take(query.$top);
  }
  if (returnSql) {
    return {
      sql: queryBuilder.getSql(),
      query: queryBuilder.getQuery()
    };
  }
  if (query.$count && query.$count !== 'false') {
    const resultData = await queryBuilder.getManyAndCount();
    return {
      items: resultData[0],
      count: resultData[1]
    }
  }

  return queryBuilder.getMany();
};

const executeQuery = async (repositoryOrQueryBuilder: any, query, options: SqlOptions) => {
  // options = options || {};
  const alias = options.alias || '';
  let queryBuilder = null;

  // check that input object is query builder
  if (typeof repositoryOrQueryBuilder.expressionMap !== 'undefined') {
    queryBuilder = repositoryOrQueryBuilder;
  } else {
    queryBuilder = await repositoryOrQueryBuilder.createQueryBuilder(alias);
  }
  const result = await executeQueryByQueryBuilder(queryBuilder, query, options);
  return result;
};


const executeCountQueryByQueryBuilder = async (inputQueryBuilder, query, options: SqlOptions) => {
  const alias = inputQueryBuilder.expressionMap.mainAlias.name;
  options.alias = alias;
  //const filter = createFilter(query.$filter, {alias: alias});
  let odataQuery: any = {};
  if (query) {
    const odataString = queryToOdataString(query);
    if (odataString) {
      odataQuery = createQuery(odataString, options);
    }
  }
  const queryRunner = inputQueryBuilder.obtainQueryRunner();
  let queryBuilder = inputQueryBuilder;

  if(odataQuery.where){
    queryBuilder = queryBuilder.andWhere(odataQuery.where)
  }

  if(odataQuery.parameters){
    queryBuilder = queryBuilder.setParameters(mapToObject(odataQuery.parameters));
  }

  queryBuilder = processIncludes(queryBuilder, odataQuery, alias);

  return await queryBuilder.getCount();
};

const executeCountQuery = async (repositoryOrQueryBuilder: any, query, options: SqlOptions) => {
  // options = options || {};
  const alias = options.alias || '';
  let queryBuilder = null;

  // check that input object is query builder
  if (typeof repositoryOrQueryBuilder.expressionMap !== 'undefined') {
    queryBuilder = repositoryOrQueryBuilder;
  } else {
    queryBuilder = repositoryOrQueryBuilder.createQueryBuilder(alias);
  }
  const result = await executeCountQueryByQueryBuilder(queryBuilder, query, options);
  return result;
};

const getExecuteQuerySQL = async (repositoryOrQueryBuilder: any, query, options: SqlOptions) => {
  // options = options || {};
  const alias = options.alias || '';
  let queryBuilder = null;

  // check that input object is query builder
  if (typeof repositoryOrQueryBuilder.expressionMap !== 'undefined') {
    queryBuilder = repositoryOrQueryBuilder;
  } else {
    queryBuilder = await repositoryOrQueryBuilder.createQueryBuilder(alias);
  }
  const result = executeQueryByQueryBuilder(queryBuilder, query, options, true);
  return result;
};

export { executeQuery, executeCountQuery, getExecuteQuerySQL };