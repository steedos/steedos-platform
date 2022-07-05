import { Token } from "odata-v4-parser/lib/lexer";
import { Literal } from "odata-v4-literal";
import { SqlOptions } from "./index";

export class SQLLiteral extends Literal{
	static convert(type:string, value:string):any {
        return (new SQLLiteral(type, value)).valueOf();
    }
	'Edm.String'(value:string){ return "'" + decodeURIComponent(value).slice(1, -1).replace(/''/g, "'") + "'"; }
	'Edm.Guid'(value:string){ return "'" + decodeURIComponent(value) + "'"; }
	'Edm.Date'(value:string){ return "'" + value + "'"; }
	'Edm.DateTimeOffset'(value:string):any{ return "'" + value.replace("T", " ").replace("Z", " ").trim() + "'"; }
	'Edm.Boolean'(value:string):any{
        value = value || '';
        switch (value.toLowerCase()){
            case 'true': return 1;
            case 'false': return 0;
            default: return "NULL";
        }
    }
	'null'(value:string){ return "NULL"; }
}

export enum SQLLang{
	ANSI,
	MsSql,
	MySql,
	PostgreSql,
	Oracle
}

export class Visitor{
	protected options:SqlOptions
	type:SQLLang;
	select:string = "";
	where:string = "";
	orderby:string = "";
	skip:number
	limit:number
	inlinecount:boolean
	navigationProperty:string
	includes:Visitor[] = [];
	parameters:any = new Map();
	protected parameterSeed:number = 0;
	protected originalWhere:string;
	ast:Token

	constructor(options = <SqlOptions>{}){
		this.options = options;
		if (this.options.useParameters != false) this.options.useParameters = true;
		this.type = options.type || SQLLang.ANSI;
	}

	from(table:string){
		let sql = `SELECT ${this.select} FROM [${table}] WHERE ${this.where} ORDER BY ${this.orderby}`;
		switch (this.type){
      case SQLLang.Oracle:
			case SQLLang.MsSql:
				if (typeof this.skip == "number") sql += ` OFFSET ${this.skip} ROWS`;
				if (typeof this.limit == "number"){
					if (typeof this.skip != "number") sql += " OFFSET 0 ROWS";
					sql += ` FETCH NEXT ${this.limit} ROWS ONLY`;
				}
				break;
			case SQLLang.MySql:
			case SQLLang.PostgreSql:
			default:
				if (typeof this.limit == "number") sql += ` LIMIT ${this.limit}`;
				if (typeof this.skip == "number") sql += ` OFFSET ${this.skip}`;
				break;
		}
		return sql;
	}

	asMsSql(){
		this.type = SQLLang.MsSql;
		let rx = new RegExp("\\?", "g");
		let keys = this.parameters.keys();
		this.originalWhere = this.where;
		this.where = this.where.replace(rx, () => `@${keys.next().value}`);
		this.includes.forEach((item) => item.asMsSql());
		return this;
	}

  asOracleSql(){
    this.type = SQLLang.Oracle;
    let rx = new RegExp("\\?", "g");
    let keys = this.parameters.keys();
    this.originalWhere = this.where;
    this.where = this.where.replace(rx, () => `:${keys.next().value}`);
    this.includes.forEach((item) => item.asOracleSql());
    return this;
  }

	asAnsiSql(){
		this.type = SQLLang.ANSI;
		this.where = this.originalWhere || this.where;
		this.includes.forEach((item) => item.asAnsiSql());
		return this;
	}

	asType(){
		switch (this.type){
			case SQLLang.MsSql: return this.asMsSql();
			case SQLLang.ANSI:
			case SQLLang.MySql:
			case SQLLang.PostgreSql: return this.asAnsiSql();
			case SQLLang.Oracle: return this.asOracleSql();
			default: return this;
		}
	}

	Visit(node:Token, context?:any){
		this.ast = this.ast || node;
		context = context || { target: "where" };

		if (node){
			var visitor = this[`Visit${node.type}`];
			if (visitor) visitor.call(this, node, context);
			else console.log(`Unhandled node type: ${node.type}`, node);
		}

		if (node == this.ast){
			if (!this.select) this.select = `*`;
			if (!this.where) this.where = "1 = 1";
			if (!this.orderby) this.orderby = "1";
		}
		return this;
	}

	protected VisitODataUri(node:Token, context:any){
		this.Visit(node.value.resource, context);
		this.Visit(node.value.query, context);
	}

	protected VisitExpand(node: Token, context: any) {
        node.value.items.forEach((item) => {
            let expandPath = item.value.path.raw;
            let visitor = this.includes.filter(v => v.navigationProperty == expandPath)[0];
            if (!visitor){
                visitor = new Visitor(this.options);
				visitor.parameterSeed = this.parameterSeed;
                this.includes.push(visitor);
            }
            visitor.Visit(item);
			this.parameterSeed = visitor.parameterSeed;
        });
    }

    protected VisitExpandItem(node: Token, context: any) {
        this.Visit(node.value.path, context);
        if (node.value.options) node.value.options.forEach((item) => this.Visit(item, context));
    }

    protected VisitExpandPath(node: Token, context: any) {
        this.navigationProperty = node.raw;
    }

	protected VisitQueryOptions(node:Token, context:any){
		node.value.options.forEach((option) => this.Visit(option, context));
	}

	protected VisitInlineCount(node:Token, context:any){
		this.inlinecount = Literal.convert(node.value.value, node.value.raw);
	}

	protected VisitFilter(node:Token, context:any){
		context.target = "where";
		this.Visit(node.value, context);
		if (!this.where) this.where = "1 = 1";
	}

	protected VisitOrderBy(node:Token, context:any){
		context.target = "orderby";
		node.value.items.forEach((item, i) => {
			this.Visit(item, context);
			if (i < node.value.items.length - 1) this.orderby += ", ";
		});
	}

	protected VisitOrderByItem(node:Token, context:any){
		this.Visit(node.value.expr, context);
		this.orderby += node.value.direction > 0 ? " ASC" : " DESC";
	}

	protected VisitSkip(node:Token, context:any){
		this.skip = +node.value.raw;
	}

	protected VisitTop(node:Token, context:any){
		this.limit = +node.value.raw;
	}

	protected VisitSelect(node:Token, context:any){
		context.target = "select";
		node.value.items.forEach((item, i) => {
			this.Visit(item, context);
			if (i < node.value.items.length - 1) this.select += ", ";
		});
	}

	protected VisitSelectItem(node:Token, context:any){
		let item = node.raw.replace(/\//g, '.');
		this.select += `[${item}]`;
	}

	protected VisitAndExpression(node:Token, context:any){
		this.Visit(node.value.left, context);
		this.where += " AND ";
		this.Visit(node.value.right, context);
	}

	protected VisitOrExpression(node:Token, context:any){
		this.Visit(node.value.left, context);
		this.where += " OR ";
		this.Visit(node.value.right, context);
	}

	protected VisitBoolParenExpression(node:Token, context:any){
		this.where += "(";
		this.Visit(node.value, context);
		this.where += ")";
	}

	protected VisitCommonExpression(node:Token, context:any){
		this.Visit(node.value, context);
	}

	protected VisitFirstMemberExpression(node:Token, context:any){
		this.Visit(node.value, context);
	}

	protected VisitMemberExpression(node:Token, context:any){
		this.Visit(node.value, context);
	}

	protected VisitPropertyPathExpression(node:Token, context:any){
		if (node.value.current && node.value.next){
			this.Visit(node.value.current, context);
			context.identifier += ".";
			this.Visit(node.value.next, context);
		}else this.Visit(node.value, context);
	}

	protected VisitSingleNavigationExpression(node:Token, context:any){
		if (node.value.current && node.value.next){
			this.Visit(node.value.current, context);
			this.Visit(node.value.next, context);
		}else this.Visit(node.value, context);
	}

	protected VisitODataIdentifier(node:Token, context:any){
		this[context.target] += `[${node.value.name}]`;
		context.identifier = node.value.name;
	}

	protected VisitEqualsExpression(node:Token, context:any){
		this.Visit(node.value.left, context);
		this.where += " = ";
		this.Visit(node.value.right, context);
		if (this.options.useParameters && context.literal == null){
			this.where = this.where.replace(/= \?$/, "IS NULL").replace(new RegExp(`\\? = \\[${context.identifier}\\]$`), `[${context.identifier}] IS NULL`);
		}else if (context.literal == "NULL"){
			this.where = this.where.replace(/= NULL$/, "IS NULL").replace(new RegExp(`NULL = \\[${context.identifier}\\]$`), `[${context.identifier}] IS NULL`);
		}
	}

	protected VisitNotEqualsExpression(node:Token, context:any){
		this.Visit(node.value.left, context);
		this.where += " <> ";
		this.Visit(node.value.right, context);
		if (this.options.useParameters && context.literal == null){
			this.where = this.where.replace(/<> \?$/, "IS NOT NULL").replace(new RegExp(`\\? <> \\[${context.identifier}\\]$`), `[${context.identifier}] IS NOT NULL`);
		}else if (context.literal == "NULL"){
			this.where = this.where.replace(/<> NULL$/, "IS NOT NULL").replace(new RegExp(`NULL <> \\[${context.identifier}\\]$`), `[${context.identifier}] IS NOT NULL`);
		}
	}

	protected VisitLesserThanExpression(node:Token, context:any){
		this.Visit(node.value.left, context);
		this.where += " < ";
		this.Visit(node.value.right, context);
	}

	protected VisitLesserOrEqualsExpression(node:Token, context:any){
		this.Visit(node.value.left, context);
		this.where += " <= ";
		this.Visit(node.value.right, context);
	}

	protected VisitGreaterThanExpression(node:Token, context:any){
		this.Visit(node.value.left, context);
		this.where += " > ";
		this.Visit(node.value.right, context);
	}

	protected VisitGreaterOrEqualsExpression(node:Token, context:any){
		this.Visit(node.value.left, context);
		this.where += " >= ";
		this.Visit(node.value.right, context);
	}

	protected VisitLiteral(node:Token, context:any){
		if (this.options.useParameters){
			let name = `p${this.parameterSeed++}`;
			let value = Literal.convert(node.value, node.raw);
			context.literal = value;
			this.parameters.set(name, value);
			this.where += "?";
		}else this.where += (context.literal = SQLLiteral.convert(node.value, node.raw));
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
			case "endswith":
				this.Visit(params[0], context);
				if (this.options.useParameters){
					let name = `p${this.parameterSeed++}`;
					let value = Literal.convert(params[1].value, params[1].raw);
					this.parameters.set(name, `%${value}`);
					this.where += " like ?";
				}else this.where += ` like '%${SQLLiteral.convert(params[1].value, params[1].raw).slice(1, -1)}'`;
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
				this.where += "LCASE(";
				this.Visit(params[0], context);
				this.where += ")";
				break;
			case "toupper":
				this.where += "UCASE(";
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
