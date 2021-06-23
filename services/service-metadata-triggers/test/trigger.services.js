const { ServiceBroker } = require("moleculer");
require('dotenv-flow').config(process.cwd());

const broker = new ServiceBroker({
	namespace: "steedos",
	nodeID: "$test",
	logLevel: "debug",
	requestTimeout: 5 * 1000,
	preferLocal: false,
	transporter: process.env.TRANSPORTER,
});

broker.createService({
	name: "test-metadata-triggers-services",

	settings: {

	},
	events: {

	},
})

broker.start().then((a, b, c, d) => {
	broker.repl();
	broker.call('triggers.add', { data: { name: 'get_test', listenTo: 'test_trigger', when: 'before.update', action: 'test' } }).then(res=>{console.log('triggers.add', res)})

	setInterval(() => {
		const appCRM = broker.getLocalService("appCRM");
		// console.log('broker.registry.registerActions', broker.registry);
		// console.log('appCRM', appCRM);
		broker.call('triggers.filter', { objectApiName: 'test_trigger', when: 'before.update'}).then(res=>{console.log('triggers.filter', res)})
		// });
	}, 5000)
})
