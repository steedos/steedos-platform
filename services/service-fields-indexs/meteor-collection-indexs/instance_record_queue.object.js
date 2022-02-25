if (Meteor.isServer) {
    InstanceRecordQueue.collection._ensureIndex({
        createdAt: 1
    });
    InstanceRecordQueue.collection._ensureIndex({
        sent: 1
    });
    InstanceRecordQueue.collection._ensureIndex({
        sending: 1
    });
}