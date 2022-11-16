module.exports = {
    standard_delete_manyVisible: function () {
        if(Meteor.settings.public.enable_saas){
            return Creator.USER_CONTEXT.user.spaceId === Creator.USER_CONTEXT.user.masterSpaceId && Steedos.StandardObjects.Base.Actions.standard_delete_many.visible.apply(this, arguments)
        }
        return Steedos.StandardObjects.Base.Actions.standard_delete_many.visible.apply(this, arguments)
    }
}