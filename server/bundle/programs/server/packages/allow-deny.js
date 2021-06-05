(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var check = Package.check.check;
var Match = Package.check.Match;
var EJSON = Package.ejson.EJSON;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var AllowDeny;

var require = meteorInstall({"node_modules":{"meteor":{"allow-deny":{"allow-deny.js":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/allow-deny/allow-deny.js                                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
///
/// Remote methods and access control.
///
const hasOwn = Object.prototype.hasOwnProperty; // Restrict default mutators on collection. allow() and deny() take the
// same options:
//
// options.insert {Function(userId, doc)}
//   return true to allow/deny adding this document
//
// options.update {Function(userId, docs, fields, modifier)}
//   return true to allow/deny updating these documents.
//   `fields` is passed as an array of fields that are to be modified
//
// options.remove {Function(userId, docs)}
//   return true to allow/deny removing these documents
//
// options.fetch {Array}
//   Fields to fetch for these validators. If any call to allow or deny
//   does not have this option then all fields are loaded.
//
// allow and deny can be called multiple times. The validators are
// evaluated as follows:
// - If neither deny() nor allow() has been called on the collection,
//   then the request is allowed if and only if the "insecure" smart
//   package is in use.
// - Otherwise, if any deny() function returns true, the request is denied.
// - Otherwise, if any allow() function returns true, the request is allowed.
// - Otherwise, the request is denied.
//
// Meteor may call your deny() and allow() functions in any order, and may not
// call all of them if it is able to make a decision without calling them all
// (so don't include side effects).

AllowDeny = {
  CollectionPrototype: {}
}; // In the `mongo` package, we will extend Mongo.Collection.prototype with these
// methods

const CollectionPrototype = AllowDeny.CollectionPrototype;
/**
 * @summary Allow users to write directly to this collection from client code, subject to limitations you define.
 * @locus Server
 * @method allow
 * @memberOf Mongo.Collection
 * @instance
 * @param {Object} options
 * @param {Function} options.insert,update,remove Functions that look at a proposed modification to the database and return true if it should be allowed.
 * @param {String[]} options.fetch Optional performance enhancement. Limits the fields that will be fetched from the database for inspection by your `update` and `remove` functions.
 * @param {Function} options.transform Overrides `transform` on the  [`Collection`](#collections).  Pass `null` to disable transformation.
 */

CollectionPrototype.allow = function (options) {
  addValidator(this, 'allow', options);
};
/**
 * @summary Override `allow` rules.
 * @locus Server
 * @method deny
 * @memberOf Mongo.Collection
 * @instance
 * @param {Object} options
 * @param {Function} options.insert,update,remove Functions that look at a proposed modification to the database and return true if it should be denied, even if an [allow](#allow) rule says otherwise.
 * @param {String[]} options.fetch Optional performance enhancement. Limits the fields that will be fetched from the database for inspection by your `update` and `remove` functions.
 * @param {Function} options.transform Overrides `transform` on the  [`Collection`](#collections).  Pass `null` to disable transformation.
 */


CollectionPrototype.deny = function (options) {
  addValidator(this, 'deny', options);
};

CollectionPrototype._defineMutationMethods = function (options) {
  const self = this;
  options = options || {}; // set to true once we call any allow or deny methods. If true, use
  // allow/deny semantics. If false, use insecure mode semantics.

  self._restricted = false; // Insecure mode (default to allowing writes). Defaults to 'undefined' which
  // means insecure iff the insecure package is loaded. This property can be
  // overriden by tests or packages wishing to change insecure mode behavior of
  // their collections.

  self._insecure = undefined;
  self._validators = {
    insert: {
      allow: [],
      deny: []
    },
    update: {
      allow: [],
      deny: []
    },
    remove: {
      allow: [],
      deny: []
    },
    upsert: {
      allow: [],
      deny: []
    },
    // dummy arrays; can't set these!
    fetch: [],
    fetchAllFields: false
  };
  if (!self._name) return; // anonymous collection
  // XXX Think about method namespacing. Maybe methods should be
  // "Meteor:Mongo:insert/NAME"?

  self._prefix = '/' + self._name + '/'; // Mutation Methods
  // Minimongo on the server gets no stubs; instead, by default
  // it wait()s until its result is ready, yielding.
  // This matches the behavior of macromongo on the server better.
  // XXX see #MeteorServerNull

  if (self._connection && (self._connection === Meteor.server || Meteor.isClient)) {
    const m = {};
    ['insert', 'update', 'remove'].forEach(method => {
      const methodName = self._prefix + method;

      if (options.useExisting) {
        const handlerPropName = Meteor.isClient ? '_methodHandlers' : 'method_handlers'; // Do not try to create additional methods if this has already been called.
        // (Otherwise the .methods() call below will throw an error.)

        if (self._connection[handlerPropName] && typeof self._connection[handlerPropName][methodName] === 'function') return;
      }

      m[methodName] = function ()
      /* ... */
      {
        // All the methods do their own validation, instead of using check().
        check(arguments, [Match.Any]);
        const args = Array.from(arguments);

        try {
          // For an insert, if the client didn't specify an _id, generate one
          // now; because this uses DDP.randomStream, it will be consistent with
          // what the client generated. We generate it now rather than later so
          // that if (eg) an allow/deny rule does an insert to the same
          // collection (not that it really should), the generated _id will
          // still be the first use of the stream and will be consistent.
          //
          // However, we don't actually stick the _id onto the document yet,
          // because we want allow/deny rules to be able to differentiate
          // between arbitrary client-specified _id fields and merely
          // client-controlled-via-randomSeed fields.
          let generatedId = null;

          if (method === "insert" && !hasOwn.call(args[0], '_id')) {
            generatedId = self._makeNewID();
          }

          if (this.isSimulation) {
            // In a client simulation, you can do any mutation (even with a
            // complex selector).
            if (generatedId !== null) args[0]._id = generatedId;
            return self._collection[method].apply(self._collection, args);
          } // This is the server receiving a method call from the client.
          // We don't allow arbitrary selectors in mutations from the client: only
          // single-ID selectors.


          if (method !== 'insert') throwIfSelectorIsNotId(args[0], method);

          if (self._restricted) {
            // short circuit if there is no way it will pass.
            if (self._validators[method].allow.length === 0) {
              throw new Meteor.Error(403, "Access denied. No allow validators set on restricted " + "collection for method '" + method + "'.");
            }

            const validatedMethodName = '_validated' + method.charAt(0).toUpperCase() + method.slice(1);
            args.unshift(this.userId);
            method === 'insert' && args.push(generatedId);
            return self[validatedMethodName].apply(self, args);
          } else if (self._isInsecure()) {
            if (generatedId !== null) args[0]._id = generatedId; // In insecure mode, allow any mutation (with a simple selector).
            // XXX This is kind of bogus.  Instead of blindly passing whatever
            //     we get from the network to this function, we should actually
            //     know the correct arguments for the function and pass just
            //     them.  For example, if you have an extraneous extra null
            //     argument and this is Mongo on the server, the .wrapAsync'd
            //     functions like update will get confused and pass the
            //     "fut.resolver()" in the wrong slot, where _update will never
            //     invoke it. Bam, broken DDP connection.  Probably should just
            //     take this whole method and write it three times, invoking
            //     helpers for the common code.

            return self._collection[method].apply(self._collection, args);
          } else {
            // In secure mode, if we haven't called allow or deny, then nothing
            // is permitted.
            throw new Meteor.Error(403, "Access denied");
          }
        } catch (e) {
          if (e.name === 'MongoError' || e.name === 'MinimongoError') {
            throw new Meteor.Error(409, e.toString());
          } else {
            throw e;
          }
        }
      };
    });

    self._connection.methods(m);
  }
};

CollectionPrototype._updateFetch = function (fields) {
  const self = this;

  if (!self._validators.fetchAllFields) {
    if (fields) {
      const union = Object.create(null);

      const add = names => names && names.forEach(name => union[name] = 1);

      add(self._validators.fetch);
      add(fields);
      self._validators.fetch = Object.keys(union);
    } else {
      self._validators.fetchAllFields = true; // clear fetch just to make sure we don't accidentally read it

      self._validators.fetch = null;
    }
  }
};

CollectionPrototype._isInsecure = function () {
  const self = this;
  if (self._insecure === undefined) return !!Package.insecure;
  return self._insecure;
};

CollectionPrototype._validatedInsert = function (userId, doc, generatedId) {
  const self = this; // call user validators.
  // Any deny returns true means denied.

  if (self._validators.insert.deny.some(validator => {
    return validator(userId, docToValidate(validator, doc, generatedId));
  })) {
    throw new Meteor.Error(403, "Access denied");
  } // Any allow returns true means proceed. Throw error if they all fail.


  if (self._validators.insert.allow.every(validator => {
    return !validator(userId, docToValidate(validator, doc, generatedId));
  })) {
    throw new Meteor.Error(403, "Access denied");
  } // If we generated an ID above, insert it now: after the validation, but
  // before actually inserting.


  if (generatedId !== null) doc._id = generatedId;

  self._collection.insert.call(self._collection, doc);
}; // Simulate a mongo `update` operation while validating that the access
// control rules set by calls to `allow/deny` are satisfied. If all
// pass, rewrite the mongo operation to use $in to set the list of
// document ids to change ##ValidatedChange


CollectionPrototype._validatedUpdate = function (userId, selector, mutator, options) {
  const self = this;
  check(mutator, Object);
  options = Object.assign(Object.create(null), options);
  if (!LocalCollection._selectorIsIdPerhapsAsObject(selector)) throw new Error("validated update should be of a single ID"); // We don't support upserts because they don't fit nicely into allow/deny
  // rules.

  if (options.upsert) throw new Meteor.Error(403, "Access denied. Upserts not " + "allowed in a restricted collection.");
  const noReplaceError = "Access denied. In a restricted collection you can only" + " update documents, not replace them. Use a Mongo update operator, such " + "as '$set'.";
  const mutatorKeys = Object.keys(mutator); // compute modified fields

  const modifiedFields = {};

  if (mutatorKeys.length === 0) {
    throw new Meteor.Error(403, noReplaceError);
  }

  mutatorKeys.forEach(op => {
    const params = mutator[op];

    if (op.charAt(0) !== '$') {
      throw new Meteor.Error(403, noReplaceError);
    } else if (!hasOwn.call(ALLOWED_UPDATE_OPERATIONS, op)) {
      throw new Meteor.Error(403, "Access denied. Operator " + op + " not allowed in a restricted collection.");
    } else {
      Object.keys(params).forEach(field => {
        // treat dotted fields as if they are replacing their
        // top-level part
        if (field.indexOf('.') !== -1) field = field.substring(0, field.indexOf('.')); // record the field we are trying to change

        modifiedFields[field] = true;
      });
    }
  });
  const fields = Object.keys(modifiedFields);
  const findOptions = {
    transform: null
  };

  if (!self._validators.fetchAllFields) {
    findOptions.fields = {};

    self._validators.fetch.forEach(fieldName => {
      findOptions.fields[fieldName] = 1;
    });
  }

  const doc = self._collection.findOne(selector, findOptions);

  if (!doc) // none satisfied!
    return 0; // call user validators.
  // Any deny returns true means denied.

  if (self._validators.update.deny.some(validator => {
    const factoriedDoc = transformDoc(validator, doc);
    return validator(userId, factoriedDoc, fields, mutator);
  })) {
    throw new Meteor.Error(403, "Access denied");
  } // Any allow returns true means proceed. Throw error if they all fail.


  if (self._validators.update.allow.every(validator => {
    const factoriedDoc = transformDoc(validator, doc);
    return !validator(userId, factoriedDoc, fields, mutator);
  })) {
    throw new Meteor.Error(403, "Access denied");
  }

  options._forbidReplace = true; // Back when we supported arbitrary client-provided selectors, we actually
  // rewrote the selector to include an _id clause before passing to Mongo to
  // avoid races, but since selector is guaranteed to already just be an ID, we
  // don't have to any more.

  return self._collection.update.call(self._collection, selector, mutator, options);
}; // Only allow these operations in validated updates. Specifically
// whitelist operations, rather than blacklist, so new complex
// operations that are added aren't automatically allowed. A complex
// operation is one that does more than just modify its target
// field. For now this contains all update operations except '$rename'.
// http://docs.mongodb.org/manual/reference/operators/#update


const ALLOWED_UPDATE_OPERATIONS = {
  $inc: 1,
  $set: 1,
  $unset: 1,
  $addToSet: 1,
  $pop: 1,
  $pullAll: 1,
  $pull: 1,
  $pushAll: 1,
  $push: 1,
  $bit: 1
}; // Simulate a mongo `remove` operation while validating access control
// rules. See #ValidatedChange

CollectionPrototype._validatedRemove = function (userId, selector) {
  const self = this;
  const findOptions = {
    transform: null
  };

  if (!self._validators.fetchAllFields) {
    findOptions.fields = {};

    self._validators.fetch.forEach(fieldName => {
      findOptions.fields[fieldName] = 1;
    });
  }

  const doc = self._collection.findOne(selector, findOptions);

  if (!doc) return 0; // call user validators.
  // Any deny returns true means denied.

  if (self._validators.remove.deny.some(validator => {
    return validator(userId, transformDoc(validator, doc));
  })) {
    throw new Meteor.Error(403, "Access denied");
  } // Any allow returns true means proceed. Throw error if they all fail.


  if (self._validators.remove.allow.every(validator => {
    return !validator(userId, transformDoc(validator, doc));
  })) {
    throw new Meteor.Error(403, "Access denied");
  } // Back when we supported arbitrary client-provided selectors, we actually
  // rewrote the selector to {_id: {$in: [ids that we found]}} before passing to
  // Mongo to avoid races, but since selector is guaranteed to already just be
  // an ID, we don't have to any more.


  return self._collection.remove.call(self._collection, selector);
};

CollectionPrototype._callMutatorMethod = function _callMutatorMethod(name, args, callback) {
  if (Meteor.isClient && !callback && !alreadyInSimulation()) {
    // Client can't block, so it can't report errors by exception,
    // only by callback. If they forget the callback, give them a
    // default one that logs the error, so they aren't totally
    // baffled if their writes don't work because their database is
    // down.
    // Don't give a default callback in simulation, because inside stubs we
    // want to return the results from the local collection immediately and
    // not force a callback.
    callback = function (err) {
      if (err) Meteor._debug(name + " failed: " + (err.reason || err.stack));
    };
  } // For two out of three mutator methods, the first argument is a selector


  const firstArgIsSelector = name === "update" || name === "remove";

  if (firstArgIsSelector && !alreadyInSimulation()) {
    // If we're about to actually send an RPC, we should throw an error if
    // this is a non-ID selector, because the mutation methods only allow
    // single-ID selectors. (If we don't throw here, we'll see flicker.)
    throwIfSelectorIsNotId(args[0], name);
  }

  const mutatorMethodName = this._prefix + name;
  return this._connection.apply(mutatorMethodName, args, {
    returnStubValue: true
  }, callback);
};

function transformDoc(validator, doc) {
  if (validator.transform) return validator.transform(doc);
  return doc;
}

function docToValidate(validator, doc, generatedId) {
  let ret = doc;

  if (validator.transform) {
    ret = EJSON.clone(doc); // If you set a server-side transform on your collection, then you don't get
    // to tell the difference between "client specified the ID" and "server
    // generated the ID", because transforms expect to get _id.  If you want to
    // do that check, you can do it with a specific
    // `C.allow({insert: f, transform: null})` validator.

    if (generatedId !== null) {
      ret._id = generatedId;
    }

    ret = validator.transform(ret);
  }

  return ret;
}

function addValidator(collection, allowOrDeny, options) {
  // validate keys
  const validKeysRegEx = /^(?:insert|update|remove|fetch|transform)$/;
  Object.keys(options).forEach(key => {
    if (!validKeysRegEx.test(key)) throw new Error(allowOrDeny + ": Invalid key: " + key);
  });
  collection._restricted = true;
  ['insert', 'update', 'remove'].forEach(name => {
    if (hasOwn.call(options, name)) {
      if (!(options[name] instanceof Function)) {
        throw new Error(allowOrDeny + ": Value for `" + name + "` must be a function");
      } // If the transform is specified at all (including as 'null') in this
      // call, then take that; otherwise, take the transform from the
      // collection.


      if (options.transform === undefined) {
        options[name].transform = collection._transform; // already wrapped
      } else {
        options[name].transform = LocalCollection.wrapTransform(options.transform);
      }

      collection._validators[name][allowOrDeny].push(options[name]);
    }
  }); // Only update the fetch fields if we're passed things that affect
  // fetching. This way allow({}) and allow({insert: f}) don't result in
  // setting fetchAllFields

  if (options.update || options.remove || options.fetch) {
    if (options.fetch && !(options.fetch instanceof Array)) {
      throw new Error(allowOrDeny + ": Value for `fetch` must be an array");
    }

    collection._updateFetch(options.fetch);
  }
}

function throwIfSelectorIsNotId(selector, methodName) {
  if (!LocalCollection._selectorIsIdPerhapsAsObject(selector)) {
    throw new Meteor.Error(403, "Not permitted. Untrusted code may only " + methodName + " documents by ID.");
  }
}

; // Determine if we are in a DDP method simulation

function alreadyInSimulation() {
  var CurrentInvocation = DDP._CurrentMethodInvocation || // For backwards compatibility, as explained in this issue:
  // https://github.com/meteor/meteor/issues/8947
  DDP._CurrentInvocation;
  const enclosing = CurrentInvocation.get();
  return enclosing && enclosing.isSimulation;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/allow-deny/allow-deny.js");

/* Exports */
Package._define("allow-deny", {
  AllowDeny: AllowDeny
});

})();

//# sourceURL=meteor://💻app/packages/allow-deny.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvYWxsb3ctZGVueS9hbGxvdy1kZW55LmpzIl0sIm5hbWVzIjpbImhhc093biIsIk9iamVjdCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiQWxsb3dEZW55IiwiQ29sbGVjdGlvblByb3RvdHlwZSIsImFsbG93Iiwib3B0aW9ucyIsImFkZFZhbGlkYXRvciIsImRlbnkiLCJfZGVmaW5lTXV0YXRpb25NZXRob2RzIiwic2VsZiIsIl9yZXN0cmljdGVkIiwiX2luc2VjdXJlIiwidW5kZWZpbmVkIiwiX3ZhbGlkYXRvcnMiLCJpbnNlcnQiLCJ1cGRhdGUiLCJyZW1vdmUiLCJ1cHNlcnQiLCJmZXRjaCIsImZldGNoQWxsRmllbGRzIiwiX25hbWUiLCJfcHJlZml4IiwiX2Nvbm5lY3Rpb24iLCJNZXRlb3IiLCJzZXJ2ZXIiLCJpc0NsaWVudCIsIm0iLCJmb3JFYWNoIiwibWV0aG9kIiwibWV0aG9kTmFtZSIsInVzZUV4aXN0aW5nIiwiaGFuZGxlclByb3BOYW1lIiwiY2hlY2siLCJhcmd1bWVudHMiLCJNYXRjaCIsIkFueSIsImFyZ3MiLCJBcnJheSIsImZyb20iLCJnZW5lcmF0ZWRJZCIsImNhbGwiLCJfbWFrZU5ld0lEIiwiaXNTaW11bGF0aW9uIiwiX2lkIiwiX2NvbGxlY3Rpb24iLCJhcHBseSIsInRocm93SWZTZWxlY3RvcklzTm90SWQiLCJsZW5ndGgiLCJFcnJvciIsInZhbGlkYXRlZE1ldGhvZE5hbWUiLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwidW5zaGlmdCIsInVzZXJJZCIsInB1c2giLCJfaXNJbnNlY3VyZSIsImUiLCJuYW1lIiwidG9TdHJpbmciLCJtZXRob2RzIiwiX3VwZGF0ZUZldGNoIiwiZmllbGRzIiwidW5pb24iLCJjcmVhdGUiLCJhZGQiLCJuYW1lcyIsImtleXMiLCJQYWNrYWdlIiwiaW5zZWN1cmUiLCJfdmFsaWRhdGVkSW5zZXJ0IiwiZG9jIiwic29tZSIsInZhbGlkYXRvciIsImRvY1RvVmFsaWRhdGUiLCJldmVyeSIsIl92YWxpZGF0ZWRVcGRhdGUiLCJzZWxlY3RvciIsIm11dGF0b3IiLCJhc3NpZ24iLCJMb2NhbENvbGxlY3Rpb24iLCJfc2VsZWN0b3JJc0lkUGVyaGFwc0FzT2JqZWN0Iiwibm9SZXBsYWNlRXJyb3IiLCJtdXRhdG9yS2V5cyIsIm1vZGlmaWVkRmllbGRzIiwib3AiLCJwYXJhbXMiLCJBTExPV0VEX1VQREFURV9PUEVSQVRJT05TIiwiZmllbGQiLCJpbmRleE9mIiwic3Vic3RyaW5nIiwiZmluZE9wdGlvbnMiLCJ0cmFuc2Zvcm0iLCJmaWVsZE5hbWUiLCJmaW5kT25lIiwiZmFjdG9yaWVkRG9jIiwidHJhbnNmb3JtRG9jIiwiX2ZvcmJpZFJlcGxhY2UiLCIkaW5jIiwiJHNldCIsIiR1bnNldCIsIiRhZGRUb1NldCIsIiRwb3AiLCIkcHVsbEFsbCIsIiRwdWxsIiwiJHB1c2hBbGwiLCIkcHVzaCIsIiRiaXQiLCJfdmFsaWRhdGVkUmVtb3ZlIiwiX2NhbGxNdXRhdG9yTWV0aG9kIiwiY2FsbGJhY2siLCJhbHJlYWR5SW5TaW11bGF0aW9uIiwiZXJyIiwiX2RlYnVnIiwicmVhc29uIiwic3RhY2siLCJmaXJzdEFyZ0lzU2VsZWN0b3IiLCJtdXRhdG9yTWV0aG9kTmFtZSIsInJldHVyblN0dWJWYWx1ZSIsInJldCIsIkVKU09OIiwiY2xvbmUiLCJjb2xsZWN0aW9uIiwiYWxsb3dPckRlbnkiLCJ2YWxpZEtleXNSZWdFeCIsImtleSIsInRlc3QiLCJGdW5jdGlvbiIsIl90cmFuc2Zvcm0iLCJ3cmFwVHJhbnNmb3JtIiwiQ3VycmVudEludm9jYXRpb24iLCJERFAiLCJfQ3VycmVudE1ldGhvZEludm9jYXRpb24iLCJfQ3VycmVudEludm9jYXRpb24iLCJlbmNsb3NpbmciLCJnZXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFFQSxNQUFNQSxNQUFNLEdBQUdDLE1BQU0sQ0FBQ0MsU0FB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ZSI6Ii9wYWNrYWdlcy9hbGxvdy1kZW55LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8vXG4vLy8gUmVtb3RlIG1ldGhvZHMgYW5kIGFjY2VzcyBjb250cm9sLlxuLy8vXG5cbmNvbnN0IGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbi8vIFJlc3RyaWN0IGRlZmF1bHQgbXV0YXRvcnMgb24gY29sbGVjdGlvbi4gYWxsb3coKSBhbmQgZGVueSgpIHRha2UgdGhlXG4vLyBzYW1lIG9wdGlvbnM6XG4vL1xuLy8gb3B0aW9ucy5pbnNlcnQge0Z1bmN0aW9uKHVzZXJJZCwgZG9jKX1cbi8vICAgcmV0dXJuIHRydWUgdG8gYWxsb3cvZGVueSBhZGRpbmcgdGhpcyBkb2N1bWVudFxuLy9cbi8vIG9wdGlvbnMudXBkYXRlIHtGdW5jdGlvbih1c2VySWQsIGRvY3MsIGZpZWxkcywgbW9kaWZpZXIpfVxuLy8gICByZXR1cm4gdHJ1ZSB0byBhbGxvdy9kZW55IHVwZGF0aW5nIHRoZXNlIGRvY3VtZW50cy5cbi8vICAgYGZpZWxkc2AgaXMgcGFzc2VkIGFzIGFuIGFycmF5IG9mIGZpZWxkcyB0aGF0IGFyZSB0byBiZSBtb2RpZmllZFxuLy9cbi8vIG9wdGlvbnMucmVtb3ZlIHtGdW5jdGlvbih1c2VySWQsIGRvY3MpfVxuLy8gICByZXR1cm4gdHJ1ZSB0byBhbGxvdy9kZW55IHJlbW92aW5nIHRoZXNlIGRvY3VtZW50c1xuLy9cbi8vIG9wdGlvbnMuZmV0Y2gge0FycmF5fVxuLy8gICBGaWVsZHMgdG8gZmV0Y2ggZm9yIHRoZXNlIHZhbGlkYXRvcnMuIElmIGFueSBjYWxsIHRvIGFsbG93IG9yIGRlbnlcbi8vICAgZG9lcyBub3QgaGF2ZSB0aGlzIG9wdGlvbiB0aGVuIGFsbCBmaWVsZHMgYXJlIGxvYWRlZC5cbi8vXG4vLyBhbGxvdyBhbmQgZGVueSBjYW4gYmUgY2FsbGVkIG11bHRpcGxlIHRpbWVzLiBUaGUgdmFsaWRhdG9ycyBhcmVcbi8vIGV2YWx1YXRlZCBhcyBmb2xsb3dzOlxuLy8gLSBJZiBuZWl0aGVyIGRlbnkoKSBub3IgYWxsb3coKSBoYXMgYmVlbiBjYWxsZWQgb24gdGhlIGNvbGxlY3Rpb24sXG4vLyAgIHRoZW4gdGhlIHJlcXVlc3QgaXMgYWxsb3dlZCBpZiBhbmQgb25seSBpZiB0aGUgXCJpbnNlY3VyZVwiIHNtYXJ0XG4vLyAgIHBhY2thZ2UgaXMgaW4gdXNlLlxuLy8gLSBPdGhlcndpc2UsIGlmIGFueSBkZW55KCkgZnVuY3Rpb24gcmV0dXJucyB0cnVlLCB0aGUgcmVxdWVzdCBpcyBkZW5pZWQuXG4vLyAtIE90aGVyd2lzZSwgaWYgYW55IGFsbG93KCkgZnVuY3Rpb24gcmV0dXJucyB0cnVlLCB0aGUgcmVxdWVzdCBpcyBhbGxvd2VkLlxuLy8gLSBPdGhlcndpc2UsIHRoZSByZXF1ZXN0IGlzIGRlbmllZC5cbi8vXG4vLyBNZXRlb3IgbWF5IGNhbGwgeW91ciBkZW55KCkgYW5kIGFsbG93KCkgZnVuY3Rpb25zIGluIGFueSBvcmRlciwgYW5kIG1heSBub3Rcbi8vIGNhbGwgYWxsIG9mIHRoZW0gaWYgaXQgaXMgYWJsZSB0byBtYWtlIGEgZGVjaXNpb24gd2l0aG91dCBjYWxsaW5nIHRoZW0gYWxsXG4vLyAoc28gZG9uJ3QgaW5jbHVkZSBzaWRlIGVmZmVjdHMpLlxuXG5BbGxvd0RlbnkgPSB7XG4gIENvbGxlY3Rpb25Qcm90b3R5cGU6IHt9XG59O1xuXG4vLyBJbiB0aGUgYG1vbmdvYCBwYWNrYWdlLCB3ZSB3aWxsIGV4dGVuZCBNb25nby5Db2xsZWN0aW9uLnByb3RvdHlwZSB3aXRoIHRoZXNlXG4vLyBtZXRob2RzXG5jb25zdCBDb2xsZWN0aW9uUHJvdG90eXBlID0gQWxsb3dEZW55LkNvbGxlY3Rpb25Qcm90b3R5cGU7XG5cbi8qKlxuICogQHN1bW1hcnkgQWxsb3cgdXNlcnMgdG8gd3JpdGUgZGlyZWN0bHkgdG8gdGhpcyBjb2xsZWN0aW9uIGZyb20gY2xpZW50IGNvZGUsIHN1YmplY3QgdG8gbGltaXRhdGlvbnMgeW91IGRlZmluZS5cbiAqIEBsb2N1cyBTZXJ2ZXJcbiAqIEBtZXRob2QgYWxsb3dcbiAqIEBtZW1iZXJPZiBNb25nby5Db2xsZWN0aW9uXG4gKiBAaW5zdGFuY2VcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcHRpb25zLmluc2VydCx1cGRhdGUscmVtb3ZlIEZ1bmN0aW9ucyB0aGF0IGxvb2sgYXQgYSBwcm9wb3NlZCBtb2RpZmljYXRpb24gdG8gdGhlIGRhdGFiYXNlIGFuZCByZXR1cm4gdHJ1ZSBpZiBpdCBzaG91bGQgYmUgYWxsb3dlZC5cbiAqIEBwYXJhbSB7U3RyaW5nW119IG9wdGlvbnMuZmV0Y2ggT3B0aW9uYWwgcGVyZm9ybWFuY2UgZW5oYW5jZW1lbnQuIExpbWl0cyB0aGUgZmllbGRzIHRoYXQgd2lsbCBiZSBmZXRjaGVkIGZyb20gdGhlIGRhdGFiYXNlIGZvciBpbnNwZWN0aW9uIGJ5IHlvdXIgYHVwZGF0ZWAgYW5kIGByZW1vdmVgIGZ1bmN0aW9ucy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbnMudHJhbnNmb3JtIE92ZXJyaWRlcyBgdHJhbnNmb3JtYCBvbiB0aGUgIFtgQ29sbGVjdGlvbmBdKCNjb2xsZWN0aW9ucykuICBQYXNzIGBudWxsYCB0byBkaXNhYmxlIHRyYW5zZm9ybWF0aW9uLlxuICovXG5Db2xsZWN0aW9uUHJvdG90eXBlLmFsbG93ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICBhZGRWYWxpZGF0b3IodGhpcywgJ2FsbG93Jywgb3B0aW9ucyk7XG59O1xuXG4vKipcbiAqIEBzdW1tYXJ5IE92ZXJyaWRlIGBhbGxvd2AgcnVsZXMuXG4gKiBAbG9jdXMgU2VydmVyXG4gKiBAbWV0aG9kIGRlbnlcbiAqIEBtZW1iZXJPZiBNb25nby5Db2xsZWN0aW9uXG4gKiBAaW5zdGFuY2VcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcHRpb25zLmluc2VydCx1cGRhdGUscmVtb3ZlIEZ1bmN0aW9ucyB0aGF0IGxvb2sgYXQgYSBwcm9wb3NlZCBtb2RpZmljYXRpb24gdG8gdGhlIGRhdGFiYXNlIGFuZCByZXR1cm4gdHJ1ZSBpZiBpdCBzaG91bGQgYmUgZGVuaWVkLCBldmVuIGlmIGFuIFthbGxvd10oI2FsbG93KSBydWxlIHNheXMgb3RoZXJ3aXNlLlxuICogQHBhcmFtIHtTdHJpbmdbXX0gb3B0aW9ucy5mZXRjaCBPcHRpb25hbCBwZXJmb3JtYW5jZSBlbmhhbmNlbWVudC4gTGltaXRzIHRoZSBmaWVsZHMgdGhhdCB3aWxsIGJlIGZldGNoZWQgZnJvbSB0aGUgZGF0YWJhc2UgZm9yIGluc3BlY3Rpb24gYnkgeW91ciBgdXBkYXRlYCBhbmQgYHJlbW92ZWAgZnVuY3Rpb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gb3B0aW9ucy50cmFuc2Zvcm0gT3ZlcnJpZGVzIGB0cmFuc2Zvcm1gIG9uIHRoZSAgW2BDb2xsZWN0aW9uYF0oI2NvbGxlY3Rpb25zKS4gIFBhc3MgYG51bGxgIHRvIGRpc2FibGUgdHJhbnNmb3JtYXRpb24uXG4gKi9cbkNvbGxlY3Rpb25Qcm90b3R5cGUuZGVueSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgYWRkVmFsaWRhdG9yKHRoaXMsICdkZW55Jywgb3B0aW9ucyk7XG59O1xuXG5Db2xsZWN0aW9uUHJvdG90eXBlLl9kZWZpbmVNdXRhdGlvbk1ldGhvZHMgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIGNvbnN0IHNlbGYgPSB0aGlzO1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAvLyBzZXQgdG8gdHJ1ZSBvbmNlIHdlIGNhbGwgYW55IGFsbG93IG9yIGRlbnkgbWV0aG9kcy4gSWYgdHJ1ZSwgdXNlXG4gIC8vIGFsbG93L2Rlbnkgc2VtYW50aWNzLiBJZiBmYWxzZSwgdXNlIGluc2VjdXJlIG1vZGUgc2VtYW50aWNzLlxuICBzZWxmLl9yZXN0cmljdGVkID0gZmFsc2U7XG5cbiAgLy8gSW5zZWN1cmUgbW9kZSAoZGVmYXVsdCB0byBhbGxvd2luZyB3cml0ZXMpLiBEZWZhdWx0cyB0byAndW5kZWZpbmVkJyB3aGljaFxuICAvLyBtZWFucyBpbnNlY3VyZSBpZmYgdGhlIGluc2VjdXJlIHBhY2thZ2UgaXMgbG9hZGVkLiBUaGlzIHByb3BlcnR5IGNhbiBiZVxuICAvLyBvdmVycmlkZW4gYnkgdGVzdHMgb3IgcGFja2FnZXMgd2lzaGluZyB0byBjaGFuZ2UgaW5zZWN1cmUgbW9kZSBiZWhhdmlvciBvZlxuICAvLyB0aGVpciBjb2xsZWN0aW9ucy5cbiAgc2VsZi5faW5zZWN1cmUgPSB1bmRlZmluZWQ7XG5cbiAgc2VsZi5fdmFsaWRhdG9ycyA9IHtcbiAgICBpbnNlcnQ6IHthbGxvdzogW10sIGRlbnk6IFtdfSxcbiAgICB1cGRhdGU6IHthbGxvdzogW10sIGRlbnk6IFtdfSxcbiAgICByZW1vdmU6IHthbGxvdzogW10sIGRlbnk6IFtdfSxcbiAgICB1cHNlcnQ6IHthbGxvdzogW10sIGRlbnk6IFtdfSwgLy8gZHVtbXkgYXJyYXlzOyBjYW4ndCBzZXQgdGhlc2UhXG4gICAgZmV0Y2g6IFtdLFxuICAgIGZldGNoQWxsRmllbGRzOiBmYWxzZVxuICB9O1xuXG4gIGlmICghc2VsZi5fbmFtZSlcbiAgICByZXR1cm47IC8vIGFub255bW91cyBjb2xsZWN0aW9uXG5cbiAgLy8gWFhYIFRoaW5rIGFib3V0IG1ldGhvZCBuYW1lc3BhY2luZy4gTWF5YmUgbWV0aG9kcyBzaG91bGQgYmVcbiAgLy8gXCJNZXRlb3I6TW9uZ286aW5zZXJ0L05BTUVcIj9cbiAgc2VsZi5fcHJlZml4ID0gJy8nICsgc2VsZi5fbmFtZSArICcvJztcblxuICAvLyBNdXRhdGlvbiBNZXRob2RzXG4gIC8vIE1pbmltb25nbyBvbiB0aGUgc2VydmVyIGdldHMgbm8gc3R1YnM7IGluc3RlYWQsIGJ5IGRlZmF1bHRcbiAgLy8gaXQgd2FpdCgpcyB1bnRpbCBpdHMgcmVzdWx0IGlzIHJlYWR5LCB5aWVsZGluZy5cbiAgLy8gVGhpcyBtYXRjaGVzIHRoZSBiZWhhdmlvciBvZiBtYWNyb21vbmdvIG9uIHRoZSBzZXJ2ZXIgYmV0dGVyLlxuICAvLyBYWFggc2VlICNNZXRlb3JTZXJ2ZXJOdWxsXG4gIGlmIChzZWxmLl9jb25uZWN0aW9uICYmIChzZWxmLl9jb25uZWN0aW9uID09PSBNZXRlb3Iuc2VydmVyIHx8IE1ldGVvci5pc0NsaWVudCkpIHtcbiAgICBjb25zdCBtID0ge307XG5cbiAgICBbJ2luc2VydCcsICd1cGRhdGUnLCAncmVtb3ZlJ10uZm9yRWFjaCgobWV0aG9kKSA9PiB7XG4gICAgICBjb25zdCBtZXRob2ROYW1lID0gc2VsZi5fcHJlZml4ICsgbWV0aG9kO1xuXG4gICAgICBpZiAob3B0aW9ucy51c2VFeGlzdGluZykge1xuICAgICAgICBjb25zdCBoYW5kbGVyUHJvcE5hbWUgPSBNZXRlb3IuaXNDbGllbnQgPyAnX21ldGhvZEhhbmRsZXJzJyA6ICdtZXRob2RfaGFuZGxlcnMnO1xuICAgICAgICAvLyBEbyBub3QgdHJ5IHRvIGNyZWF0ZSBhZGRpdGlvbmFsIG1ldGhvZHMgaWYgdGhpcyBoYXMgYWxyZWFkeSBiZWVuIGNhbGxlZC5cbiAgICAgICAgLy8gKE90aGVyd2lzZSB0aGUgLm1ldGhvZHMoKSBjYWxsIGJlbG93IHdpbGwgdGhyb3cgYW4gZXJyb3IuKVxuICAgICAgICBpZiAoc2VsZi5fY29ubmVjdGlvbltoYW5kbGVyUHJvcE5hbWVdICYmXG4gICAgICAgICAgdHlwZW9mIHNlbGYuX2Nvbm5lY3Rpb25baGFuZGxlclByb3BOYW1lXVttZXRob2ROYW1lXSA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBtW21ldGhvZE5hbWVdID0gZnVuY3Rpb24gKC8qIC4uLiAqLykge1xuICAgICAgICAvLyBBbGwgdGhlIG1ldGhvZHMgZG8gdGhlaXIgb3duIHZhbGlkYXRpb24sIGluc3RlYWQgb2YgdXNpbmcgY2hlY2soKS5cbiAgICAgICAgY2hlY2soYXJndW1lbnRzLCBbTWF0Y2guQW55XSk7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSBBcnJheS5mcm9tKGFyZ3VtZW50cyk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gRm9yIGFuIGluc2VydCwgaWYgdGhlIGNsaWVudCBkaWRuJ3Qgc3BlY2lmeSBhbiBfaWQsIGdlbmVyYXRlIG9uZVxuICAgICAgICAgIC8vIG5vdzsgYmVjYXVzZSB0aGlzIHVzZXMgRERQLnJhbmRvbVN0cmVhbSwgaXQgd2lsbCBiZSBjb25zaXN0ZW50IHdpdGhcbiAgICAgICAgICAvLyB3aGF0IHRoZSBjbGllbnQgZ2VuZXJhdGVkLiBXZSBnZW5lcmF0ZSBpdCBub3cgcmF0aGVyIHRoYW4gbGF0ZXIgc29cbiAgICAgICAgICAvLyB0aGF0IGlmIChlZykgYW4gYWxsb3cvZGVueSBydWxlIGRvZXMgYW4gaW5zZXJ0IHRvIHRoZSBzYW1lXG4gICAgICAgICAgLy8gY29sbGVjdGlvbiAobm90IHRoYXQgaXQgcmVhbGx5IHNob3VsZCksIHRoZSBnZW5lcmF0ZWQgX2lkIHdpbGxcbiAgICAgICAgICAvLyBzdGlsbCBiZSB0aGUgZmlyc3QgdXNlIG9mIHRoZSBzdHJlYW0gYW5kIHdpbGwgYmUgY29uc2lzdGVudC5cbiAgICAgICAgICAvL1xuICAgICAgICAgIC8vIEhvd2V2ZXIsIHdlIGRvbid0IGFjdHVhbGx5IHN0aWNrIHRoZSBfaWQgb250byB0aGUgZG9jdW1lbnQgeWV0LFxuICAgICAgICAgIC8vIGJlY2F1c2Ugd2Ugd2FudCBhbGxvdy9kZW55IHJ1bGVzIHRvIGJlIGFibGUgdG8gZGlmZmVyZW50aWF0ZVxuICAgICAgICAgIC8vIGJldHdlZW4gYXJiaXRyYXJ5IGNsaWVudC1zcGVjaWZpZWQgX2lkIGZpZWxkcyBhbmQgbWVyZWx5XG4gICAgICAgICAgLy8gY2xpZW50LWNvbnRyb2xsZWQtdmlhLXJhbmRvbVNlZWQgZmllbGRzLlxuICAgICAgICAgIGxldCBnZW5lcmF0ZWRJZCA9IG51bGw7XG4gICAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJpbnNlcnRcIiAmJiAhaGFzT3duLmNhbGwoYXJnc1swXSwgJ19pZCcpKSB7XG4gICAgICAgICAgICBnZW5lcmF0ZWRJZCA9IHNlbGYuX21ha2VOZXdJRCgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0aGlzLmlzU2ltdWxhdGlvbikge1xuICAgICAgICAgICAgLy8gSW4gYSBjbGllbnQgc2ltdWxhdGlvbiwgeW91IGNhbiBkbyBhbnkgbXV0YXRpb24gKGV2ZW4gd2l0aCBhXG4gICAgICAgICAgICAvLyBjb21wbGV4IHNlbGVjdG9yKS5cbiAgICAgICAgICAgIGlmIChnZW5lcmF0ZWRJZCAhPT0gbnVsbClcbiAgICAgICAgICAgICAgYXJnc1swXS5faWQgPSBnZW5lcmF0ZWRJZDtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9jb2xsZWN0aW9uW21ldGhvZF0uYXBwbHkoXG4gICAgICAgICAgICAgIHNlbGYuX2NvbGxlY3Rpb24sIGFyZ3MpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFRoaXMgaXMgdGhlIHNlcnZlciByZWNlaXZpbmcgYSBtZXRob2QgY2FsbCBmcm9tIHRoZSBjbGllbnQuXG5cbiAgICAgICAgICAvLyBXZSBkb24ndCBhbGxvdyBhcmJpdHJhcnkgc2VsZWN0b3JzIGluIG11dGF0aW9ucyBmcm9tIHRoZSBjbGllbnQ6IG9ubHlcbiAgICAgICAgICAvLyBzaW5nbGUtSUQgc2VsZWN0b3JzLlxuICAgICAgICAgIGlmIChtZXRob2QgIT09ICdpbnNlcnQnKVxuICAgICAgICAgICAgdGhyb3dJZlNlbGVjdG9ySXNOb3RJZChhcmdzWzBdLCBtZXRob2QpO1xuXG4gICAgICAgICAgaWYgKHNlbGYuX3Jlc3RyaWN0ZWQpIHtcbiAgICAgICAgICAgIC8vIHNob3J0IGNpcmN1aXQgaWYgdGhlcmUgaXMgbm8gd2F5IGl0IHdpbGwgcGFzcy5cbiAgICAgICAgICAgIGlmIChzZWxmLl92YWxpZGF0b3JzW21ldGhvZF0uYWxsb3cubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXG4gICAgICAgICAgICAgICAgNDAzLCBcIkFjY2VzcyBkZW5pZWQuIE5vIGFsbG93IHZhbGlkYXRvcnMgc2V0IG9uIHJlc3RyaWN0ZWQgXCIgK1xuICAgICAgICAgICAgICAgICAgXCJjb2xsZWN0aW9uIGZvciBtZXRob2QgJ1wiICsgbWV0aG9kICsgXCInLlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgdmFsaWRhdGVkTWV0aG9kTmFtZSA9XG4gICAgICAgICAgICAgICAgICAnX3ZhbGlkYXRlZCcgKyBtZXRob2QuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBtZXRob2Quc2xpY2UoMSk7XG4gICAgICAgICAgICBhcmdzLnVuc2hpZnQodGhpcy51c2VySWQpO1xuICAgICAgICAgICAgbWV0aG9kID09PSAnaW5zZXJ0JyAmJiBhcmdzLnB1c2goZ2VuZXJhdGVkSWQpO1xuICAgICAgICAgICAgcmV0dXJuIHNlbGZbdmFsaWRhdGVkTWV0aG9kTmFtZV0uYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICAgICAgfSBlbHNlIGlmIChzZWxmLl9pc0luc2VjdXJlKCkpIHtcbiAgICAgICAgICAgIGlmIChnZW5lcmF0ZWRJZCAhPT0gbnVsbClcbiAgICAgICAgICAgICAgYXJnc1swXS5faWQgPSBnZW5lcmF0ZWRJZDtcbiAgICAgICAgICAgIC8vIEluIGluc2VjdXJlIG1vZGUsIGFsbG93IGFueSBtdXRhdGlvbiAod2l0aCBhIHNpbXBsZSBzZWxlY3RvcikuXG4gICAgICAgICAgICAvLyBYWFggVGhpcyBpcyBraW5kIG9mIGJvZ3VzLiAgSW5zdGVhZCBvZiBibGluZGx5IHBhc3Npbmcgd2hhdGV2ZXJcbiAgICAgICAgICAgIC8vICAgICB3ZSBnZXQgZnJvbSB0aGUgbmV0d29yayB0byB0aGlzIGZ1bmN0aW9uLCB3ZSBzaG91bGQgYWN0dWFsbHlcbiAgICAgICAgICAgIC8vICAgICBrbm93IHRoZSBjb3JyZWN0IGFyZ3VtZW50cyBmb3IgdGhlIGZ1bmN0aW9uIGFuZCBwYXNzIGp1c3RcbiAgICAgICAgICAgIC8vICAgICB0aGVtLiAgRm9yIGV4YW1wbGUsIGlmIHlvdSBoYXZlIGFuIGV4dHJhbmVvdXMgZXh0cmEgbnVsbFxuICAgICAgICAgICAgLy8gICAgIGFyZ3VtZW50IGFuZCB0aGlzIGlzIE1vbmdvIG9uIHRoZSBzZXJ2ZXIsIHRoZSAud3JhcEFzeW5jJ2RcbiAgICAgICAgICAgIC8vICAgICBmdW5jdGlvbnMgbGlrZSB1cGRhdGUgd2lsbCBnZXQgY29uZnVzZWQgYW5kIHBhc3MgdGhlXG4gICAgICAgICAgICAvLyAgICAgXCJmdXQucmVzb2x2ZXIoKVwiIGluIHRoZSB3cm9uZyBzbG90LCB3aGVyZSBfdXBkYXRlIHdpbGwgbmV2ZXJcbiAgICAgICAgICAgIC8vICAgICBpbnZva2UgaXQuIEJhbSwgYnJva2VuIEREUCBjb25uZWN0aW9uLiAgUHJvYmFibHkgc2hvdWxkIGp1c3RcbiAgICAgICAgICAgIC8vICAgICB0YWtlIHRoaXMgd2hvbGUgbWV0aG9kIGFuZCB3cml0ZSBpdCB0aHJlZSB0aW1lcywgaW52b2tpbmdcbiAgICAgICAgICAgIC8vICAgICBoZWxwZXJzIGZvciB0aGUgY29tbW9uIGNvZGUuXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5fY29sbGVjdGlvblttZXRob2RdLmFwcGx5KHNlbGYuX2NvbGxlY3Rpb24sIGFyZ3MpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBJbiBzZWN1cmUgbW9kZSwgaWYgd2UgaGF2ZW4ndCBjYWxsZWQgYWxsb3cgb3IgZGVueSwgdGhlbiBub3RoaW5nXG4gICAgICAgICAgICAvLyBpcyBwZXJtaXR0ZWQuXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJBY2Nlc3MgZGVuaWVkXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGlmIChlLm5hbWUgPT09ICdNb25nb0Vycm9yJyB8fCBlLm5hbWUgPT09ICdNaW5pbW9uZ29FcnJvcicpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDA5LCBlLnRvU3RyaW5nKCkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHNlbGYuX2Nvbm5lY3Rpb24ubWV0aG9kcyhtKTtcbiAgfVxufTtcblxuQ29sbGVjdGlvblByb3RvdHlwZS5fdXBkYXRlRmV0Y2ggPSBmdW5jdGlvbiAoZmllbGRzKSB7XG4gIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gIGlmICghc2VsZi5fdmFsaWRhdG9ycy5mZXRjaEFsbEZpZWxkcykge1xuICAgIGlmIChmaWVsZHMpIHtcbiAgICAgIGNvbnN0IHVuaW9uID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgIGNvbnN0IGFkZCA9IG5hbWVzID0+IG5hbWVzICYmIG5hbWVzLmZvckVhY2gobmFtZSA9PiB1bmlvbltuYW1lXSA9IDEpO1xuICAgICAgYWRkKHNlbGYuX3ZhbGlkYXRvcnMuZmV0Y2gpO1xuICAgICAgYWRkKGZpZWxkcyk7XG4gICAgICBzZWxmLl92YWxpZGF0b3JzLmZldGNoID0gT2JqZWN0LmtleXModW5pb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLl92YWxpZGF0b3JzLmZldGNoQWxsRmllbGRzID0gdHJ1ZTtcbiAgICAgIC8vIGNsZWFyIGZldGNoIGp1c3QgdG8gbWFrZSBzdXJlIHdlIGRvbid0IGFjY2lkZW50YWxseSByZWFkIGl0XG4gICAgICBzZWxmLl92YWxpZGF0b3JzLmZldGNoID0gbnVsbDtcbiAgICB9XG4gIH1cbn07XG5cbkNvbGxlY3Rpb25Qcm90b3R5cGUuX2lzSW5zZWN1cmUgPSBmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IHNlbGYgPSB0aGlzO1xuICBpZiAoc2VsZi5faW5zZWN1cmUgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gISFQYWNrYWdlLmluc2VjdXJlO1xuICByZXR1cm4gc2VsZi5faW5zZWN1cmU7XG59O1xuXG5Db2xsZWN0aW9uUHJvdG90eXBlLl92YWxpZGF0ZWRJbnNlcnQgPSBmdW5jdGlvbiAodXNlcklkLCBkb2MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWRJZCkge1xuICBjb25zdCBzZWxmID0gdGhpcztcblxuICAvLyBjYWxsIHVzZXIgdmFsaWRhdG9ycy5cbiAgLy8gQW55IGRlbnkgcmV0dXJucyB0cnVlIG1lYW5zIGRlbmllZC5cbiAgaWYgKHNlbGYuX3ZhbGlkYXRvcnMuaW5zZXJ0LmRlbnkuc29tZSgodmFsaWRhdG9yKSA9PiB7XG4gICAgcmV0dXJuIHZhbGlkYXRvcih1c2VySWQsIGRvY1RvVmFsaWRhdGUodmFsaWRhdG9yLCBkb2MsIGdlbmVyYXRlZElkKSk7XG4gIH0pKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiQWNjZXNzIGRlbmllZFwiKTtcbiAgfVxuICAvLyBBbnkgYWxsb3cgcmV0dXJucyB0cnVlIG1lYW5zIHByb2NlZWQuIFRocm93IGVycm9yIGlmIHRoZXkgYWxsIGZhaWwuXG4gIGlmIChzZWxmLl92YWxpZGF0b3JzLmluc2VydC5hbGxvdy5ldmVyeSgodmFsaWRhdG9yKSA9PiB7XG4gICAgcmV0dXJuICF2YWxpZGF0b3IodXNlcklkLCBkb2NUb1ZhbGlkYXRlKHZhbGlkYXRvciwgZG9jLCBnZW5lcmF0ZWRJZCkpO1xuICB9KSkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIkFjY2VzcyBkZW5pZWRcIik7XG4gIH1cblxuICAvLyBJZiB3ZSBnZW5lcmF0ZWQgYW4gSUQgYWJvdmUsIGluc2VydCBpdCBub3c6IGFmdGVyIHRoZSB2YWxpZGF0aW9uLCBidXRcbiAgLy8gYmVmb3JlIGFjdHVhbGx5IGluc2VydGluZy5cbiAgaWYgKGdlbmVyYXRlZElkICE9PSBudWxsKVxuICAgIGRvYy5faWQgPSBnZW5lcmF0ZWRJZDtcblxuICBzZWxmLl9jb2xsZWN0aW9uLmluc2VydC5jYWxsKHNlbGYuX2NvbGxlY3Rpb24sIGRvYyk7XG59O1xuXG4vLyBTaW11bGF0ZSBhIG1vbmdvIGB1cGRhdGVgIG9wZXJhdGlvbiB3aGlsZSB2YWxpZGF0aW5nIHRoYXQgdGhlIGFjY2Vzc1xuLy8gY29udHJvbCBydWxlcyBzZXQgYnkgY2FsbHMgdG8gYGFsbG93L2RlbnlgIGFyZSBzYXRpc2ZpZWQuIElmIGFsbFxuLy8gcGFzcywgcmV3cml0ZSB0aGUgbW9uZ28gb3BlcmF0aW9uIHRvIHVzZSAkaW4gdG8gc2V0IHRoZSBsaXN0IG9mXG4vLyBkb2N1bWVudCBpZHMgdG8gY2hhbmdlICMjVmFsaWRhdGVkQ2hhbmdlXG5Db2xsZWN0aW9uUHJvdG90eXBlLl92YWxpZGF0ZWRVcGRhdGUgPSBmdW5jdGlvbihcbiAgICB1c2VySWQsIHNlbGVjdG9yLCBtdXRhdG9yLCBvcHRpb25zKSB7XG4gIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gIGNoZWNrKG11dGF0b3IsIE9iamVjdCk7XG5cbiAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShudWxsKSwgb3B0aW9ucyk7XG5cbiAgaWYgKCFMb2NhbENvbGxlY3Rpb24uX3NlbGVjdG9ySXNJZFBlcmhhcHNBc09iamVjdChzZWxlY3RvcikpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwidmFsaWRhdGVkIHVwZGF0ZSBzaG91bGQgYmUgb2YgYSBzaW5nbGUgSURcIik7XG5cbiAgLy8gV2UgZG9uJ3Qgc3VwcG9ydCB1cHNlcnRzIGJlY2F1c2UgdGhleSBkb24ndCBmaXQgbmljZWx5IGludG8gYWxsb3cvZGVueVxuICAvLyBydWxlcy5cbiAgaWYgKG9wdGlvbnMudXBzZXJ0KVxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIkFjY2VzcyBkZW5pZWQuIFVwc2VydHMgbm90IFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxsb3dlZCBpbiBhIHJlc3RyaWN0ZWQgY29sbGVjdGlvbi5cIik7XG5cbiAgY29uc3Qgbm9SZXBsYWNlRXJyb3IgPSBcIkFjY2VzcyBkZW5pZWQuIEluIGEgcmVzdHJpY3RlZCBjb2xsZWN0aW9uIHlvdSBjYW4gb25seVwiICtcbiAgICAgICAgXCIgdXBkYXRlIGRvY3VtZW50cywgbm90IHJlcGxhY2UgdGhlbS4gVXNlIGEgTW9uZ28gdXBkYXRlIG9wZXJhdG9yLCBzdWNoIFwiICtcbiAgICAgICAgXCJhcyAnJHNldCcuXCI7XG5cbiAgY29uc3QgbXV0YXRvcktleXMgPSBPYmplY3Qua2V5cyhtdXRhdG9yKTtcblxuICAvLyBjb21wdXRlIG1vZGlmaWVkIGZpZWxkc1xuICBjb25zdCBtb2RpZmllZEZpZWxkcyA9IHt9O1xuXG4gIGlmIChtdXRhdG9yS2V5cy5sZW5ndGggPT09IDApIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgbm9SZXBsYWNlRXJyb3IpO1xuICB9XG4gIG11dGF0b3JLZXlzLmZvckVhY2goKG9wKSA9PiB7XG4gICAgY29uc3QgcGFyYW1zID0gbXV0YXRvcltvcF07XG4gICAgaWYgKG9wLmNoYXJBdCgwKSAhPT0gJyQnKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgbm9SZXBsYWNlRXJyb3IpO1xuICAgIH0gZWxzZSBpZiAoIWhhc093bi5jYWxsKEFMTE9XRURfVVBEQVRFX09QRVJBVElPTlMsIG9wKSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcbiAgICAgICAgNDAzLCBcIkFjY2VzcyBkZW5pZWQuIE9wZXJhdG9yIFwiICsgb3AgKyBcIiBub3QgYWxsb3dlZCBpbiBhIHJlc3RyaWN0ZWQgY29sbGVjdGlvbi5cIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIE9iamVjdC5rZXlzKHBhcmFtcykuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgICAgLy8gdHJlYXQgZG90dGVkIGZpZWxkcyBhcyBpZiB0aGV5IGFyZSByZXBsYWNpbmcgdGhlaXJcbiAgICAgICAgLy8gdG9wLWxldmVsIHBhcnRcbiAgICAgICAgaWYgKGZpZWxkLmluZGV4T2YoJy4nKSAhPT0gLTEpXG4gICAgICAgICAgZmllbGQgPSBmaWVsZC5zdWJzdHJpbmcoMCwgZmllbGQuaW5kZXhPZignLicpKTtcblxuICAgICAgICAvLyByZWNvcmQgdGhlIGZpZWxkIHdlIGFyZSB0cnlpbmcgdG8gY2hhbmdlXG4gICAgICAgIG1vZGlmaWVkRmllbGRzW2ZpZWxkXSA9IHRydWU7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIGNvbnN0IGZpZWxkcyA9IE9iamVjdC5rZXlzKG1vZGlmaWVkRmllbGRzKTtcblxuICBjb25zdCBmaW5kT3B0aW9ucyA9IHt0cmFuc2Zvcm06IG51bGx9O1xuICBpZiAoIXNlbGYuX3ZhbGlkYXRvcnMuZmV0Y2hBbGxGaWVsZHMpIHtcbiAgICBmaW5kT3B0aW9ucy5maWVsZHMgPSB7fTtcbiAgICBzZWxmLl92YWxpZGF0b3JzLmZldGNoLmZvckVhY2goKGZpZWxkTmFtZSkgPT4ge1xuICAgICAgZmluZE9wdGlvbnMuZmllbGRzW2ZpZWxkTmFtZV0gPSAxO1xuICAgIH0pO1xuICB9XG5cbiAgY29uc3QgZG9jID0gc2VsZi5fY29sbGVjdGlvbi5maW5kT25lKHNlbGVjdG9yLCBmaW5kT3B0aW9ucyk7XG4gIGlmICghZG9jKSAgLy8gbm9uZSBzYXRpc2ZpZWQhXG4gICAgcmV0dXJuIDA7XG5cbiAgLy8gY2FsbCB1c2VyIHZhbGlkYXRvcnMuXG4gIC8vIEFueSBkZW55IHJldHVybnMgdHJ1ZSBtZWFucyBkZW5pZWQuXG4gIGlmIChzZWxmLl92YWxpZGF0b3JzLnVwZGF0ZS5kZW55LnNvbWUoKHZhbGlkYXRvcikgPT4ge1xuICAgIGNvbnN0IGZhY3RvcmllZERvYyA9IHRyYW5zZm9ybURvYyh2YWxpZGF0b3IsIGRvYyk7XG4gICAgcmV0dXJuIHZhbGlkYXRvcih1c2VySWQsXG4gICAgICAgICAgICAgICAgICAgICBmYWN0b3JpZWREb2MsXG4gICAgICAgICAgICAgICAgICAgICBmaWVsZHMsXG4gICAgICAgICAgICAgICAgICAgICBtdXRhdG9yKTtcbiAgfSkpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJBY2Nlc3MgZGVuaWVkXCIpO1xuICB9XG4gIC8vIEFueSBhbGxvdyByZXR1cm5zIHRydWUgbWVhbnMgcHJvY2VlZC4gVGhyb3cgZXJyb3IgaWYgdGhleSBhbGwgZmFpbC5cbiAgaWYgKHNlbGYuX3ZhbGlkYXRvcnMudXBkYXRlLmFsbG93LmV2ZXJ5KCh2YWxpZGF0b3IpID0+IHtcbiAgICBjb25zdCBmYWN0b3JpZWREb2MgPSB0cmFuc2Zvcm1Eb2ModmFsaWRhdG9yLCBkb2MpO1xuICAgIHJldHVybiAhdmFsaWRhdG9yKHVzZXJJZCxcbiAgICAgICAgICAgICAgICAgICAgICBmYWN0b3JpZWREb2MsXG4gICAgICAgICAgICAgICAgICAgICAgZmllbGRzLFxuICAgICAgICAgICAgICAgICAgICAgIG11dGF0b3IpO1xuICB9KSkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIkFjY2VzcyBkZW5pZWRcIik7XG4gIH1cblxuICBvcHRpb25zLl9mb3JiaWRSZXBsYWNlID0gdHJ1ZTtcblxuICAvLyBCYWNrIHdoZW4gd2Ugc3VwcG9ydGVkIGFyYml0cmFyeSBjbGllbnQtcHJvdmlkZWQgc2VsZWN0b3JzLCB3ZSBhY3R1YWxseVxuICAvLyByZXdyb3RlIHRoZSBzZWxlY3RvciB0byBpbmNsdWRlIGFuIF9pZCBjbGF1c2UgYmVmb3JlIHBhc3NpbmcgdG8gTW9uZ28gdG9cbiAgLy8gYXZvaWQgcmFjZXMsIGJ1dCBzaW5jZSBzZWxlY3RvciBpcyBndWFyYW50ZWVkIHRvIGFscmVhZHkganVzdCBiZSBhbiBJRCwgd2VcbiAgLy8gZG9uJ3QgaGF2ZSB0byBhbnkgbW9yZS5cblxuICByZXR1cm4gc2VsZi5fY29sbGVjdGlvbi51cGRhdGUuY2FsbChcbiAgICBzZWxmLl9jb2xsZWN0aW9uLCBzZWxlY3RvciwgbXV0YXRvciwgb3B0aW9ucyk7XG59O1xuXG4vLyBPbmx5IGFsbG93IHRoZXNlIG9wZXJhdGlvbnMgaW4gdmFsaWRhdGVkIHVwZGF0ZXMuIFNwZWNpZmljYWxseVxuLy8gd2hpdGVsaXN0IG9wZXJhdGlvbnMsIHJhdGhlciB0aGFuIGJsYWNrbGlzdCwgc28gbmV3IGNvbXBsZXhcbi8vIG9wZXJhdGlvbnMgdGhhdCBhcmUgYWRkZWQgYXJlbid0IGF1dG9tYXRpY2FsbHkgYWxsb3dlZC4gQSBjb21wbGV4XG4vLyBvcGVyYXRpb24gaXMgb25lIHRoYXQgZG9lcyBtb3JlIHRoYW4ganVzdCBtb2RpZnkgaXRzIHRhcmdldFxuLy8gZmllbGQuIEZvciBub3cgdGhpcyBjb250YWlucyBhbGwgdXBkYXRlIG9wZXJhdGlvbnMgZXhjZXB0ICckcmVuYW1lJy5cbi8vIGh0dHA6Ly9kb2NzLm1vbmdvZGIub3JnL21hbnVhbC9yZWZlcmVuY2Uvb3BlcmF0b3JzLyN1cGRhdGVcbmNvbnN0IEFMTE9XRURfVVBEQVRFX09QRVJBVElPTlMgPSB7XG4gICRpbmM6MSwgJHNldDoxLCAkdW5zZXQ6MSwgJGFkZFRvU2V0OjEsICRwb3A6MSwgJHB1bGxBbGw6MSwgJHB1bGw6MSxcbiAgJHB1c2hBbGw6MSwgJHB1c2g6MSwgJGJpdDoxXG59O1xuXG4vLyBTaW11bGF0ZSBhIG1vbmdvIGByZW1vdmVgIG9wZXJhdGlvbiB3aGlsZSB2YWxpZGF0aW5nIGFjY2VzcyBjb250cm9sXG4vLyBydWxlcy4gU2VlICNWYWxpZGF0ZWRDaGFuZ2VcbkNvbGxlY3Rpb25Qcm90b3R5cGUuX3ZhbGlkYXRlZFJlbW92ZSA9IGZ1bmN0aW9uKHVzZXJJZCwgc2VsZWN0b3IpIHtcbiAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgY29uc3QgZmluZE9wdGlvbnMgPSB7dHJhbnNmb3JtOiBudWxsfTtcbiAgaWYgKCFzZWxmLl92YWxpZGF0b3JzLmZldGNoQWxsRmllbGRzKSB7XG4gICAgZmluZE9wdGlvbnMuZmllbGRzID0ge307XG4gICAgc2VsZi5fdmFsaWRhdG9ycy5mZXRjaC5mb3JFYWNoKChmaWVsZE5hbWUpID0+IHtcbiAgICAgIGZpbmRPcHRpb25zLmZpZWxkc1tmaWVsZE5hbWVdID0gMTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0IGRvYyA9IHNlbGYuX2NvbGxlY3Rpb24uZmluZE9uZShzZWxlY3RvciwgZmluZE9wdGlvbnMpO1xuICBpZiAoIWRvYylcbiAgICByZXR1cm4gMDtcblxuICAvLyBjYWxsIHVzZXIgdmFsaWRhdG9ycy5cbiAgLy8gQW55IGRlbnkgcmV0dXJucyB0cnVlIG1lYW5zIGRlbmllZC5cbiAgaWYgKHNlbGYuX3ZhbGlkYXRvcnMucmVtb3ZlLmRlbnkuc29tZSgodmFsaWRhdG9yKSA9PiB7XG4gICAgcmV0dXJuIHZhbGlkYXRvcih1c2VySWQsIHRyYW5zZm9ybURvYyh2YWxpZGF0b3IsIGRvYykpO1xuICB9KSkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIkFjY2VzcyBkZW5pZWRcIik7XG4gIH1cbiAgLy8gQW55IGFsbG93IHJldHVybnMgdHJ1ZSBtZWFucyBwcm9jZWVkLiBUaHJvdyBlcnJvciBpZiB0aGV5IGFsbCBmYWlsLlxuICBpZiAoc2VsZi5fdmFsaWRhdG9ycy5yZW1vdmUuYWxsb3cuZXZlcnkoKHZhbGlkYXRvcikgPT4ge1xuICAgIHJldHVybiAhdmFsaWRhdG9yKHVzZXJJZCwgdHJhbnNmb3JtRG9jKHZhbGlkYXRvciwgZG9jKSk7XG4gIH0pKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiQWNjZXNzIGRlbmllZFwiKTtcbiAgfVxuXG4gIC8vIEJhY2sgd2hlbiB3ZSBzdXBwb3J0ZWQgYXJiaXRyYXJ5IGNsaWVudC1wcm92aWRlZCBzZWxlY3RvcnMsIHdlIGFjdHVhbGx5XG4gIC8vIHJld3JvdGUgdGhlIHNlbGVjdG9yIHRvIHtfaWQ6IHskaW46IFtpZHMgdGhhdCB3ZSBmb3VuZF19fSBiZWZvcmUgcGFzc2luZyB0b1xuICAvLyBNb25nbyB0byBhdm9pZCByYWNlcywgYnV0IHNpbmNlIHNlbGVjdG9yIGlzIGd1YXJhbnRlZWQgdG8gYWxyZWFkeSBqdXN0IGJlXG4gIC8vIGFuIElELCB3ZSBkb24ndCBoYXZlIHRvIGFueSBtb3JlLlxuXG4gIHJldHVybiBzZWxmLl9jb2xsZWN0aW9uLnJlbW92ZS5jYWxsKHNlbGYuX2NvbGxlY3Rpb24sIHNlbGVjdG9yKTtcbn07XG5cbkNvbGxlY3Rpb25Qcm90b3R5cGUuX2NhbGxNdXRhdG9yTWV0aG9kID0gZnVuY3Rpb24gX2NhbGxNdXRhdG9yTWV0aG9kKG5hbWUsIGFyZ3MsIGNhbGxiYWNrKSB7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQgJiYgIWNhbGxiYWNrICYmICFhbHJlYWR5SW5TaW11bGF0aW9uKCkpIHtcbiAgICAvLyBDbGllbnQgY2FuJ3QgYmxvY2ssIHNvIGl0IGNhbid0IHJlcG9ydCBlcnJvcnMgYnkgZXhjZXB0aW9uLFxuICAgIC8vIG9ubHkgYnkgY2FsbGJhY2suIElmIHRoZXkgZm9yZ2V0IHRoZSBjYWxsYmFjaywgZ2l2ZSB0aGVtIGFcbiAgICAvLyBkZWZhdWx0IG9uZSB0aGF0IGxvZ3MgdGhlIGVycm9yLCBzbyB0aGV5IGFyZW4ndCB0b3RhbGx5XG4gICAgLy8gYmFmZmxlZCBpZiB0aGVpciB3cml0ZXMgZG9uJ3Qgd29yayBiZWNhdXNlIHRoZWlyIGRhdGFiYXNlIGlzXG4gICAgLy8gZG93bi5cbiAgICAvLyBEb24ndCBnaXZlIGEgZGVmYXVsdCBjYWxsYmFjayBpbiBzaW11bGF0aW9uLCBiZWNhdXNlIGluc2lkZSBzdHVicyB3ZVxuICAgIC8vIHdhbnQgdG8gcmV0dXJuIHRoZSByZXN1bHRzIGZyb20gdGhlIGxvY2FsIGNvbGxlY3Rpb24gaW1tZWRpYXRlbHkgYW5kXG4gICAgLy8gbm90IGZvcmNlIGEgY2FsbGJhY2suXG4gICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICBpZiAoZXJyKVxuICAgICAgICBNZXRlb3IuX2RlYnVnKG5hbWUgKyBcIiBmYWlsZWQ6IFwiICsgKGVyci5yZWFzb24gfHwgZXJyLnN0YWNrKSk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIEZvciB0d28gb3V0IG9mIHRocmVlIG11dGF0b3IgbWV0aG9kcywgdGhlIGZpcnN0IGFyZ3VtZW50IGlzIGEgc2VsZWN0b3JcbiAgY29uc3QgZmlyc3RBcmdJc1NlbGVjdG9yID0gbmFtZSA9PT0gXCJ1cGRhdGVcIiB8fCBuYW1lID09PSBcInJlbW92ZVwiO1xuICBpZiAoZmlyc3RBcmdJc1NlbGVjdG9yICYmICFhbHJlYWR5SW5TaW11bGF0aW9uKCkpIHtcbiAgICAvLyBJZiB3ZSdyZSBhYm91dCB0byBhY3R1YWxseSBzZW5kIGFuIFJQQywgd2Ugc2hvdWxkIHRocm93IGFuIGVycm9yIGlmXG4gICAgLy8gdGhpcyBpcyBhIG5vbi1JRCBzZWxlY3RvciwgYmVjYXVzZSB0aGUgbXV0YXRpb24gbWV0aG9kcyBvbmx5IGFsbG93XG4gICAgLy8gc2luZ2xlLUlEIHNlbGVjdG9ycy4gKElmIHdlIGRvbid0IHRocm93IGhlcmUsIHdlJ2xsIHNlZSBmbGlja2VyLilcbiAgICB0aHJvd0lmU2VsZWN0b3JJc05vdElkKGFyZ3NbMF0sIG5hbWUpO1xuICB9XG5cbiAgY29uc3QgbXV0YXRvck1ldGhvZE5hbWUgPSB0aGlzLl9wcmVmaXggKyBuYW1lO1xuICByZXR1cm4gdGhpcy5fY29ubmVjdGlvbi5hcHBseShcbiAgICBtdXRhdG9yTWV0aG9kTmFtZSwgYXJncywgeyByZXR1cm5TdHViVmFsdWU6IHRydWUgfSwgY2FsbGJhY2spO1xufVxuXG5mdW5jdGlvbiB0cmFuc2Zvcm1Eb2ModmFsaWRhdG9yLCBkb2MpIHtcbiAgaWYgKHZhbGlkYXRvci50cmFuc2Zvcm0pXG4gICAgcmV0dXJuIHZhbGlkYXRvci50cmFuc2Zvcm0oZG9jKTtcbiAgcmV0dXJuIGRvYztcbn1cblxuZnVuY3Rpb24gZG9jVG9WYWxpZGF0ZSh2YWxpZGF0b3IsIGRvYywgZ2VuZXJhdGVkSWQpIHtcbiAgbGV0IHJldCA9IGRvYztcbiAgaWYgKHZhbGlkYXRvci50cmFuc2Zvcm0pIHtcbiAgICByZXQgPSBFSlNPTi5jbG9uZShkb2MpO1xuICAgIC8vIElmIHlvdSBzZXQgYSBzZXJ2ZXItc2lkZSB0cmFuc2Zvcm0gb24geW91ciBjb2xsZWN0aW9uLCB0aGVuIHlvdSBkb24ndCBnZXRcbiAgICAvLyB0byB0ZWxsIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gXCJjbGllbnQgc3BlY2lmaWVkIHRoZSBJRFwiIGFuZCBcInNlcnZlclxuICAgIC8vIGdlbmVyYXRlZCB0aGUgSURcIiwgYmVjYXVzZSB0cmFuc2Zvcm1zIGV4cGVjdCB0byBnZXQgX2lkLiAgSWYgeW91IHdhbnQgdG9cbiAgICAvLyBkbyB0aGF0IGNoZWNrLCB5b3UgY2FuIGRvIGl0IHdpdGggYSBzcGVjaWZpY1xuICAgIC8vIGBDLmFsbG93KHtpbnNlcnQ6IGYsIHRyYW5zZm9ybTogbnVsbH0pYCB2YWxpZGF0b3IuXG4gICAgaWYgKGdlbmVyYXRlZElkICE9PSBudWxsKSB7XG4gICAgICByZXQuX2lkID0gZ2VuZXJhdGVkSWQ7XG4gICAgfVxuICAgIHJldCA9IHZhbGlkYXRvci50cmFuc2Zvcm0ocmV0KTtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG5mdW5jdGlvbiBhZGRWYWxpZGF0b3IoY29sbGVjdGlvbiwgYWxsb3dPckRlbnksIG9wdGlvbnMpIHtcbiAgLy8gdmFsaWRhdGUga2V5c1xuICBjb25zdCB2YWxpZEtleXNSZWdFeCA9IC9eKD86aW5zZXJ0fHVwZGF0ZXxyZW1vdmV8ZmV0Y2h8dHJhbnNmb3JtKSQvO1xuICBPYmplY3Qua2V5cyhvcHRpb25zKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICBpZiAoIXZhbGlkS2V5c1JlZ0V4LnRlc3Qoa2V5KSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihhbGxvd09yRGVueSArIFwiOiBJbnZhbGlkIGtleTogXCIgKyBrZXkpO1xuICB9KTtcblxuICBjb2xsZWN0aW9uLl9yZXN0cmljdGVkID0gdHJ1ZTtcblxuICBbJ2luc2VydCcsICd1cGRhdGUnLCAncmVtb3ZlJ10uZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgIGlmIChoYXNPd24uY2FsbChvcHRpb25zLCBuYW1lKSkge1xuICAgICAgaWYgKCEob3B0aW9uc1tuYW1lXSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYWxsb3dPckRlbnkgKyBcIjogVmFsdWUgZm9yIGBcIiArIG5hbWUgKyBcImAgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB0aGUgdHJhbnNmb3JtIGlzIHNwZWNpZmllZCBhdCBhbGwgKGluY2x1ZGluZyBhcyAnbnVsbCcpIGluIHRoaXNcbiAgICAgIC8vIGNhbGwsIHRoZW4gdGFrZSB0aGF0OyBvdGhlcndpc2UsIHRha2UgdGhlIHRyYW5zZm9ybSBmcm9tIHRoZVxuICAgICAgLy8gY29sbGVjdGlvbi5cbiAgICAgIGlmIChvcHRpb25zLnRyYW5zZm9ybSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG9wdGlvbnNbbmFtZV0udHJhbnNmb3JtID0gY29sbGVjdGlvbi5fdHJhbnNmb3JtOyAgLy8gYWxyZWFkeSB3cmFwcGVkXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcHRpb25zW25hbWVdLnRyYW5zZm9ybSA9IExvY2FsQ29sbGVjdGlvbi53cmFwVHJhbnNmb3JtKFxuICAgICAgICAgIG9wdGlvbnMudHJhbnNmb3JtKTtcbiAgICAgIH1cblxuICAgICAgY29sbGVjdGlvbi5fdmFsaWRhdG9yc1tuYW1lXVthbGxvd09yRGVueV0ucHVzaChvcHRpb25zW25hbWVdKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIE9ubHkgdXBkYXRlIHRoZSBmZXRjaCBmaWVsZHMgaWYgd2UncmUgcGFzc2VkIHRoaW5ncyB0aGF0IGFmZmVjdFxuICAvLyBmZXRjaGluZy4gVGhpcyB3YXkgYWxsb3coe30pIGFuZCBhbGxvdyh7aW5zZXJ0OiBmfSkgZG9uJ3QgcmVzdWx0IGluXG4gIC8vIHNldHRpbmcgZmV0Y2hBbGxGaWVsZHNcbiAgaWYgKG9wdGlvbnMudXBkYXRlIHx8IG9wdGlvbnMucmVtb3ZlIHx8IG9wdGlvbnMuZmV0Y2gpIHtcbiAgICBpZiAob3B0aW9ucy5mZXRjaCAmJiAhKG9wdGlvbnMuZmV0Y2ggaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihhbGxvd09yRGVueSArIFwiOiBWYWx1ZSBmb3IgYGZldGNoYCBtdXN0IGJlIGFuIGFycmF5XCIpO1xuICAgIH1cbiAgICBjb2xsZWN0aW9uLl91cGRhdGVGZXRjaChvcHRpb25zLmZldGNoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB0aHJvd0lmU2VsZWN0b3JJc05vdElkKHNlbGVjdG9yLCBtZXRob2ROYW1lKSB7XG4gIGlmICghTG9jYWxDb2xsZWN0aW9uLl9zZWxlY3RvcklzSWRQZXJoYXBzQXNPYmplY3Qoc2VsZWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcbiAgICAgIDQwMywgXCJOb3QgcGVybWl0dGVkLiBVbnRydXN0ZWQgY29kZSBtYXkgb25seSBcIiArIG1ldGhvZE5hbWUgK1xuICAgICAgICBcIiBkb2N1bWVudHMgYnkgSUQuXCIpO1xuICB9XG59O1xuXG4vLyBEZXRlcm1pbmUgaWYgd2UgYXJlIGluIGEgRERQIG1ldGhvZCBzaW11bGF0aW9uXG5mdW5jdGlvbiBhbHJlYWR5SW5TaW11bGF0aW9uKCkge1xuICB2YXIgQ3VycmVudEludm9jYXRpb24gPVxuICAgIEREUC5fQ3VycmVudE1ldGhvZEludm9jYXRpb24gfHxcbiAgICAvLyBGb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHksIGFzIGV4cGxhaW5lZCBpbiB0aGlzIGlzc3VlOlxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tZXRlb3IvbWV0ZW9yL2lzc3Vlcy84OTQ3XG4gICAgRERQLl9DdXJyZW50SW52b2NhdGlvbjtcblxuICBjb25zdCBlbmNsb3NpbmcgPSBDdXJyZW50SW52b2NhdGlvbi5nZXQoKTtcbiAgcmV0dXJuIGVuY2xvc2luZyAmJiBlbmNsb3NpbmcuaXNTaW11bGF0aW9uO1xufVxuIl19
