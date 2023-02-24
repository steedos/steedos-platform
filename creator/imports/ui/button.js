import './button.html';

Template.steedos_button.helpers({
	component: function () {
		return Button;
	},
	data: function () {
		let assistiveText;
		if(this.assistiveText){
			assistiveText = this.assistiveText;
		}
		else if(this.title){
			assistiveText = { label: this.title }
		}
		return Object.assign({}, {...this}, {
			title: this.title || this.label,
			className: this.className || this.class,
			assistiveText
		}, {component: Button})
	},
	className: function () {
		return this.className || this.class;
	},
	iconCategory: function () {
		return this.iconCategory
	},
	iconName: function () {
		return this.iconName
	},
	variant: function () {
		return this.variant
	},
	title: function () {
		return this.title
	},
	iconVariant: function () {
		return this.iconVariant
	},
	iconSize: function () {
		return this.iconSize
	},
	basePath: function(){
		var basePath = Steedos.absoluteUrl();
		if(basePath && basePath.endsWith('/')){
			return basePath.substr(0, basePath.length - 1);
		}
		return basePath;
	}
});
