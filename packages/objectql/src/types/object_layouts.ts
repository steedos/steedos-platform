import { getSteedosSchema } from ".";
import * as _ from 'underscore';
export async function getObjectLayouts(profileApiName, spaceId, objectApiName?){
    const schema = getSteedosSchema();
    const configs = await schema.metadataRegister?.filterLayouts(profileApiName, spaceId, objectApiName);
    const layouts = _.pluck(configs, 'metadata');

    _.each(layouts, function(layout){
        if(!layout._id){
            layout._id = `${layout.object_name}.${layout.name}`
        }
    })
    return layouts;
}

export async function getObjectLayout(objectLayoutFullName){
    const schema = getSteedosSchema();
    const config = await schema.metadataRegister?.getLayout(objectLayoutFullName);
    return config?.metadata;
}