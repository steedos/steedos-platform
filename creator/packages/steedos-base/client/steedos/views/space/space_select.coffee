Template.space_select.helpers
        spaces: ()->
                return db.spaces.find()

Template.space_select.onRendered ->

Template.space_select.events
  "click #space_add": (event, template) ->
    swal({
      title: "请输入工作区名称", 
      text: "", 
      type: "input",
      showCancelButton: true,
      closeOnCancel: true,
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, (name) ->
      if !name
        return false

      Meteor.call 'adminInsertDoc', {name:name}, "spaces", (e,r)->
        if e
          swal("Error", e, "error")
          return false

        if r && r._id
          Session.set("spaceId", r._id)
          swal({
              title: "新建成功"
            }, () -> 
              FlowRouter.go "/workflow/space/" + Session.get("spaceId")
          )
    )
