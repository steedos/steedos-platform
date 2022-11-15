module.exports = {
    disableVisible: function (object_name, record_id) {

        if(Meteor.settings.public.enable_saas && Creator.USER_CONTEXT.user.spaceId != Creator.USER_CONTEXT.user.masterSpaceId){
            return false
        }

        const record = Creator.odata.get(object_name, record_id);
        if (record.status === 'enable') {
            return true;
        }
        return false
    }
}