if Meteor.isServer
    @SteedosOdataAPI = new OdataRestivus
        apiPath: '/api/odata/v4/:spaceId',
        useDefaultAuth: true
        prettyJson: true
        enableCors: true
        defaultHeaders:
          'Content-Type': 'application/json'
