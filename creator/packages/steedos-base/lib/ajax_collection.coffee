AjaxCollection = (model) ->
  @model = model
  return

AjaxCollection::find = (selector, options) ->
  @_send selector, options, 'find'

AjaxCollection::findOne = (selector, options) ->
  @_send selector, options, 'findone'

AjaxCollection::_send = (selector, options, api) ->
  config = 
    model: @model
    selector: selector
    options: options
    space: selector?.space || Session.get('spaceId')
    "X-User-Id": Meteor.userId()
    "X-Auth-Token": Accounts._storedLoginToken()
  rev = undefined
  settings = 
    url: Steedos.absoluteUrl('api/collection/' + api )
    type: 'POST'
    async: false
    data: JSON.stringify(config)
    dataType: 'json'
    processData: false
    contentType: "application/json"
    success: (data, textStatus) ->
      rev = data
      return
  $.ajax settings
  return rev