/*
* @Author: steedos
* @Date: 2022-03-22 19:13:57
* @Description: 提供自定义page渲染能力, 供内部使用, 内容会迭代调整, 不对用户开放. 
*/
;(function(){


    const withModalWrap = (component, provideProps) => {
        return (props) => {
          const ModalComponent = component;
          return React.createElement(ModalComponent, props);
        }
      }
      const render = (component, componentProps, container, provideProps = {} ) => {
          const wrapComponent = withModalWrap(component, provideProps);
          const contentEle = React.createElement(wrapComponent,{
              ...componentProps
            });
          return ReactDOM.render(contentEle, container);
      }

    Steedos.Page = {
        App: {},
        Record: {},
        Listview: {},
        Header: {},
        AppNav: {},
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
        modalRoot.setAttribute('id', `steedos-page-modal-root-${name}`);
        document.body.appendChild(modalRoot)
        }
        return modalRoot;
    }

    Steedos.Page.getPage = function (type, appId, objectApiName, recordId, pageId) {
        let objectInfo = null;
        if (type != 'list' && objectApiName) {
            objectInfo = Creator.getObject(objectApiName);
            if (objectInfo && objectInfo.version < 2) {
                return;
            }
        }
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
        const page = Steedos.authRequest(`/api/pageSchema/${type}?app=${appId}&objectApiName=${objectApiName}&recordId=${recordId}&pageId=${pageId}&formFactor=${formFactor}`, { async: false });
        if (page && page.schema) {
            return page;
        }
        else if(type === 'list'){
            return {
                render_engine: 'amis',
                name: 'steedosListviewPage',
                schema: {
                    "type": "page",
                    name: `amis-${appId}-${objectApiName}-listview`,
                    "title": "Welcome to Steedos",
                    bodyClassName: 'bg-white p-0',
                    "body": [
                      {
                        "type": "steedos-object-listview",
                        showHeader: true,
                        "label": "列表视图",
                        "objectApiName": "${objectName}",
                        "listName": "all",
                        "id": "u:be7c6341cd11"
                      }
                    ],
                    "regions": [
                      "body"
                    ],
                    "id": "u:7b47b6042b0d"
                }
            }
        }else if(type === 'record'){
            return {
                    render_engine: 'amis',
                    name: 'steedosRecordPage',
                    schema: {
                        "type": "page",
                        "name": `amis-${appId}-${objectApiName}-detail`,
                        "title": "Welcome to Steedos",
                        "body": [
                          {
                            "type": "steedos-record-detail",
                            "objectApiName": "${objectName}",
                            "recordId": "${recordId}",
                            appId: appId,
                            "id": "u:48d2c28eb755",
                            onEvent: {
                                "recordLoaded": {
                                    "actions": [
                                        {
                                            "actionType": "reload",
                                            "data": {
                                              "name": `\${record.${objectInfo?.NAME_FIELD_KEY || 'name'}}`
                                            }
                                        }
                                    ]
                                  }
                            },
                          }
                        ],
                        "regions": [
                          "body"
                        ],
                        "id": "u:d138f5276481"
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
                            console.log("api", api)
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
                            console.log('payload', payload)
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
                            "type": "panel",
                            "title": {
                              "type": "breadcrumb",
                              "source": "${$breadcrumb}"
                            },
                            "body": [
                              {
                                  type: 'steedos-object-related-listview',
                                  objectApiName: masterObject.name,
                                  recordId: FlowRouter.getParam("record_id"),
                                  relatedObjectApiName: objectApiName,
                                  foreign_key: relatedKey,
                                  relatedKey: relatedKey,
                                  hiddenOn: "!!!this.$loaded"
                                  // top: 5
                              }
                            ]
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
        const loadingContentData = {
            "inputs": [],
            // "title": "loading",
            "blocks": [
                {
                    "@type": "@builder.io/sdk:Element",
                    "@version": 2,
                    "layerName": "Box",
                    "id": "builder-8070f86b1aed4e78a5878fa5c0d79e49",
                    "children": [
                        {
                            "@type": "@builder.io/sdk:Element",
                            "@version": 2,
                            "layerName": "Loading...\n...",
                            "id": "builder-4b16375a68dc4e49b4844843091bf91d",
                            "component": {
                                "name": "Text",
                                "options": {
                                    "text": "<p>Loading...</p>\n"
                                }
                            },
                            "responsiveStyles": {
                                "large": {
                                    "display": "flex",
                                    "flexDirection": "column",
                                    "position": "relative",
                                    "flexShrink": "0",
                                    "boxSizing": "border-box",
                                    "marginTop": "20px",
                                    "lineHeight": "normal",
                                    "height": "auto",
                                    "textAlign": "center"
                                }
                            }
                        }
                    ],
                    "responsiveStyles": {
                        "large": {
                            "display": "flex",
                            "flexDirection": "column",
                            "position": "relative",
                            "flexShrink": "0",
                            "boxSizing": "border-box"
                        }
                    }
                }
            ]
        };

        if (page.render_engine && page.render_engine != 'redash') {

            let schema = typeof page.schema === 'string' ? JSON.parse(page.schema) : page.schema;

            const defData = lodash.defaultsDeep({}, data , {data: data} , {
                data: {
                    app_id: data.appId,
                    object_name: data.objectName,
                    record_id: data.recordId,
                    context: {
                        rootUrl: __meteor_runtime_config__.ROOT_URL,
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
                    scopeId: schema.name || schema.id
                }
            });

            schema = lodash.defaultsDeep(defData , schema);

            const pageContentData = {
                "blocks": [
                    {
                        "@type": "@builder.io/sdk:Element",
                        "@version": 2,
                        "id": `builder-${page._id}`,
                        "component": {
                            "name": upperFirst(page.render_engine),
                            "options": {
                                "schema": schema,
                                "data": data,
                                "name": page.name,
                                "pageType": page.type
                            }
                        },
                    }
                ],
                "inputs": [
                ]
            }

            const findComponent = (obj, componentName)=>{
                return lodash.find(obj, {name : componentName})
            }

            if(!lodash.isFunction(root)){
                //渲染loading
                render(BuilderComponent, {
                    model: "page", content: {
                        "data": loadingContentData
                    }
                }, root)
            }

            Promise.all([
                waitForThing(window, 'BuilderComponent'),
                waitForThing(Builder.components, upperFirst(page.render_engine), findComponent)
            ]).then(()=>{
                //渲染page
                if(!lodash.isFunction(root)){
                    render(BuilderComponent, {
                        model: "page", content: {
                            "data": pageContentData
                        }
                    }, root)
                }else{
                    if(root === SteedosUI.Drawer){
                        data.drawerName = data.drawerName || lodash.uniqueId(`drawer-${page.object_name}`);
                        SteedosUI.Drawer(Object.assign({
                            name: data.drawerName,
                            title: data.title,
                            destroyOnClose: true,
                            maskClosable: false,
                            footer: null,
                            bodyStyle: {padding: "0px", paddingTop: "12px"},
                            children: React17.createElement(BuilderComponent, {
                                model: "page", content: {
                                    "data": pageContentData
                                }
                            })
                        }, options.props)).show();
                    }else{
                        data.modalName = data.modalName || lodash.uniqueId(`modal-${page.object_name}`);
                        console.log(`Modal`, '=======Modal')
                        SteedosUI.Modal(Object.assign({
                            name: data.modalName,
                            title: data.title,
                            destroyOnClose: true,
                            maskClosable: false,
                            keyboard: false, // 禁止 esc 关闭
                            footer: null,
                            bodyStyle: {padding: "0px", paddingTop: "12px"},
                            children: React17.createElement(BuilderComponent, {
                                model: "page", content: {
                                    "data": pageContentData
                                }
                            })
                        }, options.props)).show();
                    }

                    
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
                $(".page-list-view-root")[0].appendChild(modalRoot);
            }

            if (page.render_engine && page.render_engine != 'redash') {
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
            const { page, ...data } = template.data.regions();
            var rootId = "steedosPageRecordRoot";
            var modalRoot = document.getElementById(rootId);
            // if(modalRoot){
            //     modalRoot.remove();
            // }
            if (!modalRoot) {
                modalRoot = document.createElement('div');
                modalRoot.setAttribute('id', rootId);
                $(".page-record-view-root")[0].appendChild(modalRoot);
            }

            if (page.render_engine && page.render_engine != 'redash') {
                return Steedos.Page.render($("#" + rootId)[0], page, Object.assign({}, options, data));
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

        SteedosUI.showModal(stores.ComponentRegistry.components.ObjectForm, {
            name: `${objectApiName}_standard_new_form`,
            objectApiName: objectApiName,
            title: title,
            initialValues: initialValues,
            afterInsert: function (result) {
                if (result.length > 0) {
                    var record = result[0];
                    SteedosUI.router.go({objectName: objectApiName, recordId: record._id, type: 'new'});
                    return true;
                }
            }
        }, null, { iconPath: '/assets/icons' });
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

        return SteedosUI.showModal(stores.ComponentRegistry.components.ObjectForm, {
            name: `${objectApiName}_standard_edit_form`,
            objectApiName: objectApiName,
            recordId: recordId,
            title: title,
            afterUpdate: function () {
                setTimeout(function () {
                    if(["/app/:app_id/:object_name/view/:record_id", "/app/:app_id/:object_name/:record_id/:related_object_name/grid"].indexOf(FlowRouter.current().route.pathDef) > -1){
                        // 记录详细界面编辑子表记录，或相关子表列表界面编辑子表记录
                        var params = FlowRouter.current().params;
                        if(params.record_id !== recordId){
                            // ObjectForm有缓存，修改子表记录可能会有主表记录的汇总字段变更，需要刷新主表记录
                            SteedosUI.reloadRecord(params.object_name, params.record_id)
                        }
                    }
                    if (FlowRouter.current().route.path.endsWith("/:record_id")) {
                        FlowRouter.reload()
                    } else {
                        window.refreshDxSchedulerInstance()
                        window.refreshGrid(options.gridName);
                    }
                }, 1);
                return true;
            }
        }, null, { iconPath: '/assets/icons' })
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
            logoSrc = Steedos.absoluteUrl(space.avatar) 
        }else if(space?.avatar_square){
            logoSrc = Steedos.absoluteUrl(space.avatar_square) 
        }else{
            var settings = Session.get("tenant_settings");
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

    Steedos.Page.Header.render = function(){
        try {
            const data = {};
            const page = Steedos.Page.Header.getPage();
            var rootId = "steedosGlobalHeaderRoot";
            var modalRoot = document.getElementById(rootId);
            if (!modalRoot) {
                modalRoot = document.createElement('div');
                modalRoot.setAttribute('id', rootId);
                $(".steedos-global-header-root")[0].appendChild(modalRoot);
            }
            if (page.render_engine && page.render_engine != 'redash') {
                return Steedos.Page.render($("#" + rootId)[0], page, Object.assign({}, data));
            }
        } catch (error) {
            console.error(`Steedos.Page.Header.render`, error)
        }
    }
    Steedos.Page.Header.getPage = function(){
        const logoSrc = getSpaceLogo()
        return {
            render_engine: 'amis',
            name: 'steedosGlobalHeaderPage',
            schema: {
                "type": "service",
                name: "globalHeader",
                "body": [
                  {
                    "type": "grid",
                    className: 'pl-4',
                    "columns": [
                      {
                        "columnClassName": "",
                        "body": [
                          {
                            "type": "steedos-logo",
                            "src": logoSrc,
                            "className": 'block h-10 w-auto'
                          }
                        ],
                        "id": "u:1f6c4552143c",
                        "valign": "middle"
                      },
                      {
                        "columnClassName": "",
                        "body": [
                            {
                                "type": "steedos-global-header",
                                "label": "Global Header",
                                className: 'flex flex-nowrap gap-x-3 items-center',
                                logoutScript: "Steedos.logout();"
                              }
                        ],
                        "id": "u:b73c2c079561",
                        "md": "auto"
                      }
                    ],
                    "id": "u:b403a69ebdaf",
                    "align": "left"
                  }
                ],
              }
        }
    }

    Steedos.Page.AppNav.render = function(appId, tabId){
        try {
            const data = {};
            const page = Steedos.Page.AppNav.getPage(appId, tabId);
            var rootId = "steedosAppNavRoot";
            var modalRoot = document.getElementById(rootId);
            if (!modalRoot) {
                modalRoot = document.createElement('div');
                modalRoot.setAttribute('id', rootId);
                $(".steedos-app-nav-root")[0].appendChild(modalRoot);
            }
            if (page.render_engine && page.render_engine != 'redash') {
                return Steedos.Page.render($("#" + rootId)[0], page, Object.assign({}, data));
            }
        } catch (error) {
            console.error(`Steedos.Page.Header.render`, error)
        }
    }
    Steedos.Page.AppNav.getPage = function(appId, tabId){
        return {
            render_engine: 'amis',
            name: 'steedosAppNavPage',
            schema: {
                "type": "service",
                "name": "steedosAppNav",
                "className": "slds-global-header_container sticky top-0 z-40 w-full flex-none backdrop-blur transition-colors duration-500 lg:z-50 border-b border-b-2 border-sky-500 lg:shadow",
                "body": [
                  {
                    "type": "grid",
                    className: 'pl-4',
                    "columns": [
                      {
                        "columnClassName": "",
                        "body": [
                          {
                            "type": "steedos-app-launcher",
                            showAppName: true,
                            "appId": appId,
                          }
                        ],
                        "id": "u:e8a42e96eaf5",
                        "md": "auto",
                        "valign": "middle"
                      },
                      {
                        "columnClassName": "",
                        "body": [
                          {
                            "type": "steedos-app-menu",
                            "stacked": false,
                            showIcon: false,
                            "appId": appId,
                            selectedId: tabId,
                            overflow: {
                                enable: true,
                                overflowLabel: '更多',
                                overflowIndicator: "fas fa-angle-double-down"
                            },
                            "id": "u:77851eb4aa89",
                            hiddenOn: `${appId === 'admin'}`
                          }
                        ],
                        "id": "u:5367229505d8",
                        "md": "",
                        "valign": "middle",
                        hiddenOn: `${appId === 'admin'}`
                      }
                    ],
                    "id": "u:6cc99950b29c"
                  }
                ],
              }}
    }
})();