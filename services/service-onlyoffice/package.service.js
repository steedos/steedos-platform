"use strict";
const project = require('./package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');

module.exports = {
    name: packageName,
    namespace: "steedos",
    mixins: [packageLoader],
    /**
     * Settings
     */
    settings: {
        packageInfo: {
            path: __dirname,
            name: packageName,
            isPackage: true
        }
    },

    /**
     * Dependencies
     */
    dependencies: ['~packages-standard-objects'],
};
