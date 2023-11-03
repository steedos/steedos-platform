module.exports = {
    installPackageFromUrlVisible: function (object_name, record_id) {
        if(Meteor.settings.public.enable_saas){
            return false;
        }
        return Steedos.isSpaceAdmin();
    }
}