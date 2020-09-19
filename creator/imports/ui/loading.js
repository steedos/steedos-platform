import './loading.html';
import { Illustration } from '@steedos/react';

Template.recordLoading.helpers({
	illustration: function() {
	  return Illustration;
	},
	path: function() {
	  return Steedos.absoluteUrl("/assets/images/illustrations/empty-state-no-results.svg#no-results");
	},
	heading: function(){
		return '';
	},
	messageBody: function(){
		return '';
	}
});
