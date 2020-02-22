import React from 'react';
import { Provider } from 'react-redux';
import { SelectUsers, Bootstrap, store } from '@steedos/react';

function SelectUsersContainer(prop){
	return (
		<Provider store={store}>
			<Bootstrap>
				<SelectUsers searchMode="omitFilters" multiple={prop.multiple} gridId={prop.gridId} />
			</Bootstrap>
		</Provider>
	)
}

export default SelectUsersContainer;