/// BCRYPT
var bcrypt = NpmModuleBcrypt;
var bcryptHash = Meteor.wrapAsync(bcrypt.hash);
var bcryptCompare = Meteor.wrapAsync(bcrypt.compare);

var passwordValidator = Match.OneOf(
  String,
  { digest: String, algorithm: String }
);

var checkPassword = Accounts._checkPassword;

// Given a 'password' from the client, extract the string that we should
// bcrypt. 'password' can be one of:
//  - String (the plaintext password)
//  - Object with 'digest' and 'algorithm' keys. 'algorithm' must be "sha-256".
//
var getPasswordString = function (password) {
  if (typeof password === "string") {
    password = SHA256(password);
  } else { // 'password' is an object
    if (password.algorithm !== "sha-256") {
      throw new Error("Invalid password hash algorithm. " +
                      "Only 'sha-256' is allowed.");
    }
    password = password.digest;
  }
  return password;
};

// Use bcrypt to hash the password for storage in the database.
// `password` can be a string (in which case it will be run through
// SHA256 before bcrypt) or an object with properties `digest` and
// `algorithm` (in which case we bcrypt `password.digest`).
//
var hashPassword = function (password) {
  password = getPasswordString(password);
  return bcryptHash(password, Accounts._bcryptRounds);
};

///
/// ERROR HANDLER
///
var handleError = function(msg, throwError) {
  if(throwError === undefined){
    throwError = true;
  }
  var error = new Meteor.Error(
    403,
    Accounts._options.ambiguousErrorMessages
      ? "Something went wrong. Please check your credentials."
      : msg
  );
  if (throwError) {
    throw error;
  }
  return error;
};

// Generates permutations of all case variations of a given string.
var generateCasePermutationsForString = function (string) {
  var permutations = [''];
  for (var i = 0; i < string.length; i++) {
    var ch = string.charAt(i);
    permutations = _.flatten(_.map(permutations, function (prefix) {
      var lowerCaseChar = ch.toLowerCase();
      var upperCaseChar = ch.toUpperCase();
      // Don't add unneccesary permutations when ch is not a letter
      if (lowerCaseChar === upperCaseChar) {
        return [prefix + ch];
      } else {
        return [prefix + lowerCaseChar, prefix + upperCaseChar];
      }
    }));
  }
  return permutations;
};

// Generates a MongoDB selector that can be used to perform a fast case
// insensitive lookup for the given fieldName and string. Since MongoDB does
// not support case insensitive indexes, and case insensitive regex queries
// are slow, we construct a set of prefix selectors for all permutations of
// the first 4 characters ourselves. We first attempt to matching against
// these, and because 'prefix expression' regex queries do use indexes (see
// http://docs.mongodb.org/v2.6/reference/operator/query/regex/#index-use),
// this has been found to greatly improve performance (from 1200ms to 5ms in a
// test with 1.000.000 users).
var selectorForFastCaseInsensitiveLookup = function (fieldName, string) {
  // Performance seems to improve up to 4 prefix characters
  var prefix = string.substring(0, Math.min(string.length, 4));
  var orClause = _.map(generateCasePermutationsForString(prefix),
    function (prefixPermutation) {
      var selector = {};
      selector[fieldName] =
        new RegExp('^' + Meteor._escapeRegExp(prefixPermutation));
      return selector;
    });
  var caseInsensitiveClause = {};
  caseInsensitiveClause[fieldName] =
    new RegExp('^' + Meteor._escapeRegExp(string) + '$', 'i')
  return {$and: [{$or: orClause}, caseInsensitiveClause]};
}

Accounts._findUserByQueryForSteedos = function (query) {
  var user = null;

  if (query.id) {
    user = Meteor.users.findOne({ _id: query.id });
  } else {
    var fieldName;
    var fieldValue;
    if (query.username) {
      fieldName = 'username';
      fieldValue = query.username;
    } else if (query.email) {
      fieldName = 'emails.address';
      fieldValue = query.email;
    } else if (query.phone) {
      fieldName = 'phone.number';
      // fieldValue如果自带区号，则不做处理，反之默认加上中国区号+86
      if(/^\+\d+/g.test(query.phone)){
        fieldValue = query.phone;
      }
      else{
        fieldValue = "+86" + query.phone;
      }
      fieldName = "$or"
      fieldValue = [{'phone.number':fieldValue},{username:query.phone}]
    } else {
      throw new Error("shouldn't happen (validation missed something)");
    }
    var selector = {};
    selector[fieldName] = fieldValue;
    user = Meteor.users.findOne(selector);
    // If user is not found, try a case insensitive lookup
    if (!user && fieldName != "$or") {
      selector = selectorForFastCaseInsensitiveLookup(fieldName, fieldValue);
      var candidateUsers = Meteor.users.find(selector).fetch();
      // No match if multiple candidates are found
      if (candidateUsers.length === 1) {
        user = candidateUsers[0];
      }
    }
  }

  return user;
};

var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length > 0;
});

var userQueryValidator = Match.Where(function (user) {
  check(user, {
    id: Match.Optional(NonEmptyString),
    username: Match.Optional(NonEmptyString),
    email: Match.Optional(NonEmptyString),
    phone: Match.Optional(NonEmptyString)
  });
  if (_.keys(user).length !== 1)
    throw new Match.Error("User property must have exactly one field");
  return true;
});

Accounts.registerLoginHandler("password2", function (options) {
  if (! options.password2 || options.srp)
    return undefined; // don't handle

  check(options, {
    user: userQueryValidator,
    password2: passwordValidator
  });


  var user = Accounts._findUserByQueryForSteedos(options.user);
  if (!user) {
    handleError("User not found");
  }

  if (!user.services || !user.services.password ||
      !(user.services.password.bcrypt || user.services.password.srp)) {
    handleError("User has no password set");
  }

  if (!user.services.password.bcrypt) {
    if (typeof options.password2 === "string") {
      // The client has presented a plaintext password, and the user is
      // not upgraded to bcrypt yet. We don't attempt to tell the client
      // to upgrade to bcrypt, because it might be a standalone DDP
      // client doesn't know how to do such a thing.
      var verifier = user.services.password.srp;
      var newVerifier = SRP.generateVerifier(options.password2, {
        identity: verifier.identity, salt: verifier.salt});

      if (verifier.verifier !== newVerifier.verifier) {
        return {
          userId: Accounts._options.ambiguousErrorMessages ? null : user._id,
          error: handleError("Incorrect password", false)
        };
      }

      return {userId: user._id};
    } else {
      // Tell the client to use the SRP upgrade process.
      throw new Meteor.Error(400, "old password format", EJSON.stringify({
        format: 'srp',
        identity: user.services.password.srp.identity
      }));
    }
  }

  return checkPassword(
    user,
    options.password2
  );
});

// Handler to login using the SRP upgrade path. To use this login
// handler, the client must provide:
//   - srp: H(identity + ":" + password)
//   - password: a string or an object with properties 'digest' and 'algorithm'
//
// We use `options.srp` to verify that the client knows the correct
// password without doing a full SRP flow. Once we've checked that, we
// upgrade the user to bcrypt and remove the SRP information from the
// user document.
//
// The client ends up using this login handler after trying the normal
// login handler (above), which throws an error telling the client to
// try the SRP upgrade path.
//
// XXX COMPAT WITH 0.8.1.3
Accounts.registerLoginHandler("password2", function (options) {
  if (!options.srp || !options.password2) {
    return undefined; // don't handle
  }

  check(options, {
    user: userQueryValidator,
    srp: String,
    password2: passwordValidator
  });

  var user = Accounts._findUserByQueryForSteedos(options.user);
  if (!user) {
    handleError("User not found");
  }

  // Check to see if another simultaneous login has already upgraded
  // the user record to bcrypt.
  if (user.services && user.services.password && user.services.password.bcrypt) {
    return checkPassword(user, options.password2);
  }

  if (!(user.services && user.services.password && user.services.password.srp)) {
    handleError("User has no password set");
  }

  var v1 = user.services.password.srp.verifier;
  var v2 = SRP.generateVerifier(
    null,
    {
      hashedIdentityAndPassword: options.srp,
      salt: user.services.password.srp.salt
    }
  ).verifier;
  if (v1 !== v2) {
    return {
      userId: Accounts._options.ambiguousErrorMessages ? null : user._id,
      error: handleError("Incorrect password", false)
    };
  }

  // Upgrade to bcrypt on successful login.
  var salted = hashPassword(options.password2);
  Meteor.users.update(
    user._id,
    {
      $unset: { 'services.password.srp': 1 },
      $set: { 'services.password.bcrypt': salted }
    }
  );

  return {userId: user._id};
});