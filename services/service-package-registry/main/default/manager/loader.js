const yaml = require('js-yaml');
const _ = require('lodash');
const steedos = require('@steedos/core');
const fs = require("fs");
const path = require('path');
const objectql = require('@steedos/objectql');
const registry = require('./registry');
const userDir = path.join(process.cwd(), '.steedos');
const packagesFilePath = path.join(userDir, 'steedos-packages.yml'); 

const loadPackagesConfig = ()=>{
    return yaml.load(fs.readFileSync(packagesFilePath, 'utf8')) || {};
}

const appendToPackagesConfig = (packageName, options)=>{
    let packages = loadPackagesConfig();
    let changeNamePackage = null;
    if(options.local && !packages[packageName]){
        changeNamePackage = _.find(packages, (pInfo, key)=>{
            if(pInfo.path === options.path){
                pInfo.module = key;
                return true;
            }
        })
    }
    if(changeNamePackage){
        //如果是修改package name, 在steedos-package.yml位置保持不变
        const newPackages = {};
        _.each(packages, (info, key)=>{
            if(key === changeNamePackage.module){
                delete changeNamePackage.module
                newPackages[packageName] = Object.assign(changeNamePackage, options)
            }else{
                newPackages[key] = info
            }
        })
        packages = newPackages
    }else{
        if(!packages[packageName]){
            packages[packageName] = Object.assign({
                enable: true
            }, options)
        }else{
            packages[packageName] = Object.assign(packages[packageName], options)
        }
    }
    let data = yaml.dump(packages);
    fs.writeFileSync(packagesFilePath, data);
}

const loadPackages = async ()=>{
    const packages = loadPackagesConfig();
    for (const packageName in packages) {
        const package = packages[packageName]
        if(package.enable){
            if(package.local !== true){
                try {
                    const packagePath = path.dirname(require.resolve(`${packageName}/package.json`, {
                        paths: [path.join(userDir, 'node_modules')]
                    }))
                    if(packagePath){
                        await loadPackage(packageName);
                    }
                } catch (error) {
                    try {
                        await registry.installModule(packageName, package.version, package.url, package.registry_url || '')
                        const packageInfo = await loadPackage(packageName);
                        appendToPackagesConfig(packageInfo.name, {version: packageInfo.version, description: packageInfo.description, local: false});
                    } catch (error) {
                        console.error(error)
                    }
                }
            }else if(package.local === true){
                let packagePath = package.path;
                if(!path.isAbsolute(packagePath)){
                    packagePath = path.resolve(process.cwd(), packagePath)
                }
                if(packagePath){
                    await loadPackage(packageName, packagePath);
                }
            }

            

        }
    }
}

const getPackageInfo = (packageName, packagePath)=>{
    try {
        if(!packagePath){
            packagePath = path.dirname(require.resolve(`${packageName}/package.json`, {
                paths: [path.join(userDir, 'node_modules')]
            }))
        }
        const packageInfo = require(path.join(packagePath, 'package.json'));
        return Object.assign({packagePath: packagePath}, packageInfo);
    } catch (error) {
        console.error(error)
    }
}

const loadPackage = async (packageName, packagePath)=>{
    try {
        if(!packagePath){
            packagePath = path.dirname(require.resolve(`${packageName}/package.json`, {
                paths: [path.join(userDir, 'node_modules')]
            }))
        }
        const packageInfo = require(path.join(packagePath, 'package.json'));
        await steedos.loadPackage(packagePath)
        return Object.assign({packagePath: packagePath}, packageInfo);
    } catch (error) {
        console.error(error)
    }
}

const disablePackage = async (packageName)=>{
    let schema = objectql.getSteedosSchema();
    let broker = schema.broker;
    const serviceList = broker.registry.getServiceList({ withActions: true });
    const service = _.find(serviceList, (_service)=>{return _service.name == `~packages-${packageName}`;})
    if(service){
        await broker.destroyService(service);
    }
    const packages = loadPackagesConfig();
    let packageInfo = {};
    _.map(packages, (package, name)=>{
        if(packageName == name){
            package.enable = false;
            packageInfo = Object.assign({}, package, {name: packageName});
        }
    })
    let data = yaml.dump(packages);
    fs.writeFileSync(packagesFilePath, data);
    return packageInfo;
}

const removePackage = async (packageName)=>{
    let schema = objectql.getSteedosSchema();
    let broker = schema.broker;
    const serviceList = broker.registry.getServiceList({ withActions: true });
    const service = _.find(serviceList, (_service)=>{return _service.name == `~packages-${packageName}`;})
    if(service){
        await broker.destroyService(service);
    }
    const packages = loadPackagesConfig();
    delete packages[packageName];
    let data = yaml.dump(packages);
    fs.writeFileSync(packagesFilePath, data);
}

const enablePackage = async (packageName)=>{
    const packages = loadPackagesConfig();
    let packagePath = null;
    const package = _.find(packages, (info, name)=>{
        return packageName == name
    })
    if(package.local){
        if(path.isAbsolute(package.path)){
            packagePath = package.path
        }else{
            packagePath = path.resolve(process.cwd(), package.path)
        }
    }else{
        packagePath = path.dirname(require.resolve(`${packageName}/package.json`, {
            paths: [path.join(userDir, 'node_modules')]
        }))
    }
    await steedos.loadPackage(packagePath)
    let packageInfo = {};
    _.map(packages, (package, name)=>{
        if(packageName == name){
            package.enable = true;
            packageInfo = Object.assign({}, package, {name: packageName});
        }
    })
    let data = yaml.dump(packages);
    fs.writeFileSync(packagesFilePath, data);
    return packageInfo;
}


module.exports = {
    loadPackages,
    loadPackage,
    appendToPackagesConfig,
    loadPackagesConfig,
    disablePackage,
    enablePackage,
    removePackage,
    getPackageInfo
}
