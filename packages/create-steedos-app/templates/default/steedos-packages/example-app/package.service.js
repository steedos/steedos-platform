const project = require('./package.json');
const packageLoader = require('@steedos/service-package-loader');

module.exports = {
  name: project.name,

	mixins: [packageLoader],

  metadata: {
    $package: {
        name: project.name,
        version: project.version,
        path: __dirname,
        isPackage: true
    }
  },
  actions: {
  },
  events: {
  }
}