import './button.html';
const { Button } = DesignSystem;

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
	}
});
