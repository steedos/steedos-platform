import React from 'react';
import { Provider } from 'react-redux';
import Dashboard from 'steedos-webapp/lib/components/dashboard';
import Bootstrap from 'steedos-webapp/lib/components/bootstrap';
import store from 'steedos-webapp/lib/stores/configureStore';
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