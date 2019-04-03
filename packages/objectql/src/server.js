var server = require('@steedos/meteor-bundle-runner');
var SteedosMeteorMongoDriver = require('../lib').SteedosMeteorMongoDriver;
server.Fiber(function () {
	server.Profile.run("Server startup", async function () {
		server.loadServerBundles();
		server.callStartupHooks();
		try {

			objectql = require("@steedos/objectql")
			newObjects = {}
			objectsRolesPermission = {}
			_.each(Creator.Objects, function (obj, key) {
				if (/^[_a-zA-Z][_a-zA-Z0-9]*$/.test(key)) {
					newObjects[key] = obj
				}
				objectsRolesPermission[key] = obj.permission_set
			})

			steedosSchema = new objectql.SteedosSchema({
				datasources: {
					default: {
						driver: 'meteor-mongo',
						objects: newObjects,
						objectsRolesPermission: objectsRolesPermission
					}
				},
				getRoles: function (userId) {
					console.log('userId: ', userId)
					return ['admin']
				}
			})
			var obj = steedosSchema.getObject('organizations')
			console.log('obj.getObjectRolesPermission(): ', obj.getObjectRolesPermission())
			console.log('obj.getUserObjectPermission(): ', await obj.getUserObjectPermission('hwJJbdc2WmFriMzb6'))


			var count = await obj.count({
				fields: ['_id']
			})
			console.log('count: ', count)
			let find = await obj.find({
				fields: ['_id']
			})
			console.log('find: ', find)
			let insert = await obj.insert({
				"name": "b",
				"parent": "2CXyaFdiBAtJbtpAe",
				"sort_no": 100,
				"is_company": false,
				"is_group": false,
				"hidden": false,
				"space": "YjYpjXZeSAzq6Y8ba"
			})
			console.log('insert: ', insert)

		} catch (error) {
			console.log(error)
		}
		server.Fiber(function () {
			server.runMain();
		}).run()

	});
}).run();