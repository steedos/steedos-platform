const Fiber = require('fibers');

exports.hasInstancePermissions = async function(user, instance){
    let hasPermission = await new Promise(function (resolve, reject) {
        Fiber(function () {
            try {
                let result = WorkflowManager.hasInstancePermissions(user, instance)
                resolve(result);
            } catch (error) {
                reject(error)
            }
        }).run()
    })
    return hasPermission;
}
