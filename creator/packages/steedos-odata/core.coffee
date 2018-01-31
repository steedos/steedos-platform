if Meteor.isServer
    @API = new Restivus
        apiPath: '/api/odata/v4/:spaceId',
        useDefaultAuth: true
        prettyJson: true
        enableCors: true
        defaultHeaders:
          'Content-Type': 'application/json'
