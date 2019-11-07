let objectql = require("@steedos/objectql")
let path = require("path");

let datasource = objectql.getDataSource()
console.log(datasource);
objectql.addObjectConfigFiles(path.join(__dirname, "../src/**"), 'default');
datasource.init()
console.log(datasource);
let object = objectql.getObject("contracts")
console.log(object)
object.count({}).then(function(result){
    console.log(result)
})
