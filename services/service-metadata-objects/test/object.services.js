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
	name: "test-metadata-objects-services",

	settings: {

	},
    events: {
		"#accounts.created"(ctx) {
			broker.call("#accounts.find", {query: {filters: ['_id', '=', ctx.params.recordId]}}).then(res => console.log(ctx.eventName, res));
		},
        "#accounts.updated"(ctx) {
			broker.call("#accounts.find", {query: {filters: ['_id', '=', ctx.params.recordId]}}).then(res => console.log(ctx.eventName, res));
		},
        "#accounts.deleted"(ctx) {
			console.log("#accounts.deleted ctx:", ctx);
		}
	},
})

broker.start().then((a, b, c, d) => {
    broker.repl();
})
