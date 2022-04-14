/*
 * @Author: steedos
 * @Date: 2022-03-22 19:13:57
 * @Description: 提供自定义page渲染能力, 供内部使用, 内容会迭代调整, 不对用户开放. 
 */

Steedos.Page = {
    App: {},
    Record: {},
    Listview: {},
    RelatedListview: {},
    Form: {
        StandardNew: {},
        StandardEdit: {}
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
    if (type != 'list' && objectApiName) {
        const objectInfo = Creator.getObject(objectApiName);
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
}

Steedos.Page.render = function (root, page, data) {

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
        const defData = Object.assign({}, data, {
            context: {
                rootUrl: __meteor_runtime_config__.ROOT_URL,
                tenantId: Creator.USER_CONTEXT.spaceId,
                userId: Creator.USER_CONTEXT.userId,
                authToken: Creator.USER_CONTEXT.user.authToken
            }
        })

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
                            "data": data
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

        //渲染loading
        SteedosUI.render(BuilderComponent, {
            model: "page", content: {
                "data": loadingContentData
            }
        }, root)

        Promise.all([
            waitForThing(window, 'BuilderComponent'),
            waitForThing(Builder.components, upperFirst(page.render_engine), findComponent)
        ]).then(()=>{
            //渲染page
            SteedosUI.render(BuilderComponent, {
                model: "page", content: {
                    "data": pageContentData
                }
            }, root)
        });
    }

    return root;
};

Steedos.Page.App.render = function (template, pageName, app_id) {
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
            return Steedos.Page.render(container, page, {
                appId: app_id
            });
        }
    }

    SteedosUI.render(stores.ComponentRegistry.components.PublicPage, {
        token: pageName
    }, container);
    return container
};

Steedos.Page.Listview.render = function (template, objectApiName) {
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
            return Steedos.Page.render($("#" + rootId)[0], page, data);
        }
    } catch (error) {

    }
};

Steedos.Page.Record.render = function (template, objectApiName, recordId) {
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
            return Steedos.Page.render($("#" + rootId)[0], page, data);
        }
    } catch (error) {

    }
};

Steedos.Page.RelatedListview.render = function (template, objectApiName) {
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
            return Steedos.Page.render($("#" + rootId)[0], page, data);
        }
    } catch (error) {

    }
};

Steedos.Page.Form.StandardNew.render = function (appId, objectApiName, title, initialValues) {
    const page = Steedos.Page.getPage('form', appId, objectApiName);
    if (page && page.schema) {
        const elementId = getModalElement(`${objectApiName}-standard_new`);
        return Steedos.Page.render(elementId, page, {
            appId: appId,
            objectName: objectApiName,
            title: title,
            initialValues: initialValues
        });
    }

    SteedosUI.showModal(stores.ComponentRegistry.components.ObjectForm, {
        name: `${objectApiName}_standard_new_form`,
        objectApiName: objectApiName,
        title: title,
        initialValues: initialValues,
        afterInsert: function (result) {
            if (result.length > 0) {
                var record = result[0];
                setTimeout(function () {
                    var url = `/app/${appId}/${objectApiName}/view/${record._id}`
                    FlowRouter.go(url)
                }
                    , 1);
                return true;
            }
        }
    }, null, { iconPath: '/assets/icons' });
};

Steedos.Page.Form.StandardEdit.render = function (appId, objectApiName, title, recordId) {

    const page = Steedos.Page.getPage('form', appId, objectApiName, recordId);
    if (page && page.schema) {
        const elementId = getModalElement(`${objectApiName}-standard_edit`);
        return Steedos.Page.render(elementId, page, {
            appId: appId,
            objectName: objectApiName,
            title: title,
            recordId: recordId
        });
    }

    return SteedosUI.showModal(stores.ComponentRegistry.components.ObjectForm, {
        name: `${objectApiName}_standard_edit_form`,
        objectApiName: objectApiName,
        recordId: recordId,
        title: title,
        afterUpdate: function () {
            setTimeout(function () {
                if (FlowRouter.current().route.path.endsWith("/:record_id")) {
                    FlowRouter.reload()
                    // ObjectForm有缓存，修改子表记录可能会有主表记录的汇总字段变更，需要刷新表单数据
                    SteedosUI.reloadRecord(objectApiName, recordId)
                } else {
                    window.refreshDxSchedulerInstance()
                    window.refreshGrid();
                }
            }, 1);
            return true;
        }
    }, null, { iconPath: '/assets/icons' })
};

// Steedos.Page.Form.StandardDelete.render = function(){

// };