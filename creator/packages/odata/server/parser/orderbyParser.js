// ?$skip=10
// ->
// query.skip(10)
export default (query, $orderby) => new Promise((resolve, reject) => {
	if (!$orderby) {
		return resolve();
	}

	const order = {};
	const orderbyArr = $orderby.split(',');

	orderbyArr.map((item) => {
		const data = item.trim().split(' ');
		if (data.length > 2) {
			return reject(`odata: Syntax error at '${$orderby}', ` + 'it\'s should be like \'ReleaseDate asc, Rating desc\'');
		}
		const key = data[0].trim();
		const value = data[1] || 'asc';
		order[key] = value;
		return undefined;
	});
	query.sort(order);
	return resolve();
});
