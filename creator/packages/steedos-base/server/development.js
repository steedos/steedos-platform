if(Meteor.isDevelopment){
	//Meteor 版本升级到1.9 及以上时(node 版本 11+)，可以删除此代码
	Object.defineProperty(Array.prototype, 'flat', {
		value: function(depth = 1) {
			return this.reduce(function (flat, toFlatten) {
				return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
			}, []);
		}
	});
}