"use strict";
const path = require('path');
const chokidar = require('chokidar');
import _ from 'underscore';
let changePackages: string[] = [];

let timeoutId: any = null;

const reloadPackage = (broker, packagePath) => {
    changePackages.push(packagePath);
    if (!timeoutId) {
        clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
        const _changePackages = _.clone(changePackages);
        changePackages = []
        _.each(_.uniq(_.compact(_changePackages)), (_packagePath) => {
            const packageJson = require(path.join(_packagePath, 'package.json'));
            if (packageJson) {
                const servicePath = path.join(_packagePath, 'package.service.js')
                const serviceJson = require(servicePath);
                if (serviceJson) {
                    delete require.cache[require.resolve(servicePath)];
                }
                broker.call(`@steedos/service-project.reloadPackage`, { module: packageJson.name })
            }
        })
    }, 3000)
}

module.exports = {
    name: "steedos-dx-develop",
    namespace: "steedos",
    started() {

        const appPath = path.join(process.cwd(), 'steedos-app')
        chokidar.watch(appPath).on('change', (_path, stats) => {
            reloadPackage(this.broker, appPath)
        });

        const packagesPath = path.join(process.cwd(), 'steedos-packages');
        chokidar.watch(packagesPath).on('change', (_path, stats) => {
            const rP = path.relative(packagesPath, _path);
            const packagePath = path.join(packagesPath, rP.split(path.sep)[0])
            reloadPackage(this.broker, packagePath)
        });
    }
};
