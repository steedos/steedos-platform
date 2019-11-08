let objectql = require("@steedos/objectql")
let path = require("path");

let datasource = objectql.getDataSource()
objectql.addObjectConfigFiles(path.join(__dirname, "../src/**"), 'default');
datasource.init()
console.log(datasource)
let object = objectql.getObject("permission_set")
object.find({}).then(function(result){
    console.log(result)
})
objectql.addAppConfigFiles(path.join(process.cwd(), "src/**"))
let apps = objectql.getAppConfigs()
console.log(objectql.getConfigDatabase())