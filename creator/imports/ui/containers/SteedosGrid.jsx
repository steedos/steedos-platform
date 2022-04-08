import React from 'react';
const { ObjectGrid, SteedosProvider, SteedosRouter : Router } = SteedosUICommunity
function SteedosGridContainer(prop){
	const { objectApiName, name, columnFields, filters, sort, onChange } = prop;
	return (
		<SteedosProvider iconPath="/assets/icons">
			<Router>
				<ObjectGrid
					name={name}
					columnFields={columnFields}
					objectApiName={objectApiName}
					filters={filters}
					sort={sort}
					onChange={onChange}
				></ObjectGrid>
			</Router>
		</SteedosProvider>
	)
}

export default SteedosGridContainer;