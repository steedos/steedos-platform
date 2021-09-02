module.exports = {
    install_purchased_packages: function (object_name, record_id) {
        Steedos.authRequest(Steedos.absoluteUrl('service/api/~packages-project-server/cloud/saas/packages/purchased'), {async: false, type: 'post'});
    },
    install_purchased_packagesVisible: function (object_name, record_id) {
        return true;
    }
}