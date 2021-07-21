const fs = require("fs");
const loader = require('./loader');
const path = require("path");
const getAllPackages = ()=>{
    const installPackages = loader.loadPackagesConfig();
    const filePath = path.resolve(__dirname, path.join('..','..','..', "steedos-packages.json"));
    const packages = JSON.parse(fs.readFileSync(filePath, 'utf8').normalize('NFC'));
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