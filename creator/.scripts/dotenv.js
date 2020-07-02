const path = require("path");
const dotenv = require("dotenv-flow");

delete process.env.MONGO_URL
delete process.env.MONGO_OPLOG_URL
delete process.env.ROOT_URL
delete process.env.PORT

let projectPath = process.cwd()

dotenv.config({path: projectPath, debug: true, purge_dotenv: true})
console.log("MONGO_URL: " + process.env.MONGO_URL)

module.exports= {}