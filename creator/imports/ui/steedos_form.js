import './steedos_form.html';
import SteedosFormContainer from './containers/SteedosForm.jsx';

Template.steedos_form.helpers({
	SteedosFormContainer: function(){
		return SteedosFormContainer;
	},
	objectApiName: function(){
		return this.objectApiName || Session.get("object_name");
	},
	recordId: function(){
		return this.recordId || Session.get("record_id");
	},
	name: function(){
		return this.name;
	},
	mode: function(){
		return this.mode;
	},
	onFinish: function(){
		return this.onFinish;
	},
	submitter: function(){
		return this.submitter;
	},
	afterInsert: function(){
		return this.afterInsert;
	},
	afterUpdate: function(){
		return this.afterUpdate;
	},
	isModalForm: function(){
		return this.isModalForm;
	}
})

