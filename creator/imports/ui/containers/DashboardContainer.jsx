import React from 'react';
import { Provider } from 'react-redux';
import { Dashboard, Bootstrap, store } from '@steedos/react';
import { IconSettings } from '@salesforce/design-system-react';

var iconPath = `/creator/assets/icons`;

function DashboardContainer(prop){
	return (
		<Provider store={store}>
			<Bootstrap>
					<Dashboard config={prop.config}/>
			</Bootstrap>
		</Provider>
	)
}

export default DashboardContainer;