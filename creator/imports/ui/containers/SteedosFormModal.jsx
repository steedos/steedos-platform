import React from 'react';
import { API, ObjectForm, SteedosProvider, SteedosRouter as Router, Forms } from '@steedos/builder-community/dist/builder-community.react.js';
import { Button } from 'antd';
// import { ObjectForm, SteedosProvider } from '@steedos/builder-object';
// import { FooterToolbar } from '@ant-design/pro-layout';
// import { Forms } from '@steedos/builder-store';
// import {
// 	BrowserRouter as Router
// } from "react-router-dom";
function SteedosFormContainer(prop){
	const { objectApiName, recordId, name, mode, onFinish, submitter, afterUpdate, afterInsert,title, triggerLabel, triggerId } = prop;
	function setFormMode(value){
		let form = Forms.loadById(name);
		form.setMode(value);
		console.log('form.setMode', value);
	}
	// API.client.setUrl(Meteor.absoluteUrl());
	API.client.setUserId(Steedos.getUserId());
	API.client.setToken(Steedos.getCookie("X-Auth-Token"));
	API.client.setSpaceId(Steedos.getSpaceId());
	return (
		<SteedosProvider iconPath="/assets/icons">
			<Router>
				<ObjectForm
					layout='horizontal'
					recordId={recordId}
					objectApiName={objectApiName}
					name={name}
					mode={mode}
					// onFinish={onFinish}
					submitter={submitter}
					afterUpdate = {afterUpdate}
					afterInsert = {afterInsert}
					isModalForm={true}
					trigger={<Button type="primary" id={triggerId}>{triggerLabel}</Button>}
					title={title}
					// submitter={{
					// 	// render: (_, dom) => <FooterToolbar style={{height: "64px", lineHeight:"64px"}}>{dom}</FooterToolbar>
					// 	// ,
					// 	searchConfig: {
					// 		resetText: '取消',
					// 		submitText: '提交',
					// 	},
					// 	resetButtonProps: {
					// 		onClick: () => {
					// 			setFormMode('read')
					// 		},
					// 	},
					// }}
				></ObjectForm>
			</Router>
		</SteedosProvider>
	)
}

export default SteedosFormContainer;