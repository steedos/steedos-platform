var fs = require("fs")
var os = require("os")
var path = require("path")
var _ = require("underscore")
var yaml = require("js-yaml")


var getServerDir = function(){
  var serverDir = process.env.SERVER_DIR;  
  if (!serverDir) {
      process.env.NODE_OPTIONS="";
      var npmRoot = require('child_process').execSync('npm root -g').toString().trim()
      try {
          serverDir = path.join(npmRoot, "steedos-server", "bundle", "programs", "server")
      } catch (err) {
          console.error(`Install steedos server globally first with: npm install -g steedos-server`)
          process.exit(1)
      }
  } else {
      serverDir = path.join(serverDir, "bundle", "programs", "server");
  }
  
  if (!fs.existsSync(serverDir))
  {
      console.error(`serverDir not found: ${serverDir}`);
      console.error(`Install steedos server globally first with: npm install -g steedos-server`)
      process.exit(1)
  }  
  return serverDir;
}

var getSettings = function(){
  
  var settingsFileName = 'settings.yml'
  var settingsPath = path.join(projectDir, settingsFileName)
  var settings = {
  };
  if(fs.existsSync(settingsPath)){
    try {
      settings = yaml.safeLoad(fs.readFileSync(settingsPath, 'utf8'));
    } catch (error) {
      console.error(`Invalid settings.yml`, error)
    }
  }

  if(settings){
    process.env.METEOR_SETTINGS = JSON.stringify(settings)
  }

  // 环境变量，以settings中定义的为准
  if (settings.env){
    _.each(settings.env, function(item, key){
      process.env[key] = item
    })
  }

  return settings;

}
  
var projectDir = process.cwd();   
var serverDir = getServerDir();
var settings = getSettings();


var port = process.env.PORT;
if (!port){
  port = 3000;
  process.env.PORT = port
}

var rootUrl = process.env.ROOT_URL;      
if (!rootUrl) {
    rootUrl = "http://" + os.hostname() + ":" + port
    process.env.ROOT_URL = rootUrl
}

var mongoUrl =  process.env.MONGO_URL;       
if (!mongoUrl) {  
  mongoUrl = "mongodb://127.0.0.1/steedos";
  process.env.MONGO_URL = mongoUrl
}

__steedos_bootstrap__ = {
    projectDir: projectDir,
    serverDir: serverDir,
    rootUrl: rootUrl,
    mongoUrl: mongoUrl,
    verbose: false
}

console.log("*******************************************************************");
console.log("*")
console.log(`*  Initialize Steedos Server ...`);
console.log("*")
console.log(`*  PORT: ${process.env.PORT}`);
console.log(`*  ROOT_URL: ${process.env.ROOT_URL}`);
console.log(`*  MONGO_URL: ${process.env.MONGO_URL}`);
console.log(`*  PROJECT_DIR: ${projectDir}`);
console.log(`*  SERVER_DIR: ${serverDir}`);
console.log("*")
console.log("*******************************************************************");

module.exports = require("./src/boot");

