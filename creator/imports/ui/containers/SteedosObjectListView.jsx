import React, { useRef } from 'react';
import { ObjectListView, SteedosRouter as Router, SteedosProvider } from '@steedos/builder-community/dist/builder-community.react.js';
function SteedosGridContainer(prop){
	const { objectApiName, name, listName, filters, onModelUpdated, sideBar, pageSize, onUpdated, checkboxSelection } = prop;
	const gridRef = useRef();
	window.gridRef = gridRef;
	if(!window.gridRefs){
		window.gridRefs = {};
	}
	window.gridRefs[name] = gridRef;
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
					pageSize={pageSize}
					onUpdated={onUpdated}
					checkboxSelection={checkboxSelection}
				></ObjectListView>
			</Router>
		</SteedosProvider>
	)
}

export default SteedosGridContainer;