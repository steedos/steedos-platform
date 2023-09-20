const fs = require("fs");
const loader = require('./loader');
const registry = require('./registry');
const path = require("path");
const objectql = require('@steedos/objectql');
const packageJson = require('./package-json');
const _ = require('lodash');
const login = require('./login');
const metadataApi = require('@steedos/metadata-api');
function registryUrl(scope) {
    try {
        const result = login.getYarnrcScopes();
        const url = result[`${scope}:registry`];
        if (url) {
            return url.slice(-1) === '/' ? url : `${url}/`;
        }
    } catch (Exception) {

    }
}

const getAllPackages = async ()=>{
    // const installPackages = loader.loadPackagesConfig();
    // const filePath = path.resolve(__dirname, path.join('..','..','..', "steedos-packages.json"));
    // const packages = JSON.parse(fs.readFileSync(filePath, 'utf8').normalize('NFC'));
    const packages = [];
    const onlinePackages = await objectql.getSteedosSchema().broker.call(`@steedos/service-packages.getSteedosPackages`);
    const installPackages = await objectql.getSteedosSchema().broker.call(`@steedos/service-packages.getSteedosInstallPackages`);
    // const pI = await registry.getPackageNewVersion(`@steedos/app-project-management`);
    _.map(packages, (package)=>{
        package._id = package.name.replace("/", '_')
        package.status = '';
        package.new_version = package.version
        package.local = package.local
        package.static = package.static
        package.homepage = package.homepage
        delete package.version
        if(installPackages[package.name]){
            package.status = installPackages[package.name].enable ? 'enable' : 'disable'
        }
    })
    _.map(_.map(installPackages, 'metadata'), (package)=>{
        const packageName = package.name
        const _package = _.find(packages, (_p)=>{return _p.name == packageName})
        if(_package){
            _package.status = package.enable ? 'starting' : 'disable'
            _package.version = package.version
        }else{
            packages.push({
                _id : packageName.replace("/", '_'),
                name: packageName,
                status : package.enable ? 'starting' : 'disable',
                version : package.version,
                local: package.local,
                label: package.label || packageName,
                description: package.description,
                metadata: package.metadata,
                static: package.static,
                homepage: package.homepage
            })
        }
    })
    _.map(_.map(onlinePackages, 'metadata'), (packageInfo)=>{
        const packageName = packageInfo.name.replace(`~packages-`, '');
        const _package = _.find(packages, (_p)=>{return _p.name == packageName})
        if(_package){
            _package.status = 'enable'
            _package.service_name = packageInfo.name
            _package.node_id = packageInfo.nodeID
            _package.instance_id = packageInfo.instanceID
            _package.version = packageInfo.version
            _package.homepage = packageInfo.homepage
        }else{
            packages.push({
                _id : packageName.replace("/", '_'),
                name: packageName,
                service_name: packageInfo.name,
                node_id: packageInfo.nodeID,
                instance_id: packageInfo.instanceID,
                status : 'enable',
                version : packageInfo.version,
                label: packageInfo.label || packageName,
                description: packageInfo.description,
                local: false,
                homepage: packageInfo.homepage
            })
        }
    })
    for (const package of packages) {
        package.record_permissions = {
            allowEdit: false,
            allowDelete: false,
            allowRead: true,
        }
        // if(!_.has(package, 'metadata')){
        //     package.metadata = await objectql.getSteedosSchema().broker.call(`@steedos/service-packages.getPackageMetadata`, {packageName: package.name}); 
        // }
    }
    return packages;
}

const userDir = path.join(process.cwd(), '.steedos');
const maintainSystemFiles = ()=>{
    if(!fs.existsSync(userDir)){
        fs.mkdirSync(userDir);
    }

    const packages = path.join(userDir, 'steedos-packages.yml');
    if(!fs.existsSync(packages)){
        fs.writeFileSync(packages, ``)
    }

    const packageJson = path.join(userDir, 'package.json')
    if(!fs.existsSync(packageJson)){
        fs.writeFileSync(packageJson, `
{
    "name": "steedos-project-packages",
    "version": "1.0.0",
    "description": "",
    "license": "MIT",
    "author": ""
}
        `)
    }
}

const getPackageVersions = async (packageName, options)=>{
    //TODO 处理 registry_url

    let registry_url = registryUrl(packageName.toLowerCase().split('/')[0]);

    const result = await packageJson(packageName.toLowerCase(), {
        allVersions: true,
        registryUrl: registry_url,
        authInfo: login.getNpmAuthInfo(registry_url)
    });

    const versions = [];

    const distTags = result['dist-tags'];
    _.each(distTags, function(version, tag){
        versions.push({version: version, tag: tag})
    });

    _.each(_.reverse(_.keys(result.versions)), function(version){
        if(versions.length < 50){
            if(!_.find(versions, function(v){return v.version == version})){
                versions.push({version: version})
            }
        }
    });
	return versions;
}

const scanPackageMetadatas = async (packagePath) => {
    const packageMetadatas = [];
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

    _.each(result, (metadataItems, metadataType) => {
        _.each(metadataItems, (metadata, apiName) => {
            packageMetadatas.push({
                label: metadata.label || metadata.name,
                type: metadataType,
                api_name: apiName
            })
        })
    })
    return packageMetadatas;
}

const checkDependencies = async (packagePath)=>{
    const packageServiceConfig = require(path.join(packagePath, 'package.service.js'));
    const dependencies = packageServiceConfig?.dependencies || [];
    for(const item of dependencies){
        const hasService = await objectql.getSteedosSchema().broker.registry.hasService(item);
        if(!hasService){
            throw new Error(`依赖项${item}未启动, 请先启动依赖项`)
        }
    }
    return true;
}

module.exports = {
    maintainSystemFiles,
    getAllPackages,
    getPackageVersions,
    scanPackageMetadatas,
    checkDependencies
}