Template.initiate_approval.helpers
    flows: () ->
        return _.where Creator.object_workflows, { object_name: this.object_name, can_add: true }

Template.initiate_approval.events
    'click .weui_cell' : (e, t) ->
        flowId = e.currentTarget.dataset.flow
        object_name = t.data.object_name
        record_id = t.data.record_id
        record_ids = [{ o: object_name, ids: [record_id] }]
        uobj = {}
        uobj.methodOverride = 'POST'
        uobj['X-User-Id'] = Meteor.userId()
        uobj['X-Auth-Token'] = Accounts._storedLoginToken()
        url = Steedos.absoluteUrl() + 'api/object/workflow/drafts?' + $.param(uobj)
        data = 'Instances': [ {
            'flow': flowId
            'applicant': Meteor.userId()
            'space': Session.get('spaceId')
            'record_ids': record_ids
        } ]
        data = JSON.stringify(data)
        $(document.body).addClass 'loading'
        $.ajax
            url: url
            type: 'POST'
            async: true
            data: data
            dataType: 'json'
            processData: false
            contentType: 'application/json'
            success: (responseText, status) ->
                $(document.body).removeClass 'loading'
                if responseText.errors
                    responseText.errors.forEach (e) ->
                        toastr.error e.errorMessage
                        return
                    return
                instance = responseText.inserts[0]
                # 跳转到APPS草稿
                # Steedos.openWindow Steedos.absoluteUrl('workflow/space/' + Session.get('spaceId') + '/draft/' + instance._id)
                Steedos.openWindow Steedos.absoluteUrl('/app/'+FlowRouter.current().params.app_id+'/instances/view/'+instance._id+'?display='+FlowRouter.current().queryParams.display+'&side_object=instances&side_listview_id=draft')
                Modal.hide(t)
                SteedosUI.reloadRecord(object_name, record_id)
                FlowRouter.reload()
                return
            error: (xhr, msg, ex) ->
                $(document.body).removeClass 'loading'
                toastr.error msg
                return
        return

