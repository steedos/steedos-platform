import './button.html';
import { Button } from '@steedos/design-system-react';

Template.steedos_button.helpers({
	component: function () {
		return Button;
	},
	iconCategory: function () {
		return this.iconCategory;
	},
	title: function () {
		return this.title;
	},
	iconName: function () {
		return this.iconName;
	},
	iconSize: function () {
		return this.iconSize;
	},
	iconVariant: function () {
		return this.iconVariant;
	},
	variant: function () {
		return this.variant;
	},
	className: function () {
		return this.className;
	},
	iconClassName: function () {
		return this.iconClassName;
	},
	style: function () {
		return this.style;
	},
	assistiveText: function () {
		if(this.assistiveText){
			return this.assistiveText;
		}
		else if(this.title){
			return { label: this.title }
		}
	}
});
