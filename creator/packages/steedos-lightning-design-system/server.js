
// const express = require("express");
// const path = require("path");

// const router = express.Router()
// let dsPath = require.resolve("@salesforce-ux/design-system/package.json")
// dsPath = dsPath.replace("package.json", 'assets')

// // Meteor 开发环境
// let projectPath = process.cwd()
// if (projectPath.indexOf(".meteor")) {
//     projectPath = projectPath.split(".meteor")[0]
//     dsPath = path.join(projectPath, "node_modules", dsPath)
// }

// router.use("/assets/", express.static(dsPath));

// if (__meteor_runtime_config__ && __meteor_runtime_config__.ROOT_URL_PATH_PREFIX)
// router.use(__meteor_runtime_config__.ROOT_URL_PATH_PREFIX + "/assets/", express.static(dsPath));


// WebApp.rawConnectHandlers.use(router);
