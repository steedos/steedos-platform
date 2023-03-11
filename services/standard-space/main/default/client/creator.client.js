/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-02-27 19:09:19
 * @LastEditors: 廖大雪 2291335922@qq.com
 * @LastEditTime: 2023-03-11 13:29:34
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
    window.refreshGrid = ()=>{
        return FlowRouter.reload();
    };
}
	