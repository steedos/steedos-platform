/*
* @Author: steedos
* @Date: 2022-03-22 19:13:57
* @Description: 提供自定义page渲染能力, 供内部使用, 内容会迭代调整, 不对用户开放. 
*/
;(function(){
    Steedos.Page = {
        App: {},
        Record: {},
        Listview: {},
        Header: {},
        RelatedListview: {},
        Form: {
            StandardNew: {},
            StandardEdit: {}
        },
        Data: {},
        reload: function(){
            FlowRouter.reload();
        }
    };

    function upperFirst(str) {
        return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
    };

    function getModalElement(name){
        let modalRoot = document.getElementById(`steedos-page-modal-root-${name}`);
        if (!modalRoot) {
        modalRoot = document.createElement('div');
        modalRoot.setAttribute('class', 'h-full');
        modalRoot.setAttribute('id', `steedos-page-modal-root-${name}`);
        document.body.appendChild(modalRoot)
        }
        return modalRoot;
    }

    Steedos.Page.getPage = function (type, appId, objectApiName, recordId, pageId) {
        let objectInfo = null;
        let searchParams = FlowRouter.current().queryParams;

        const display = searchParams['display']
        const listViewId = searchParams['listview_id']
        const sideObject = searchParams['side_object']
        const sideListviewId = searchParams['side_listview_id']
        
        if(!objectApiName){
            objectApiName = ''
        }
        if(!recordId){
            recordId = ''
        }
        if(!pageId){
            pageId = ''
        }
        const formFactor = Steedos.isMobile() ? "SMALL" : "LARGE";

        if(type != 'list' && type != 'record'){
            const page = Steedos.authRequest(`/api/pageSchema/${type}?app=${appId}&objectApiName=${objectApiName}&recordId=${recordId}&pageId=${pageId}&formFactor=${formFactor}`, { async: false });
            if (page && page.schema) {
                return page;
            }
        }
        
        if(type === 'list'){
            return {
                render_engine: 'amis',
                name: 'steedosListviewPage',
                schema:{
                    "name": `${objectApiName}-listview-${listViewId}`,
                    "type": "steedos-page-listview",
                    "showHeader": true,
                    "objectApiName": objectApiName,
                    "appId": appId,
                    "display": display,
                    "columnsTogglable": false,
                    // "listName": "all",
                }
            }
        }else if(type === 'record'){
            return {
                    render_engine: 'amis',
                    name: 'steedosRecordPage',
                    schema: {
                        "name": `${objectApiName}-recordDetail-${recordId}`,
                        "type": "steedos-page-record-detail",
                        "objectApiName": objectApiName,
                        "sideObject": sideObject,
                        "sideListviewId": sideListviewId,
                        // "recordId": recordId,
                        "display": display,
                        "appId": appId,
                    }
                }
            
        }else if(type === 'related_list'){
            const relatedKey = FlowRouter._current.queryParams.related_field_name;
            const masterObject = Creator.getObject(FlowRouter.getParam("object_name"))
            const object = Creator.getObject(objectApiName)
            const idFieldName = masterObject.idFieldName;
            return {
                render_engine: 'amis',
                name: 'steedosRelatedListPage',
                schema: {
                    type: 'service',
                    name: `amis-${appId}-${FlowRouter.getParam("object_name")}-related-${objectApiName}`,
                    api: {
                        method: "post",
                        url: `\${context.rootUrl}/graphql`,
                        requestAdaptor: `
                            api.data = {
                                query: \`{
                                    data: ${masterObject.name}(filters:["${idFieldName}", "=", "${FlowRouter.getParam("record_id")}"]){
                                        ${idFieldName}
                                        ${masterObject.NAME_FIELD_KEY},
                                        recordPermissions: _permissions{
                                            allowCreate,
                                            allowCreateFiles,
                                            allowDelete,
                                            allowDeleteFiles,
                                            allowEdit,
                                            allowEditFiles,
                                            allowRead,
                                            allowReadFiles,
                                            disabled_actions,
                                            disabled_list_views,
                                            field_permissions,
                                            modifyAllFiles,
                                            modifyAllRecords,
                                            modifyAssignCompanysRecords,
                                            modifyCompanyRecords,
                                            uneditable_fields,
                                            unreadable_fields,
                                            unrelated_objects,
                                            viewAllFiles,
                                            viewAllRecords,
                                            viewAssignCompanysRecords,
                                            viewCompanyRecords,
                                          }
                                    }
                                }\`
                            }
                            return api;
                        `,
                        adaptor: `
                            if(payload.data.data){
                                var data = payload.data.data[0];
                                payload.data = data;
                            }
                            payload.data.$breadcrumb = [
                                {
                                  "label": "${masterObject.label}",
                                  "href": "/app/${appId}/${masterObject.name}"
                                },
                                {
                                    "label": payload.data.${masterObject.NAME_FIELD_KEY},
                                    "href": "/app/${appId}/${masterObject.name}/view/${FlowRouter.getParam("record_id")}",
                                },
                                {
                                    "label": "相关 ${object.label}"
                                },
                              ]
                            payload.data.$loaded = true;
                            return payload;
                        `,
                        headers: {
                            Authorization: "Bearer ${context.tenantId},${context.authToken}"
                        }
                    },
                    "data": {
                        "&": "$$",
                        "$breadcrumb": [], //先给一个空数组, 防止breadcrumb组件报错
                      },
                    body: [
                        {
                              "type": "breadcrumb",
                              "source": "${$breadcrumb}",
                              "className": "mx-4 my-2",
                        },
                        {
                            type: 'steedos-object-related-listview',
                            objectApiName: masterObject.name,
                            recordId: FlowRouter.getParam("record_id"),
                            relatedObjectApiName: objectApiName,
                            foreign_key: relatedKey,
                            relatedKey: relatedKey,
                            hiddenOn: "!!!this.$loaded",
                            "className": "mx-4",
                            // top: 5
                        }
                        ,
                        // {
                        //     type: 'steedos-object-related-listview',
                        //     objectApiName: masterObject.name,
                        //     recordId: FlowRouter.getParam("record_id"),
                        //     relatedObjectApiName: objectApiName,
                        //     foreign_key: relatedKey,
                        //     relatedKey: relatedKey,
                        //     hiddenOn: "!!!this.$loaded"
                        //     // top: 5
                        // }
                    ]
                }
              }
        }
    }

    Steedos.Page.render = function (root, page, data, options = {}) {
        console.log(`Steedos.Page.render`, root, page, data)
        if (page.render_engine && page.render_engine != 'redash') {

            let schema = typeof page.schema === 'string' ? JSON.parse(page.schema) : page.schema;
            const rootUrl = __meteor_runtime_config__.ROOT_URL;
            const defData = lodash.defaultsDeep({}, {data: data} , {
                data: {
                    app_id: data.appId,
                    object_name: data.objectName,
                    record_id: data.recordId,
                    context: {
                        rootUrl: rootUrl.endsWith("/") ? rootUrl.substr(0, rootUrl.length-1) : rootUrl,
                        tenantId: Creator.USER_CONTEXT.spaceId,
                        userId: Creator.USER_CONTEXT.userId,
                        authToken: Creator.USER_CONTEXT.user.authToken,
                        user: Creator.USER_CONTEXT.user
                    },
                    global: {
                        userId: Creator.USER_CONTEXT.userId,
                        spaceId: Creator.USER_CONTEXT.spaceId,
                        user: Creator.USER_CONTEXT.user, 
                        now: new Date(),
                        // mode: mode //由表单提供
                    },
                    scopeId: schema.name || schema.id,
                    $scopeId : schema.name || schema.id
                }
            });

            schema = lodash.defaultsDeep(defData , schema);

            delete schema.data.recordId
            delete schema.data.record_id


            const findComponent = (obj, componentName)=>{
                return lodash.find(obj, {name : componentName})
            }

            if(!lodash.isFunction(root)){
                //渲染loading
            }

            Promise.all([
                waitForThing(window, 'renderAmis'),
                waitForThing(Builder.components, upperFirst(page.render_engine), findComponent)
            ]).then(()=>{
                //渲染page
                // console.log(`renderAmis`, schema, data)
                if(!lodash.isFunction(root)){
                    renderAmis(
                        root,
                        schema,
                        data,
                    )
                }
            });
        }

        return root;
    };

    Steedos.Page.App.render = function (template, pageName, app_id, options) {
        if (!pageName) {
            return;
        }
        var rootId = "steedosPageRoot";
        var modalRoot = document.getElementById(rootId);
        // if(modalRoot){
        //     modalRoot.remove();
        // }
        if (!modalRoot) {
            modalRoot = document.createElement('div');
            modalRoot.setAttribute('id', rootId);
            modalRoot.setAttribute('class', 'h-full overflow-auto');
            $(".page-template-root")[0].appendChild(modalRoot);
        }

        const container = $("#" + rootId)[0];

        const page = Steedos.Page.getPage('app', app_id, null, null, pageName);
        if (page) {
            if (page.render_engine && page.render_engine != 'redash') {
                return Steedos.Page.render(container, page, Object.assign({}, options, {
                    appId: app_id
                }));
            }
        }

        SteedosUI.render(stores.ComponentRegistry.components.PublicPage, {
            token: pageName
        }, container);
        return container
    };

    Steedos.Page.Listview.getDefaultName = function (objectApiName, listViewName) {
        return `listview_${objectApiName}_${listViewName}`;
    };

    Steedos.Page.Listview.render = function (template, objectApiName, options) {
        try {
            if (!template.data.regions || !objectApiName) {
                return;
            }
            const { page, ...data } = template.data.regions();

            var rootId = "steedosPageRecordRoot";
            var modalRoot = document.getElementById(rootId);
            // if(modalRoot){
            //     modalRoot.remove();
            // }
            if (!modalRoot) {
                modalRoot = document.createElement('div');
                modalRoot.setAttribute('id', rootId);
                modalRoot.setAttribute('class', 'h-full')
                $(".page-list-view-root")[0].appendChild(modalRoot);
            }

            if (page.render_engine && page.render_engine != 'redash') {
                data.listName = data.listViewId;
                return Steedos.Page.render($("#" + rootId)[0], page, Object.assign({}, options, data));
            }
        } catch (error) {

        }
    };

    Steedos.Page.Record.render = function (template, objectApiName, recordId, options) {
        try {
            if (!template.data.regions || !objectApiName || !recordId) {
                return;
            }
            const { page, ...data } = Tracker.nonreactive(template.data.regions);
            var rootId = "steedosPageRecordRoot";
            var modalRoot = document.getElementById(rootId);
            // if(modalRoot){
            //     modalRoot.remove();
            // }
            if (!modalRoot) {
                modalRoot = document.createElement('div');
                modalRoot.setAttribute('id', rootId);
                modalRoot.setAttribute('class', 'h-full')
                $(".page-record-view-root")[0].appendChild(modalRoot);
            }

            if (page.render_engine && page.render_engine != 'redash') {
                return Steedos.Page.render($("#" + rootId)[0], page, Object.assign({}, options, data, {recordId}));
            }
        } catch (error) {

        }
    };

    Steedos.Page.RelatedListview.render = function (template, objectApiName, options) {
        try {
            if (!template.data.regions || !objectApiName) {
                return;
            }
            const { page, ...data } = template.data.regions();

            var rootId = "steedosPageRecordRoot";
            var modalRoot = document.getElementById(rootId);
            // if(modalRoot){
            //     modalRoot.remove();
            // }
            if (!modalRoot) {
                modalRoot = document.createElement('div');
                modalRoot.setAttribute('id', rootId);
                modalRoot.setAttribute('class', 'h-full');
                $(".page-related-list-view-root")[0].appendChild(modalRoot);
            }

            if (page.render_engine && page.render_engine != 'redash') {
                return Steedos.Page.render($("#" + rootId)[0], page, Object.assign({}, options, data));
            }
        } catch (error) {

        }
    };

    Steedos.Page.Form.StandardNew.render = function (appId, objectApiName, title, initialValues, options) {
        const page = Steedos.Page.getPage('form', appId, objectApiName);
        if (page && page.schema) {
            const elementId = getModalElement(`${objectApiName}-standard_new`);
            page.schema = {
                "type": "service",
                "className": "hidden",
                "body": [
                    {
                        "type": "button",
                        "label": "新建",
                        "id": "u:standard_new",
                        "level": "default",
                        "onEvent": {
                            "click": {
                                "actions": [
                                    {
                                        "actionType": "dialog",
                                        "dialog": {
                                            "type": "dialog",
                                            "title": title,
                                            "bodyClassName": "",
                                            "body": [
                                                JSON.parse(page.schema)
                                            ],
                                            "id": "u:0b96577db93c",
                                            "closeOnEsc": false,
                                            "closeOnOutside": false,
                                            "showCloseButton": true,
                                            "size": "lg"
                                        }
                                    }
                                ],
                                "weight": 0
                            }
                        }
                    }
                ],
                "regions": [
                    "body"
                ],
                "bodyClassName": "p-0",
                "id": "u:aef99d937b10"
            }
            const scope = Steedos.Page.render(elementId, page, Object.assign({}, options, {
                appId: appId,
                objectName: objectApiName,
                title: title,
                data: initialValues,
            }));
            setTimeout(()=>{
                $("button", scope).trigger("click")
            }, 300)
            return scope ;
            // return Steedos.Page.render(SteedosUI.Modal, page, Object.assign({}, options, {
            //     appId: appId,
            //     objectName: objectApiName,
            //     title: title,
            //     data: initialValues,
            // }));
        }
    };

    Steedos.Page.Form.StandardEdit.render = function (appId, objectApiName, title, recordId, options) {
        const page = Steedos.Page.getPage('form', appId, objectApiName, recordId);
        if (page && page.schema) {
            const elementId = getModalElement(`${objectApiName}-standard_edit`);
            page.schema = {
                "type": "service",
                "className": "hidden",
                "body": [
                    {
                        "type": "button",
                        "label": "编辑",
                        "id": "u:standard_new",
                        "level": "default",
                        "onEvent": {
                            "click": {
                                "actions": [
                                    {
                                        "actionType": "dialog",
                                        "dialog": {
                                            "type": "dialog",
                                            "title": title,
                                            "bodyClassName": "",
                                            "body": [
                                                JSON.parse(page.schema)
                                            ],
                                            "id": "u:0b96577db93c",
                                            "closeOnEsc": false,
                                            "closeOnOutside": false,
                                            "showCloseButton": true,
                                            "size": "lg"
                                        }
                                    }
                                ],
                                "weight": 0
                            }
                        }
                    }
                ],
                "regions": [
                    "body"
                ],
                "bodyClassName": "p-0",
                "id": "u:aef99d937b10"
            }
            const scope = Steedos.Page.render(elementId, page, Object.assign({}, options, {
                appId: appId,
                objectName: objectApiName,
                title: title,
                recordId: recordId
            }));
            setTimeout(()=>{
                $("button", scope).trigger("click")
            }, 300)
            return scope ;
            // return Steedos.Page.render(SteedosUI.Modal, page, Object.assign({}, options, {
            //     appId: appId,
            //     objectName: objectApiName,
            //     title: title,
            //     recordId: recordId
            // }));
        }
    };

    // Steedos.Page.Form.StandardDelete.render = function(){

    // };


    // creator odata 转 graphql 防腐层

    function getGraphqlFieldsQuery(objectApiName, selectFields, expandFields){
        const objectConfig = Creator.getObject(objectApiName)
        const objectFields = objectConfig.fields
        if(_.isString(selectFields)){
            selectFields = selectFields.split(',');
        }

        if(_.isString(expandFields)){
            expandFields = expandFields.split(',');
        }

        const fieldsName = ['_id'];

        if(objectConfig.database_name ==='default' || !objectConfig.database_name){
            fieldsName.push('record_permissions')
        }

        _.each(selectFields, function(fieldName){
            fieldsName.push(`${fieldName}`)
        });

        _.each(expandFields, function(fieldName){
            if(fieldName.indexOf("\\") > -1){
                fieldName = fieldName.split('\\')[0];
            }
            if(fieldName && objectFields[fieldName] && _.isString(objectFields[fieldName].reference_to)){
                let spaceUsersCompanyIdsExpand = '';
                if(objectApiName === 'space_users' && fieldName === 'company_ids'){
                    spaceUsersCompanyIdsExpand = ',name,admins'
                }
                let referenceTo = objectFields[fieldName].reference_to;
                const refObject = Creator.getObject(referenceTo)
                if(!refObject){
                    window.lodash.remove(fieldsName, function(item) { return item === fieldName; });
                    console.error(`未找到对象“${referenceTo}”，请检查是否该对象依赖的软件包未安装。`);
                }else{
                    if(_.includes(fieldsName, fieldName)){
                        fieldsName[_.indexOf(fieldsName, fieldName)] = `${fieldName}:${fieldName}__expand{_id, _NAME_FIELD_VALUE:${refObject.NAME_FIELD_KEY}${spaceUsersCompanyIdsExpand}}`
                    }else{
                        fieldsName.push(`${fieldName}:${fieldName}__expand{_id, _NAME_FIELD_VALUE:${refObject.NAME_FIELD_KEY}${spaceUsersCompanyIdsExpand}}`)
                    }
                }
            }
        })

        return fieldsName;
    }

    Steedos.Page.Data.getRecord = function(objectApiName, recordId, selectFields, expandFields){
        return stores.API.client.sobject(objectApiName).record(recordId, null, {
            graphqlFieldsQuery: getGraphqlFieldsQuery(objectApiName, selectFields, expandFields)
        })
    }

    const getSpaceLogo = function(){
        let logoSrc = '';
        const space = db.spaces.findOne(Steedos.getSpaceId())
        if(space?.avatar){
            logoSrc = Steedos.absoluteUrl('api/files/avatars/'+space.avatar) 
        }else if(space?.avatar_square){
            logoSrc = Steedos.absoluteUrl('api/files/avatars/'+space.avatar_square) 
        }else{
            var settings = Session.get("tenant_settings");
            var avatar_url = "";
            if(settings){
                avatar_url = settings?.logo_square_url;
            }
            if(!avatar_url || !settings){
                avatar_url = "/images/logo_platform.png"
                if(Meteor.user()?.locale != 'zh-cn'){
                    avatar_url = "/images/logo_platform.en-us.png"
                }
            }
            logoSrc = Steedos.absoluteUrl(avatar_url) 
        }
        return logoSrc
    }

    Steedos.Page.Header.render = function(appId, tabId){
        let app = _.find(Session.get('app_menus'), {id: appId}) || {}
        if(_.isEmpty(app)){
            return ;
        }
        if (appId === 'admin' || (window.innerWidth < 768))
            app.showSidebar = true;
        if (app.showSidebar)
            document.body.classList.add('sidebar')
        else
            document.body.classList.remove("sidebar")   
        if (window.innerWidth >= 768) 
            document.body.classList.add('sidebar-open')
        if(app.showSidebar && FlowRouter.current().path.startsWith("/workflow")){
            app = {id: 'workflow'}
        }
        if(FlowRouter.current().path.startsWith("/workflow")){
            document.body.classList.remove("sidebar-open")   
        }
        try {
            const data = {
                app,
                isMobile: window.innerWidth <= 768
            };
            const page = Steedos.Page.Header.getPage(appId, tabId);
            var rootId = "steedosGlobalHeaderRoot";
            var modalRoot = document.getElementById(rootId);
            if (!modalRoot) {
                modalRoot = document.createElement('div');
                modalRoot.setAttribute('id', rootId);
                modalRoot.setAttribute('class', 'h-full');
                $(".steedos-global-header-root")[0].appendChild(modalRoot);
            }
            if (page.render_engine && page.render_engine != 'redash') {
                // console.log("Steedos.Page.Header.render", appId, tabId, page)
                return Steedos.Page.render($("#" + rootId)[0], page, Object.assign({}, data));
            }
        } catch (error) {
            console.error(`Steedos.Page.Header.render`, error)
        }
    }
    Steedos.Page.Header.getPage = function(appId, tabId){
        const logoSrc = Tracker.nonreactive(getSpaceLogo);
        return {
            render_engine: 'amis',
            name: 'steedosGlobalHeaderPage',
            schema: {
                "type": "service",
                name: "globalHeader",
                body: [
                    {
                      "type": "wrapper",
                      "className": 'p-0',
                      body: [
                        {
                          "type": "wrapper",
                          "className": "bg-white sticky p-0 top-0 z-40 w-full flex-none backdrop-blur transition-colors duration-500 lg:z-50 sm:shadow  border-b-[3px] border-sky-500 border-solid steedos-header-container",
                          body: [
                            {
                              "type": "wrapper",
                              "className": 'flex w-full px-4 h-[50px] p-0 justify-between items-center steedos-header-container-line-one',
                              "body": [
                                {
                                  type: "wrapper",
                                  className: 'p-0 flex flex-1 items-center',
                                  body: [
                                    {
                                      "type": "button",
                                      "className": "toggle-sidebar flex items-center pr-4",
                                      "hiddenOn": "${!isMobile}",
                                      "onEvent": {
                                        "click": {
                                          "actions": [
                                            {
                                              "actionType": "custom",
                                              "script": "document.body.classList.toggle('sidebar-open')",
                                            }
                                          ]
                                        }
                                      },
                                      "body": [
                                        {
                                          "type": "steedos-icon",
                                          "category": "utility",
                                          "name": "rows",
                                          "colorVariant": "default",
                                          "id": "u:afc3a08e8cf3",
                                          "className": "slds-button_icon slds-global-header__icon"
                                        }
                                      ],
                                    },
                                    {
                                        "className": 'block h-10 w-auto mr-4',
                                        "type": "tpl",
                                        "tpl": `<a href='/app' class='flex items-center '><img class='block h-10 w-auto' src='${logoSrc}'></a>`,      
                                    },
                                  ],
                                },
                                {
                                  "type": "steedos-global-header",
                                  "label": "Global Header",
                                  className: 'flex flex-nowrap gap-x-3 items-center',
                                  logoutScript: "window.Steedos.logout();",
                                  customButtons: [
                                    {
                                      "type": "button",
                                      "className": "toggle-sidebar",
                                      "visibleOn": "${AND(app.showSidebar,!isMobile)}",
                                      "onEvent": {
                                        "click": {
                                          "actions": [
                                            {
                                              "actionType": "custom",
                                              "script": "document.body.classList.toggle('sidebar-open')",
                                            }
                                          ]
                                        }
                                      },
                                      "body": [
                                        {
                                          "type": "steedos-icon",
                                          "category": "utility",
                                          "name": "rows",
                                          "colorVariant": "default",
                                          "id": "u:afc3a08e8cf3",
                                          "className": "slds-button_icon slds-global-header__icon"
                                        }
                                      ],
                                    },
                                    {
                                        "type": "steedos-app-launcher",
                                        "showAppName": false,
                                        "appId": "${app.id}",
                                        "visibleOn": "${isMobile}",
                                    },
                                ]
                                }
                              ],
                            },
            
                            {
                              "type": "grid",
                              "hiddenOn": "${isMobile}",
                              "className": 'steedos-context-bar flex flex-nowrap h-10 leading-5 pl-4 mb-[-3px] steedos-header-container-line-two',
                              "columns": [
                                {
                                  "columnClassName": "items-center flex pb-0",
                                  "body": [
                                    {
                                      "type": "steedos-app-launcher",
                                      "showAppName": true,
                                      "appId": "${app.id}",
                                    }
                                  ],
                                  "md": "auto",
                                  "valign": "middle"
                                },
                                {
                                  hiddenOn: "${app.showSidebar === true}",
                                  "columnClassName": "flex overflow-hidden",
                                  "body": [
                                    {
                                      "type": "steedos-app-menu",
                                      "stacked": false,
                                      showIcon: false,
                                      "appId": "${app.id}",
                                      hiddenOn: "${app.showSidebar === true}",
                                      overflow: {
                                          enable: false,
                                          itemWidth: 80,
                                      },
                                      "id": "u:77851eb4aa89",
                                    }
                                  ],
                                  "id": "u:5367229505d8",
                                  "md": "",
                                  "valign": "middle",
                                }
                              ],
                            },
                          ],
                        },
        
                        {
        
                          "type": "button",
                          "className": 'p-0 absolute inset-0 mt-[50px] sm:mt-[90px]',
                          hiddenOn: "${app.showSidebar != true}",
                          body: [{
                            type: "wrapper",
                            className: 'sidebar-wrapper px-0 pt-4 pb-24 fixed z-20 h-full ease-in-out duration-300 flex flex-col border-r overflow-y-auto bg-white border-slate-200 block -translate-x-0 sm:w-[220px] w-64',
                            body: [
                                {
                                  "type": "steedos-app-launcher",
                                  "className": "px-4 pb-4",
                                  "visibleOn": "${isMobile}",
                                  "showAppName": true
                                },
                                {
                                    "type": "steedos-app-menu",
                                    "stacked": true,
                                    "appId": "${app.id}",
                                },
                            ]
                          }],
                          "onEvent": {
                            "click": {
                              "actions": [
                                {
                                  "actionType": "custom",
                                  "script": "console.log(event.target); if(window.innerWidth < 768){ document.body.classList.remove('sidebar-open'); }",
                                }
                              ]
                            }
                          },
                        }
                      ],
                    },
                  ]
              }
        }
    }
})();