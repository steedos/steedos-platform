/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-02-27 19:09:19
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-03-03 09:11:56
 * @Description: 
 */
if(window.Meteor){
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

    Creator.getCollection = (objectName)=>{
        if(!objectName){
            if(window.Session){
                objectName = Session.get("object_name")
            }
            if(!objectName){
                throw new Error('miss objectName')
            }
        }
        return db[objectName]
    }
}
	