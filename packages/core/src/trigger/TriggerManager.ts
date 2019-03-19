import { getFromContainer } from "../container";
import { Trigger } from './Trigger'
import { getCreator } from "../index";
import _ = require('underscore');
var util = require("../util");

const _TRIGGERKEYS = ['beforeInsert','beforeUpdate','beforeDelete','afterInsert','afterUpdate','afterDelete']

class TirggerManager{

    /**
     * 从文件中读取Trigger
     * @param {string} filePath 文件路径
     * @memberof TirggerManager
     */
    public loadFile(filePath: string): void{
        let tirgger: Trigger = getFromContainer(util.loadFile(filePath));
        this.loadTrigger(tirgger);
    }


    /**
     * 加载Trigger配置到collection
     * @private
     * @param {Trigger} trigger
     * @memberof TirggerManager
     */
    private loadTrigger(trigger: Trigger): void{
        let object_name = trigger.listenTo()
        let Creator = getCreator();
        let collection = Creator.getCollection(object_name)
        _TRIGGERKEYS.forEach((key)=>{
            let event = trigger[key];
            if(_.isFunction(event)){
                this.setCollectionHook(collection, event);
            }
        })
    }

    
    /**
     * 设置数据持久化时间
     * @private
     * @param {*} collection： 当前collection需要meteor的matb33:collection-hooks支持
     * @param {Function} todo： 执行的脚本
     * @returns {boolean}：true: 设置Hook成功; false 设置Hook失败
     * @memberof TirggerManager
     */
    private setCollectionHook(collection: any, todo: Function): boolean{
        if(!todo){
            return false;
        }
        let when = todo.name;
        switch (when) {
            case 'beforeInsert':
                collection.before.insert(todo);
                break;
            case 'beforeUpdate':
                collection.before.update(todo);
                break;
            case 'beforeDelete':
                collection.before.remove(todo);
                break;
            case 'afterInsert':
                collection.after.insert(todo);
                break;
            case 'afterUpdate':
                collection.after.update(todo);
                break;
            case 'afterDelete':
                collection.after.remove(todo);
                break;
            default:
                break;
        }
        return true;
    }
}

export default getFromContainer(TirggerManager)