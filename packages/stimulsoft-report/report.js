Element = 'undefined';
moment_mod = require('moment');
var Stimulsoft = require('./stimulsoft.reports');
JSZip = require('jszip');
xmldoc = require('xmldoc');
XLSX = require('xlsx');
XXH = global["XXH"];
Stimulsoft.System.Drawing.Graphics.opentypeClass = require('opentype.js');

Stimulsoft.System.NodeJs.useWebKit = false;
Stimulsoft.System.NodeJs.initialize();

module.exports = Stimulsoft;