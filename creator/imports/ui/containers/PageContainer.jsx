import { store, Bootstrap } from '@steedos/react';

function PageContainer(prop){
  const Provider = ReactRedux.Provider;
	const pageId = this.props.pageId;
	if (!pageId || !Steedos.Pages[pageId])
		return null;
	const Page = Steedos.Pages[pageId]	
	return (
		<Provider store={store}>
			<Bootstrap>
				<Page/>
			</Bootstrap>
		</Provider>
	);
}

export default PageContainer;