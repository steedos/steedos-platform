import './icon.html';
import { Icon } from '@steedos/design-system-react';

Template.icon.helpers({
	icon: function () {
		debugger;
		return Icon;
	},
	category: function () {
		debugger;
		return this.category;
	},
	name: function () {
		return this.name;
	},
	size: function () {
		return this.size;
	},
	className: function () {
		return this.className;
	},
	title: function () {
		return this.title;
	},
	colorVariant: function () {
		return this.colorVariant;
	},
	style: function () {
		return this.style;
	},
	containerStyle: function () {
		return this.containerStyle;
	},
	assistiveText: function () {
		return { label: "abc" }
		// return this.assistiveText;
	}
});
