// const path = require("path")
// const projectDir = path.resolve(__dirname, '../../../')
// const {steedos} = require(`${projectDir}/package.json`);

// const steedos_plugins = steedos.plugins

// // const projectNodeModules = path.join(projectDir, 'node_modules');

// //先加载plugin, 再加载本地app
// _.each(steedos_plugins, (plugin)=>{
//     // require(path.join(projectNodeModules,plugin));
//     require(require.resolve(plugin))
// })

exports.load = require("./app").load;