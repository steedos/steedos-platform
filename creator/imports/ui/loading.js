import './loading.html';
const { Illustration } = BuilderCreator

Template.recordLoading.helpers({
	illustration: function() {
	  return Illustration;
	},
	path: function() {
	  return Creator.getRelativeUrl("/assets/images/illustrations/empty-state-no-results.svg#no-results");
	},
	heading: function(){
		return '';
	},
	messageBody: function(){
		return '';
	}
});
