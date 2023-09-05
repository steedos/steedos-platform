const yaml = require('js-yaml');
const _ = require('lodash');
const steedos = require('@steedos/core');
const fs = require("fs");
const path = require('path');
const objectql = require('@steedos/objectql');
const registry = require('./registry');
const userDir = path.join(process.cwd(), '.steedos');
const packagesFilePath = path.join(userDir, 'steedos-packages.yml'); 
const metadataApi = require('@steedos/metadata-api');
const util = require('./util');
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
    if(options.static){
        if(!packages[packageName]){
            if(options.enable){
                const packagePath = path.dirname(require.resolve(`${packageName}/package.json`))
                loadPackage(packageName, packagePath);
            }
            packages[packageName] = Object.assign({
                enable: false
            }, options)
        }else{
            packages[packageName] = Object.assign(packages[packageName], options)
        }
    }else{
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
                        const packageInfo = await loadPackage(packageName);
                        appendToPackagesConfig(packageInfo.name, {version: packageInfo.version, description: packageInfo.description, local: false});
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
                    const packageInfo = await loadPackage(packageName, packagePath);
                    if(packageInfo){
                        appendToPackagesConfig(packageInfo.name, {version: packageInfo.version, description: packageInfo.description, local: true});
                    }
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

const destroyExistThePackageService = async (packageInfo)=>{
    let schema = objectql.getSteedosSchema();
    let broker = schema.broker;
    let svc = broker.getLocalService({
        name: `~packages-${packageInfo.name}`
    });
    if(!svc){
        svc = broker.getLocalService({
            name: packageInfo.name
        });
    }
    if (svc) {
        broker.logger.info(`Destroy previous '${schema.name}' service...`);
        await broker.destroyService(svc);
    }
}

const isPackage = (name)=>{
    try {
        const packagePath = path.dirname(require.resolve(`${name}/package.json`, {
            paths: [path.join(userDir, 'node_modules')]
        }))
        return fs.existsSync(path.join(packagePath, 'package.service.js'));
    } catch (error) {
        return false;
    }
}

const loadDependency = async (dependencyName, dependencyVersion)=>{
    let schema = objectql.getSteedosSchema();
    let broker = schema.broker;
    let packageInfo = null;
    const packageConfig = getPackageConfig(dependencyName);
    if(packageConfig){
        if(packageConfig.enable){
            return ;
        }else{
            await enablePackage(dependencyName)
        }
    }else{
        try {
            const packagePath = path.dirname(require.resolve(`${dependencyName}/package.json`, {
                paths: [path.join(userDir, 'node_modules')]
            }))
            packageInfo = require(path.join(packagePath, 'package.json'));
        } catch (error) {
            // console.log(`loadDependency`, error.message)
        }
        if(packageInfo && isPackage(dependencyName)){
            await enablePackage(dependencyName)
        }else{
            try {
                await installPackage(broker, {module: dependencyName, version: dependencyVersion, enable: true})
            } catch (error) {
                
            }
        }
        // 如果steedos package yml 中没有该依赖，则直接安装
        // await installPackage(broker, {module: dependencyName, version: dependencyVersion, enable: true})
    }
}

const loadPackage = async (packageName, packagePath)=>{
    try {
        if(!packagePath){
            packagePath = path.dirname(require.resolve(`${packageName}/package.json`, {
                paths: [path.join(userDir, 'node_modules')]
            }))
        }
        let schema = objectql.getSteedosSchema();
        let broker = schema.broker;
        if(!fs.existsSync(packagePath) || !fs.existsSync(path.join(packagePath, 'package.json'))){
            broker.logger.warn(`已经从 steedos-packages.yml 文件中删除无效的软件包配置 ${packageName} : ${packagePath}`)
            removePackageConfig(packageName);
            return ;
        }
        const packageInfo = require(path.join(packagePath, 'package.json'));
        await destroyExistThePackageService(packageInfo);
        await steedos.loadPackage(packagePath);

        if(packageInfo.dependencies){
            for (const dependencyName in packageInfo.dependencies) {
                const dependencyVersion = packageInfo.dependencies[dependencyName];
                await loadDependency(dependencyName, dependencyVersion);
            }
        }   
        return Object.assign({packagePath: packagePath}, packageInfo);
    } catch (error) {
        console.error(error)
    }
}

const disablePackage = async (packageName)=>{
    let schema = objectql.getSteedosSchema();
    let broker = schema.broker;
    const serviceList = broker.registry.getServiceList({ withActions: true });
    const service = _.find(serviceList, (_service)=>{return _service.name == `~packages-${packageName}` || _service.name == packageName;})
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
    const service = _.find(serviceList, (_service)=>{return _service.name == `~packages-${packageName}` || _service.name == packageName;})
    if(service){
        await broker.destroyService(service);
    }
    removePackageConfig(packageName);
}

const removePackageConfig = (packageName)=>{
    const packages = loadPackagesConfig();
    delete packages[packageName];
    let data = yaml.dump(packages);
    fs.writeFileSync(packagesFilePath, data);
}

const getPackageConfig = (packageName)=>{
    const packages = loadPackagesConfig();
    return _.find(packages, (info, name)=>{
        return packageName == name
    });
}

const enablePackage = async (packageName)=>{
    let packagePath = null;
    let package = getPackageConfig(packageName);
    if(package && package.local){
        if(path.isAbsolute(package.path)){
            packagePath = package.path
        }else{
            packagePath = path.resolve(process.cwd(), package.path)
        }
    }else{
        if(package && package.static){
            packagePath = path.dirname(require.resolve(`${packageName}/package.json`))
        }else{
            packagePath = path.dirname(require.resolve(`${packageName}/package.json`, {
                paths: [path.join(userDir, 'node_modules')]
            }))
        }
    }
    await loadPackage(packageName, packagePath)
    
    if(package){
        package.enable = true;
    }else{
        const packageJSON = require(path.join(packagePath, 'package.json'));
        package = {
            label: '', 
            version: packageJSON.version, 
            description: packageJSON.description || '', 
            local: false, 
            enable: true,
            path: util.getPackageRelativePath(process.cwd(), packagePath)
        }
    }
    appendToPackagesConfig(packageName, package);
    let packageInfo = Object.assign({}, package, {name: packageName});
    // console.log(`enable packageInfo`, packageInfo)
    return packageInfo;
}
const installPackage = async (broker, options)=>{
    let {module, version, label, description, enable} = options;
    const packagePath = await registry.installModule(module, version);
    if(enable){
        await loadPackage(module, packagePath);
    }else{
        enable = false;
    }
    const packageConfig = {
        label: label || '', 
        version: version, 
        description: description || '', 
        local: false, 
        enable: enable,
        path: util.getPackageRelativePath(process.cwd(), packagePath)
    }
    appendToPackagesConfig(module, packageConfig);
    const metadata = await getPackageMetadata(util.getPackageRelativePath(process.cwd(), packagePath));
    await broker.call(`@steedos/service-packages.install`, {
        serviceInfo: Object.assign({}, packageConfig, {
            name: module,
            enable: enable, 
            nodeID: broker.nodeID, 
            instanceID: broker.instanceID,
            metadata: metadata
        })
    })
    return packageConfig;
}

const getPackageMetadata = async (packagePath)=>{
	const packageMetadata = [];
	const result = await metadataApi.loadFileToJson(packagePath, {
		CustomApplication: '*',
		CustomPermissionset: '*',
		CustomProfile: '*',
		CustomObject: '*',
		Layout: '*',
		CustomReport: '*',
		Workflow: '*',
		Flow: '*',
		ApprovalProcess: '*',
		Role: '*',
		FlowRole: '*',
		Query: '*',
		Chart: '*',
		Page: '*',
		Tab: '*',
	});

	_.each(result, (metadataItems, metadataType)=>{
		_.each(metadataItems, (metadata, apiName)=>{
			packageMetadata.push({
				label: metadata.label || metadata.name,
				type: metadataType,
				api_name: apiName
			})
		})
	})
	return packageMetadata;
}

module.exports = {
    loadPackages,
    loadPackage,
    appendToPackagesConfig,
    loadPackagesConfig,
    disablePackage,
    enablePackage,
    removePackage,
    getPackageInfo,
    getPackageMetadata,
    installPackage
}
