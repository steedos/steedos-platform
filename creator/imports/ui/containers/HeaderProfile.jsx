import React from 'react';
import { Provider } from 'react-redux';
import { HeaderProfile, Bootstrap, store } from '@steedos/react';

function HeaderProfileContainer(prop){
	return (
		<Provider store={store}>
			<Bootstrap>
				<HeaderProfile avatarURL={prop.avatarURL} logoutAccountClick={prop.logoutAccountClick} settingsAccountClick={prop.settingsAccountClick} footers={prop.footers} assistiveText={prop.assistiveText}/>
			</Bootstrap>
		</Provider>
	)
}

export default HeaderProfileContainer;