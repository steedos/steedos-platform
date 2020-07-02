
var xml2js = Npm.require('xml2js');

exports.buildXML = function(json){
	var builder = new xml2js.Builder();
	return builder.buildObject(json);
};

exports.parseXML = function(xml, fn){
	var parser = new xml2js.Parser({ trim:true, explicitArray:false, explicitRoot:false });
	parser.parseString(xml, fn||function(err, result){});
};

exports.parseRaw = function(){
	return function(req, res, next){
		var buffer = [];
		req.on('data', function(trunk){
			buffer.push(trunk);
		});
		req.on('end', function(){
			req.rawbody = Buffer.concat(buffer).toString('utf8');
			next();
		});
		req.on('error', function(err){
			next(err);
		});
	}
};

exports.pipe = function(stream, fn){
	var buffers = [];
	stream.on('data', function (trunk) {
		buffers.push(trunk);
	});
	stream.on('end', function () {
		fn(null, Buffer.concat(buffers));
	});
	stream.once('error', fn);
};

exports.mix = function(){
	var root = arguments[0];
	if (arguments.length==1) { return root; }
	for (var i=1; i<arguments.length; i++) {
		for(var k in arguments[i]) {
			root[k] = arguments[i][k];
		}
	}
	return root;
};

exports.generateNonceString = function(length){
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var maxPos = chars.length;
	var noceStr = "";
	for (var i = 0; i < (length || 32); i++) {
		noceStr += chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return noceStr;
};