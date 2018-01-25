// ?$select=Rating,ReleaseDate
// ->
// query.select('Rating ReleaseDate')
export default (query, $select) => new Promise((resolve) => {
	if (!$select) {
		return resolve();
	}

	const list = $select.split(',').map(item => item.trim());

	const selectFields = {
		_id: 0
	};
	const tree = query.model.schema.tree;
	Object.keys(tree).map((item) => {
		if (list.indexOf(item) >= 0) {
			if (item === 'id') {
				selectFields._id = 1;
			} else if (typeof tree[item] === 'function' || tree[item].select !== false) {
				selectFields[item] = 1;
			}
		}
		return undefined;
	});

	if (Object.keys(selectFields).length === 1 && selectFields._id === 0) {
		return resolve();
	}

	query.select(selectFields);
	return resolve();
});
