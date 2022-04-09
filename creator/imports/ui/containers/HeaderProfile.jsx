// import React from 'react';
const { HeaderProfile, Bootstrap, store } = BuilderCreator

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