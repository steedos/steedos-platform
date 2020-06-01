import React from 'react';
import { Provider } from 'react-redux';
import { Modal, Bootstrap, store, FlowsTree } from '@steedos/react';
// modalProp： heading={prop.heading} id={prop.modalId} appElement="body" onConfirm={prop.onConfirm} align={prop.align} footer={prop.footer}
// treeProp: rootNodes={prop.rootNodes} nodes={prop.nodes} id={prop.treeId}
function FlowsTreeModalContainer(prop){
	// console.log('FlowsTreeModalContainer prop', prop);
	return (
		<Provider store={store}>
			<Bootstrap>
				<Modal appElement={prop.appElement} id={prop.id} {...prop.modalProp}>
					<FlowsTree {...prop.treeProp}/>
				</Modal>
			</Bootstrap>
		</Provider>
	)
}

export default FlowsTreeModalContainer;