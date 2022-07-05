import { Visitor, SQLLang } from "./visitor";
export { SQLLang } from "./visitor";
import { filter, query } from "odata-v4-parser";
import { Token } from "odata-v4-parser/lib/lexer";

export interface SqlOptions{
    useParameters?:boolean
    type?:SQLLang
}

/**
 * Creates an SQL query descriptor from an OData query string
 * @param {string} odataQuery - An OData query string
 * @return {string}  SQL query descriptor
 * @example
 * const filter = createQuery("$filter=Size eq 4 and Age gt 18");
 * let sqlQuery = `SELECT * FROM table WHERE ${filter.where}`;
 */
export function createQuery(odataQuery:string, options?:SqlOptions):Visitor;
export function createQuery(odataQuery:string, options?:SqlOptions, type?:SQLLang):Visitor;
export function createQuery(odataQuery:Token, options?:SqlOptions):Visitor;
export function createQuery(odataQuery:Token, options?:SqlOptions, type?:SQLLang):Visitor;
export function createQuery(odataQuery:string | Token, options = <SqlOptions>{}, type?:SQLLang):Visitor{
    if (typeof type != "undefined" && type) options.type = type;
    let ast:Token = <Token>(typeof odataQuery == "string" ? query(<string>odataQuery) : odataQuery);
    return new Visitor(options).Visit(ast).asType();
}

/**
 * Creates an SQL WHERE clause from an OData filter expression string
 * @param {string} odataFilter - A filter expression in OData $filter format
 * @return {string}  SQL WHERE clause
 * @example
 * const filter = createFilter("Size eq 4 and Age gt 18");
 * let sqlQuery = `SELECT * FROM table WHERE ${filter}`;
 */
export function createFilter(odataFilter:string, options?:SqlOptions):Visitor;
export function createFilter(odataFilter:string, options?:SqlOptions, type?:SQLLang):Visitor;
export function createFilter(odataFilter:Token, options?:SqlOptions):Visitor;
export function createFilter(odataFilter:Token, options?:SqlOptions, type?:SQLLang):Visitor;
export function createFilter(odataFilter:string | Token, options = <SqlOptions>{}, type?:SQLLang):Visitor{
    if (typeof type != "undefined" && type) options.type = type;
    let ast:Token = <Token>(typeof odataFilter == "string" ? filter(<string>odataFilter) : odataFilter);
    return new Visitor(options).Visit(ast).asType();
}