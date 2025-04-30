// Namespaced storage key
var localStorageKey = '_raix:push_token';

// If we are using the accounts system then add the userId to appCollection
// and monitor for logout
var addUserId = !!Package['accounts-base'];

/*
  1. Check if id is already set in localstorage
  2. If not then create an app id
  3. Refresh the apn/gcm push token for this app
*/

var loadLocalstorage = function() {
  var data = {};

  try {
    // Get the stored object from local storage
    data = JSON.parse(localStorage.getItem(localStorageKey));

  } catch(err) {
    // XXX: Error using the local storage
  }

  return {
    // Use a new id if not set
    id: data && data.id || Random.id(),
    // Set empty metadata object if nothing loaded
    metadata: data && data.metadata || {},
    // Set default token
    token: null
  };
};

var saveLocalstorage = function(data) {
  try {
    // Try setting the id
    localStorage.setItem(localStorageKey, JSON.stringify(data));
  } catch(err) {
    // XXX: storage error
  }
};

// Set stored object
var stored = loadLocalstorage();
// Reactive id
var idDep = new Tracker.Dependency();
var stateDep = new Tracker.Dependency();

// Its either set by localStorage or random
idDep.changed();

var _setEnabled = function(state) {
  if (stored.enabled !== state) {
    stored.enabled = state;
    // Save the stored object
    saveLocalstorage(stored);
    stateDep.changed();
  }
};

Push.id = function() {
  idDep.depend();
  return stored.id;
};

Push.enabled = function(state) {
  if (stored) {
    if (typeof state === 'undefined') {
      // Act as a getter
      stateDep.depend();
      return stored.enabled !== false;
    } else {
      check(state, Boolean);
      if (state !== stored.enabled && stored.id) {
        // Latency compensation
        _setEnabled(state);
        // Update server
        Meteor.call('raix:push-enable', {
          id: stored.id,
          enabled: state
        }, function(err, found) {
          if (err || !found) {
            // On error or missing app item, revert
            _setEnabled(!state);
          }
        });
      }
    }
  }
};

Push.setUser = function() {
  // Let the server update the userId on the id
  Meteor.call('raix:push-setuser', stored.id);
};

Push.setMetadata = function(data) {
  stored.metadata = data;
  saveLocalstorage(stored);
  // Set the metadata on the server collection if we have a token, otherwise
  // we should only set the metadata in localstorage
  if (stored.token) {
    // Update the metadata
    Meteor.call('raix:push-metadata', {
      id: stored.id,
      metadata: stored.metadata
    });
  }
};

// Report token to the server
var reportTokenToServer = function(token, appName) {
  // Store the token
  stored.token = token;

  // Set the data object
  var data = {
    id: stored.id,
    token: token,
    appName: appName,
    userId: (addUserId) ? Meteor.userId() : null,
    metadata: stored.metadata
  };

  // token.gcm or token.apn
  Meteor.call('raix:push-update', data, function(err, result) {
    if (!err && result) {
      // The result is the id - The server may update this if it finds a
      // match for an old install
      if (stored.id !== result._id) {
        // The server did match the push token for this device
        stored.id = result._id;
        // Save the stored object
        saveLocalstorage(stored);
        // The id has changed.
        idDep.changed();
      }

      // Make sure enabled is also updated to keep in sync
      if (typeof result.enabled !== 'undefined') {
        _setEnabled(result.enabled);
      }
    }
  });
};

initPushUpdates = function(appName) {
  Meteor.startup(function() {
    // Start listening for tokens
    Push.on('token', function(token) {
      if (Push.debug) {
        console.log('Got token:', token);
      }
      // The app should be ready, lets call in
      reportTokenToServer(token, appName || 'main');
    });

    // Start listening for user updates if accounts package is added
    if (addUserId) {
      Tracker.autorun(function() {
        // Depend on the userId
        Meteor.userId();
        // Dont run this the first time, its already done in the reportTokenToServer
        if (!this.firstRun) {
          // Update the userId
          Push.setUser();
        }
      });
    }
  });
};
