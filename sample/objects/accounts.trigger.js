var Steedos = require("../../");

class accountTriggers extends Steedos.Trigger {

	listenTo(){
        return "accounts"
    };

    beforeInsert(userId, doc) {

	};

    beforeUpdate(userId, doc, fieldNames, modifier, options) {

	};

    beforeDelete(userId, doc) {

	};

    afterInsert(userId, doc) {
	};

    afterUpdate(userId, doc, fieldNames, modifier, options) {
	};
    
    afterDelete(userId, doc) {
	};
}

// module.exports = accountTriggers;