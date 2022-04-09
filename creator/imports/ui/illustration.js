import './illustration.html';
const { Illustration } = BuilderCreator

Template.illustration.helpers({
	illustration: function () {
		return Illustration;
	},
	path: function () {
		return this.path || Creator.getRelativeUrl("/assets/images/illustrations/empty-state-no-results.svg#no-results");
	},
	heading: function () {
		return this.heading;
	},
	messageBody: function () {
		return this.messageBody;
	}
});
