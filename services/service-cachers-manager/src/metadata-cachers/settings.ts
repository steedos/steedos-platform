import { MetadataCacherBase } from './base'

export class SettingsCacher extends MetadataCacherBase{
    constructor(){
        super('settings', true, {type: 'space', key: {$exists: true}});
    }
}