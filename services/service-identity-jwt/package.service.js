/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-11 18:09:20
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-18 09:34:32
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const packageName = project.name;
const objectql = require('@steedos/objectql');
const packageLoader = require('@steedos/service-package-loader');
const passport = require('passport');
const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;


const authError = function (done, message, err = null) {
	return done(
		message,
		null
	);
};

module.exports = {
	name: packageName,
	namespace: "steedos",
	mixins: [packageLoader],
	/**
	 * Settings
	 */
	settings: {
		packageInfo: {
			path: __dirname,
			name: packageName,
			isPackage: true
		},
		jwt: {
			secret: process.env.STEEDOS_IDENTITY_JWT_SECRET,
		}
	},

	/**
	 * Dependencies
	 */
	dependencies: [],

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
		beforeStart: async function () {
			if(!this.settings.jwt.secret){
				throw new Error(`${packageName} jwt secret is not defined`);
			}
		}
	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {
	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {
		try {
            if(this.settings.jwt.secret){
				const jwtOptions = {
					secretOrKey: this.settings.jwt.secret,
					jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
				}
				
				const jwtAuthenticate = function (jwt_payload, done) {
					try {
						const { profile } = jwt_payload;
						if(profile && profile.email){
							objectql.getObject('users').find({filters: [['email', '=', profile.email]], fields: ['_id', 'name', 'email', 'username']}).then((records)=>{
								if(records.length > 0){
									const user = records[0];
									return done(null, Object.assign({}, user, {id: user._id}))
								}else{
									return done('user not find', null)
								}
							})
						}else{
							return done('JWT invalid', null)
						}
					} catch (err) {
						return authError(done, "JWT invalid", err)
					}
				}
				
				passport.use(new JwtStrategy(jwtOptions, jwtAuthenticate))
			}
        } catch (error) {
            // this.setError(error);
			this.broker.logger.error(error)
        }
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
