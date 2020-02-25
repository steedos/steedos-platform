import React from 'react';
import { Provider } from 'react-redux';
import { GridModal, Bootstrap, store } from '@steedos/react';

function GridModalContainer(prop){
	console.log('GridModalContainer prop', prop);
	return (
		<Provider store={store}>
			<Bootstrap>
				<GridModal appElement={"body"} {...prop.gridModalProp}/>
			</Bootstrap>
		</Provider>
	)
}

export default GridModalContainer;