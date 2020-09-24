import './button.html';
import { Button } from '@steedos/design-system-react';

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
			assistiveText
		}, {component: Button})
	}
});
