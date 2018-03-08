if (Meteor.isClient) {
	Meteor.startup(function () {
		Meteor.autorun(function () {
			var lang = TAPi18n.getLanguage();
			var localMessages = TAPi18n.__("simpleschema.messages", {returnObjectTrees: true});
			localMessages.regEx = _.map(localMessages.regEx, function (item) {
				if (item.exp) {
					var obj = window;
					var path = item.exp.split('.');
					for (var i = 0; i < path.length; i++) {
						obj = obj[path[i]];
					}
					item.exp = obj;
				}
				return item;
			});

			_regEx = [];

			SimpleSchema._globalMessages.regEx.forEach(function(item){
				local_reg = _.find(localMessages.regEx, function(doc){
					if(_.has(doc,"exp") && _.has(item,"exp")){
						if (doc.exp === item.exp) {
							return true
						}else if(!doc.exp || !item.exp){
							return false
						}else{
							return doc.exp.toString() == item.exp.toString()
						}
					}else if(_.has(doc,"exp") || _.has(item,"exp")){
						return false
					}else{
						return doc.exp === item.exp
					}
				});
				_regEx.push(local_reg || item)
			})

			SimpleSchema._globalMessages.regEx.concat(localMessages.regEx)

			localMessages.regEx = _regEx;

			var messages = _.extend(_.clone(SimpleSchema._globalMessages), localMessages);
			SimpleSchema.messages(messages);
		});
	});
}
