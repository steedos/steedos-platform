import { store, Bootstrap, Dashboard } from '@steedos/react';
import { Provider } from 'react-redux';

function DashboardContainer(prop){
	return (
		<Provider store={store}>
			<Bootstrap>
				<Dashboard config={prop.config} assistiveText={prop.assistiveText} />
			</Bootstrap>
		</Provider>
	);
}

export default DashboardContainer;