"use strict";
const passport = require('passport');
const JwtStrategy = require("passport-jwt").Strategy
const session = require('express-session');

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
	name: 'passport-jwt',
	mixins: [],
	/**
	 * Settings
	 */
	settings: {
    jwt: {
      secret: process.env.STEEDOS_IDENTITY_JWT_SECRET,
      cookieName: process.env.STEEDOS_IDENTITY_JWT_COOKIE_NAME
    },
    session: {
      secret: process.env.STEEDOS_IDENTITY_SESSION_SECRET,
    }
	},

	/**
	 * Dependencies
	 */
	dependencies: ['steedos-server'],

	/**
	 * Actions
	 */
	actions: {

	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {
		
	},

	/**
	 * Service created lifecycle event handler
	 */
	async created() {
	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {
        
		const jwtOptions = {
      secretOrKey: this.settings.jwt.secret,
      jwtFromRequest: (ctx) => {
        return ctx.cookies.get(this.settings.jwt.cookieName)
      },
    }
    const jwtAuthenticate = async function (jwt, done) {
      try {
        return done(null, jwt)
      } catch (err) {
        return authError(done, "JWT invalid", err)
      }
    }
		
		passport.use(new JwtStrategy(jwtOptions, jwtAuthenticate))
		
    const sessionOptions = {
      secret: this.settings.session.secret,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: true }
    }

    const app = WebApp.connectHandlers;

		// express/nodejs style application callback (req, res, next) for use with express apps, see /examples/express.js
		app.use(passport.authenticate('jwt'));
		app.use(session(sessionOptions));
    app.use(passport.authenticate('session'));

		this.logger.warn(`service started.`);
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
