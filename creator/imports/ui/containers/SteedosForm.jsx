// import React from 'react';
const { API, ObjectForm, SteedosProvider, SteedosRouter: Router, Forms } = BuilderSteedos;

window.SteedosReactForms = Forms;
window.SteedosReactAPI = API;
// import { ObjectForm, SteedosProvider } from '@steedos/builder-object';
// import { FooterToolbar } from '@ant-design/pro-layout';
// import { Forms } from '@steedos/builder-store';
// import {
// 	BrowserRouter as Router
// } from "react-router-dom";
function SteedosFormContainer(prop){
	const { objectApiName, recordId, name, mode, onFinish, submitter, afterUpdate, afterInsert,isModalForm } = prop;
	function setFormMode(value){
		let form = Forms.loadById(name);
		form.setMode(value);
		console.log('form.setMode', value);
	}
	// API.client.setUrl(Meteor.absoluteUrl());
	API.client.setUserId(Steedos.getUserId());
	API.client.setToken(Steedos.getCookie("X-Auth-Token"));
	API.client.setSpaceId(Steedos.getSpaceId());
	let _submitter = submitter;
	if(_submitter !== false && !_submitter){
		_submitter = {
			render: (_, dom) => <div tabIndex="-1"
									 className="ant-drawer ant-drawer-bottom ant-drawer-open no-mask"
									 style={{height:"60px"}}>
				<div className="ant-drawer-content-wrapper">
					<div className="ant-drawer-content">
						<div className="ant-drawer-wrapper-body">
							<div className="ant-drawer-body" style={{padding: "12px", textAlign: "center"}}>
								<div className="ant-space ant-space-horizontal ant-space-align-center">
									{dom}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		}
	}


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
					submitter={_submitter}
					afterUpdate = {afterUpdate}
					afterInsert = {afterInsert}
					isModalForm={isModalForm}
				></ObjectForm>
			</Router>
		</SteedosProvider>
	)
}

export default SteedosFormContainer;