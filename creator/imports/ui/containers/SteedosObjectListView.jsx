import React, { useRef } from 'react';
import { ObjectListView, SteedosRouter as Router, SteedosProvider } from '@steedos/builder-community/dist/builder-community.react.js';
function SteedosGridContainer(prop){
	const { objectApiName, name, listName, filters, onModelUpdated, sideBar } = prop;
	const gridRef = useRef();
	window.gridRef = gridRef;
	return (
		<SteedosProvider iconPath="/assets/icons">
			<Router>
				<ObjectListView
					name={name}
					gridRef={gridRef}
					objectApiName={objectApiName}
					listName={listName}
					filters={filters}
					sideBar={sideBar}
					onModelUpdated={onModelUpdated}
				></ObjectListView>
			</Router>
		</SteedosProvider>
	)
}

export default SteedosGridContainer;