import React, { useRef } from 'react';
import { ObjectListView, SteedosRouter as Router, SteedosProvider } from '@steedos/builder-community/dist/builder-community.react.js';
function SteedosGridContainer(prop){
	const { objectApiName, name, listName, filters, onModelUpdated, sideBar, pageSize, onUpdated, checkboxSelection, columnFields, autoFixHeight, autoHideForEmptyData } = prop;
	const gridRef = useRef();
	window.gridRef = gridRef;
	if(!window.gridRefs){
		window.gridRefs = {};
	}
	window.gridRefs[name] = gridRef;
	window.refreshGrid = (name)=>{
		const grid = name ? window.gridRefs[name] : window.gridRef;
		if(!grid){
			return;
		}
		const rowModel = grid.current.api.rowModel.getType();
		if(rowModel === "serverSide"){
			grid.current.api.refreshServerSideStore();
		}
		else{
			// infinite
			grid.current.api.rowModel.reset()
			// grid.current.api.ensureIndexVisible(0);
			// grid.current.api.purgeInfiniteCache()
		}
	}
	if(!objectApiName){
		return null;
	}
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
					columnFields={columnFields}
					checkboxSelection={checkboxSelection}
					autoFixHeight={autoFixHeight}
					autoHideForEmptyData={autoHideForEmptyData}
					></ObjectListView>
			</Router>
		</SteedosProvider>
	)
}

export default SteedosGridContainer;