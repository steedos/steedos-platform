
global['fetch'] = require("node-fetch");

import { Client4 } from 'mattermost-redux/client';
import passport = require('passport');
import { Strategy } from 'passport-oauth2';
import express = require('express');

import crypto = require('crypto');
import Cookies = require('cookies');
import { default as Random } from './random';

declare var Meteor: any;


let router = express.Router();
let app = express();

let mattermost_url = process.env.MATTERMOST_URL;
let callback_url = process.env.MATTERMOST_CALLBACK_URL;
let client_id = process.env.MATTERMOST_CLIENT_ID;
let client_secret = process.env.MATTERMOST_CLIENT_SECRET;

let oauth2Strategy = new Strategy({
  authorizationURL: mattermost_url + "/oauth/authorize",
  tokenURL: mattermost_url + "/oauth/access_token",
  clientID: client_id,
  clientSecret: client_secret,
  callbackURL: callback_url
}, function (accessToken, refreshToken, profile, done) {
  return done(null, profile);
});

oauth2Strategy.userProfile = function (accessToken, done) {
  Client4.setUrl(mattermost_url);
  Client4.setToken(accessToken);
  return Client4.getMe().then(function (data) {
    return done(null, data);
  }).catch(function (err) {
    return done(err);
  });
};

passport.use(oauth2Strategy);

passport.serializeUser(function (user, done) {
  return done(null, user);
});

passport.deserializeUser(function (user, done) {
  return done(null, user);
});

router.get('/login', passport.authenticate('oauth2'));

router.get('/callback', function (req, res, next) {
  passport.authenticate('oauth2', function (err, user) {
    if (err) {
      return next(err);
    }
    if (req.query.error) {
      return next(new Error(req.query.error));
    }
    if (!user) {
      return next(new Error('no user'));
    }

    let cookies = req.cookies;
    let userId = cookies['X-User-Id'];
    let authToken = cookies['X-Auth-Token'];

    let setup = {
      _hashLoginToken: function (loginToken) {
        const hash = crypto.createHash('sha256');
        hash.update(loginToken);
        return hash.digest('base64');
      },
      setAuthCookies: function (req, res, userId, authToken) {
        let cookies = new Cookies(req, res);

        cookies.set("X-User-Id", userId, {
          maxAge: 90 * 60 * 60 * 24 * 1000,
          httpOnly: false,
          overwrite: true
        });

        cookies.set("X-Auth-Token", authToken, {
          maxAge: 90 * 60 * 60 * 24 * 1000,
          httpOnly: false,
          overwrite: true
        });
      },
      _generateStampedLoginToken: function () {
        return {
          token: Random.secret(),
          when: new Date
        };
      },
      _hashStampedToken: function (stampedToken) {
        const hashedStampedToken = Object.keys(stampedToken).reduce(
          (prev, key) => key === 'token' ?
            prev :
            { ...prev, [key]: stampedToken[key] },
          {},
        )
        return {
          ...hashedStampedToken,
          hashedToken: this._hashLoginToken(stampedToken.token)
        };
      },
      _insertHashedLoginToken: function (userId, hashedToken, query?) {
        query = query ? { ...query } : {};
        query._id = userId;
        Meteor.users.update(query, {
          $addToSet: {
            "services.resume.loginTokens": hashedToken
          }
        });
      }
    }
    if (userId && authToken) {
      let hashedToken = setup._hashLoginToken(authToken);
      user = Meteor.users.findOne({
        _id: userId,
        "services.resume.loginTokens.hashedToken": hashedToken
      });
      if (user) {
        setup.setAuthCookies(req, res, userId, authToken);
        return res.redirect('/');
      }
    }
    let suer = Meteor.users.findOne({
      $or: [
        {
          'username': user.username
        }, {
          'emails.address': user.email
        }
      ]
    });
    if (suer) {
      authToken = setup._generateStampedLoginToken();
      let token = authToken.token;
      let hashedToken = setup._hashStampedToken(authToken);
      setup._insertHashedLoginToken(suer._id, hashedToken);
      setup.setAuthCookies(req, res, suer._id, token);
    }

    return res.redirect('/');
  })(req, res, next);
});


app.use('/steedos/oauth2/messenger', router);

export default app;
