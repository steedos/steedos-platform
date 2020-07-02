Meteor.startup ->
  try
    if process.env.MATTERMOST_URL && process.env.MATTERMOST_CALLBACK_URL && process.env.MATTERMOST_CLIENT_ID && process.env.MATTERMOST_CLIENT_SECRET
      app = require("@steedos/oauth2-messenger").default
      WebApp.connectHandlers.use app
  catch error
    console.error error
  return
