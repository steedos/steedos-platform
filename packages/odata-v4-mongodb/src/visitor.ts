import { Literal } from "odata-v4-literal";

export class Visitor{
	query: any
	sort: any
	skip: number
	limit: number
	projection: any
	collection: string
	navigationProperty: string
	includes:Visitor[]
	inlinecount: boolean
	ast:any

	constructor(){
		this.query = {};
		this.sort = {};
		this.projection = {};
		this.includes = [];

		let _ast;
		Object.defineProperty(this, "ast", {
			get: () => { return _ast; },
			set: (v) => { _ast = v; },
			enumerable: false
		});
	}

	Visit(node:any, context?:any){
		this.ast = this.ast || node;
		context = context || {};

		if (node){
			var visitor = this[`Visit${node.type}`];
			if (visitor) visitor.call(this, node, context);
		}

		return this;
	}

	protected VisitODataUri(node:any, context:any){
		this.Visit(node.value.resource, context);
		this.Visit(node.value.query, context);
	}

	protected VisitEntitySetName(node:any, context:any){
		this.collection = node.value.name;
	}

	protected VisitExpand(node: any, context: any) {
        var innerContexts:any = {};
        node.value.items.forEach((item) => {
            var expandPath = item.value.path.raw;
            var innerVisitor = this.includes.filter(v => v.navigationProperty === expandPath)[0];
            if (!innerVisitor){
                innerVisitor = new Visitor();

                innerContexts[expandPath] = {
                    query: {},
                    sort: {},
                    projection: {},
                    options: {}
                };

                this.includes.push(innerVisitor);
            }

            let innerContext:any = innerContexts[expandPath] || {};
            innerVisitor.Visit(item, innerContext);

            innerVisitor.query = innerContext.query || innerVisitor.query || {};
            innerVisitor.sort = innerContext.sort || innerVisitor.sort;
            innerVisitor.projection = innerContext.projection || innerVisitor.projection;
        });
    }

    protected VisitExpandItem(node: any, context: any) {
        this.Visit(node.value.path, context);
        node.value.options && node.value.options.forEach((item) => this.Visit(item, context));
    }

    protected VisitExpandPath(node: any, context: any) {
        this.navigationProperty = node.raw;
    }

	protected VisitQueryOptions(node:any, context:any){
		context.options = {};
		node.value.options.forEach((option) => this.Visit(option, context));

		this.query = context.query || {};
		delete context.query;

		this.sort = context.sort;
		delete context.sort;
	}

	protected VisitInlineCount(node:any, context:any){
		this.inlinecount = Literal.convert(node.value.value, node.value.raw);
	}

	protected VisitFilter(node:any, context:any){
		context.query = {};
		this.Visit(node.value, context);
		delete context.identifier;
		delete context.literal;
	}

	protected VisitOrderBy(node:any, context:any){
		context.sort = {};
		node.value.items.forEach((item) => this.Visit(item, context));
	}

	protected VisitSkip(node:any, context:any){
		this.skip = +node.value.raw;
	}

	protected VisitTop(node:any, context:any){
		this.limit = +node.value.raw;
	}

	protected VisitOrderByItem(node:any, context:any){
		this.Visit(node.value.expr, context);
		if (context.identifier) context.sort[context.identifier] = node.value.direction;
		delete context.identifier;
		delete context.literal;
	}

	protected VisitSelect(node:any, context:any){
		context.projection = {};
		node.value.items.forEach((item) => this.Visit(item, context));

		this.projection = context.projection;
		delete context.projection;
	}

	protected VisitSelectItem(node:any, context:any){
		context.projection[node.raw.replace(/\//g, '.')] = 1;
	}

	protected VisitAndExpression(node:any, context:any){
		var query = context.query;
		var leftQuery = {};
		context.query = leftQuery;
		this.Visit(node.value.left, context);

		var rightQuery = {};
		context.query = rightQuery;
		this.Visit(node.value.right, context);

		if (Object.keys(leftQuery).length > 0 && Object.keys(rightQuery).length > 0){
			query.$and = [leftQuery, rightQuery];
		}
		context.query = query;
	}

	protected VisitOrExpression(node:any, context:any){
		var query = context.query;
		var leftQuery = {};
		context.query = leftQuery;
		this.Visit(node.value.left, context);

		var rightQuery = {};
		context.query = rightQuery;
		this.Visit(node.value.right, context);

		if (Object.keys(leftQuery).length > 0 && Object.keys(rightQuery).length > 0){
			query.$or = [leftQuery, rightQuery];
		}
		context.query = query;
	}

	protected VisitBoolParenExpression(node:any, context:any){
		this.Visit(node.value, context);
	}

	protected VisitCommonExpression(node:any, context:any){
		this.Visit(node.value, context);
	}

	protected VisitFirstMemberExpression(node:any, context:any){
		this.Visit(node.value, context);
	}

	protected VisitMemberExpression(node:any, context:any){
		this.Visit(node.value, context);
	}

	protected VisitPropertyPathExpression(node:any, context:any){
		if (node.value.current && node.value.next){
			this.Visit(node.value.current, context);
			if (context.identifier) context.identifier += ".";
			this.Visit(node.value.next, context);
		}else this.Visit(node.value, context);
	}

	protected VisitSingleNavigationExpression(node:any, context:any){
		if (node.value.current && node.value.next){
			this.Visit(node.value.current, context);
			this.Visit(node.value.next, context);
		}else this.Visit(node.value, context);
	}

	protected VisitODataIdentifier(node:any, context:any){
		context.identifier = (context.identifier || "") + node.value.name;
	}

	protected VisitNotExpression(node:any, context:any){
		this.Visit(node.value, context);
		if (context.query){
			for (var prop in context.query){
				context.query[prop] = { $not: context.query[prop] };
			}
		}
	}

	protected VisitEqualsExpression(node:any, context:any){
		this.Visit(node.value.left, context);
		this.Visit(node.value.right, context);

		if (context.identifier) context.query[context.identifier] = context.literal;
		delete context.identifier;
		delete context.literal;
	}

	protected VisitNotEqualsExpression(node:any, context:any){
		this.Visit(node.value.left, context);
		this.Visit(node.value.right, context);
		if (context.identifier) context.query[context.identifier] = { $ne: context.literal };
		delete context.identifier;
		delete context.literal;
	}

	protected VisitInExpression(node:any, context:any){
        this.Visit(node.value.left, context);
        this.Visit(node.value.right, context);
        if (context.identifier)
            context.query[context.identifier] = {
                $in: JSON.parse(`[${node.value.right.raw.replace(/\'/g, "\"").slice(1).slice(0, -1)}]`)
            };
        delete context.identifier;
        delete context.literal;
    };

	protected VisitNotInExpression(node:any, context:any){
        this.Visit(node.value.left, context);
        this.Visit(node.value.right, context);
        if (context.identifier)
            context.query[context.identifier] = {
                $nin: JSON.parse(`[${node.value.right.raw.replace(/\'/g, "\"").slice(1).slice(0, -1)}]`)
            };
        delete context.identifier;
        delete context.literal;
    };

	protected VisitLesserThanExpression(node:any, context:any){
		this.Visit(node.value.left, context);
		this.Visit(node.value.right, context);
		if (context.identifier) context.query[context.identifier] = { $lt: context.literal };
		delete context.identifier;
		delete context.literal;
	}

	protected VisitLesserOrEqualsExpression(node:any, context:any){
		this.Visit(node.value.left, context);
		this.Visit(node.value.right, context);
		if (context.identifier) context.query[context.identifier] = { $lte: context.literal };
		delete context.identifier;
		delete context.literal;
	}

	protected VisitGreaterThanExpression(node:any, context:any){
		this.Visit(node.value.left, context);
		this.Visit(node.value.right, context);
		if (context.identifier) context.query[context.identifier] = { $gt: context.literal };
		delete context.identifier;
		delete context.literal;
	}

	protected VisitGreaterOrEqualsExpression(node:any, context:any){
		this.Visit(node.value.left, context);
		this.Visit(node.value.right, context);
		if (context.identifier) context.query[context.identifier] = { $gte: context.literal };
		delete context.identifier;
		delete context.literal;
	}

	protected VisitLiteral(node:any, context:any){
		context.literal = Literal.convert(node.value, node.raw);
	}

	protected VisitMethodCallExpression(node: any, context: any) {
		var method = node.value.method;
		(node.value.parameters || []).forEach(p => this.Visit(p, context));
		if (context.identifier) {
			switch (method) {
				case "contains":
					context.query[context.identifier] = new RegExp(context.literal, "gi");
					break;
				case "endswith":
					context.query[context.identifier] = new RegExp(context.literal + "$", "gi");
					break;
				case "startswith":
					context.query[context.identifier] = new RegExp("^" + context.literal, "gi");
					break;
				default:
					throw new Error("Method call not implemented.")
			}
			delete context.identifier;
		}
	}

}
