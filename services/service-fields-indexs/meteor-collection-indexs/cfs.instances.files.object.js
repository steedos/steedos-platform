Meteor.startup(function () {
    cfs.instances.files._ensureIndex({ "metadata.instance": 1 })
    cfs.instances.files._ensureIndex({ "failures.copies.instances.doneTrying": 1 })
    cfs.instances.files._ensureIndex({ "copies.instances": 1 })
    cfs.instances.files._ensureIndex({ "uploadedAt": 1 })
})
