import { Trigger, MetadataTrigger } from '../../types/trigger';

export interface ITrigger{
    add(config: Trigger): boolean; //需要记录每个trigger 对应的 service\nodeID。  service集群启动时，需要考虑记录合并
    delete(config: Trigger): boolean;
    get(objectAPIName, when: 'before.insert' | 'before.update'): Promise<Array<MetadataTrigger>>
}

/**
.trigger.yml
name: APIName
listenTo: accounts
when: ['before.insert', 'before.update']
handler: function(ctx){
    ... return false | true | null
};
todo?: function(){

}
*/

/** new: 一个when一个文件
.trigger.js
name: APIName
listenTo?: accounts
when?: ['before.insert', 'before.update'] | string
handler: function(ctx){
    ... return false | true | null
};
*/


/** old
.trigger.js
name: APIName
listenTo?: accounts
afterFind: function(){
    ... return false | true | null
},
afterAggregate: function(){
    ... return false | true | null
}
*/


/** 旧trigger.todo 按以前方式执行。
 * 1 加载 .trigger.js
 * 2 trigger.handler && 创建本地Trigger action: {name: `$trigger.${listenTo}.${name}`, handler: function(){
 *  ...
 *  handler
 * }}。when记录在action中。
 * 3 注册trigger到metadata service: call triggers.add action
 * 4 运行trigger：eg：insert 之前，先call action: ("triggers.get", objectAPIName, when)。循环调用call，传入action
 */