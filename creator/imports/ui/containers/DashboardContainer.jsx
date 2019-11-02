function DashboardContainer(prop){
	return (
		<ReactRedux.Provider store={ReactSteedos.store}>
			<ReactSteedos.Bootstrap>
				<ReactSteedos.Dashboard config={prop.config} />
			</ReactSteedos.Bootstrap>
		</ReactRedux.Provider>
	);
}

export default DashboardContainer;