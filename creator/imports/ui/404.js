import './404.html';
import { Illustration } from '@steedos/react';

Template.notFound.helpers({
	object: function() {
	  return Creator.getObject();
	},
	illustration: function() {
	  return Illustration;
	},
	notFoundPath: function() {
	  return Creator.getRelativeUrl("/assets/images/illustrations/empty-state-no-results.svg#no-results");
	},
	notFoundHeading: function() {
	  return t("creator_not_found_heading");
	},
	notFoundMessageBody: function() {
	  return t("creator_not_found_message_body");
	}
});
