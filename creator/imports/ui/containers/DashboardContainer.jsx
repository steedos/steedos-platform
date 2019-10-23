import React from 'react';
import { Provider } from 'react-redux';
import { Dashboard, Bootstrap, store } from '@steedos/react';
import { IconSettings } from '@salesforce/design-system-react';

var iconPath = `/assets/icons`;

function DashboardContainer(prop){
	return <IconSettings iconPath={iconPath} >
		<Provider store={store}>
			<Bootstrap>
				<Dashboard config={prop.config}/>
			</Bootstrap>
		</Provider>
	</IconSettings>
}

export default DashboardContainer;