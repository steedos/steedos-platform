import React from 'react';
import { HeaderProfile, Bootstrap, store } from '@steedos/react';

function HeaderProfileContainer(prop){
	const Provider = ReactRedux.Provider;
	return (
		<Provider store={store}>
			<Bootstrap>
				<HeaderProfile avatarURL={prop.avatarURL} logoutAccountClick={prop.logoutAccountClick} settingsAccountClick={prop.settingsAccountClick} footers={prop.footers} assistiveText={prop.assistiveText}/>
			</Bootstrap>
		</Provider>
	)
}

export default HeaderProfileContainer;