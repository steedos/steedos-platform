import { pluginComponentSelector, store, Bootstrap, Dashboard } from '@steedos/react';
import { Provider } from 'react-redux';

function DashboardContainer(prop){
	return (
		<Provider store={store}>
			<Bootstrap>
				<Dashboard config={prop.config} />
			</Bootstrap>
		</Provider>
	);
}

export default DashboardContainer;