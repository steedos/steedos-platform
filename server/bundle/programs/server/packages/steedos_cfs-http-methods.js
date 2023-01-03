(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var _ = Package.underscore._;
var EJSON = Package.ejson.EJSON;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var HTTP, _methodHTTP, Fiber, runServerMethod;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:cfs-http-methods":{"http.methods.server.api.js":function module(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_cfs-http-methods/http.methods.server.api.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/*

GET /note
GET /note/:id
POST /note
PUT /note/:id
DELETE /note/:id

*/
HTTP = Package.http && Package.http.HTTP || {}; // Primary local test scope

_methodHTTP = {};
_methodHTTP.methodHandlers = {};
_methodHTTP.methodTree = {}; // This could be changed eg. could allow larger data chunks than 1.000.000
// 5mb = 5 * 1024 * 1024 = 5242880;

HTTP.methodsMaxDataLength = 5242880; //1e6;

_methodHTTP.nameFollowsConventions = function (name) {
  // Check that name is string, not a falsy or empty
  return name && name === '' + name && name !== '';
};

_methodHTTP.getNameList = function (name) {
  // Remove leading and trailing slashes and make command array
  name = name && name.replace(/^\//g, '') || ''; // /^\/|\/$/g
  // TODO: Get the format from the url - eg.: "/list/45.json" format should be
  // set in this function by splitting the last list item by . and have format
  // as the last item. How should we toggle:
  // "/list/45/item.name.json" and "/list/45/item.name"?
  // We would either have to check all known formats or allways determin the "."
  // as an extension. Resolving in "json" and "name" as handed format - the user
  // Could simply just add the format as a parametre? or be explicit about
  // naming

  return name && name.split('/') || [];
}; // Merge two arrays one containing keys and one values


_methodHTTP.createObject = function (keys, values) {
  var result = {};

  if (keys && values) {
    for (var i = 0; i < keys.length; i++) {
      result[keys[i]] = values[i] && decodeURIComponent(values[i]) || '';
    }
  }

  return result;
};

_methodHTTP.addToMethodTree = function (methodName) {
  var list = _methodHTTP.getNameList(methodName);

  var name = '/'; // Contains the list of params names

  var params = [];
  var currentMethodTree = _methodHTTP.methodTree;

  for (var i = 0; i < list.length; i++) {
    // get the key name
    var key = list[i]; // Check if it expects a value

    if (key[0] === ':') {
      // This is a value
      params.push(key.slice(1));
      key = ':value';
    }

    name += key + '/'; // Set the key into the method tree

    if (typeof currentMethodTree[key] === 'undefined') {
      currentMethodTree[key] = {};
    } // Dig deeper


    currentMethodTree = currentMethodTree[key];
  }

  if (_.isEmpty(currentMethodTree[':ref'])) {
    currentMethodTree[':ref'] = {
      name: name,
      params: params
    };
  }

  return currentMethodTree[':ref'];
}; // This method should be optimized for speed since its called on allmost every
// http call to the server so we return null as soon as we know its not a method


_methodHTTP.getMethod = function (name) {
  // Check if the
  if (!_methodHTTP.nameFollowsConventions(name)) {
    return null;
  }

  var list = _methodHTTP.getNameList(name); // Check if we got a correct list


  if (!list || !list.length) {
    return null;
  } // Set current refernce in the _methodHTTP.methodTree


  var currentMethodTree = _methodHTTP.methodTree; // Buffer for values to hand on later

  var values = []; // Iterate over the method name and check if its found in the method tree

  for (var i = 0; i < list.length; i++) {
    // get the key name
    var key = list[i]; // We expect to find the key or :value if not we break

    if (typeof currentMethodTree[key] !== 'undefined' || typeof currentMethodTree[':value'] !== 'undefined') {
      // We got a result now check if its a value
      if (typeof currentMethodTree[key] === 'undefined') {
        // Push the value
        values.push(key); // Set the key to :value to dig deeper

        key = ':value';
      }
    } else {
      // Break - method call not found
      return null;
    } // Dig deeper


    currentMethodTree = currentMethodTree[key];
  } // Extract reference pointer


  var reference = currentMethodTree && currentMethodTree[':ref'];

  if (typeof reference !== 'undefined') {
    return {
      name: reference.name,
      params: _methodHTTP.createObject(reference.params, values),
      handle: _methodHTTP.methodHandlers[reference.name]
    };
  } else {
    // Did not get any reference to the method
    return null;
  }
}; // This method retrieves the userId from the token and makes sure that the token
// is valid and not expired


_methodHTTP.getUserId = function () {
  var self = this; // // Get ip, x-forwarded-for can be comma seperated ips where the first is the
  // // client ip
  // var ip = self.req.headers['x-forwarded-for'] &&
  //         // Return the first item in ip list
  //         self.req.headers['x-forwarded-for'].split(',')[0] ||
  //         // or return the remoteAddress
  //         self.req.connection.remoteAddress;
  // Check authentication

  var userToken = self.query.token; // Check if we are handed strings

  try {
    userToken && check(userToken, String);
  } catch (err) {
    throw new Meteor.Error(404, 'Error user token and id not of type strings, Error: ' + (err.stack || err.message));
  } // Set the this.userId


  if (userToken) {
    // Look up user to check if user exists and is loggedin via token
    var user = Meteor.users.findOne({
      $or: [{
        'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(userToken)
      }, {
        'services.resume.loginTokens.token': userToken
      }]
    }); // TODO: check 'services.resume.loginTokens.when' to have the token expire
    // Set the userId in the scope

    return user && user._id;
  }

  return null;
}; // Expose the default auth for calling from custom authentication handlers.


HTTP.defaultAuth = _methodHTTP.getUserId;
/*

Add default support for options

*/

_methodHTTP.defaultOptionsHandler = function (methodObject) {
  // List of supported methods
  var allowMethods = []; // The final result object

  var result = {}; // Iterate over the methods
  // XXX: We should have a way to extend this - We should have some schema model
  // for our methods...

  _.each(methodObject, function (f, methodName) {
    // Skip the stream and auth functions - they are not public / accessible
    if (methodName !== 'stream' && methodName !== 'auth') {
      // Create an empty description
      result[methodName] = {
        description: '',
        parameters: {}
      }; // Add method name to headers

      allowMethods.push(methodName);
    }
  }); // Lets play nice


  this.setStatusCode(200); // We have to set some allow headers here

  this.addHeader('Allow', allowMethods.join(',')); // Return json result - Pretty print

  return JSON.stringify(result, null, '\t');
}; // Public interface for adding server-side http methods - if setting a method to
// 'false' it would actually remove the method (can be used to unpublish a method)


HTTP.methods = function (newMethods) {
  _.each(newMethods, function (func, name) {
    if (_methodHTTP.nameFollowsConventions(name)) {
      // Check if we got a function
      //if (typeof func === 'function') {
      var method = _methodHTTP.addToMethodTree(name); // The func is good


      if (typeof _methodHTTP.methodHandlers[method.name] !== 'undefined') {
        if (func === false) {
          // If the method is set to false then unpublish
          delete _methodHTTP.methodHandlers[method.name]; // Delete the reference in the _methodHTTP.methodTree

          delete method.name;
          delete method.params;
        } else {
          // We should not allow overwriting - following Meteor.methods
          throw new Error('HTTP method "' + name + '" is already registered');
        }
      } else {
        // We could have a function or a object
        // The object could have:
        // '/test/': {
        //   auth: function() ... returning the userId using over default
        //
        //   method: function() ...
        //   or
        //   post: function() ...
        //   put:
        //   get:
        //   delete:
        //   head:
        // }

        /*
        We conform to the object format:
        {
          auth:
          post:
          put:
          get:
          delete:
          head:
        }
        This way we have a uniform reference
        */
        var uniObj = {};

        if (typeof func === 'function') {
          uniObj = {
            'auth': _methodHTTP.getUserId,
            'stream': false,
            'POST': func,
            'PUT': func,
            'GET': func,
            'DELETE': func,
            'HEAD': func,
            'OPTIONS': _methodHTTP.defaultOptionsHandler
          };
        } else {
          uniObj = {
            'stream': func.stream || false,
            'auth': func.auth || _methodHTTP.getUserId,
            'POST': func.post || func.method,
            'PUT': func.put || func.method,
            'GET': func.get || func.method,
            'DELETE': func.delete || func.method,
            'HEAD': func.head || func.get || func.method,
            'OPTIONS': func.options || _methodHTTP.defaultOptionsHandler
          };
        } // Registre the method


        _methodHTTP.methodHandlers[method.name] = uniObj; // func;
      } // } else {
      //   // We do require a function as a function to execute later
      //   throw new Error('HTTP.methods failed: ' + name + ' is not a function');
      // }

    } else {
      // We have to follow the naming spec defined in nameFollowsConventions
      throw new Error('HTTP.method "' + name + '" invalid naming of method');
    }
  });
};

var sendError = function (res, code, message) {
  if (code) {
    res.writeHead(code);
  } else {
    res.writeHead(500);
  }

  res.end(message);
}; // This handler collects the header data into either an object (if json) or the
// raw data. The data is passed to the callback


var requestHandler = function (req, res, callback) {
  if (typeof callback !== 'function') {
    return null;
  } // Container for buffers and a sum of the length


  var bufferData = [],
      dataLen = 0; // Extract the body

  req.on('data', function (data) {
    bufferData.push(data);
    dataLen += data.length; // We have to check the data length in order to spare the server

    if (dataLen > HTTP.methodsMaxDataLength) {
      dataLen = 0;
      bufferData = []; // Flood attack or faulty client

      sendError(res, 413, 'Flood attack or faulty client');
      req.connection.destroy();
    }
  }); // When message is ready to be passed on

  req.on('end', function () {
    if (res.finished) {
      return;
    } // Allow the result to be undefined if so


    var result; // If data found the work it - either buffer or json

    if (dataLen > 0) {
      result = new Buffer(dataLen); // Merge the chunks into one buffer

      for (var i = 0, ln = bufferData.length, pos = 0; i < ln; i++) {
        bufferData[i].copy(result, pos);
        pos += bufferData[i].length;
        delete bufferData[i];
      } // Check if we could be dealing with json


      if (result[0] == 0x7b && result[1] === 0x22) {
        try {
          // Convert the body into json and extract the data object
          result = EJSON.parse(result.toString());
        } catch (err) {// Could not parse so we return the raw data
        }
      }
    } // Else result will be undefined


    try {
      callback(result);
    } catch (err) {
      sendError(res, 500, 'Error in requestHandler callback, Error: ' + (err.stack || err.message));
    }
  });
}; // This is the simplest handler - it simply passes req stream as data to the
// method


var streamHandler = function (req, res, callback) {
  try {
    callback();
  } catch (err) {
    sendError(res, 500, 'Error in requestHandler callback, Error: ' + (err.stack || err.message));
  }
};
/*
  Allow file uploads in cordova cfs
*/


var setCordovaHeaders = function (request, response) {
  var origin = request.headers.origin; // Match http://localhost:<port> for Cordova clients in Meteor 1.3
  // and http://meteor.local for earlier versions

  if (origin && (origin === 'http://meteor.local' || /^http:\/\/localhost/.test(origin))) {
    // We need to echo the origin provided in the request
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Access-Control-Allow-Methods", "PUT");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
}; // Handle the actual connection


WebApp.connectHandlers.use(function (req, res, next) {
  // Check to se if this is a http method call
  var method = _methodHTTP.getMethod(req._parsedUrl.pathname); // If method is null then it wasn't and we pass the request along


  if (method === null) {
    return next();
  }

  var dataHandle = method.handle && method.handle.stream ? streamHandler : requestHandler;
  dataHandle(req, res, function (data) {
    // If methodsHandler not found or somehow the methodshandler is not a
    // function then return a 404
    if (typeof method.handle === 'undefined') {
      sendError(res, 404, 'Error HTTP method handler "' + method.name + '" is not found');
      return;
    } // Set CORS headers for Meteor Cordova clients


    setCordovaHeaders(req, res); // Set fiber scope

    var fiberScope = {
      // Pointers to Request / Response
      req: req,
      res: res,
      // Request / Response helpers
      statusCode: 200,
      method: req.method,
      // Headers for response
      headers: {
        'Content-Type': 'text/html' // Set default type

      },
      // Arguments
      data: data,
      query: req.query,
      params: method.params,
      // Method reference
      reference: method.name,
      methodObject: method.handle,
      _streamsWaiting: 0
    }; // Helper functions this scope

    Fiber = require('fibers');
    runServerMethod = Fiber(function (self) {
      var result, resultBuffer; // We fetch methods data from methodsHandler, the handler uses the this.addItem()
      // function to populate the methods, this way we have better check control and
      // better error handling + messages
      // The scope for the user methodObject callbacks

      var thisScope = {
        // The user whos id and token was used to run this method, if set/found
        userId: null,
        // The id of the data
        _id: null,
        // Set the query params ?token=1&id=2 -> { token: 1, id: 2 }
        query: self.query,
        // Set params /foo/:name/test/:id -> { name: '', id: '' }
        params: self.params,
        // Method GET, PUT, POST, DELETE, HEAD
        method: self.method,
        // User agent
        userAgent: req.headers['user-agent'],
        // All request headers
        requestHeaders: req.headers,
        // Add the request object it self
        request: req,
        // Set the userId
        setUserId: function (id) {
          this.userId = id;
        },
        // We dont simulate / run this on the client at the moment
        isSimulation: false,
        // Run the next method in a new fiber - This is default at the moment
        unblock: function () {},
        // Set the content type in header, defaults to text/html?
        setContentType: function (type) {
          self.headers['Content-Type'] = type;
        },
        setStatusCode: function (code) {
          self.statusCode = code;
        },
        addHeader: function (key, value) {
          self.headers[key] = value;
        },
        createReadStream: function () {
          self._streamsWaiting++;
          return req;
        },
        createWriteStream: function () {
          self._streamsWaiting++;
          return res;
        },
        Error: function (err) {
          if (err instanceof Meteor.Error) {
            // Return controlled error
            sendError(res, err.error, err.message);
          } else if (err instanceof Error) {
            // Return error trace - this is not intented
            sendError(res, 503, 'Error in method "' + self.reference + '", Error: ' + (err.stack || err.message));
          } else {
            sendError(res, 503, 'Error in method "' + self.reference + '"');
          }
        } // getData: function() {
        //   // XXX: TODO if we could run the request handler stuff eg.
        //   // in here in a fiber sync it could be cool - and the user did
        //   // not have to specify the stream=true flag?
        // }

      }; // This function sends the final response. Depending on the
      // timing of the streaming, we might have to wait for all
      // streaming to end, or we might have to wait for this function
      // to finish after streaming ends. The checks in this function
      // and the fact that we call it twice ensure that we will always
      // send the response if we haven't sent an error response, but
      // we will not send it too early.

      function sendResponseIfDone() {
        res.statusCode = self.statusCode; // If no streams are waiting

        if (self._streamsWaiting === 0 && (self.statusCode === 200 || self.statusCode === 206) && self.done && !self._responseSent && !res.finished) {
          self._responseSent = true;
          res.end(resultBuffer);
        }
      }

      var methodCall = self.methodObject[self.method]; // If the method call is set for the POST/PUT/GET or DELETE then run the
      // respective methodCall if its a function

      if (typeof methodCall === 'function') {
        // Get the userId - This is either set as a method specific handler and
        // will allways default back to the builtin getUserId handler
        try {
          // Try to set the userId
          thisScope.userId = self.methodObject.auth.apply(self);
        } catch (err) {
          sendError(res, err.error, err.message || err.stack);
          return;
        } // This must be attached before there's any chance of `createReadStream`
        // or `createWriteStream` being called, which means before we do
        // `methodCall.apply` below.


        req.on('end', function () {
          self._streamsWaiting--;
          sendResponseIfDone();
        }); // Get the result of the methodCall

        try {
          if (self.method === 'OPTIONS') {
            result = methodCall.apply(thisScope, [self.methodObject]) || '';
          } else {
            result = methodCall.apply(thisScope, [self.data]) || '';
          }
        } catch (err) {
          if (err instanceof Meteor.Error) {
            // Return controlled error
            sendError(res, err.error, err.message);
          } else {
            // Return error trace - this is not intented
            sendError(res, 503, 'Error in method "' + self.reference + '", Error: ' + (err.stack || err.message));
          }

          return;
        } // Set headers


        _.each(self.headers, function (value, key) {
          // If value is defined then set the header, this allows for unsetting
          // the default content-type
          if (typeof value !== 'undefined') res.setHeader(key, value);
        }); // If OK / 200 then Return the result


        if (self.statusCode === 200 || self.statusCode === 206) {
          if (self.method !== "HEAD") {
            // Return result
            if (typeof result === 'string') {
              resultBuffer = new Buffer(result);
            } else {
              resultBuffer = new Buffer(JSON.stringify(result));
            } // Check if user wants to overwrite content length for some reason?


            if (typeof self.headers['Content-Length'] === 'undefined') {
              self.headers['Content-Length'] = resultBuffer.length;
            }
          }

          self.done = true;
          sendResponseIfDone();
        } else {
          // Allow user to alter the status code and send a message
          sendError(res, self.statusCode, result);
        }
      } else {
        sendError(res, 404, 'Service not found');
      }
    }); // Run http methods handler

    try {
      runServerMethod.run(fiberScope);
    } catch (err) {
      sendError(res, 500, 'Error running the server http method handler, Error: ' + (err.stack || err.message));
    }
  }); // EO Request handler
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/steedos:cfs-http-methods/http.methods.server.api.js");

/* Exports */
Package._define("steedos:cfs-http-methods", {
  HTTP: HTTP,
  _methodHTTP: _methodHTTP
});

})();

//# sourceURL=meteor://💻app/packages/steedos_cfs-http-methods.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjZnMtaHR0cC1tZXRob2RzL2h0dHAubWV0aG9kcy5zZXJ2ZXIuYXBpLmpzIl0sIm5hbWVzIjpbIkhUVFAiLCJQYWNrYWdlIiwiaHR0cCIsIl9tZXRob2RIVFRQIiwibWV0aG9kSGFuZGxlcnMiLCJtZXRob2RUcmVlIiwibWV0aG9kc01heERhdGFMZW5ndGgiLCJuYW1lRm9sbG93c0NvbnZlbnRpb25zIiwibmFtZSIsImdldE5hbWVMaXN0IiwicmVwbGFjZSIsInNwbGl0IiwiY3JlYXRlT2JqZWN0Iiwia2V5cyIsInZhbHVlcyIsInJlc3VsdCIsImkiLCJsZW5ndGgiLCJkZWNvZGVVUklDb21wb25lbnQiLCJhZGRUb01ldGhvZFRyZWUiLCJtZXRob2ROYW1lIiwibGlzdCIsInBhcmFtcyIsImN1cnJlbnRNZXRob2RUcmVlIiwia2V5IiwicHVzaCIsInNsaWNlIiwiXyIsImlzRW1wdHkiLCJnZXRNZXRob2QiLCJyZWZlcmVuY2UiLCJoYW5kbGUiLCJnZXRVc2VySWQiLCJzZWxmIiwidXNlclRva2VuIiwicXVlcnkiLCJ0b2tlbiIsImNoZWNrIiwiU3RyaW5nIiwiZXJyIiwiTWV0ZW9yIiwiRXJyb3IiLCJzdGFjayIsIm1lc3NhZ2UiLCJ1c2VyIiwidXNlcnMiLCJmaW5kT25lIiwiJG9yIiwiQWNjb3VudHMiLCJfaGFzaExvZ2luVG9rZW4iLCJfaWQiLCJkZWZhdWx0QXV0aCIsImRlZmF1bHRPcHRpb25zSGFuZGxlciIsIm1ldGhvZE9iamVjdCIsImFsbG93TWV0aG9kcyIsImVhY2giLCJmIiwiZGVzY3JpcHRpb24iLCJwYXJhbWV0ZXJzIiwic2V0U3RhdHVzQ29kZSIsImFkZEhlYWRlciIsImpvaW4iLCJKU09OIiwic3RyaW5naWZ5IiwibWV0aG9kcyIsIm5ld01ldGhvZHMiLCJmdW5jIiwibWV0aG9kIiwidW5pT2JqIiwic3RyZWFtIiwiYXV0aCIsInBvc3QiLCJwdXQiLCJnZXQiLCJkZWxldGUiLCJoZWFkIiwib3B0aW9ucyIsInNlbmRFcnJvciIsInJlcyIsImNvZGUiLCJ3cml0ZUhlYWQiLCJlbmQiLCJyZXF1ZXN0SGFuZGxlciIsInJlcSIsImNhbGxiYWNrIiwiYnVmZmVyRGF0YSIsImRhdGFMZW4iLCJvbiIsImRhdGEiLCJjb25uZWN0aW9uIiwiZGVzdHJveSIsImZpbmlzaGVkIiwiQnVmZmVyIiwibG4iLCJwb3MiLCJjb3B5IiwiRUpTT04iLCJwYXJzZSIsInRvU3RyaW5nIiwic3RyZWFtSGFuZGxlciIsInNldENvcmRvdmFIZWFkZXJzIiwicmVxdWVzdCIsInJlc3BvbnNlIiwib3JpZ2luIiwiaGVhZGVycyIsInRlc3QiLCJzZXRIZWFkZXIiLCJXZWJBcHAiLCJjb25uZWN0SGFuZGxlcnMiLCJ1c2UiLCJuZXh0IiwiX3BhcnNlZFVybCIsInBhdGhuYW1lIiwiZGF0YUhhbmRsZSIsImZpYmVyU2NvcGUiLCJzdGF0dXNDb2RlIiwiX3N0cmVhbXNXYWl0aW5nIiwiRmliZXIiLCJyZXF1aXJlIiwicnVuU2VydmVyTWV0aG9kIiwicmVzdWx0QnVmZmVyIiwidGhpc1Njb3BlIiwidXNlcklkIiwidXNlckFnZW50IiwicmVxdWVzdEhlYWRlcnMiLCJzZXRVc2VySWQiLCJpZCIsImlzU2ltdWxhdGlvbiIsInVuYmxvY2siLCJzZXRDb250ZW50VHlwZSIsInR5cGUiLCJ2YWx1ZSIsImNyZWF0ZVJlYWRTdHJlYW0iLCJjcmVhdGVXcml0ZVN0cmVhbSIsImVycm9yIiwic2VuZFJlc3BvbnNlSWZEb25lIiwiZG9uZSIsIl9yZXNwb25zZVNlbnQiLCJtZXRob2RDYWxsIiwiYXBwbHkiLCJydW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7OztBQVNBQSxJQUFJLEdBQUdDLE9BQU8sQ0FBQ0MsSUFBUixJQUFnQkQsT0FBTyxDQUFDQyxJQUFSLENBQWFGLElBQTdCLElBQXFDLEVBQTVDLEMsQ0FFQTs7QUFDQUcsV0FBVyxHQUFHLEVBQWQ7QUFHQUEsV0FBVyxD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LG1CQUFTLENBQUNDLEdBQUQsRUFBTTdDLElBQUksQ0FBQ2tGLFVBQVgsRUFBdUJwRyxNQUF2QixDQUFUO0FBQ0Q7QUFFRixPQXhFRCxNQXdFTztBQUNMOEQsaUJBQVMsQ0FBQ0MsR0FBRCxFQUFNLEdBQU4sRUFBVyxtQkFBWCxDQUFUO0FBQ0Q7QUFHRixLQTVLc0IsQ0FBdkIsQ0FuQ2tDLENBZ05sQzs7QUFDQSxRQUFJO0FBQ0Z5QyxxQkFBZSxDQUFDcUIsR0FBaEIsQ0FBb0IxQixVQUFwQjtBQUNELEtBRkQsQ0FFRSxPQUFNM0UsR0FBTixFQUFXO0FBQ1hzQyxlQUFTLENBQUNDLEdBQUQsRUFBTSxHQUFOLEVBQVcsMkRBQTJEdkMsR0FBRyxDQUFDRyxLQUFKLElBQWFILEdBQUcsQ0FBQ0ksT0FBNUUsQ0FBWCxDQUFUO0FBQ0Q7QUFFRixHQXZOUyxDQUFWLENBWmtELENBbU85QztBQUdMLENBdE9ELEUiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfY2ZzLWh0dHAtbWV0aG9kcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcblxyXG5HRVQgL25vdGVcclxuR0VUIC9ub3RlLzppZFxyXG5QT1NUIC9ub3RlXHJcblBVVCAvbm90ZS86aWRcclxuREVMRVRFIC9ub3RlLzppZFxyXG5cclxuKi9cclxuSFRUUCA9IFBhY2thZ2UuaHR0cCAmJiBQYWNrYWdlLmh0dHAuSFRUUCB8fCB7fTtcclxuXHJcbi8vIFByaW1hcnkgbG9jYWwgdGVzdCBzY29wZVxyXG5fbWV0aG9kSFRUUCA9IHt9O1xyXG5cclxuXHJcbl9tZXRob2RIVFRQLm1ldGhvZEhhbmRsZXJzID0ge307XHJcbl9tZXRob2RIVFRQLm1ldGhvZFRyZWUgPSB7fTtcclxuXHJcbi8vIFRoaXMgY291bGQgYmUgY2hhbmdlZCBlZy4gY291bGQgYWxsb3cgbGFyZ2VyIGRhdGEgY2h1bmtzIHRoYW4gMS4wMDAuMDAwXHJcbi8vIDVtYiA9IDUgKiAxMDI0ICogMTAyNCA9IDUyNDI4ODA7XHJcbkhUVFAubWV0aG9kc01heERhdGFMZW5ndGggPSA1MjQyODgwOyAvLzFlNjtcclxuXHJcbl9tZXRob2RIVFRQLm5hbWVGb2xsb3dzQ29udmVudGlvbnMgPSBmdW5jdGlvbihuYW1lKSB7XHJcbiAgLy8gQ2hlY2sgdGhhdCBuYW1lIGlzIHN0cmluZywgbm90IGEgZmFsc3kgb3IgZW1wdHlcclxuICByZXR1cm4gbmFtZSAmJiBuYW1lID09PSAnJyArIG5hbWUgJiYgbmFtZSAhPT0gJyc7XHJcbn07XHJcblxyXG5cclxuX21ldGhvZEhUVFAuZ2V0TmFtZUxpc3QgPSBmdW5jdGlvbihuYW1lKSB7XHJcbiAgLy8gUmVtb3ZlIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHNsYXNoZXMgYW5kIG1ha2UgY29tbWFuZCBhcnJheVxyXG4gIG5hbWUgPSBuYW1lICYmIG5hbWUucmVwbGFjZSgvXlxcLy9nLCAnJykgfHwgJyc7IC8vIC9eXFwvfFxcLyQvZ1xyXG4gIC8vIFRPRE86IEdldCB0aGUgZm9ybWF0IGZyb20gdGhlIHVybCAtIGVnLjogXCIvbGlzdC80NS5qc29uXCIgZm9ybWF0IHNob3VsZCBiZVxyXG4gIC8vIHNldCBpbiB0aGlzIGZ1bmN0aW9uIGJ5IHNwbGl0dGluZyB0aGUgbGFzdCBsaXN0IGl0ZW0gYnkgLiBhbmQgaGF2ZSBmb3JtYXRcclxuICAvLyBhcyB0aGUgbGFzdCBpdGVtLiBIb3cgc2hvdWxkIHdlIHRvZ2dsZTpcclxuICAvLyBcIi9saXN0LzQ1L2l0ZW0ubmFtZS5qc29uXCIgYW5kIFwiL2xpc3QvNDUvaXRlbS5uYW1lXCI/XHJcbiAgLy8gV2Ugd291bGQgZWl0aGVyIGhhdmUgdG8gY2hlY2sgYWxsIGtub3duIGZvcm1hdHMgb3IgYWxsd2F5cyBkZXRlcm1pbiB0aGUgXCIuXCJcclxuICAvLyBhcyBhbiBleHRlbnNpb24uIFJlc29sdmluZyBpbiBcImpzb25cIiBhbmQgXCJuYW1lXCIgYXMgaGFuZGVkIGZvcm1hdCAtIHRoZSB1c2VyXHJcbiAgLy8gQ291bGQgc2ltcGx5IGp1c3QgYWRkIHRoZSBmb3JtYXQgYXMgYSBwYXJhbWV0cmU/IG9yIGJlIGV4cGxpY2l0IGFib3V0XHJcbiAgLy8gbmFtaW5nXHJcbiAgcmV0dXJuIG5hbWUgJiYgbmFtZS5zcGxpdCgnLycpIHx8IFtdO1xyXG59O1xyXG5cclxuLy8gTWVyZ2UgdHdvIGFycmF5cyBvbmUgY29udGFpbmluZyBrZXlzIGFuZCBvbmUgdmFsdWVzXHJcbl9tZXRob2RIVFRQLmNyZWF0ZU9iamVjdCA9IGZ1bmN0aW9uKGtleXMsIHZhbHVlcykge1xyXG4gIHZhciByZXN1bHQgPSB7fTtcclxuICBpZiAoa2V5cyAmJiB2YWx1ZXMpIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICByZXN1bHRba2V5c1tpXV0gPSB2YWx1ZXNbaV0gJiYgZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlc1tpXSkgfHwgJyc7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG5fbWV0aG9kSFRUUC5hZGRUb01ldGhvZFRyZWUgPSBmdW5jdGlvbihtZXRob2ROYW1lKSB7XHJcbiAgdmFyIGxpc3QgPSBfbWV0aG9kSFRUUC5nZXROYW1lTGlzdChtZXRob2ROYW1lKTtcclxuICB2YXIgbmFtZSA9ICcvJztcclxuICAvLyBDb250YWlucyB0aGUgbGlzdCBvZiBwYXJhbXMgbmFtZXNcclxuICB2YXIgcGFyYW1zID0gW107XHJcbiAgdmFyIGN1cnJlbnRNZXRob2RUcmVlID0gX21ldGhvZEhUVFAubWV0aG9kVHJlZTtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgLy8gZ2V0IHRoZSBrZXkgbmFtZVxyXG4gICAgdmFyIGtleSA9IGxpc3RbaV07XHJcbiAgICAvLyBDaGVjayBpZiBpdCBleHBlY3RzIGEgdmFsdWVcclxuICAgIGlmIChrZXlbMF0gPT09ICc6Jykge1xyXG4gICAgICAvLyBUaGlzIGlzIGEgdmFsdWVcclxuICAgICAgcGFyYW1zLnB1c2goa2V5LnNsaWNlKDEpKTtcclxuICAgICAga2V5ID0gJzp2YWx1ZSc7XHJcbiAgICB9XHJcbiAgICBuYW1lICs9IGtleSArICcvJztcclxuXHJcbiAgICAvLyBTZXQgdGhlIGtleSBpbnRvIHRoZSBtZXRob2QgdHJlZVxyXG4gICAgaWYgKHR5cGVvZiBjdXJyZW50TWV0aG9kVHJlZVtrZXldID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICBjdXJyZW50TWV0aG9kVHJlZVtrZXldID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRGlnIGRlZXBlclxyXG4gICAgY3VycmVudE1ldGhvZFRyZWUgPSBjdXJyZW50TWV0aG9kVHJlZVtrZXldO1xyXG5cclxuICB9XHJcblxyXG4gIGlmIChfLmlzRW1wdHkoY3VycmVudE1ldGhvZFRyZWVbJzpyZWYnXSkpIHtcclxuICAgIGN1cnJlbnRNZXRob2RUcmVlWyc6cmVmJ10gPSB7XHJcbiAgICAgIG5hbWU6IG5hbWUsXHJcbiAgICAgIHBhcmFtczogcGFyYW1zXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGN1cnJlbnRNZXRob2RUcmVlWyc6cmVmJ107XHJcbn07XHJcblxyXG4vLyBUaGlzIG1ldGhvZCBzaG91bGQgYmUgb3B0aW1pemVkIGZvciBzcGVlZCBzaW5jZSBpdHMgY2FsbGVkIG9uIGFsbG1vc3QgZXZlcnlcclxuLy8gaHR0cCBjYWxsIHRvIHRoZSBzZXJ2ZXIgc28gd2UgcmV0dXJuIG51bGwgYXMgc29vbiBhcyB3ZSBrbm93IGl0cyBub3QgYSBtZXRob2RcclxuX21ldGhvZEhUVFAuZ2V0TWV0aG9kID0gZnVuY3Rpb24obmFtZSkge1xyXG4gIC8vIENoZWNrIGlmIHRoZVxyXG4gIGlmICghX21ldGhvZEhUVFAubmFtZUZvbGxvd3NDb252ZW50aW9ucyhuYW1lKSkge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG4gIHZhciBsaXN0ID0gX21ldGhvZEhUVFAuZ2V0TmFtZUxpc3QobmFtZSk7XHJcbiAgLy8gQ2hlY2sgaWYgd2UgZ290IGEgY29ycmVjdCBsaXN0XHJcbiAgaWYgKCFsaXN0IHx8ICFsaXN0Lmxlbmd0aCkge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG4gIC8vIFNldCBjdXJyZW50IHJlZmVybmNlIGluIHRoZSBfbWV0aG9kSFRUUC5tZXRob2RUcmVlXHJcbiAgdmFyIGN1cnJlbnRNZXRob2RUcmVlID0gX21ldGhvZEhUVFAubWV0aG9kVHJlZTtcclxuICAvLyBCdWZmZXIgZm9yIHZhbHVlcyB0byBoYW5kIG9uIGxhdGVyXHJcbiAgdmFyIHZhbHVlcyA9IFtdO1xyXG4gIC8vIEl0ZXJhdGUgb3ZlciB0aGUgbWV0aG9kIG5hbWUgYW5kIGNoZWNrIGlmIGl0cyBmb3VuZCBpbiB0aGUgbWV0aG9kIHRyZWVcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgIC8vIGdldCB0aGUga2V5IG5hbWVcclxuICAgIHZhciBrZXkgPSBsaXN0W2ldO1xyXG4gICAgLy8gV2UgZXhwZWN0IHRvIGZpbmQgdGhlIGtleSBvciA6dmFsdWUgaWYgbm90IHdlIGJyZWFrXHJcbiAgICBpZiAodHlwZW9mIGN1cnJlbnRNZXRob2RUcmVlW2tleV0gIT09ICd1bmRlZmluZWQnIHx8XHJcbiAgICAgICAgICAgIHR5cGVvZiBjdXJyZW50TWV0aG9kVHJlZVsnOnZhbHVlJ10gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIC8vIFdlIGdvdCBhIHJlc3VsdCBub3cgY2hlY2sgaWYgaXRzIGEgdmFsdWVcclxuICAgICAgaWYgKHR5cGVvZiBjdXJyZW50TWV0aG9kVHJlZVtrZXldID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIC8vIFB1c2ggdGhlIHZhbHVlXHJcbiAgICAgICAgdmFsdWVzLnB1c2goa2V5KTtcclxuICAgICAgICAvLyBTZXQgdGhlIGtleSB0byA6dmFsdWUgdG8gZGlnIGRlZXBlclxyXG4gICAgICAgIGtleSA9ICc6dmFsdWUnO1xyXG4gICAgICB9XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gQnJlYWsgLSBtZXRob2QgY2FsbCBub3QgZm91bmRcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRGlnIGRlZXBlclxyXG4gICAgY3VycmVudE1ldGhvZFRyZWUgPSBjdXJyZW50TWV0aG9kVHJlZVtrZXldO1xyXG4gIH1cclxuXHJcbiAgLy8gRXh0cmFjdCByZWZlcmVuY2UgcG9pbnRlclxyXG4gIHZhciByZWZlcmVuY2UgPSBjdXJyZW50TWV0aG9kVHJlZSAmJiBjdXJyZW50TWV0aG9kVHJlZVsnOnJlZiddO1xyXG4gIGlmICh0eXBlb2YgcmVmZXJlbmNlICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbmFtZTogcmVmZXJlbmNlLm5hbWUsXHJcbiAgICAgIHBhcmFtczogX21ldGhvZEhUVFAuY3JlYXRlT2JqZWN0KHJlZmVyZW5jZS5wYXJhbXMsIHZhbHVlcyksXHJcbiAgICAgIGhhbmRsZTogX21ldGhvZEhUVFAubWV0aG9kSGFuZGxlcnNbcmVmZXJlbmNlLm5hbWVdXHJcbiAgICB9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBEaWQgbm90IGdldCBhbnkgcmVmZXJlbmNlIHRvIHRoZSBtZXRob2RcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIFRoaXMgbWV0aG9kIHJldHJpZXZlcyB0aGUgdXNlcklkIGZyb20gdGhlIHRva2VuIGFuZCBtYWtlcyBzdXJlIHRoYXQgdGhlIHRva2VuXHJcbi8vIGlzIHZhbGlkIGFuZCBub3QgZXhwaXJlZFxyXG5fbWV0aG9kSFRUUC5nZXRVc2VySWQgPSBmdW5jdGlvbigpIHtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gIC8vIC8vIEdldCBpcCwgeC1mb3J3YXJkZWQtZm9yIGNhbiBiZSBjb21tYSBzZXBlcmF0ZWQgaXBzIHdoZXJlIHRoZSBmaXJzdCBpcyB0aGVcclxuICAvLyAvLyBjbGllbnQgaXBcclxuICAvLyB2YXIgaXAgPSBzZWxmLnJlcS5oZWFkZXJzWyd4LWZvcndhcmRlZC1mb3InXSAmJlxyXG4gIC8vICAgICAgICAgLy8gUmV0dXJuIHRoZSBmaXJzdCBpdGVtIGluIGlwIGxpc3RcclxuICAvLyAgICAgICAgIHNlbGYucmVxLmhlYWRlcnNbJ3gtZm9yd2FyZGVkLWZvciddLnNwbGl0KCcsJylbMF0gfHxcclxuICAvLyAgICAgICAgIC8vIG9yIHJldHVybiB0aGUgcmVtb3RlQWRkcmVzc1xyXG4gIC8vICAgICAgICAgc2VsZi5yZXEuY29ubmVjdGlvbi5yZW1vdGVBZGRyZXNzO1xyXG5cclxuICAvLyBDaGVjayBhdXRoZW50aWNhdGlvblxyXG4gIHZhciB1c2VyVG9rZW4gPSBzZWxmLnF1ZXJ5LnRva2VuO1xyXG5cclxuICAvLyBDaGVjayBpZiB3ZSBhcmUgaGFuZGVkIHN0cmluZ3NcclxuICB0cnkge1xyXG4gICAgdXNlclRva2VuICYmIGNoZWNrKHVzZXJUb2tlbiwgU3RyaW5nKTtcclxuICB9IGNhdGNoKGVycikge1xyXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDQsICdFcnJvciB1c2VyIHRva2VuIGFuZCBpZCBub3Qgb2YgdHlwZSBzdHJpbmdzLCBFcnJvcjogJyArIChlcnIuc3RhY2sgfHwgZXJyLm1lc3NhZ2UpKTtcclxuICB9XHJcblxyXG4gIC8vIFNldCB0aGUgdGhpcy51c2VySWRcclxuICBpZiAodXNlclRva2VuKSB7XHJcbiAgICAvLyBMb29rIHVwIHVzZXIgdG8gY2hlY2sgaWYgdXNlciBleGlzdHMgYW5kIGlzIGxvZ2dlZGluIHZpYSB0b2tlblxyXG4gICAgdmFyIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XHJcbiAgICAgICAgJG9yOiBbXHJcbiAgICAgICAgICB7J3NlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlbic6IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbih1c2VyVG9rZW4pfSxcclxuICAgICAgICAgIHsnc2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLnRva2VuJzogdXNlclRva2VufVxyXG4gICAgICAgIF1cclxuICAgICAgfSk7XHJcbiAgICAvLyBUT0RPOiBjaGVjayAnc2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLndoZW4nIHRvIGhhdmUgdGhlIHRva2VuIGV4cGlyZVxyXG5cclxuICAgIC8vIFNldCB0aGUgdXNlcklkIGluIHRoZSBzY29wZVxyXG4gICAgcmV0dXJuIHVzZXIgJiYgdXNlci5faWQ7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbnVsbDtcclxufTtcclxuXHJcbi8vIEV4cG9zZSB0aGUgZGVmYXVsdCBhdXRoIGZvciBjYWxsaW5nIGZyb20gY3VzdG9tIGF1dGhlbnRpY2F0aW9uIGhhbmRsZXJzLlxyXG5IVFRQLmRlZmF1bHRBdXRoID0gX21ldGhvZEhUVFAuZ2V0VXNlcklkO1xyXG5cclxuLypcclxuXHJcbkFkZCBkZWZhdWx0IHN1cHBvcnQgZm9yIG9wdGlvbnNcclxuXHJcbiovXHJcbl9tZXRob2RIVFRQLmRlZmF1bHRPcHRpb25zSGFuZGxlciA9IGZ1bmN0aW9uKG1ldGhvZE9iamVjdCkge1xyXG4gIC8vIExpc3Qgb2Ygc3VwcG9ydGVkIG1ldGhvZHNcclxuICB2YXIgYWxsb3dNZXRob2RzID0gW107XHJcbiAgLy8gVGhlIGZpbmFsIHJlc3VsdCBvYmplY3RcclxuICB2YXIgcmVzdWx0ID0ge307XHJcblxyXG4gIC8vIEl0ZXJhdGUgb3ZlciB0aGUgbWV0aG9kc1xyXG4gIC8vIFhYWDogV2Ugc2hvdWxkIGhhdmUgYSB3YXkgdG8gZXh0ZW5kIHRoaXMgLSBXZSBzaG91bGQgaGF2ZSBzb21lIHNjaGVtYSBtb2RlbFxyXG4gIC8vIGZvciBvdXIgbWV0aG9kcy4uLlxyXG4gIF8uZWFjaChtZXRob2RPYmplY3QsIGZ1bmN0aW9uKGYsIG1ldGhvZE5hbWUpIHtcclxuICAgIC8vIFNraXAgdGhlIHN0cmVhbSBhbmQgYXV0aCBmdW5jdGlvbnMgLSB0aGV5IGFyZSBub3QgcHVibGljIC8gYWNjZXNzaWJsZVxyXG4gICAgaWYgKG1ldGhvZE5hbWUgIT09ICdzdHJlYW0nICYmIG1ldGhvZE5hbWUgIT09ICdhdXRoJykge1xyXG5cclxuICAgICAgLy8gQ3JlYXRlIGFuIGVtcHR5IGRlc2NyaXB0aW9uXHJcbiAgICAgIHJlc3VsdFttZXRob2ROYW1lXSA9IHsgZGVzY3JpcHRpb246ICcnLCBwYXJhbWV0ZXJzOiB7fSB9O1xyXG4gICAgICAvLyBBZGQgbWV0aG9kIG5hbWUgdG8gaGVhZGVyc1xyXG4gICAgICBhbGxvd01ldGhvZHMucHVzaChtZXRob2ROYW1lKTtcclxuXHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIC8vIExldHMgcGxheSBuaWNlXHJcbiAgdGhpcy5zZXRTdGF0dXNDb2RlKDIwMCk7XHJcblxyXG4gIC8vIFdlIGhhdmUgdG8gc2V0IHNvbWUgYWxsb3cgaGVhZGVycyBoZXJlXHJcbiAgdGhpcy5hZGRIZWFkZXIoJ0FsbG93JywgYWxsb3dNZXRob2RzLmpvaW4oJywnKSk7XHJcblxyXG4gIC8vIFJldHVybiBqc29uIHJlc3VsdCAtIFByZXR0eSBwcmludFxyXG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShyZXN1bHQsIG51bGwsICdcXHQnKTtcclxufTtcclxuXHJcbi8vIFB1YmxpYyBpbnRlcmZhY2UgZm9yIGFkZGluZyBzZXJ2ZXItc2lkZSBodHRwIG1ldGhvZHMgLSBpZiBzZXR0aW5nIGEgbWV0aG9kIHRvXHJcbi8vICdmYWxzZScgaXQgd291bGQgYWN0dWFsbHkgcmVtb3ZlIHRoZSBtZXRob2QgKGNhbiBiZSB1c2VkIHRvIHVucHVibGlzaCBhIG1ldGhvZClcclxuSFRUUC5tZXRob2RzID0gZnVuY3Rpb24obmV3TWV0aG9kcykge1xyXG4gIF8uZWFjaChuZXdNZXRob2RzLCBmdW5jdGlvbihmdW5jLCBuYW1lKSB7XHJcbiAgICBpZiAoX21ldGhvZEhUVFAubmFtZUZvbGxvd3NDb252ZW50aW9ucyhuYW1lKSkge1xyXG4gICAgICAvLyBDaGVjayBpZiB3ZSBnb3QgYSBmdW5jdGlvblxyXG4gICAgICAvL2lmICh0eXBlb2YgZnVuYyA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHZhciBtZXRob2QgPSBfbWV0aG9kSFRUUC5hZGRUb01ldGhvZFRyZWUobmFtZSk7XHJcbiAgICAgICAgLy8gVGhlIGZ1bmMgaXMgZ29vZFxyXG4gICAgICAgIGlmICh0eXBlb2YgX21ldGhvZEhUVFAubWV0aG9kSGFuZGxlcnNbbWV0aG9kLm5hbWVdICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgaWYgKGZ1bmMgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIC8vIElmIHRoZSBtZXRob2QgaXMgc2V0IHRvIGZhbHNlIHRoZW4gdW5wdWJsaXNoXHJcbiAgICAgICAgICAgIGRlbGV0ZSBfbWV0aG9kSFRUUC5tZXRob2RIYW5kbGVyc1ttZXRob2QubmFtZV07XHJcbiAgICAgICAgICAgIC8vIERlbGV0ZSB0aGUgcmVmZXJlbmNlIGluIHRoZSBfbWV0aG9kSFRUUC5tZXRob2RUcmVlXHJcbiAgICAgICAgICAgIGRlbGV0ZSBtZXRob2QubmFtZTtcclxuICAgICAgICAgICAgZGVsZXRlIG1ldGhvZC5wYXJhbXM7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBXZSBzaG91bGQgbm90IGFsbG93IG92ZXJ3cml0aW5nIC0gZm9sbG93aW5nIE1ldGVvci5tZXRob2RzXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSFRUUCBtZXRob2QgXCInICsgbmFtZSArICdcIiBpcyBhbHJlYWR5IHJlZ2lzdGVyZWQnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy8gV2UgY291bGQgaGF2ZSBhIGZ1bmN0aW9uIG9yIGEgb2JqZWN0XHJcbiAgICAgICAgICAvLyBUaGUgb2JqZWN0IGNvdWxkIGhhdmU6XHJcbiAgICAgICAgICAvLyAnL3Rlc3QvJzoge1xyXG4gICAgICAgICAgLy8gICBhdXRoOiBmdW5jdGlvbigpIC4uLiByZXR1cm5pbmcgdGhlIHVzZXJJZCB1c2luZyBvdmVyIGRlZmF1bHRcclxuICAgICAgICAgIC8vXHJcbiAgICAgICAgICAvLyAgIG1ldGhvZDogZnVuY3Rpb24oKSAuLi5cclxuICAgICAgICAgIC8vICAgb3JcclxuICAgICAgICAgIC8vICAgcG9zdDogZnVuY3Rpb24oKSAuLi5cclxuICAgICAgICAgIC8vICAgcHV0OlxyXG4gICAgICAgICAgLy8gICBnZXQ6XHJcbiAgICAgICAgICAvLyAgIGRlbGV0ZTpcclxuICAgICAgICAgIC8vICAgaGVhZDpcclxuICAgICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgICAvKlxyXG4gICAgICAgICAgV2UgY29uZm9ybSB0byB0aGUgb2JqZWN0IGZvcm1hdDpcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgYXV0aDpcclxuICAgICAgICAgICAgcG9zdDpcclxuICAgICAgICAgICAgcHV0OlxyXG4gICAgICAgICAgICBnZXQ6XHJcbiAgICAgICAgICAgIGRlbGV0ZTpcclxuICAgICAgICAgICAgaGVhZDpcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFRoaXMgd2F5IHdlIGhhdmUgYSB1bmlmb3JtIHJlZmVyZW5jZVxyXG4gICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICB2YXIgdW5pT2JqID0ge307XHJcbiAgICAgICAgICBpZiAodHlwZW9mIGZ1bmMgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgdW5pT2JqID0ge1xyXG4gICAgICAgICAgICAgICdhdXRoJzogX21ldGhvZEhUVFAuZ2V0VXNlcklkLFxyXG4gICAgICAgICAgICAgICdzdHJlYW0nOiBmYWxzZSxcclxuICAgICAgICAgICAgICAnUE9TVCc6IGZ1bmMsXHJcbiAgICAgICAgICAgICAgJ1BVVCc6IGZ1bmMsXHJcbiAgICAgICAgICAgICAgJ0dFVCc6IGZ1bmMsXHJcbiAgICAgICAgICAgICAgJ0RFTEVURSc6IGZ1bmMsXHJcbiAgICAgICAgICAgICAgJ0hFQUQnOiBmdW5jLFxyXG4gICAgICAgICAgICAgICdPUFRJT05TJzogX21ldGhvZEhUVFAuZGVmYXVsdE9wdGlvbnNIYW5kbGVyXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB1bmlPYmogPSB7XHJcbiAgICAgICAgICAgICAgJ3N0cmVhbSc6IGZ1bmMuc3RyZWFtIHx8IGZhbHNlLFxyXG4gICAgICAgICAgICAgICdhdXRoJzogZnVuYy5hdXRoIHx8IF9tZXRob2RIVFRQLmdldFVzZXJJZCxcclxuICAgICAgICAgICAgICAnUE9TVCc6IGZ1bmMucG9zdCB8fCBmdW5jLm1ldGhvZCxcclxuICAgICAgICAgICAgICAnUFVUJzogZnVuYy5wdXQgfHwgZnVuYy5tZXRob2QsXHJcbiAgICAgICAgICAgICAgJ0dFVCc6IGZ1bmMuZ2V0IHx8IGZ1bmMubWV0aG9kLFxyXG4gICAgICAgICAgICAgICdERUxFVEUnOiBmdW5jLmRlbGV0ZSB8fCBmdW5jLm1ldGhvZCxcclxuICAgICAgICAgICAgICAnSEVBRCc6IGZ1bmMuaGVhZCB8fCBmdW5jLmdldCB8fCBmdW5jLm1ldGhvZCxcclxuICAgICAgICAgICAgICAnT1BUSU9OUyc6IGZ1bmMub3B0aW9ucyB8fCBfbWV0aG9kSFRUUC5kZWZhdWx0T3B0aW9uc0hhbmRsZXJcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBSZWdpc3RyZSB0aGUgbWV0aG9kXHJcbiAgICAgICAgICBfbWV0aG9kSFRUUC5tZXRob2RIYW5kbGVyc1ttZXRob2QubmFtZV0gPSB1bmlPYmo7IC8vIGZ1bmM7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgLy8gfSBlbHNlIHtcclxuICAgICAgLy8gICAvLyBXZSBkbyByZXF1aXJlIGEgZnVuY3Rpb24gYXMgYSBmdW5jdGlvbiB0byBleGVjdXRlIGxhdGVyXHJcbiAgICAgIC8vICAgdGhyb3cgbmV3IEVycm9yKCdIVFRQLm1ldGhvZHMgZmFpbGVkOiAnICsgbmFtZSArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcclxuICAgICAgLy8gfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gV2UgaGF2ZSB0byBmb2xsb3cgdGhlIG5hbWluZyBzcGVjIGRlZmluZWQgaW4gbmFtZUZvbGxvd3NDb252ZW50aW9uc1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0hUVFAubWV0aG9kIFwiJyArIG5hbWUgKyAnXCIgaW52YWxpZCBuYW1pbmcgb2YgbWV0aG9kJyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn07XHJcblxyXG52YXIgc2VuZEVycm9yID0gZnVuY3Rpb24ocmVzLCBjb2RlLCBtZXNzYWdlKSB7XHJcbiAgaWYgKGNvZGUpIHtcclxuICAgIHJlcy53cml0ZUhlYWQoY29kZSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJlcy53cml0ZUhlYWQoNTAwKTtcclxuICB9XHJcbiAgcmVzLmVuZChtZXNzYWdlKTtcclxufTtcclxuXHJcbi8vIFRoaXMgaGFuZGxlciBjb2xsZWN0cyB0aGUgaGVhZGVyIGRhdGEgaW50byBlaXRoZXIgYW4gb2JqZWN0IChpZiBqc29uKSBvciB0aGVcclxuLy8gcmF3IGRhdGEuIFRoZSBkYXRhIGlzIHBhc3NlZCB0byB0aGUgY2FsbGJhY2tcclxudmFyIHJlcXVlc3RIYW5kbGVyID0gZnVuY3Rpb24ocmVxLCByZXMsIGNhbGxiYWNrKSB7XHJcbiAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICAvLyBDb250YWluZXIgZm9yIGJ1ZmZlcnMgYW5kIGEgc3VtIG9mIHRoZSBsZW5ndGhcclxuICB2YXIgYnVmZmVyRGF0YSA9IFtdLCBkYXRhTGVuID0gMDtcclxuXHJcbiAgLy8gRXh0cmFjdCB0aGUgYm9keVxyXG4gIHJlcS5vbignZGF0YScsIGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgIGJ1ZmZlckRhdGEucHVzaChkYXRhKTtcclxuICAgIGRhdGFMZW4gKz0gZGF0YS5sZW5ndGg7XHJcblxyXG4gICAgLy8gV2UgaGF2ZSB0byBjaGVjayB0aGUgZGF0YSBsZW5ndGggaW4gb3JkZXIgdG8gc3BhcmUgdGhlIHNlcnZlclxyXG4gICAgaWYgKGRhdGFMZW4gPiBIVFRQLm1ldGhvZHNNYXhEYXRhTGVuZ3RoKSB7XHJcbiAgICAgIGRhdGFMZW4gPSAwO1xyXG4gICAgICBidWZmZXJEYXRhID0gW107XHJcbiAgICAgIC8vIEZsb29kIGF0dGFjayBvciBmYXVsdHkgY2xpZW50XHJcbiAgICAgIHNlbmRFcnJvcihyZXMsIDQxMywgJ0Zsb29kIGF0dGFjayBvciBmYXVsdHkgY2xpZW50Jyk7XHJcbiAgICAgIHJlcS5jb25uZWN0aW9uLmRlc3Ryb3koKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgLy8gV2hlbiBtZXNzYWdlIGlzIHJlYWR5IHRvIGJlIHBhc3NlZCBvblxyXG4gIHJlcS5vbignZW5kJywgZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAocmVzLmZpbmlzaGVkKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBBbGxvdyB0aGUgcmVzdWx0IHRvIGJlIHVuZGVmaW5lZCBpZiBzb1xyXG4gICAgdmFyIHJlc3VsdDtcclxuXHJcbiAgICAvLyBJZiBkYXRhIGZvdW5kIHRoZSB3b3JrIGl0IC0gZWl0aGVyIGJ1ZmZlciBvciBqc29uXHJcbiAgICBpZiAoZGF0YUxlbiA+IDApIHtcclxuICAgICAgcmVzdWx0ID0gbmV3IEJ1ZmZlcihkYXRhTGVuKTtcclxuICAgICAgLy8gTWVyZ2UgdGhlIGNodW5rcyBpbnRvIG9uZSBidWZmZXJcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxuID0gYnVmZmVyRGF0YS5sZW5ndGgsIHBvcyA9IDA7IGkgPCBsbjsgaSsrKSB7XHJcbiAgICAgICAgYnVmZmVyRGF0YVtpXS5jb3B5KHJlc3VsdCwgcG9zKTtcclxuICAgICAgICBwb3MgKz0gYnVmZmVyRGF0YVtpXS5sZW5ndGg7XHJcbiAgICAgICAgZGVsZXRlIGJ1ZmZlckRhdGFbaV07XHJcbiAgICAgIH1cclxuICAgICAgLy8gQ2hlY2sgaWYgd2UgY291bGQgYmUgZGVhbGluZyB3aXRoIGpzb25cclxuICAgICAgaWYgKHJlc3VsdFswXSA9PSAweDdiICYmIHJlc3VsdFsxXSA9PT0gMHgyMikge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAvLyBDb252ZXJ0IHRoZSBib2R5IGludG8ganNvbiBhbmQgZXh0cmFjdCB0aGUgZGF0YSBvYmplY3RcclxuICAgICAgICAgIHJlc3VsdCA9IEVKU09OLnBhcnNlKHJlc3VsdC50b1N0cmluZygpKTtcclxuICAgICAgICB9IGNhdGNoKGVycikge1xyXG4gICAgICAgICAgLy8gQ291bGQgbm90IHBhcnNlIHNvIHdlIHJldHVybiB0aGUgcmF3IGRhdGFcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gLy8gRWxzZSByZXN1bHQgd2lsbCBiZSB1bmRlZmluZWRcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjYWxsYmFjayhyZXN1bHQpO1xyXG4gICAgfSBjYXRjaChlcnIpIHtcclxuICAgICAgc2VuZEVycm9yKHJlcywgNTAwLCAnRXJyb3IgaW4gcmVxdWVzdEhhbmRsZXIgY2FsbGJhY2ssIEVycm9yOiAnICsgKGVyci5zdGFjayB8fCBlcnIubWVzc2FnZSkgKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbn07XHJcblxyXG4vLyBUaGlzIGlzIHRoZSBzaW1wbGVzdCBoYW5kbGVyIC0gaXQgc2ltcGx5IHBhc3NlcyByZXEgc3RyZWFtIGFzIGRhdGEgdG8gdGhlXHJcbi8vIG1ldGhvZFxyXG52YXIgc3RyZWFtSGFuZGxlciA9IGZ1bmN0aW9uKHJlcSwgcmVzLCBjYWxsYmFjaykge1xyXG4gIHRyeSB7XHJcbiAgICBjYWxsYmFjaygpO1xyXG4gIH0gY2F0Y2goZXJyKSB7XHJcbiAgICBzZW5kRXJyb3IocmVzLCA1MDAsICdFcnJvciBpbiByZXF1ZXN0SGFuZGxlciBjYWxsYmFjaywgRXJyb3I6ICcgKyAoZXJyLnN0YWNrIHx8IGVyci5tZXNzYWdlKSApO1xyXG4gIH1cclxufTtcclxuXHJcbi8qXHJcbiAgQWxsb3cgZmlsZSB1cGxvYWRzIGluIGNvcmRvdmEgY2ZzXHJcbiovXHJcbnZhciBzZXRDb3Jkb3ZhSGVhZGVycyA9IGZ1bmN0aW9uKHJlcXVlc3QsIHJlc3BvbnNlKSB7XHJcbiAgdmFyIG9yaWdpbiA9IHJlcXVlc3QuaGVhZGVycy5vcmlnaW47XHJcbiAgLy8gTWF0Y2ggaHR0cDovL2xvY2FsaG9zdDo8cG9ydD4gZm9yIENvcmRvdmEgY2xpZW50cyBpbiBNZXRlb3IgMS4zXHJcbiAgLy8gYW5kIGh0dHA6Ly9tZXRlb3IubG9jYWwgZm9yIGVhcmxpZXIgdmVyc2lvbnNcclxuICBpZiAob3JpZ2luICYmIChvcmlnaW4gPT09ICdodHRwOi8vbWV0ZW9yLmxvY2FsJyB8fCAvXmh0dHA6XFwvXFwvbG9jYWxob3N0Ly50ZXN0KG9yaWdpbikpKSB7XHJcbiAgICAvLyBXZSBuZWVkIHRvIGVjaG8gdGhlIG9yaWdpbiBwcm92aWRlZCBpbiB0aGUgcmVxdWVzdFxyXG4gICAgcmVzcG9uc2Uuc2V0SGVhZGVyKFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luXCIsIG9yaWdpbik7XHJcblxyXG4gICAgcmVzcG9uc2Uuc2V0SGVhZGVyKFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kc1wiLCBcIlBVVFwiKTtcclxuICAgIHJlc3BvbnNlLnNldEhlYWRlcihcIkFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnNcIiwgXCJDb250ZW50LVR5cGVcIik7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gSGFuZGxlIHRoZSBhY3R1YWwgY29ubmVjdGlvblxyXG5XZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xyXG5cclxuICAvLyBDaGVjayB0byBzZSBpZiB0aGlzIGlzIGEgaHR0cCBtZXRob2QgY2FsbFxyXG4gIHZhciBtZXRob2QgPSBfbWV0aG9kSFRUUC5nZXRNZXRob2QocmVxLl9wYXJzZWRVcmwucGF0aG5hbWUpO1xyXG5cclxuICAvLyBJZiBtZXRob2QgaXMgbnVsbCB0aGVuIGl0IHdhc24ndCBhbmQgd2UgcGFzcyB0aGUgcmVxdWVzdCBhbG9uZ1xyXG4gIGlmIChtZXRob2QgPT09IG51bGwpIHtcclxuICAgIHJldHVybiBuZXh0KCk7XHJcbiAgfVxyXG5cclxuICB2YXIgZGF0YUhhbmRsZSA9IChtZXRob2QuaGFuZGxlICYmIG1ldGhvZC5oYW5kbGUuc3RyZWFtKT9zdHJlYW1IYW5kbGVyOnJlcXVlc3RIYW5kbGVyO1xyXG5cclxuICBkYXRhSGFuZGxlKHJlcSwgcmVzLCBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAvLyBJZiBtZXRob2RzSGFuZGxlciBub3QgZm91bmQgb3Igc29tZWhvdyB0aGUgbWV0aG9kc2hhbmRsZXIgaXMgbm90IGFcclxuICAgIC8vIGZ1bmN0aW9uIHRoZW4gcmV0dXJuIGEgNDA0XHJcbiAgICBpZiAodHlwZW9mIG1ldGhvZC5oYW5kbGUgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIHNlbmRFcnJvcihyZXMsIDQwNCwgJ0Vycm9yIEhUVFAgbWV0aG9kIGhhbmRsZXIgXCInICsgbWV0aG9kLm5hbWUgKyAnXCIgaXMgbm90IGZvdW5kJyk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBTZXQgQ09SUyBoZWFkZXJzIGZvciBNZXRlb3IgQ29yZG92YSBjbGllbnRzXHJcbiAgICBzZXRDb3Jkb3ZhSGVhZGVycyhyZXEsIHJlcyk7XHJcblxyXG4gICAgLy8gU2V0IGZpYmVyIHNjb3BlXHJcbiAgICB2YXIgZmliZXJTY29wZSA9IHtcclxuICAgICAgLy8gUG9pbnRlcnMgdG8gUmVxdWVzdCAvIFJlc3BvbnNlXHJcbiAgICAgIHJlcTogcmVxLFxyXG4gICAgICByZXM6IHJlcyxcclxuICAgICAgLy8gUmVxdWVzdCAvIFJlc3BvbnNlIGhlbHBlcnNcclxuICAgICAgc3RhdHVzQ29kZTogMjAwLFxyXG4gICAgICBtZXRob2Q6IHJlcS5tZXRob2QsXHJcbiAgICAgIC8vIEhlYWRlcnMgZm9yIHJlc3BvbnNlXHJcbiAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAnQ29udGVudC1UeXBlJzogJ3RleHQvaHRtbCcgIC8vIFNldCBkZWZhdWx0IHR5cGVcclxuICAgICAgfSxcclxuICAgICAgLy8gQXJndW1lbnRzXHJcbiAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgIHF1ZXJ5OiByZXEucXVlcnksXHJcbiAgICAgIHBhcmFtczogbWV0aG9kLnBhcmFtcyxcclxuICAgICAgLy8gTWV0aG9kIHJlZmVyZW5jZVxyXG4gICAgICByZWZlcmVuY2U6IG1ldGhvZC5uYW1lLFxyXG4gICAgICBtZXRob2RPYmplY3Q6IG1ldGhvZC5oYW5kbGUsXHJcbiAgICAgIF9zdHJlYW1zV2FpdGluZzogMFxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIZWxwZXIgZnVuY3Rpb25zIHRoaXMgc2NvcGVcclxuICAgIEZpYmVyID0gcmVxdWlyZSgnZmliZXJzJyk7XHJcbiAgICBydW5TZXJ2ZXJNZXRob2QgPSBGaWJlcihmdW5jdGlvbihzZWxmKSB7XHJcbiAgICAgIHZhciByZXN1bHQsIHJlc3VsdEJ1ZmZlcjtcclxuXHJcbiAgICAgIC8vIFdlIGZldGNoIG1ldGhvZHMgZGF0YSBmcm9tIG1ldGhvZHNIYW5kbGVyLCB0aGUgaGFuZGxlciB1c2VzIHRoZSB0aGlzLmFkZEl0ZW0oKVxyXG4gICAgICAvLyBmdW5jdGlvbiB0byBwb3B1bGF0ZSB0aGUgbWV0aG9kcywgdGhpcyB3YXkgd2UgaGF2ZSBiZXR0ZXIgY2hlY2sgY29udHJvbCBhbmRcclxuICAgICAgLy8gYmV0dGVyIGVycm9yIGhhbmRsaW5nICsgbWVzc2FnZXNcclxuXHJcbiAgICAgIC8vIFRoZSBzY29wZSBmb3IgdGhlIHVzZXIgbWV0aG9kT2JqZWN0IGNhbGxiYWNrc1xyXG4gICAgICB2YXIgdGhpc1Njb3BlID0ge1xyXG4gICAgICAgIC8vIFRoZSB1c2VyIHdob3MgaWQgYW5kIHRva2VuIHdhcyB1c2VkIHRvIHJ1biB0aGlzIG1ldGhvZCwgaWYgc2V0L2ZvdW5kXHJcbiAgICAgICAgdXNlcklkOiBudWxsLFxyXG4gICAgICAgIC8vIFRoZSBpZCBvZiB0aGUgZGF0YVxyXG4gICAgICAgIF9pZDogbnVsbCxcclxuICAgICAgICAvLyBTZXQgdGhlIHF1ZXJ5IHBhcmFtcyA/dG9rZW49MSZpZD0yIC0+IHsgdG9rZW46IDEsIGlkOiAyIH1cclxuICAgICAgICBxdWVyeTogc2VsZi5xdWVyeSxcclxuICAgICAgICAvLyBTZXQgcGFyYW1zIC9mb28vOm5hbWUvdGVzdC86aWQgLT4geyBuYW1lOiAnJywgaWQ6ICcnIH1cclxuICAgICAgICBwYXJhbXM6IHNlbGYucGFyYW1zLFxyXG4gICAgICAgIC8vIE1ldGhvZCBHRVQsIFBVVCwgUE9TVCwgREVMRVRFLCBIRUFEXHJcbiAgICAgICAgbWV0aG9kOiBzZWxmLm1ldGhvZCxcclxuICAgICAgICAvLyBVc2VyIGFnZW50XHJcbiAgICAgICAgdXNlckFnZW50OiByZXEuaGVhZGVyc1sndXNlci1hZ2VudCddLFxyXG4gICAgICAgIC8vIEFsbCByZXF1ZXN0IGhlYWRlcnNcclxuICAgICAgICByZXF1ZXN0SGVhZGVyczogcmVxLmhlYWRlcnMsXHJcbiAgICAgICAgLy8gQWRkIHRoZSByZXF1ZXN0IG9iamVjdCBpdCBzZWxmXHJcbiAgICAgICAgcmVxdWVzdDogcmVxLFxyXG4gICAgICAgIC8vIFNldCB0aGUgdXNlcklkXHJcbiAgICAgICAgc2V0VXNlcklkOiBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgICAgdGhpcy51c2VySWQgPSBpZDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIFdlIGRvbnQgc2ltdWxhdGUgLyBydW4gdGhpcyBvbiB0aGUgY2xpZW50IGF0IHRoZSBtb21lbnRcclxuICAgICAgICBpc1NpbXVsYXRpb246IGZhbHNlLFxyXG4gICAgICAgIC8vIFJ1biB0aGUgbmV4dCBtZXRob2QgaW4gYSBuZXcgZmliZXIgLSBUaGlzIGlzIGRlZmF1bHQgYXQgdGhlIG1vbWVudFxyXG4gICAgICAgIHVuYmxvY2s6IGZ1bmN0aW9uKCkge30sXHJcbiAgICAgICAgLy8gU2V0IHRoZSBjb250ZW50IHR5cGUgaW4gaGVhZGVyLCBkZWZhdWx0cyB0byB0ZXh0L2h0bWw/XHJcbiAgICAgICAgc2V0Q29udGVudFR5cGU6IGZ1bmN0aW9uKHR5cGUpIHtcclxuICAgICAgICAgIHNlbGYuaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSB0eXBlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0U3RhdHVzQ29kZTogZnVuY3Rpb24oY29kZSkge1xyXG4gICAgICAgICAgc2VsZi5zdGF0dXNDb2RlID0gY29kZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFkZEhlYWRlcjogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgc2VsZi5oZWFkZXJzW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNyZWF0ZVJlYWRTdHJlYW06IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgc2VsZi5fc3RyZWFtc1dhaXRpbmcrKztcclxuICAgICAgICAgIHJldHVybiByZXE7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjcmVhdGVXcml0ZVN0cmVhbTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBzZWxmLl9zdHJlYW1zV2FpdGluZysrO1xyXG4gICAgICAgICAgcmV0dXJuIHJlcztcclxuICAgICAgICB9LFxyXG4gICAgICAgIEVycm9yOiBmdW5jdGlvbihlcnIpIHtcclxuXHJcbiAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgTWV0ZW9yLkVycm9yKSB7XHJcbiAgICAgICAgICAgIC8vIFJldHVybiBjb250cm9sbGVkIGVycm9yXHJcbiAgICAgICAgICAgIHNlbmRFcnJvcihyZXMsIGVyci5lcnJvciwgZXJyLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChlcnIgaW5zdGFuY2VvZiBFcnJvcikge1xyXG4gICAgICAgICAgICAvLyBSZXR1cm4gZXJyb3IgdHJhY2UgLSB0aGlzIGlzIG5vdCBpbnRlbnRlZFxyXG4gICAgICAgICAgICBzZW5kRXJyb3IocmVzLCA1MDMsICdFcnJvciBpbiBtZXRob2QgXCInICsgc2VsZi5yZWZlcmVuY2UgKyAnXCIsIEVycm9yOiAnICsgKGVyci5zdGFjayB8fCBlcnIubWVzc2FnZSkgKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNlbmRFcnJvcihyZXMsIDUwMywgJ0Vycm9yIGluIG1ldGhvZCBcIicgKyBzZWxmLnJlZmVyZW5jZSArICdcIicgKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBnZXREYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyAgIC8vIFhYWDogVE9ETyBpZiB3ZSBjb3VsZCBydW4gdGhlIHJlcXVlc3QgaGFuZGxlciBzdHVmZiBlZy5cclxuICAgICAgICAvLyAgIC8vIGluIGhlcmUgaW4gYSBmaWJlciBzeW5jIGl0IGNvdWxkIGJlIGNvb2wgLSBhbmQgdGhlIHVzZXIgZGlkXHJcbiAgICAgICAgLy8gICAvLyBub3QgaGF2ZSB0byBzcGVjaWZ5IHRoZSBzdHJlYW09dHJ1ZSBmbGFnP1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIFRoaXMgZnVuY3Rpb24gc2VuZHMgdGhlIGZpbmFsIHJlc3BvbnNlLiBEZXBlbmRpbmcgb24gdGhlXHJcbiAgICAgIC8vIHRpbWluZyBvZiB0aGUgc3RyZWFtaW5nLCB3ZSBtaWdodCBoYXZlIHRvIHdhaXQgZm9yIGFsbFxyXG4gICAgICAvLyBzdHJlYW1pbmcgdG8gZW5kLCBvciB3ZSBtaWdodCBoYXZlIHRvIHdhaXQgZm9yIHRoaXMgZnVuY3Rpb25cclxuICAgICAgLy8gdG8gZmluaXNoIGFmdGVyIHN0cmVhbWluZyBlbmRzLiBUaGUgY2hlY2tzIGluIHRoaXMgZnVuY3Rpb25cclxuICAgICAgLy8gYW5kIHRoZSBmYWN0IHRoYXQgd2UgY2FsbCBpdCB0d2ljZSBlbnN1cmUgdGhhdCB3ZSB3aWxsIGFsd2F5c1xyXG4gICAgICAvLyBzZW5kIHRoZSByZXNwb25zZSBpZiB3ZSBoYXZlbid0IHNlbnQgYW4gZXJyb3IgcmVzcG9uc2UsIGJ1dFxyXG4gICAgICAvLyB3ZSB3aWxsIG5vdCBzZW5kIGl0IHRvbyBlYXJseS5cclxuICAgICAgZnVuY3Rpb24gc2VuZFJlc3BvbnNlSWZEb25lKCkge1xyXG4gICAgICAgIHJlcy5zdGF0dXNDb2RlID0gc2VsZi5zdGF0dXNDb2RlO1xyXG4gICAgICAgIC8vIElmIG5vIHN0cmVhbXMgYXJlIHdhaXRpbmdcclxuICAgICAgICBpZiAoc2VsZi5fc3RyZWFtc1dhaXRpbmcgPT09IDAgJiZcclxuICAgICAgICAgICAgKHNlbGYuc3RhdHVzQ29kZSA9PT0gMjAwIHx8IHNlbGYuc3RhdHVzQ29kZSA9PT0gMjA2KSAmJlxyXG4gICAgICAgICAgICBzZWxmLmRvbmUgJiZcclxuICAgICAgICAgICAgIXNlbGYuX3Jlc3BvbnNlU2VudCAmJlxyXG4gICAgICAgICAgICAhcmVzLmZpbmlzaGVkKSB7XHJcbiAgICAgICAgICBzZWxmLl9yZXNwb25zZVNlbnQgPSB0cnVlO1xyXG4gICAgICAgICAgcmVzLmVuZChyZXN1bHRCdWZmZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIG1ldGhvZENhbGwgPSBzZWxmLm1ldGhvZE9iamVjdFtzZWxmLm1ldGhvZF07XHJcblxyXG4gICAgICAvLyBJZiB0aGUgbWV0aG9kIGNhbGwgaXMgc2V0IGZvciB0aGUgUE9TVC9QVVQvR0VUIG9yIERFTEVURSB0aGVuIHJ1biB0aGVcclxuICAgICAgLy8gcmVzcGVjdGl2ZSBtZXRob2RDYWxsIGlmIGl0cyBhIGZ1bmN0aW9uXHJcbiAgICAgIGlmICh0eXBlb2YgbWV0aG9kQ2FsbCA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIHVzZXJJZCAtIFRoaXMgaXMgZWl0aGVyIHNldCBhcyBhIG1ldGhvZCBzcGVjaWZpYyBoYW5kbGVyIGFuZFxyXG4gICAgICAgIC8vIHdpbGwgYWxsd2F5cyBkZWZhdWx0IGJhY2sgdG8gdGhlIGJ1aWx0aW4gZ2V0VXNlcklkIGhhbmRsZXJcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgLy8gVHJ5IHRvIHNldCB0aGUgdXNlcklkXHJcbiAgICAgICAgICB0aGlzU2NvcGUudXNlcklkID0gc2VsZi5tZXRob2RPYmplY3QuYXV0aC5hcHBseShzZWxmKTtcclxuICAgICAgICB9IGNhdGNoKGVycikge1xyXG4gICAgICAgICAgc2VuZEVycm9yKHJlcywgZXJyLmVycm9yLCAoZXJyLm1lc3NhZ2UgfHwgZXJyLnN0YWNrKSk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUaGlzIG11c3QgYmUgYXR0YWNoZWQgYmVmb3JlIHRoZXJlJ3MgYW55IGNoYW5jZSBvZiBgY3JlYXRlUmVhZFN0cmVhbWBcclxuICAgICAgICAvLyBvciBgY3JlYXRlV3JpdGVTdHJlYW1gIGJlaW5nIGNhbGxlZCwgd2hpY2ggbWVhbnMgYmVmb3JlIHdlIGRvXHJcbiAgICAgICAgLy8gYG1ldGhvZENhbGwuYXBwbHlgIGJlbG93LlxyXG4gICAgICAgIHJlcS5vbignZW5kJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBzZWxmLl9zdHJlYW1zV2FpdGluZy0tO1xyXG4gICAgICAgICAgc2VuZFJlc3BvbnNlSWZEb25lKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEdldCB0aGUgcmVzdWx0IG9mIHRoZSBtZXRob2RDYWxsXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIGlmIChzZWxmLm1ldGhvZCA9PT0gJ09QVElPTlMnKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IG1ldGhvZENhbGwuYXBwbHkodGhpc1Njb3BlLCBbc2VsZi5tZXRob2RPYmplY3RdKSB8fCAnJztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IG1ldGhvZENhbGwuYXBwbHkodGhpc1Njb3BlLCBbc2VsZi5kYXRhXSkgfHwgJyc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaChlcnIpIHtcclxuICAgICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBNZXRlb3IuRXJyb3IpIHtcclxuICAgICAgICAgICAgLy8gUmV0dXJuIGNvbnRyb2xsZWQgZXJyb3JcclxuICAgICAgICAgICAgc2VuZEVycm9yKHJlcywgZXJyLmVycm9yLCBlcnIubWVzc2FnZSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBSZXR1cm4gZXJyb3IgdHJhY2UgLSB0aGlzIGlzIG5vdCBpbnRlbnRlZFxyXG4gICAgICAgICAgICBzZW5kRXJyb3IocmVzLCA1MDMsICdFcnJvciBpbiBtZXRob2QgXCInICsgc2VsZi5yZWZlcmVuY2UgKyAnXCIsIEVycm9yOiAnICsgKGVyci5zdGFjayB8fCBlcnIubWVzc2FnZSkgKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNldCBoZWFkZXJzXHJcbiAgICAgICAgXy5lYWNoKHNlbGYuaGVhZGVycywgZnVuY3Rpb24odmFsdWUsIGtleSkge1xyXG4gICAgICAgICAgLy8gSWYgdmFsdWUgaXMgZGVmaW5lZCB0aGVuIHNldCB0aGUgaGVhZGVyLCB0aGlzIGFsbG93cyBmb3IgdW5zZXR0aW5nXHJcbiAgICAgICAgICAvLyB0aGUgZGVmYXVsdCBjb250ZW50LXR5cGVcclxuICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICByZXMuc2V0SGVhZGVyKGtleSwgdmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBJZiBPSyAvIDIwMCB0aGVuIFJldHVybiB0aGUgcmVzdWx0XHJcbiAgICAgICAgaWYgKHNlbGYuc3RhdHVzQ29kZSA9PT0gMjAwIHx8IHNlbGYuc3RhdHVzQ29kZSA9PT0gMjA2KSB7XHJcblxyXG4gICAgICAgICAgaWYgKHNlbGYubWV0aG9kICE9PSBcIkhFQURcIikge1xyXG4gICAgICAgICAgICAvLyBSZXR1cm4gcmVzdWx0XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgIHJlc3VsdEJ1ZmZlciA9IG5ldyBCdWZmZXIocmVzdWx0KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICByZXN1bHRCdWZmZXIgPSBuZXcgQnVmZmVyKEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVjayBpZiB1c2VyIHdhbnRzIHRvIG92ZXJ3cml0ZSBjb250ZW50IGxlbmd0aCBmb3Igc29tZSByZWFzb24/XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc2VsZi5oZWFkZXJzWydDb250ZW50LUxlbmd0aCddID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgIHNlbGYuaGVhZGVyc1snQ29udGVudC1MZW5ndGgnXSA9IHJlc3VsdEJ1ZmZlci5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgc2VsZi5kb25lID0gdHJ1ZTtcclxuICAgICAgICAgIHNlbmRSZXNwb25zZUlmRG9uZSgpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy8gQWxsb3cgdXNlciB0byBhbHRlciB0aGUgc3RhdHVzIGNvZGUgYW5kIHNlbmQgYSBtZXNzYWdlXHJcbiAgICAgICAgICBzZW5kRXJyb3IocmVzLCBzZWxmLnN0YXR1c0NvZGUsIHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzZW5kRXJyb3IocmVzLCA0MDQsICdTZXJ2aWNlIG5vdCBmb3VuZCcpO1xyXG4gICAgICB9XHJcblxyXG5cclxuICAgIH0pO1xyXG4gICAgLy8gUnVuIGh0dHAgbWV0aG9kcyBoYW5kbGVyXHJcbiAgICB0cnkge1xyXG4gICAgICBydW5TZXJ2ZXJNZXRob2QucnVuKGZpYmVyU2NvcGUpO1xyXG4gICAgfSBjYXRjaChlcnIpIHtcclxuICAgICAgc2VuZEVycm9yKHJlcywgNTAwLCAnRXJyb3IgcnVubmluZyB0aGUgc2VydmVyIGh0dHAgbWV0aG9kIGhhbmRsZXIsIEVycm9yOiAnICsgKGVyci5zdGFjayB8fCBlcnIubWVzc2FnZSkpO1xyXG4gICAgfVxyXG5cclxuICB9KTsgLy8gRU8gUmVxdWVzdCBoYW5kbGVyXHJcblxyXG5cclxufSk7XHJcbiJdfQ==
