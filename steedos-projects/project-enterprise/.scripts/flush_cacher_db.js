const Redis = require("ioredis");
require('dotenv-flow').config(process.cwd());
const redis = new Redis(process.env.CACHER);
redis.flushdb(() => {
    console.log(`flushdb: ${process.env.CACHER}`);
    process.exit(0)
});