Template.space_info.helpers

    schema: ->
        return db.spaces._simpleSchema;

    space: ->
        return db.spaces.findOne(Steedos.getSpaceId())

    btn_save_i18n: () ->
        return TAPi18n.__ 'Submit'

    spaceOwnerName: (id) ->
        user = CFDataManager.getFormulaSpaceUsers(id)
        return if user then user.name else ""

    adminsNames: (ids) ->
        return CFDataManager.getFormulaSpaceUsers(ids)?.getProperty("name").join(",")

    isDisableAddSpace: ->
        return Meteor.settings?.public?.admin?.disableAddSpace

    isRightDropdownNeeded: ->
        isSpaceAdmin = Steedos.isSpaceAdmin()
        isSpaceOwner = Steedos.isSpaceOwner()
        disableAddSpace = Meteor.settings?.public?.admin?.disableAddSpace
        unless isSpaceAdmin
            return false
        if isSpaceOwner
            return true
        return !disableAddSpace

    total_user_count: ->
        return this.user_count_info?.get().total_user_count

    paid_user_count: ->
        s = db.spaces.findOne({_id:Session.get('spaceId')}, {fields: {user_limit: 1}})
        return s.user_limit

    accepted_user_count: ->
        return this.user_count_info?.get().accepted_user_count

    paid_modules: ->
        pm = ""
        s = db.spaces.findOne(Session.get('spaceId'))
        if s and s.modules
            ms = db.modules.find({name: {$in: s.modules}}).fetch()
            pm = _.pluck(ms, 'name_zh').join(',')
        return pm

    end_date: ->
        s = db.spaces.findOne({_id:Session.get('spaceId')}, {fields: {end_date: 1}})
        if s.end_date
            return moment(s.end_date).format('YYYY-MM-DD')
        return ""
    
    updateButtonContent: ->
        return t("Update")


Template.space_info.events

    'click .btn-new-space': (event)->
        FlowRouter.go("/accounts/setup/space")

    'click .btn-edit-space': (event)->
        $(".btn-space-info-edit").click()


    'click .btn-exit-space': (event)->


    'click #space_recharge': (event, template)->
        Modal.show('space_recharge_modal')


Template.space_info.onCreated ()->
    this.data.user_count_info = new ReactiveVar({})
    
	AutoForm.hooks spaceInfoEditForm:
		onSuccess: (formType,result)->
            toastr.success t('saved_successfully')
        onError: (formType, error) ->
            if error.reason
                if error.reason == "space_paid_info_title"
                    Steedos.spaceUpgradedModal()
            else 
                toastr.error t(error)

Template.space_info.onRendered ()->
    that = this
    if Session.get('spaceId')
        Meteor.call 'get_space_user_count', Session.get('spaceId'), (err, result)->
            if err
                console.log err.reason
            if result
                that.data.user_count_info.set(result)
                Session.set('space_user_count', result.accepted_user_count)

