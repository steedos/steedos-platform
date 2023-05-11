/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-11 18:09:20
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-11 11:40:58
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
const jwt = require('jsonwebtoken');


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
			isPackage: false,
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
			// if(!this.settings.jwt.secret){
			// 	throw new Error(`${packageName} jwt secret is not defined`);
			// }
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
			const secret = this.settings.jwt.secret
			const jwtOptions = {
				// secretOrKey: this.settings.jwt.secret,
				secretOrKeyProvider: function (request, rawJwtToken, done) {
					try {
						let decoded = jwt.decode(rawJwtToken, { complete: true });
						let payload = decoded.payload
						const app_code = payload.app_code
						if (app_code) { // 走应用认证
							objectql.getObject('apps').find({filters: [['code', '=', app_code]], fields: ['secret']}).then((records)=>{
								if(records.length > 0){
									const app = records[0];
									if (app.secret) {
										return done(null, app.secret)
									}
									else {
										done(`app ${app_code}'s secret is null`, null)
									}
								}else{
									return done('app not find', null)
								}
							})
						}
						else if (secret) { // 走全局配置
							return done(null, secret)
						}
						else { // 都没有则认证不通过
							return done('need secret', null)
						}
					} catch (error) {
						// console.error(error)
						return done(error.message, null)
					}
					
				},
				jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), ExtractJwt.fromUrlQueryParameter('t')]) 
			}
			
			const jwtAuthenticate = function (jwt_payload, done) {
				try {
					const { profile, idKey } = jwt_payload;
					if(idKey && profile && profile[idKey]){
						objectql.getObject('users').find({filters: [[idKey, '=', profile[idKey]]], fields: ['_id', 'name', 'email', 'username']}).then((records)=>{
							if(records.length > 0){
								const user = records[0];
								return done(null, Object.assign({}, user, {id: user._id}))
							}else{
								return done('user not find', null)
							}
						})
					}else if(profile && profile.email){
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
