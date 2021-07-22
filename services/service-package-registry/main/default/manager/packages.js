const fs = require("fs");
const loader = require('./loader');
const registry = require('./registry');
const path = require("path");
const objectql = require('@steedos/objectql');
const _ = require('lodash');

const getAllPackages = async ()=>{
    const installPackages = loader.loadPackagesConfig();
    const filePath = path.resolve(__dirname, path.join('..','..','..', "steedos-packages.json"));
    const packages = JSON.parse(fs.readFileSync(filePath, 'utf8').normalize('NFC'));
    const onlinePackages = await objectql.getSteedosSchema().broker.call(`@steedos/service-packages.getSteedosPackages`);
    // const pI = await registry.getPackageNewVersion(`@steedos/app-project-management`);
    _.map(packages, (package)=>{
        package._id = package.name.replace("/", '_')
        package.status = '';
        package.new_version = package.version
        package.local = package.local
        delete package.version
        if(installPackages[package.name]){
            package.status = installPackages[package.name].enable ? 'enable' : 'disable'
        }
    })
    _.map(installPackages, (package, packageName)=>{
        const _package = _.find(packages, (_p)=>{return _p.name == packageName})
        if(_package){
            _package.status = package.enable ? 'enable' : 'disable'
            _package.version = package.version
        }else{
            packages.push({
                _id : packageName.replace("/", '_'),
                name: packageName,
                status : package.enable ? 'enable' : 'disable',
                version : package.version,
                local: package.local
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
        }else{
            packages.push({
                _id : packageName.replace("/", '_'),
                name: packageName,
                node_id: packageInfo.nodeID,
                instance_id: packageInfo.instanceID,
                status : 'enable',
                version : packageInfo.version,
                local: false
            })
        }
    })
    

    _.map(packages, (package)=>{
        package.record_permissions = {
            allowEdit: false,
            allowDelete: false,
            allowRead: true,
        }
    })
    return packages;
}

const userDir = path.join(process.cwd(), '.steedos');
const maintainSystemFiles = ()=>{
    if(!fs.existsSync(userDir)){
        fs.mkdirSync(userDir);
    }

    const packageJson = path.join(userDir, 'package.json')
    if(!fs.existsSync(packageJson)){
        fs.writeFileSync(packageJson, `
{
    "name": "steedos-project-packages",
    "version": "1.0.0",
    "description": "",
    "author": ""
}
        `)
    }
} 

module.exports = {
    maintainSystemFiles,
    getAllPackages
}