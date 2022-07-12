import {Token} from '@steedos/odata-v4-parser/lib/lexer';
import {Literal} from 'odata-v4-literal';
import {SQLLiteral, SQLLang, Visitor} from '@steedos/odata-v4-sql/lib/visitor';
// import {SqlOptions} from './index';

export class TypeOrmVisitor extends Visitor {
  //parameters:any[] = [];
  includes: TypeOrmVisitor[] = [];
  alias: string = ''// 'typeorm_query';

  constructor(options) {
    super(options);
    if (!options.type) {
      this.type = SQLLang.Oracle;
    }
    else{
      this.type = options.type;
    }
    this.alias = options.alias || this.alias;
  }

  from(table: string) {
    let sql = `SELECT ${this.select} FROM [${table}] WHERE ${this.where} ORDER BY ${this.orderby}`;
    switch (this.type) {
      case SQLLang.Oracle:
        if (typeof this.skip == "number") sql += ` OFFSET ${this.skip} ROWS`;
        if (typeof this.limit == "number") {
          if (typeof this.skip != "number") sql += " OFFSET 0 ROWS";
          sql += ` FETCH NEXT ${this.limit} ROWS ONLY`;
        }
      case SQLLang.MsSql:
        if (typeof this.orderby !== "string" || this.orderby === "1"){
          this.orderby = "(select null) ASC";
        }
        let start = this.skip ? this.skip : 0;
        let end = start + this.limit;
        sql = `SELECT * from (SELECT ${this.select}, ROW_NUMBER() OVER(ORDER BY ${this.orderby}) AS RowId 
          FROM [${table}] WHERE ${this.where}) as a WHERE RowId BETWEEN ${start} + 1 and ${end}`;
        break;
      case SQLLang.MySql:
      case SQLLang.PostgreSql:
      default:
        if (typeof this.limit == "number") sql += ` LIMIT ${this.limit}`;
        if (typeof this.skip == "number") sql += ` OFFSET ${this.skip}`;
        break;
    }
    // 给sql语句中字段名称增加中括号，防止字段名称使用了数据库的关键字
    sql = sql.replace(/(\b\w+\b)\.(\b\w+\b)/g, '[$1].[$2]');
    return sql;
  }

  asMsSql() {
    this.type = SQLLang.MsSql;
    let rx = new RegExp("\\?", "g");
    let keys = this.parameters.keys();
    this.originalWhere = this.where;
    this.where = this.where.replace(rx, () => `:${keys.next().value}`);
    this.includes.forEach((item) => item.asMsSql());
    return this;
  }

  asPostgreSql() {
    this.type = SQLLang.ANSI;
    let rx = new RegExp("\\?", "g");
    let keys = this.parameters.keys();
    this.originalWhere = this.where;
    this.where = this.where.replace(rx, () => `:${keys.next().value}`);
    this.includes.forEach((item) => item.asPostgreSql());
    return this;
  }

  asType() {
    switch (this.type) {
      case SQLLang.MsSql: return this.asMsSql();
      case SQLLang.ANSI:
      case SQLLang.MySql:
      case SQLLang.PostgreSql: return this.asPostgreSql();
      case SQLLang.Oracle: return this.asOracleSql();
      default: return this;
    }
  }

  protected VisitExpand(node: Token, context: any) {
    node.value.items.forEach((item) => {
      let expandPath = item.value.path.raw;
      let visitor = this.includes.filter(v => v.navigationProperty == expandPath)[0];
      if (!visitor) {
        visitor = new TypeOrmVisitor(this.options);
        visitor.parameterSeed = this.parameterSeed;
        this.includes.push(visitor);
      }
      visitor.Visit(item);
      this.parameterSeed = visitor.parameterSeed;
    });
  }

  protected VisitSelectItem(node: Token, context: any) {
    let item = node.raw.replace(/\//g, '.');
    this.select += this.getIdentifier(item, context.identifier);//`${this.alias}.${item}`;
  }

  protected VisitODataIdentifier(node: Token, context: any) {
    if (context.identifier && context.identifier.endsWith('.')) {
      this[context.target] += '.';
    }

    if (node.value.name === 'NULL') {
      this[context.target] += node.value.name;
    } else {
      const ident = this.getIdentifier(node.value.name, context);//`${this.alias ? this.alias + '.' : ''}${node.value.name}`;
      this[context.target] += ident
    }
    context.identifier = /*this.getIdentifier(node.value.name, context); //*/node.value.name;
  }

  private getIdentifier(originalIdentifier: string, context: any) {
    let alias = '';
    if (!context || !context.identifier || !context.identifier.endsWith('.')) {
      alias = this.alias + '.';
    } else {
      this[context.target] = this[context.target].replace(new RegExp(this.alias + '.' + context.identifier, 'g'), context.identifier)
    }
    return `${alias}${originalIdentifier}`;
  };

  protected VisitEqualsExpression(node: Token, context: any) {
    this.Visit(node.value.left, context);
    this.where += ' = ';
    this.Visit(node.value.right, context);
    if (this.options.useParameters && context.literal == null) {
      this.where = this.where.replace(/= :p\d*$/, 'IS NULL')
        .replace(new RegExp(`\\:p\\d* = ${context.identifier}$`),
          `${context.identifier} IS NULL`);
    } else if (context.literal == 'NULL') {
      this.where = this.where.replace(/= NULL$/, 'IS NULL')
        .replace(new RegExp(`NULL = ${context.identifier}$`), `${context.identifier} IS NULL`);
    }
  }

	protected VisitInExpression(node:any, context:any){
    this.Visit(node.value.left, context);
    this.where += ' in ';
    this.Visit(node.value.right, context);
    if (this.options.useParameters && context.literal == null) {
      this.where = this.where.replace(/= :p\d*$/, 'IS NULL')
        .replace(new RegExp(`\\:p\\d* = ${context.identifier}$`),
          `${context.identifier} IS NULL`);
    } else if (context.literal == 'NULL') {
      this.where = this.where.replace(/= NULL$/, 'IS NULL')
        .replace(new RegExp(`NULL = ${context.identifier}$`), `${context.identifier} IS NULL`);
    }
  };

  protected VisitNotInExpression(node:any, context:any){
    this.Visit(node.value.left, context);
    this.where += ' not in ';
    this.Visit(node.value.right, context);
    if (this.options.useParameters && context.literal == null) {
      this.where = this.where.replace(/= :p\d*$/, 'IS NULL')
        .replace(new RegExp(`\\:p\\d* = ${context.identifier}$`),
          `${context.identifier} IS NULL`);
    } else if (context.literal == 'NULL') {
      this.where = this.where.replace(/= NULL$/, 'IS NULL')
        .replace(new RegExp(`NULL = ${context.identifier}$`), `${context.identifier} IS NULL`);
    }
  };

  protected VisitNotEqualsExpression(node: Token, context: any) {
    this.Visit(node.value.left, context);
    this.where += ' <> ';
    this.Visit(node.value.right, context);
    if (this.options.useParameters && context.literal == null) {
      this.where = this.where.replace(/<> :p\d*$/, 'IS NOT NULL')
        .replace(new RegExp(`\\:p\\d* <> ${context.identifier}$`),
          `${context.identifier} IS NOT NULL`);
    } else if (context.literal == 'NULL') {
      this.where = this.where.replace(/<> NULL$/, 'IS NOT NULL')
        .replace(new RegExp(`NULL <> ${context.identifier}$`), `${context.identifier} IS NOT NULL`);
    }
  }

  protected VisitLiteral(node: Token, context: any) {
    // 如果是in 查询,则使用 += 拼接where条件
    if (this.options.useParameters && node.value != 'Edm.Array') {
      let name = `p${this.parameterSeed++}`;
      let value = Literal.convert(node.value, node.raw);
      context.literal = value;
      if (context.literal != null) {
        this.parameters.set(name, value);
      }
      // this.where += `:${name}`;
      // 因为useParameters为true，所以这里不可以把where追加为:p1这种格式，因为asOracleSql、asPostgreSql等用了正则替换?占位的方式重新设置:p{index}值
      // 如果把where追加为:p1这种格式，已知的问题是VisitMethodCallExpression函数中的包括contains在内的所有method都只能写在过滤条件的最前面，而不可以写在后面的位置
      this.where += `?`;
    } else this.where += (context.literal = SQLLiteral.convert(node.value, node.raw));
  }

  protected VisitNotExpression(node: Token, context: any) {
    if (node.value && node.value.type === "MethodCallExpression" && node.value.value.method) {
      node.value.value.method = `not ${node.value.value.method}`;
      this.VisitMethodCallExpression(node.value, context);
    }
  }

  protected VisitMethodCallExpression(node:Token, context:any){
    var method = node.value.method;
    var params = node.value.parameters || [];
    switch (method){
      case "contains":
        this.Visit(params[0], context);
        if (this.options.useParameters){
          let name = `p${this.parameterSeed++}`;
          let value = Literal.convert(params[1].value, params[1].raw);
          this.parameters.set(name, `%${value}%`);
          this.where += " like ?";
        }else this.where += ` like '%${SQLLiteral.convert(params[1].value, params[1].raw).slice(1, -1)}%'`;
        break;
      case "not contains":
        this.Visit(params[0], context);
        if (this.options.useParameters) {
          let name = `p${this.parameterSeed++}`;
          let value = Literal.convert(params[1].value, params[1].raw);
          this.parameters.set(name, `%${value}%`);
          this.where += " not like ?";
        } else this.where += ` not like '%${SQLLiteral.convert(params[1].value, params[1].raw).slice(1, -1)}%'`;
        break;
      case "endswith":
        this.Visit(params[0], context);
        if (this.options.useParameters){
          let name = `p${this.parameterSeed++}`;
          let value = Literal.convert(params[1].value, params[1].raw);
          this.parameters.set(name, `%${value}`);
          this.where += " like ?";
        }else this.where += ` like '%${SQLLiteral.convert(params[1].value, params[1].raw).slice(1, -1)}'`;
        break;
      case "not endswith":
        this.Visit(params[0], context);
        if (this.options.useParameters) {
          let name = `p${this.parameterSeed++}`;
          let value = Literal.convert(params[1].value, params[1].raw);
          this.parameters.set(name, `%${value}`);
          this.where += " not like ?";
        } else this.where += ` not like '%${SQLLiteral.convert(params[1].value, params[1].raw).slice(1, -1)}'`;
        break;
      case "startswith":
        this.Visit(params[0], context);
        if (this.options.useParameters){
          let name = `p${this.parameterSeed++}`;
          let value = Literal.convert(params[1].value, params[1].raw);
          this.parameters.set(name, `${value}%`);
          this.where += " like ?";
        }else this.where += ` like '${SQLLiteral.convert(params[1].value, params[1].raw).slice(1, -1)}%'`;
        break;
      case "not startswith":
        this.Visit(params[0], context);
        if (this.options.useParameters) {
          let name = `p${this.parameterSeed++}`;
          let value = Literal.convert(params[1].value, params[1].raw);
          this.parameters.set(name, `${value}%`);
          this.where += " not like ?";
        } else this.where += ` not like '${SQLLiteral.convert(params[1].value, params[1].raw).slice(1, -1)}%'`;
        break;
      case "indexof":
        let fn = "";
        switch (this.type) {
          case SQLLang.MsSql:
            fn = "CHARINDEX";
            break;
          case SQLLang.ANSI:
          case SQLLang.MySql:
          case SQLLang.PostgreSql:
          default:
            fn = "INSTR";
            break;
        }
        if (fn === "CHARINDEX"){
          const tmp = params[0];
          params[0] = params[1];
          params[1] = tmp;
        }
        this.where += `${fn}(`;
        this.Visit(params[0], context);
        this.where += ', ';
        this.Visit(params[1], context);
        this.where += ") - 1";
        break;
      case "round":
        this.where += "ROUND(";
        this.Visit(params[0], context);
        this.where += ")";
        break;
      case "length":
        this.where += "LEN(";
        this.Visit(params[0], context);
        this.where += ")";
        break;
      case "tolower":
        this.where += "LOWER(";
        this.Visit(params[0], context);
        this.where += ")";
        break;
      case "toupper":
        this.where += "UPPER(";
        this.Visit(params[0], context);
        this.where += ")";
        break;
      case "floor":
      case "ceiling":
      case "year":
      case "month":
      case "day":
      case "hour":
      case "minute":
      case "second":
        this.where += `${method.toUpperCase()}(`;
        this.Visit(params[0], context);
        this.where += ")";
        break;
      case "now":
        this.where += "NOW()";
        break;
      case "trim":
        this.where += "TRIM(' ' FROM ";
        this.Visit(params[0], context);
        this.where += ")";
        break;
    }
  }

}
