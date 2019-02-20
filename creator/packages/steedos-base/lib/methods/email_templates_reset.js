Accounts.emailTemplates = {
	from: (function(){
		var defaultFrom = "Steedos <noreply@message.steedos.com>";
		if(!Meteor.settings)
			return defaultFrom;
		
		if(!Meteor.settings.email)
			return defaultFrom;

		if(!Meteor.settings.email.from)
			return defaultFrom;
		
		return Meteor.settings.email.from;
	})(),
	resetPassword: {
		subject: function (user) {
			return TAPi18n.__("users_email_reset_password",{},user.locale);
		},
		text: function (user, url) {
			var splits = url.split("/");
			var tokenCode = splits[splits.length-1];
			var greeting = user.profile && user.profile.name ? TAPi18n.__("users_email_hello",{},user.locale) + user.profile.name + "," : TAPi18n.__("users_email_hello",{},user.locale) + ",";
			return greeting + "\n\n" + TAPi18n.__("users_email_reset_password_body",{token_code:tokenCode},user.locale) + "\n\n" + url + "\n\n" + TAPi18n.__("users_email_thanks",{},user.locale) + "\n";
		}
	},
	verifyEmail: {
		subject: function (user) {
			return TAPi18n.__("users_email_verify_email",{},user.locale);
		},
		text: function (user, url) {
			var greeting = user.profile && user.profile.name ? TAPi18n.__("users_email_hello",{},user.locale) + user.profile.name + "," : TAPi18n.__("users_email_hello",{},user.locale) + ",";
			return greeting + "\n\n" + TAPi18n.__("users_email_verify_account",{},user.locale) + "\n\n" + url + "\n\n" + TAPi18n.__("users_email_thanks",{},user.locale) + "\n";
		}
	},
	enrollAccount: {
		subject: function (user) {
			return TAPi18n.__("users_email_create_account",{},user.locale);
		},
		text: function (user, url) {
			var greeting = user.profile && user.profile.name ? TAPi18n.__("users_email_hello",{},user.locale) + user.profile.name + "," : TAPi18n.__("users_email_hello",{},user.locale) + ",";
			return greeting + "\n\n" + TAPi18n.__("users_email_start_service",{},user.locale) + "\n\n" + url + "\n\n" + TAPi18n.__("users_email_thanks",{},user.locale) + "\n";
		}
	}
};