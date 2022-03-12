const Redis = require("ioredis");
require('dotenv-flow').config(process.cwd());
let redis;
try {
    const cacherConfig = JSON.parse(process.env.STEEDOS_CACHER);
    redis = new Redis.Cluster(cacherConfig.options.cluster.nodes, cacherConfig.options.cluster.options);
} catch (error) {
    redis = new Redis(process.env.STEEDOS_CACHER);
}
if (redis) {
    redis.flushdb(() => {
        console.log(`flushdb: ${process.env.STEEDOS_CACHER}`);
        process.exit(0)
    });
}