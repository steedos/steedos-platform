Steedos.PackageRegistry = {
    getNodes: function(){
        const projectNodes = Steedos.authRequest('/service/api/@steedos/service-project/getProjectNodes', {async: false});
        return projectNodes;
    },
    getNodesSelect: function(){
        const projectNodes = Steedos.authRequest('/service/api/@steedos/service-project/getProjectNodes', {async: false});
        let selectOptions = '';
        _.each(projectNodes, function(nodeID){
            selectOptions = selectOptions + `<option value ="${nodeID}">${nodeID}</option>`
        })
        let style = `style="display:none;"`
        if(projectNodes.length > 1){
            style = '';
        }
        let select = `<div ${style}><br/><select name="steedos_package_main_node" id="steedos_package_main_node">${selectOptions}</select></div>`
        return select;
    }
}