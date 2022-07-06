/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-07-06 10:05:56
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-07-06 10:06:05
 * @Description: 
 */
'use strict';

var Stream = require('stream');
var util = require('util');

var Transform = Stream.Transform;

function PassThroughExt(writeFn, endFn, options) {
  if (!(this instanceof PassThroughExt)) {
    return new PassThroughExt(writeFn, endFn, options);
  }
  Transform.call(this, options);
  this._writeFn = writeFn;
  this._endFn = endFn;
}

util.inherits(PassThroughExt, Transform);

function passTransform(chunk, encoding, cb) {
  /*jshint validthis:true */
  this.push(chunk);
  cb();
}

PassThroughExt.prototype._transform = function _transform(chunk, encoding, cb) {
  if (this._writeFn) return this._writeFn.apply(this, arguments);
  return passTransform.apply(this, arguments);
};

PassThroughExt.prototype._flush = function _flush(cb) {
  if (this._endFn) return this._endFn.apply(this, arguments);
  return cb();
};

function passStream(writeFn, endFn, options) {
  var stream = new PassThroughExt(writeFn, endFn, options);
  return stream;
}

module.exports = passStream;