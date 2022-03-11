Steedos.Pages = {};

function upperFirst(str) {
	return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
};

Steedos.Pages.Render = function (pageName) {
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

    const pages = Creator.odata.query("pages", {$filter:`(name eq '${pageName}')`}, true);
    if(pages.length > 0){
        const page = pages[0];
        if(page.render_engine && page.render_engine != 'redash'){
            return SteedosUI.render(BuilderReact.BuilderComponent, {model:"page",content:{
                "data":{
                   "blocks":[
                      {
                         "@type":"@builder.io/sdk:Element",
                         "@version":2,
                         "id":"builder-2b290abc4e4042498645863f53ee6815",
                         "component":{
                            "name": upperFirst(page.render_engine), //_.upperFirst
                            "options":{
                               "schema": JSON.parse(page.schema)
                            }
                         },
                      }
                   ],
                   "inputs":[
                      
                   ]
                }
             }}, $("#" + rootId)[0]);
        }
    }

    SteedosUI.render(stores.ComponentRegistry.components.PublicPage, {
        token: pageName
    }, $("#" + rootId)[0]);
};