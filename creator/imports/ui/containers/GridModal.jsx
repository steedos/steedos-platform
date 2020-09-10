import React from 'react';
import { GridModal, Bootstrap, store } from '@steedos/react';

function GridModalContainer(prop){
	const Provider = ReactRedux.Provider;
	// console.log('GridModalContainer prop', prop);
	return (
		<Provider store={store}>
			<Bootstrap>
				<GridModal appElement={"body"} {...prop.gridModalProp}/>
			</Bootstrap>
		</Provider>
	)
}

export default GridModalContainer;