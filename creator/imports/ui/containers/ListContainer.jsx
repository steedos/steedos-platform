import React from 'react';
import { Provider } from 'react-redux';
import { List, Bootstrap, store } from '@steedos/react';

function ListContainer(prop){
	console.log('ListContainer prop', prop);
	if(!prop.listProps){
		return null;
	}
	return (
		<Provider store={store}>
			<Bootstrap>
				<List id={prop.id} {...prop.listProps}/>
			</Bootstrap>
		</Provider>
	)
}

export default ListContainer;