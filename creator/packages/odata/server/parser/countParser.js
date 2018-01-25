import filterParser from './filterParser';

// ?$count=10
// ->
// query.count(10)
export default (mongooseModel, $count, $filter) => new Promise((resolve, reject) => {
	if ($count === undefined) {
		return resolve();
	}

	switch ($count) {
		case 'true':
			{
				const query = mongooseModel.find();
				filterParser(query, $filter);
				query.count((err, count) => {
					resolve(count);
				});
				break;
			}
		case 'false':
			resolve();
			break;
		default:
			reject('Unknown $count option, only "true" and "false" are supported.');
			break;
	}
	return undefined;
});
