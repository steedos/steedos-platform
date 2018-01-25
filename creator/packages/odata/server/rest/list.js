import countParser from '../parser/countParser';
import filterParser from '../parser/filterParser';
import orderbyParser from '../parser/orderbyParser';
import skipParser from '../parser/skipParser';
import topParser from '../parser/topParser';
import selectParser from '../parser/selectParser';

function _countQuery(model, {
	count, filter
}) {
	return new Promise((resolve, reject) => {
		countParser(model, count, filter).then(dataCount =>
			(dataCount !== undefined ? resolve({
				'@odata.count': dataCount
			}) : resolve({}))).catch(reject);
	});
}

function _dataQuery(model, {
	filter, orderby, skip, top, select
}, options) {
	return new Promise((resolve, reject) => {
		const query = model.find();
		filterParser(query, filter)
			.then(() => orderbyParser(query, orderby || options.orderby))
			.then(() => skipParser(query, skip, options.maxSkip))
			.then(() => topParser(query, top, options.maxTop))
			.then(() => selectParser(query, select))
			.then(() => query.exec((err, data) => {
				if (err) {
					return reject(err);
				}
				return resolve({
					value: data
				});
			}))
			.catch(reject);
	});
}

export default (req, MongooseModel, options) => new Promise((resolve, reject) => {
	const params = {
		count: req.query.$count,
		filter: req.query.$filter,
		orderby: req.query.$orderby,
		skip: req.query.$skip,
		top: req.query.$top,
		select: req.query.$select
	};

	Promise.all([
		_countQuery(MongooseModel, params),
		_dataQuery(MongooseModel, params, options),
	]).then((results) => {
		const entity = results.reduce((current, next) => ({...current, ...next
		}));
		resolve({
			entity
		});
	}).catch(err => reject({
		status: 500,
		text: err
	}));
});
