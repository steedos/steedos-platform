var server = require('@steedos/meteor-bundle-runner');
var SteedosMeteorMongoDriver = require('../lib').SteedosMeteorMongoDriver;
server.Fiber(function () {
	server.Profile.run("Server startup", async function () {
		server.loadServerBundles();
		server.callStartupHooks();
		try {

			objectql = require("@steedos/objectql")
			newObjects = {}
			_.each(Creator.Objects, function (obj, key) {
				if (/^[_a-zA-Z][_a-zA-Z0-9]*$/.test(key)) {
					newObjects[key] = obj
				}
			})

			steedosSchema = new objectql.SteedosSchema({
				datasources: {
					default: {
						driver: 'meteor-mongo',
						objects: newObjects
					}
				}
			})
			var obj = steedosSchema.getObject('organizations')
			var count = await obj.count({
				fields: ['_id']
			})
			console.log('count: ', count)
			let find = await obj.find({
				fields: ['_id']
			})
			console.log('find: ', find)
			let insert = await obj.insert({"name":"b","parent":"2CXyaFdiBAtJbtpAe","sort_no":100,"is_company":false,"is_group":false,"hidden":false,"space":"YjYpjXZeSAzq6Y8ba"})
			console.log('insert: ', insert)

		} catch (error) {
			console.log(error)
		}
		server.Fiber(function () {
			server.runMain();
		}).run()

	});
}).run();