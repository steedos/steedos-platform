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
			var aw = await obj.count({
				fields: ['_id']
			})
			console.log('aw: ', aw)
			console.log('f: ', await obj.find({
				fields: ['_id']
			}))

		} catch (error) {
			console.error(error)
			throw error
		}
		server.Fiber(function () {
			server.runMain();
		}).run()

	});
}).run();