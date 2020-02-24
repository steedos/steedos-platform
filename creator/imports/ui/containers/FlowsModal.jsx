import React from 'react';
import { Provider } from 'react-redux';
import { FlowsModal, Bootstrap, store } from '@steedos/react';

function FlowsModalContainer(prop){
	return (
		<Provider store={store}>
			<Bootstrap>
				<FlowsModal id={prop.modalId} appElement={prop.appElement || "body"} onConfirm={prop.onConfirm} gridId={prop.gridId} multiple={prop.multiple} spaceId={prop.spaceId} />
			</Bootstrap>
		</Provider>
	)
}

export default FlowsModalContainer;