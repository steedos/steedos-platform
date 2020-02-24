import './template_flows_modal.html';
import { pluginComponentSelector, store, viewStateSelector, createFlowsModalAction } from '@steedos/react';
import FlowsModalContainer from './containers/FlowsModal'
var _ = require("underscore");

var templateSpace = "template";
var gridId = "templateFlowsModalGridId";
var modalId = "templateFlowsModal";

var onConfirm = '';

Template.templateFlowsModal.helpers({
	component: function(){
		return FlowsModalContainer;
	},
	spaceId: function () {
		return templateSpace;
	},
	multiple: function(){
		return false;
	},
	gridId: function(){
		return gridId;
	},
	modalId: function () {
		return modalId;
	},
	onConfirm: function(){
		return function(){
			console.log('on confirm...');
			if(_.isFunction(onConfirm)){
				onConfirm(viewStateSelector(store.getState(), gridId).selection);
			}
		}
	}
});


Template.templateFlowsModal.show = function(options){
	if(options && _.isFunction(options.onConfirm)){
		onConfirm = options.onConfirm;
	}
	store.dispatch(createFlowsModalAction('isOpen', true, {id: modalId}))
};