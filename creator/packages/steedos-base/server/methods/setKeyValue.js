Meteor.methods({
    setKeyValue: function(key, value) {
        check(key, String);
        check(value, Object);

        obj = {};
        obj.user = this.userId;
        obj.key = key;
        obj.value = value;

        var c = db.steedos_keyvalues.find({
            user: this.userId,
            key: key
        }).count();
        if (c > 0) {
            db.steedos_keyvalues.update({
                user: this.userId,
                key: key
            }, {
                $set: {
                    value: value
                }
            });
        } else {
            db.steedos_keyvalues.insert(obj);
        }

        return true;
    }
})