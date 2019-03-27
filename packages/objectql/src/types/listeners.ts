export type SteedosListenerConfig = {
    listenTo?: string | Function,
    beforeInsert?: Function,
    beforeUpdate?: Function,
    beforeDelete?: Function,
    afterInsert?: Function,
    afterUpdate?: Function,
    afterDelete?: Function,
}