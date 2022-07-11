/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-05-19 11:38:30
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-10 15:53:44
 * @Description: 
 */
import {TypeOrmVisitor as Visitor} from './visitor';
import {Token} from '@steedos/odata-v4-parser/lib/lexer';
import {SqlOptions} from './sqlOptions';
import {filter} from '@steedos/odata-v4-parser';
import {SQLLang} from '@steedos/odata-v4-sql';

/**
 * Creates an SQL WHERE clause from an OData filter expression string
 * @param {string} odataFilter - A filter expression in OData $filter format
 * @return {string}  SQL WHERE clause
 * @example
 * const filter = createFilter("Size eq 4 and Age gt 18");
 * let sqlQuery = `SELECT * FROM table WHERE ${filter}`;
 */
export function createFilter(odataFilter: string, options?: SqlOptions): Visitor;
export function createFilter(odataFilter: Token, options?: SqlOptions): Visitor;
export function createFilter(odataFilter: string | Token, options = <SqlOptions>{}): Visitor {
  if (!options.type){
    options.type = SQLLang.Oracle;
  }
  let ast: Token = <Token>(typeof odataFilter == 'string' ? filter(<string>odataFilter) : odataFilter);
  const visitor = new Visitor(options);
  const visit = visitor.Visit(ast);
  const type = visit.asType();
  return type;

}