import React from 'react';
import { FlowsModal, Bootstrap, store } from '@steedos/react';

function FlowsModalContainer(prop){
	const Provider = ReactRedux.Provider;
	return (
		<Provider store={store}>
			<Bootstrap>
				<FlowsModal id={prop.modalId} appElement={prop.appElement || "body"} onConfirm={prop.onConfirm} gridId={prop.gridId} multiple={prop.multiple} spaceId={prop.spaceId} gridProp={prop.gridProp}/>
			</Bootstrap>
		</Provider>
	)
}

export default FlowsModalContainer;