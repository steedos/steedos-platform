//require("./src");
const path = require("path")
const SteedosSchema = require("@steedos/core").SteedosSchema;


const schema = new SteedosSchema({objects: {}, datasource: {url: 'mongo://xxxx'}})
schema.use(path.join(__dirname, "src"));
const objects = schema.getObject("contracts")
console.log(objects)

