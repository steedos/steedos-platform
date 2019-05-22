export type SteedosListenerConfig = {
    name?: string,
    listenTo?: string | Function,
    beforeInsert?: Function,
    beforeUpdate?: Function,
    beforeDelete?: Function,
    afterInsert?: Function,
    afterUpdate?: Function,
    afterDelete?: Function,
}