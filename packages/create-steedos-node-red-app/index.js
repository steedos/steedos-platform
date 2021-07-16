#!/usr/bin/env node

'use strict';

var currentNodeVersion = process.versions.node;
var semver = currentNodeVersion.split('.');
var major = semver[0];
if (major < 12) {
  console.error(
    'You are running Node ' +
      currentNodeVersion +
      '.\n' +
      'Create Steedos App requires Node 12 or higher. \n' +
      'Please update your version of Node.'
  );
  process.exit(1);
}

require('./createSteedosNodeRedApp');
