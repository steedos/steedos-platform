const {exec,log,events} = require("../util");
const child_process = require('child_process');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'; 
const yarnCommand = process.platform === 'win32' ? 'yarn.cmd' : 'yarn';  
const path = require("path");
const fs = require("fs");
const moduleRe = /^(@[^/@]+?[/])?[^/@]+?$/;
const slashRe = process.platform === "win32" ? /\\|[/]/ : /[/]/;
// const pkgurlRe = /^(https?|git(|\+https?|\+ssh|\+file)):\/\//;
const pkgurlRe = /^(https?):\/\/|(file|link):/;
const localtgzRe = /^([a-zA-Z]:|\/).+tgz$/;
let installAllowList = ['*'];
let installDenyList = [];
let installAllAllowed = true;
let installVersionRestricted = false;
var activePromise = Promise.resolve();
const _ = require('lodash');
const npa = require("npm-package-arg");

log.init({});

const settings = {
    userDir: path.join(process.cwd(), '.steedos')
}

function checkModulePath(folder) {
    var moduleName;
    var moduleVersion;
    var err;
    var fullPath = path.resolve(folder);
    var packageFile = path.join(fullPath,'package.json');
    try {
        var pkg = require(packageFile);
        moduleName = pkg.name;
        moduleVersion = pkg.version;
        if (!pkg['node-red']) {
            // TODO: nls
            err = new Error("Invalid Node-RED module");
            err.code = 'invalid_module';
            throw err;
        }
    } catch(err2) {
        err = new Error("Module not found");
        err.code = 404;
        throw err;
    }
    return {
        name: moduleName,
        version: moduleVersion
    };
}

async function getModuleVersionFromNPM(module, version) {
    let installName = module;
    if (version) {
        installName += "@" + version;
    }

    return new Promise((resolve, reject) => {
        child_process.execFile(npmCommand,['info','--json',installName],function(err,stdout,stderr) {
            try {
                if (!stdout) {
                    log.warn(log._("server.install.install-failed-not-found",{name:module}));
                    e = new Error("Version not found");
                    e.code = 404;
                    reject(e);
                    return;
                }
                const response = JSON.parse(stdout);
                if (response.error) {
                    if (response.error.code === "E404") {
                        log.warn(log._("server.install.install-failed-not-found",{name:module}));
                        e = new Error("Module not found");
                        e.code = 404;
                        reject(e);
                    } else {
                        log.warn(log._("server.install.install-failed-long",{name:module}));
                        log.warn("------------------------------------------");
                        log.warn(response.error.summary);
                        log.warn("------------------------------------------");
                        reject(new Error(log._("server.install.install-failed")));
                    }
                    return;
                } else {
                    resolve(response.version);
                }
            } catch(err) {
                log.warn(log._("server.install.install-failed-long",{name:module}));
                log.warn("------------------------------------------");
                if (stdout) {
                    log.warn(stdout);
                }
                if (stderr) {
                    log.warn(stderr);
                }
                log.warn(err);
                log.warn("------------------------------------------");
                reject(new Error(log._("server.install.install-failed")));
            }
        });
    })
}

function checkModuleIsInstall(module){
    if(module){
        try {
            const modulePath = path.dirname(require.resolve(module + '/package.json'));
            return modulePath;
        } catch (Exception) {
            console.log(`Exception`, Exception)
            return false;
        }
    }
    return false
}

async function installModule(module, version, url, registry_url) {
    if (Buffer.isBuffer(module)) {
        // return installTarball(module)
        return 
    }
    // const check = checkModuleIsInstall(module);
    // if( check !== false){
    //     return check;
    // }
    // console.log(`installModule`, module,version,url)
    module = module || "";
    activePromise = activePromise.then(async function() {
        //TODO: ensure module is 'safe'
        var installName = module;
        let isRegistryPackage = true;
        var isUpgrade = false;
        var isExisting = false;
        if (url) { 
            if (pkgurlRe.test(url) || localtgzRe.test(url)) {
                // Git remote url or Tarball url - check the valid package url
                installName = url;
                isRegistryPackage = false;
            } else {
                log.warn(log._("server.install.install-failed-url",{name:module,url:url}));
                const e = new Error("Invalid url");
                e.code = "invalid_module_url";
                throw e;
            }
        } else if (moduleRe.test(module)) {
            // Simple module name - assume it can be npm installed
            if (version) {
                installName += "@"+version;
            }
        } else if (slashRe.test(module)) {
            // A path - check if there's a valid package.json
            installName = module;
            let info = checkModulePath(module);
            module = info.name;
            isRegistryPackage = false;
        } else {
            log.warn(log._("server.install.install-failed-name",{name:module}));
            const e = new Error("Invalid module name");
            e.code = "invalid_module_name";
            throw e;
        }
        if (!installAllAllowed) {
            let installVersion = version;
            if (installVersionRestricted && isRegistryPackage) {
                installVersion = await getModuleVersionFromNPM(module, version);
            }

            // if (!registryUtil.checkModuleAllowed(module,installVersion,installAllowList,installDenyList)) {
            //     const e = new Error("Install not allowed");
            //     e.code = "install_not_allowed";
            //     throw e;
            // }
        }

        var info = null //registry.getModuleInfo(module);
        if (info) {
            if (!info.user) {
                log.debug(`Installing existing module: ${module}`)
                isExisting = true;
            } else if (!version || info.version === version) {
                var err = new Error("Module already loaded");
                err.code = "module_already_loaded";
                throw err;
            }
            isUpgrade = true;
        } else {
            isUpgrade = false;
        }

        // if (!isUpgrade) {
        //     log.info(log._("server.install.installing",{name: module,version: version||"latest"}));
        // } else {
        //     log.info(log._("server.install.upgrading",{name: module,version: version||"latest"}));
        // }

        var installDir = settings.userDir || ".";
        var args = ['install','--no-audit','--no-update-notifier','--no-fund','--save','--save-prefix=~','--production',installName];
        var yarnArgs = ['add', '-E', installName, '--json']; //yarnCommand  , '--json' --registry
        if (false && registry_url) {
            yarnArgs.push('--registry')
            yarnArgs.push(registry_url)
        }
        return exec.run(yarnCommand,yarnArgs,{
            cwd: installDir
        }, true).then(result => {
            // console.log(`result ok`, result)
            try {
                const packagePath = path.dirname(require.resolve(`${module}/package.json`, {
                    paths: [path.join(settings.userDir, 'node_modules')]
                }))
                if(!fs.existsSync(path.join(packagePath, 'package.service.js'))){
                    throw new Error(`${module} is not steedos package`)
                }
                console.log(`install package ${module} successful.`)
                activePromise = Promise.resolve(packagePath);
                return activePromise;
            } catch (error) {
                throw new Error(`${module} is not steedos package`)
            }

            // log.info(JSON.stringify(result))
            if (isExisting) {
                // This is a module we already have installed as a non-user module.
                // That means it was discovered when loading, but was not listed
                // in package.json and has been hidden from the editor.
                // The user has requested to install this module. Having run
                // the npm install above, it will now be listed in package.json.
                // Update the registry to mark it as a user module so it will
                // be available to the editor.
                log.info(log._("server.install.installed",{name:module}));
                // return require("./registry").setUserInstalled(module,true).then(reportAddedModules);
            } else if (!isUpgrade) {
                log.info(log._("server.install.installed",{name:module}));
                // return require("./index").addModule(module).then(reportAddedModules);
            } else {
                log.info(log._("server.install.upgraded",{name:module, version:version}));
                // events.emit("runtime-event",{id:"restart-required",payload:{type:"warning",text:"notification.warnings.restartRequired"},retain:true});
                // return require("./registry").setModulePendingUpdated(module,version);
            }
        }).catch(result => {
            activePromise = Promise.resolve();
            throw result;
            // var output = result.stderr;
            // var e;
            // var lookFor404 = new RegExp(" 404 .*"+module,"m");
            // var lookForVersionNotFound = new RegExp("version not found: "+module+"@"+version,"m");
            // if (lookFor404.test(output)) {
            //     log.warn(log._("server.install.install-failed-not-found",{name:module}));
            //     e = new Error("Module not found");
            //     e.code = 404;
            //     throw e;
            // } else if (isUpgrade && lookForVersionNotFound.test(output)) {
            //     log.warn(log._("server.install.upgrade-failed-not-found",{name:module}));
            //     e = new Error("Module not found");
            //     e.code = 404;
            //     throw e;
            // } else {
            //     log.warn(log._("server.install.install-failed-long",{name:module}));
            //     log.warn("------------------------------------------");
            //     log.warn(output);
            //     log.warn("------------------------------------------");
            //     throw new Error(log._("server.install.install-failed"));
            // }
        })
    }).catch(err => {
        // In case of error, reset activePromise to be resolvable
        activePromise = Promise.resolve();
        throw err;
    });
    return activePromise;
}

async function yarnAddPackage(yarnPackage){
    var installDir = settings.userDir || ".";
    var yarnArgs = ['add', '-E', ...yarnPackage.split(' '), '--json'];
    const data = await exec.run(yarnCommand, yarnArgs, {cwd: installDir}, true);
    const formatData = JSON.parse(_.last(_.compact(data.stdout.split('\n'))))
    // 解析 yarn add 返回的结果
    const steedosPackages = [];
    _.each(formatData.data.trees, (module)=>{
        const parsed = npa(module.name);
        const packagePath = path.dirname(require.resolve(`${parsed.name}/package.json`, {
            paths: [path.join(installDir, 'node_modules')]
        }))
        steedosPackages.push({
            name: parsed.name,
            version: parsed.rawSpec,
            path: packagePath
        })
    })
    return steedosPackages;
}


async function uninstallModule(module){
    if (Buffer.isBuffer(module)) {
        // return installTarball(module)
        return 
    }
    module = module || "";
    activePromise = activePromise.then(async function() {
        //TODO: ensure module is 'safe'
        var installName = module;

        var installDir = settings.userDir || ".";
        var yarnArgs = ['remove', installName]; //yarnCommand
        return exec.run(yarnCommand,yarnArgs,{
            cwd: installDir
        }, true).then(result => {
            console.log(`result ok`, result)
            
        }).catch(result => {
            console.log(`result error`, result)
            
        })
    }).catch(err => {
        activePromise = Promise.resolve();
        throw err;
    });
    return activePromise;
}

// async function getPackageNewVersion(packageName){
//     activePromise = activePromise.then(async function() {
//         var yarnArgs = ['info', packageName, 'dist-tags']; //yarnCommand
//         return exec.run(yarnCommand,yarnArgs,{
            
//         }, true).then(result => {
//             if(result.stdout){

//             }
//             console.log(`result ok`, result)
            
//         }).catch(result => {
//             console.log(`result error`, result)
            
//         })
//     }).catch(err => {
//         activePromise = Promise.resolve();
//         throw err;
//     });
//     return activePromise;
// }

const isPackageUrl = (url)=>{
    return pkgurlRe.test(url) || localtgzRe.test(url)
}

module.exports = {
    installModule,
    uninstallModule,
    isPackageUrl,
    yarnAddPackage
}