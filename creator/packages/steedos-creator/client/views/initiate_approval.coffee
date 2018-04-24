Template.initiate_approval.helpers
    flows: () ->
        return _.where Creator.object_workflows, { object_name: this.object_name }

Template.initiate_approval.events
    'click .weui_cell' : (e, t) ->
        workflowUrl = window.location.protocol + '//' + window.location.hostname + '/'
        flowId = e.currentTarget.dataset.flow
        object_name = t.data.object_name
        record_id = t.data.record_id
        record_ids = { o: object_name, ids: [record_id] }
        uobj = {}
        uobj.methodOverride = 'POST'
        uobj['X-User-Id'] = Meteor.userId()
        uobj['X-Auth-Token'] = Accounts._storedLoginToken()
        url = Meteor.absoluteUrl() + 'api/workflow/drafts?' + $.param(uobj)
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
                Steedos.openWindow workflowUrl + 'workflow/space/' + Session.get('spaceId') + '/draft/' + instance._id
                return
            error: (xhr, msg, ex) ->
                $(document.body).removeClass 'loading'
                toastr.error msg
                return
        return

