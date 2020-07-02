Meteor.startup ->
  Steedos.settings.webservices = Meteor.settings.public.webservices

  if !Steedos.settings.webservices
    Steedos.settings.webservices =
      www: 
        status: "active",
        url: "/"