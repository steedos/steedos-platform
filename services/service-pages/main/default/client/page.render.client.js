Steedos.Page = {
    App: {},
    Record: {},
    Listview: {},
    RelatedListview: {},
    Form:{
        StandardNew: {},
        StandardEdit: {}
    }
};

function upperFirst(str) {
	return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
};

Steedos.Page.getPage = function(type, appId, objectApiName, recordId){
    if(objectApiName){
        const objectInfo = Creator.getObject(Session.get("object_name"));
        if(objectInfo.version < 2){
            return ;
        }
    }
    const formFactor = Steedos.isMobile() ? "SMALL" : "LARGE";
    const page = Steedos.authRequest(`/api/pageSchema/${type}?app=${appId}&objectApiName=${objectApiName}&recordId=${recordId}&formFactor=${formFactor}`, {async:false});
    if(page && page.schema){
        return page;
    }
}

Steedos.Page.render = function (root, page, data) {
    console.log(`render======>data`, data)
    if (page.render_engine && page.render_engine != 'redash') {
        return SteedosUI.render(BuilderComponent, {
            model: "page", content: {
                "data": {
                    "blocks": [
                        {
                            "@type": "@builder.io/sdk:Element",
                            "@version": 2,
                            "id": `builder-${page._id}`,
                            "component": {
                                "name": upperFirst(page.render_engine),
                                "options": {
                                    "schema": typeof page.schema === 'string' ? JSON.parse(page.schema) : page.schema,
                                    "data": Object.assign({}, data,{
                                            rootUrl: __meteor_runtime_config__.ROOT_URL,
                                            userSession: Creator.USER_CONTEXT.user
                                        })
                                }
                            },
                        }
                    ],
                    "inputs": [
                    ]
                }
            }
        }, root);
    }
};

Steedos.Page.App.render = function (template, pageName, app_id) {
    if(!pageName){
        return ;
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

    const page = Steedos.Page.getPage('app', app_id);
    if(page){
        if(page.render_engine && page.render_engine != 'redash'){
            return Steedos.Page.render($("#" + rootId)[0], page, {
                appId: app_id
            });
        }
    }

    SteedosUI.render(stores.ComponentRegistry.components.PublicPage, {
        token: pageName
    }, $("#" + rootId)[0]);
};

Steedos.Page.Listview.render = function(template, objectApiName){
    try {
        if(!template.data.regions || !objectApiName){
            return ;
        }
        const page = template.data.regions().page;

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

        if(page.render_engine && page.render_engine != 'redash'){
            return Steedos.Page.render($("#" + rootId)[0], page, template.data.regions());
        }
    } catch (error) {
        
    }
};

Steedos.Page.Record.render = function(template, objectApiName, recordId){
    try {
        if(!template.data.regions || !objectApiName || !recordId){
            return ;
        }
        console.log(`Steedos.Page.Record.render...`, template.data.regions(), objectApiName, recordId);
        const page = template.data.regions().page;

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

        if(page.render_engine && page.render_engine != 'redash'){
            return Steedos.Page.render($("#" + rootId)[0], page, template.data.regions());
        }
    } catch (error) {
        
    }
};

Steedos.Page.RelatedListview.render = function(template, objectApiName){
    try {
        if(!template.data.regions || !objectApiName){
            return ;
        }
        const page = template.data.regions().page;

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

        if(page.render_engine && page.render_engine != 'redash'){
            return Steedos.Page.render($("#" + rootId)[0], page, template.data.regions());
        }
    } catch (error) {
        
    }
};

Steedos.Page.Form.StandardNew.render = function(appId, objectApiName, tilte, initialValues){
    SteedosUI.showModal(stores.ComponentRegistry.components.ObjectForm, {
        name: `${objectApiName}_standard_new_form`,
        objectApiName: objectApiName,
        title: tilte,
        initialValues: initialValues,
        afterInsert: function(result){
            if(result.length > 0){
                var record = result[0];
                setTimeout(function(){
                    var url = `/app/${appId}/${objectApiName}/view/${record._id}`
                    FlowRouter.go(url)
                }
                , 1);
                return true;
            }
        }
    }, null, {iconPath: '/assets/icons'});
};

Steedos.Page.Form.StandardEdit.render = function(appId, objectApiName, tilte, recordId){
    return SteedosUI.showModal(stores.ComponentRegistry.components.ObjectForm, {
        name: `${objectApiName}_standard_edit_form`,
        objectApiName: objectApiName,
        recordId: recordId,
        title: tilte,
        afterUpdate: function(){
            setTimeout(function(){
                if(FlowRouter.current().route.path.endsWith("/:record_id")){
                    FlowRouter.reload()
                    // ObjectForm有缓存，修改子表记录可能会有主表记录的汇总字段变更，需要刷新表单数据
                    SteedosUI.reloadRecord(objectApiName, recordId)
                }else{
                    window.refreshDxSchedulerInstance()
                    window.refreshGrid();
                }
                }, 1);
            return true;
        }
    }, null, {iconPath: '/assets/icons'})
};

// Steedos.Page.Form.StandardDelete.render = function(){

// };