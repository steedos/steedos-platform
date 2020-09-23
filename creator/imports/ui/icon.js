import './icon.html';
import { Icon } from '@steedos/design-system-react';

const getSourceName = (source, name) => {
	var foo;
	foo = name != null ? name.split(".") : void 0;
	if (foo && foo.length > 1) {
	  return foo[0];
	}
	if (source != null ? source.endsWith("-sprite") : void 0) {
	  return source.substr(0, source.length - 7);
	}
};

Template.steedos_icon.helpers({
	icon: function () {
		return Icon;
	},
	category: function () {
		return this.category || getSourceName(this.source, this.name);
	},
	name: function () {
		return this.name;
	},
	size: function () {
		return this.size;
	},
	className: function () {
		return this.className || this.class;
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
		if(this.assistiveText){
			return this.assistiveText;
		}
		else if(this.title){
			{ label: this.title }
		}
	}
});
