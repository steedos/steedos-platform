exports.object_name = "meeting";
exports.type = "trigger";

clashRemind = function(_id,room,start,end){
	meetings = Creator.getCollection("meeting").find({_id:{ $ne:_id},room:room,$or: [{start:{$lte:start},end:{$gt:start}},{start:{$lt:end},end:{$gte:end}},{start:{$gte:start},end:{$lte:end}}]}).fetch()
    return meetings.length
}

exports.beforeInsert = function (userId, doc) {
    var clashs;

    if (doc.end <= doc.start) {
        throw new Meteor.Error(500, "开始时间需小于结束时间");
    }

    clashs = clashRemind(doc._id, doc.room, doc.start, doc.end);

    if (clashs) {
        throw new Meteor.Error(500, "该时间段的此会议室已被占用");
    }
}

exports.beforeUpdate = function (userId, doc, fieldNames, modifier, options) {
    var clashs, end, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, room, start;

    if ((modifier != null ? (ref = modifier.$set) != null ? ref.start : void 0 : void 0) || (modifier != null ? (ref1 = modifier.$set) != null ? ref1.end : void 0 : void 0)) {
      start = modifier != null ? (ref2 = modifier.$set) != null ? ref2.start : void 0 : void 0;
      end = modifier != null ? (ref3 = modifier.$set) != null ? ref3.end : void 0 : void 0;
    }

    if (!(modifier != null ? (ref4 = modifier.$set) != null ? ref4.start : void 0 : void 0)) {
      start = doc.start;
    }

    if (!(modifier != null ? (ref5 = modifier.$set) != null ? ref5.end : void 0 : void 0)) {
      end = doc.end;
    }

    if (end <= start) {
      throw new Meteor.Error(500, "开始时间不能大于结束时间");
    }

    if (modifier != null ? (ref6 = modifier.$set) != null ? ref6.room : void 0 : void 0) {
      room = modifier != null ? (ref7 = modifier.$set) != null ? ref7.room : void 0 : void 0;
    } else {
      room = doc.room;
    }

    clashs = clashRemind(doc._id, room, start, end);

    if (clashs) {
      throw new Meteor.Error(500, "该时间段的此会议室已被占用");
    }
  }