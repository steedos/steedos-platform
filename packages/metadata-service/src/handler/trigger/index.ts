import { Trigger, MetadataTrigger } from '../../types/trigger';

export interface ITrigger{
    add(config: Trigger): boolean; //需要记录每个trigger 对应的 service\nodeID。  service集群启动时，需要考虑记录合并
    delete(config: Trigger): boolean;
    get(objectAPIName, when: 'before.insert' | 'before.update'): Promise<Array<MetadataTrigger>>
}

/**
.trigger.yml
listenTo: accounts
on: ['before.insert', 'before.update']
handler: function(){
    ... return false | true | null
};
*/

/**
 * 1 加载 .triger.yml
 * 2 创建本地Trigger action: {name: name, handler: handler}
 * 3 注册trigger到metadata service: call triggers.add action
 * 4 运行trigger：eg：insert 之前，先call action: ("triggers.get", when)。循环调用call，传入action
 */