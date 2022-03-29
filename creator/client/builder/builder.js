const lodash  = require('lodash'); 
const underscore = require('underscore')
const _ = Object.assign(underscore, lodash)
window['_'] = _; 
window['lodash'] = lodash; 

window.BuilderReact = require('@steedos-builder/react');
window.BuilderSDK=require('@steedos-builder/sdk');

window.Builder = BuilderReact.Builder;
window.BuilderComponent = BuilderReact.BuilderComponent;
window.builder = BuilderReact.builder;

builder.init('steedos-builder');