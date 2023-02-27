if(!window.Creator){
    window.Creator = {};
}

Creator.getObject = (objectName)=>{
    if(!objectName){
        if(window.Session){
            objectName = Session.get("object_name")
        }
        if(!objectName){
            throw new Error('miss objectName')
        }
    }
    return getUISchemaSync(objectName);
}

Creator.getPermissions = (object_name, spaceId, userId)=>{
    return Creator.getObject(object_name).permissions;
}
	