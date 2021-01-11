Tinytest.add('Status template not shown when connected', function (test) {
  Meteor.status = function () {
    return {
      connected: true,
      status: 'connected',
      retryCount: 0,
      retryTime: new Date().getTime(),
      reason: ''
    }
  }

  Blaze.render(Template.status, document.body)

  test.equal(0, document.getElementsByClassName('alert').length)
})

Tinytest.add('Status template shown when not connected', function (test) {
  Meteor.status = function () {
    return {
      connected: false,
      status: 'waiting',
      retryCount: 4,
      retryTime: new Date().getTime() + 1000,
      reason: 'unknown'
    }
  }

  Blaze.render(Template.status, document.body)

  test.equal(1, document.getElementsByClassName('alert').length)
})
