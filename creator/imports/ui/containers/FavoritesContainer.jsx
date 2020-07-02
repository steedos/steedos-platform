import React from 'react';
import { Provider } from 'react-redux';
import { Favorites, Bootstrap, store } from '@steedos/react';

function FavoritesContainer(prop){
	return (
		<Provider store={store}>
			<Bootstrap>
				<Favorites title={prop.title} onToggleActionSelected={prop.onToggleActionSelected} recordOnClick={prop.recordOnClick} id={prop.id} editOnClick={prop.editOnClick}></Favorites>
			</Bootstrap>
		</Provider>
	)

		
}

export default FavoritesContainer;