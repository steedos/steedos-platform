var retryTime   = new ReactiveVar(0)
var retryHandle = null

var clearRetryInterval = function () {
  clearInterval(retryHandle)

  retryHandle = null
}

var trackStatus = function () {
  if (Meteor.status().status === 'waiting')
    retryHandle = retryHandle || setInterval(function () {
      var timeDiff   = Meteor.status().retryTime - (new Date).getTime()
      var _retryTime = timeDiff > 0 && Math.round(timeDiff / 1000) || 0

      retryTime.set(_retryTime)
    }, 500)
  else
    clearRetryInterval()
}

var helpers = {
  connected: function () {
    return Meteor.status().connected
  },

  message: function () {
    return TAPi18n.__('meteor_status', { context: Meteor.status().status })
  },

  extraMessage: function () {
    if (Meteor.status().status === 'waiting')
      return TAPi18n.__('meteor_status_reconnect_in', { count: retryTime.get() })
  },

  showReconnect: function () {
    return _.contains(['waiting', 'offline'], Meteor.status().status)
  },

  reconnectLabel: function () {
    return TAPi18n.__('meteor_status_try_now', { context: Meteor.status().status })
  },

  option: function (option) {
    return Status.option(option)
  }
}

Template.status.onDestroyed(clearRetryInterval)

Template.status.onCreated(function () {
  this.autorun(trackStatus)
})

Template.status.helpers({
  template: function () {
    return 'status_' + Status.template()
  },

  helpers: function () {
    return helpers
  }
})

Template.status.events({
  'click a.alert-link': function (e) {
    e.preventDefault()
    Meteor.reconnect()
  }
})
