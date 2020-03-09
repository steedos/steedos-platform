var migrate = require('migrate')
var path = require('path');

var stateStore = path.join(process.cwd(), '.migrate');
var migrationsDirectory = path.join(__dirname, 'migrations'); 

// let Fiber = require('fibers');

const up = async function() {

    migrate.load({
        stateStore: stateStore,
        migrationsDirectory: migrationsDirectory
    }, function (err, set) {
        if (err) {
          throw err
        }
        set.up(function (err) {
          if (err) {
            throw err
          }
          console.log('DB migrations up successfully.')
        })
    })
}

const init = async function() {
    var objectql = require("@steedos/objectql");
    if (objectql.getSteedosConfig().datasources.default.auto_migrate)
        up();
}

const down = async function() {
    migrate.load({
        stateStore: stateStore,
        migrationsDirectory: migrationsDirectory
    }, function (err, set) {
        if (err) {
          throw err
        }
        set.down(function (err) {
          if (err) {
            throw err
          }
          console.log('DB migrations down successfully.')
        })
    })
}

// const upSync = function(){
//   Fiber(function(){
//       let fiber = Fiber.current;
//       up.then(result => {
//           fiber.run();
//       }).catch(result => {
//           console.error(result)
//           fiber.run();
//       })
//       Fiber.yield();
//   }).run();
// }


module.exports = {
    init: init,
    up: up,
    // upSync: upSync,
    down: down
}