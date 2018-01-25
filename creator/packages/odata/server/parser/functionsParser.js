const convertToOperator = (odataOperator) => {
	let operator;
	switch (odataOperator) {
		case 'eq':
			operator = '==';
			break;
		case 'ne':
			operator = '!=';
			break;
		case 'gt':
			operator = '>';
			break;
		case 'ge':
			operator = '>=';
			break;
		case 'lt':
			operator = '<';
			break;
		case 'le':
			operator = '<=';
			break;
		default:
			throw new Error('Invalid operator code, expected one of ["==", "!=", ">", ">=", "<", "<="].');
	}
	return operator;
};

// contains(CompanyName,'icrosoft')
const contains = (query, fnKey) => {
	let [key, target] = fnKey.substring(fnKey.indexOf('(') + 1, fnKey.indexOf(')')).split(',');
	[key, target] = [key.trim(), target.trim()];
	query.$where(`this.${key}.indexOf(${target}) != -1`);
};

// indexof(CompanyName,'X') eq 1
const indexof = (query, fnKey, odataOperator, value) => {
	let [key, target] = fnKey.substring(fnKey.indexOf('(') + 1, fnKey.indexOf(')')).split(',');
	[key, target] = [key.trim(), target.trim()];
	const operator = convertToOperator(odataOperator);
	query.$where(`this.${key}.indexOf(${target}) ${operator} ${value}`);
};

// year(publish_date) eq 2000
const year = (query, fnKey, odataOperator, value) => {
	const key = fnKey.substring(fnKey.indexOf('(') + 1, fnKey.indexOf(')'));

	const start = new Date(+value, 0, 1);
	const end = new Date(+value + 1, 0, 1);

	switch (odataOperator) {
		case 'eq':
			query.where(key).gte(start).lt(end);
			break;
		case 'ne':
			{
				const condition = [{}, {}];
				condition[0][key] = {
					$lt: start
				};
				condition[1][key] = {
					$gte: end
				};
				query.or(condition);
				break;
			}
		case 'gt':
			query.where(key).gte(end);
			break;
		case 'ge':
			query.where(key).gte(start);
			break;
		case 'lt':
			query.where(key).lt(start);
			break;
		case 'le':
			query.where(key).lt(end);
			break;
		default:
			throw new Error('Invalid operator code, expected one of ["==", "!=", ">", ">=", "<", "<="].');
	}
};

export default {
	indexof, year, contains
};
