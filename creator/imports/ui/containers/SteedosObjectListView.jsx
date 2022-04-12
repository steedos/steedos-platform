const { useRef } = React;
const { ObjectListView, SteedosRouter : Router, SteedosProvider } = BuilderSteedos

window.refreshGrid = (name)=>{
	const grid = name ? window.gridRefs[name] : window.gridRef;
	if(!grid || !grid.current){
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

function SteedosGridContainer(prop){
	const { objectApiName, name, listName, filters, treeRootFilters, onModelUpdated, sideBar, pageSize, onUpdated, checkboxSelection, columnFields, autoFixHeight, autoHideForEmptyData, sort } = prop;
	const gridRef = useRef();
	window.gridRef = gridRef;
	if(!window.gridRefs){
		window.gridRefs = {};
	}
	window.gridRefs[name] = gridRef;
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
					sort={sort}
					treeRootFilters={treeRootFilters}
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