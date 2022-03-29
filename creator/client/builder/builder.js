const lodash  = require('lodash'); 
const underscore = require('underscore')
const _ = Object.assign(underscore, lodash)
window['_'] = _; 
window['lodash'] = lodash; 

const BuilderReact = require('@steedos-builder/react');
const BuilderSDK = BuilderReact;

window.BuilderReact = BuilderReact;
window.BuilderSDK = BuilderSDK;

window.Builder = BuilderReact.Builder;
window.BuilderComponent = BuilderReact.BuilderComponent;
window.builder = BuilderReact.builder;

builder.init('steedos-builder');